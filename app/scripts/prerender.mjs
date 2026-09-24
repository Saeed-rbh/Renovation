// Build-time prerender: loads every public page of the built site in
// headless Chrome, waits for its Firestore content, and saves the finished
// HTML so search engines and link previews (Facebook, WhatsApp, LinkedIn)
// get real content instead of an empty <div id="root">. Also writes
// sitemap.xml from the pages it found.
//
// Output layout matches firebase.json (cleanUrls): /about -> dist/about.html,
// /projects/x -> dist/projects/x.html, 404 page -> dist/404.html. The
// untouched SPA shell is kept as dist/app-shell.html for routes that are
// rewritten to it (admin, and projects/services added after the last deploy).
//
// Run after `vite build`. Fails the build if a core page can't render, so a
// broken prerender never gets deployed.
import { execSync } from 'node:child_process';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE_URL = 'https://homevconstruction.ca';
const CORE_ROUTES = ['/', '/projects', '/services', '/about', '/estimator'];
const NOT_FOUND_PROBE = '/__prerender-not-found__';
const SKIP = /^\/(admin|assets)(\/|$)|\.[a-z0-9]+$/i;

const launchBrowser = async () => {
    const args = ['--no-sandbox', '--disable-setuid-sandbox'];
    try {
        return await puppeteer.launch({ args });
    } catch {
        // npm may skip puppeteer's postinstall download; fetch Chrome once.
        console.log('[prerender] Installing Chrome for puppeteer…');
        execSync('npx puppeteer browsers install chrome', { cwd: ROOT, stdio: 'inherit' });
        return puppeteer.launch({ args });
    }
};

const outputFile = (route) => (route === '/' ? join(DIST, 'index.html') : join(DIST, `${route.slice(1)}.html`));

const renderPage = async (browser, origin, route) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.evaluateOnNewDocument(() => {
        window.__PRERENDER__ = true;
        sessionStorage.setItem('visited_session', 'true');
    });
    try {
        await page.goto(origin + route, { waitUntil: 'networkidle2', timeout: 60000 });
        // Firestore keeps a connection open, so also wait for the page to
        // settle: no loading screens or skeletons left.
        await page.waitForFunction(
            () => !document.querySelector('.loading-container, .skeleton, [class*="skeleton-"]')
                && document.querySelector('#root .app'),
            { timeout: 30000 }
        );
        // Scroll through so on-scroll animations reveal their content.
        await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 500) {
                window.scrollTo(0, y);
                await new Promise(r => setTimeout(r, 120));
            }
            window.scrollTo(0, 0);
        });
        await new Promise(r => setTimeout(r, 1200));

        return await page.evaluate((site) => {
            // Per-page tags from react-helmet-async replace index.html's defaults.
            const managed = [...document.head.querySelectorAll('meta[data-rh], link[data-rh]')];
            managed.forEach(tag => {
                const key = tag.getAttribute('name') ? `name="${tag.getAttribute('name')}"`
                    : tag.getAttribute('property') ? `property="${tag.getAttribute('property')}"` : null;
                if (!key) return;
                document.head.querySelectorAll(`meta[${key}]:not([data-rh])`).forEach(dup => dup.remove());
            });
            // Vite's runtime-injected preload hints are rebuilt on load anyway.
            document.head.querySelectorAll('link[rel="modulepreload"]:not([crossorigin])').forEach(l => l.remove());

            const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
            const noindex = !!document.querySelector('meta[name="robots"][content*="noindex"]');
            const links = [...document.querySelectorAll('a[href^="/"]')]
                .map(a => a.getAttribute('href').split(/[?#]/)[0])
                .filter(Boolean);
            const canonicalPath = canonical && canonical.startsWith(site)
                ? (canonical.slice(site.length) || '/') : null;
            return {
                html: '<!doctype html>\n' + document.documentElement.outerHTML,
                canonicalPath,
                noindex,
                links
            };
        }, SITE_URL);
    } finally {
        await page.close();
    }
};

const main = async () => {
    // Keep the untouched SPA shell before index.html is overwritten.
    await copyFile(join(DIST, 'index.html'), join(DIST, 'app-shell.html'));

    const server = await preview({ root: ROOT, preview: { port: 4179, strictPort: false, open: false }, logLevel: 'warn' });
    const origin = server.resolvedUrls.local[0].replace(/\/$/, '');
    const browser = await launchBrowser();

    const queue = [...CORE_ROUTES];
    const seen = new Set(queue);
    const indexed = [];
    const failures = [];
    // Written only after crawling: the preview server serves dist/, so
    // writing as we go would feed rendered pages back into later renders.
    const outputs = new Map();

    try {
        while (queue.length) {
            const route = queue.shift();
            let result;
            try {
                result = await renderPage(browser, origin, route);
            } catch (error) {
                failures.push(route);
                console.warn(`[prerender] ${route} failed: ${error.message}`);
                continue;
            }

            for (const link of result.links) {
                const path = link.replace(/\/$/, '') || '/';
                if (!seen.has(path) && !SKIP.test(path)) {
                    seen.add(path);
                    queue.push(path);
                }
            }

            // Pages reachable at a second URL (e.g. /services/<doc id>) point
            // their canonical at the main one; only save and list that one.
            if (result.canonicalPath && result.canonicalPath !== route) {
                if (!seen.has(result.canonicalPath)) {
                    seen.add(result.canonicalPath);
                    queue.push(result.canonicalPath);
                }
                continue;
            }
            if (result.noindex) continue;

            outputs.set(outputFile(route), result.html);
            indexed.push(route);
            console.log(`[prerender] ${route}`);
        }

        const notFound = await renderPage(browser, origin, NOT_FOUND_PROBE);
        outputs.set(join(DIST, '404.html'), notFound.html);
        console.log('[prerender] 404.html');
    } finally {
        await browser.close();
        await new Promise(resolve => server.httpServer.close(resolve));
    }

    const coreFailures = failures.filter(r => CORE_ROUTES.includes(r));
    if (coreFailures.length) {
        throw new Error(`Core pages failed to prerender: ${coreFailures.join(', ')}`);
    }

    for (const [file, html] of outputs) {
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, html);
    }

    const today = new Date().toISOString().slice(0, 10);
    const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
        + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + indexed.sort().map(route => `  <url>\n    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')
        + '\n</urlset>\n';
    await writeFile(join(DIST, 'sitemap.xml'), sitemap);
    console.log(`[prerender] Done: ${indexed.length} pages, sitemap.xml written${failures.length ? `; skipped ${failures.join(', ')}` : ''}.`);
};

main().catch(error => {
    console.error('[prerender]', error);
    process.exit(1);
});
