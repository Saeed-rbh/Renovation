import { useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { sendEstimateRequest } from '../utils/inquiry';
import { DEFAULT_ESTIMATOR_RATES, mergeRates } from '../data/estimatorRates';
import './EstimatorPage.css';

const EstimatorPage = () => {
    const frameRef = useRef(null);

    // Hand the widget the rates saved in Admin → Estimator Rates. It may load
    // before or after the fetch finishes, so send once both are ready.
    useEffect(() => {
        let rates = null;
        let widgetReady = false;
        const sendRates = () => {
            if (rates && widgetReady) {
                frameRef.current?.contentWindow?.postMessage({ type: 'homev-estimator-rates', rates }, window.location.origin);
            }
        };
        const handleReady = (event) => {
            if (event.origin !== window.location.origin || event.data?.type !== 'homev-estimator-ready') return;
            widgetReady = true;
            sendRates();
        };
        window.addEventListener('message', handleReady);
        getDoc(doc(db, "content", "estimator"))
            .then(snap => { rates = mergeRates(DEFAULT_ESTIMATOR_RATES, snap.exists() ? snap.data() : null); })
            .catch(error => {
                console.error("Error fetching estimator rates:", error);
                rates = DEFAULT_ESTIMATOR_RATES;
            })
            .finally(sendRates);
        return () => window.removeEventListener('message', handleReady);
    }, []);

    // The estimator runs in an iframe; it hands quote requests up to us so they
    // are emailed and saved to the admin inbox like the About page form.
    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.origin !== window.location.origin || event.data?.type !== 'homev-estimate-request') return;
            const result = await sendEstimateRequest(event.data.payload);
            event.source?.postMessage({ type: 'homev-estimate-result', ...result }, event.origin);
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <PageTransition>
            <SEO
                title="Instant Estimate"
                description="Get a fast, ballpark cost range for your renovation or construction project."
            />
            <div className="page-container">
                <div className="container">
                    <div className="section-header text-center">
                        <h1 className="section-title">Get An Instant Estimate</h1>
                        <p className="estimator-subtitle">
                            Pick a project type, answer a few quick questions, and get a ballpark
                            price range in under a minute. Want an exact quote instead? Reach out
                            through the results screen and our team will follow up.
                        </p>
                    </div>

                    <div className="estimator-frame-wrapper glass-panel">
                        <iframe
                            ref={frameRef}
                            src="/estimator-widget.html"
                            title="Homev Instant Estimator"
                            className="estimator-frame"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EstimatorPage;
