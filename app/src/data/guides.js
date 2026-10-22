// Educational guides shown at /guides. Newest first. Each guide is a list of
// content blocks so articles stay plain data (no markdown parser needed):
//   { type: 'p', text }                 paragraph
//   { type: 'h2', text }                section heading (also builds the table of contents)
//   { type: 'list', items: [] }         bullet list
//   { type: 'steps', items: [{ title, text }] }  numbered steps
//   { type: 'figure', src, alt, caption }
//   { type: 'callout', title, text }    highlighted note
// `faq` feeds both the on-page FAQ and FAQPage structured data.

export const guides = [
    {
        slug: 'foundation-waterproofing-guide',
        title: 'Foundation Waterproofing: How to Keep Your Basement Dry',
        description: 'Signs of a leaking foundation, interior vs exterior waterproofing, sump pumps, backwater valves and the simple fixes every Toronto homeowner should check first.',
        category: 'Basements',
        published: '2026-11-05',
        readMinutes: 7,
        image: '/guides/foundation-excavation.jpg',
        imageAlt: 'Excavation along a brick home\'s foundation wall',
        relatedService: { label: 'Basement Finishing', path: '/services/basement-finishing' },
        body: [
            { type: 'p', text: 'Water is the number one enemy of a finished basement. A small leak can ruin new flooring and drywall, grow mould behind the walls, and turn a beautiful renovation into a costly repair. The good news: most basement water problems have a clear cause and a proven fix. This guide explains how to spot the warning signs, what your options are, and what to do before you finish or legalize a basement.' },
            { type: 'h2', text: 'Signs your foundation is letting water in' },
            { type: 'list', items: [
                'Damp or dark patches on the lower part of foundation walls, especially after rain or snow melt.',
                'White, chalky deposits on concrete (efflorescence): minerals left behind as water passes through.',
                'A musty smell that doesn\'t go away, or mould on drywall, baseboards or stored boxes.',
                'Water on the floor along the wall-floor joint, or around a floor drain after heavy rain.',
                'Cracks in the foundation wall, especially ones that are wider at one end or show staining.',
                'Peeling paint, rust on metal near the floor, or carpet that feels damp.',
            ] },
            { type: 'callout', title: 'Fix water before you finish', text: 'Never cover a damp foundation wall with insulation and drywall. Solve the water problem first. Finishing over moisture traps it inside the wall, where it causes mould and rot you won\'t see until the damage is done.' },
            { type: 'h2', text: 'Start with the free and cheap fixes' },
            { type: 'p', text: 'A surprising number of wet basements are caused by water that is directed toward the house instead of away from it. Check these first:' },
            { type: 'list', items: [
                'Grading: the soil around the house should slope away from the foundation, not toward it.',
                'Downspouts: extend them so roof water lands well away from the foundation, never right at the wall.',
                'Eavestroughs: clear clogged gutters so water doesn\'t overflow straight down beside the house.',
                'Window wells: keep them clear of leaves and debris, make sure they drain, and consider a cover.',
                'Driveways and walkways: settled concrete that tilts toward the house can funnel water to the wall.',
            ] },
            { type: 'h2', text: 'Exterior waterproofing' },
            { type: 'p', text: 'Exterior waterproofing stops water before it reaches the foundation. It is the most complete solution, and the most involved, because the soil must be dug out down to the footing.' },
            { type: 'figure', src: '/guides/foundation-excavation.jpg', alt: 'Narrow excavation beside a foundation wall with soil piled up', caption: 'Exterior work means digging along the foundation wall, often in tight side yards like this one.' },
            { type: 'steps', items: [
                { title: 'Excavate', text: 'Dig along the affected wall down to the footing.' },
                { title: 'Clean and repair', text: 'Clean the wall and repair cracks and holes in the concrete.' },
                { title: 'Membrane', text: 'Apply a waterproofing membrane to the outside of the wall, often with a dimpled drainage board over it.' },
                { title: 'Weeping tile', text: 'Install or replace the perforated drain pipe at the footing so water is carried away.' },
                { title: 'Backfill and grade', text: 'Backfill with free-draining material and re-grade the surface so water flows away from the house.' },
            ] },
            { type: 'h2', text: 'Interior waterproofing' },
            { type: 'p', text: 'Interior systems manage water that reaches the foundation instead of stopping it outside. They are often used where digging outside isn\'t practical, such as a shared wall, a tight lot or a finished landscape.' },
            { type: 'list', items: [
                'Interior weeping tile: a drain channel cut into the floor along the walls that collects water and sends it to a sump pit.',
                'Sump pump: pumps collected water out and away from the house. A battery backup keeps it running in a power outage.',
                'Dimpled membrane on the walls: lets any seepage drain down behind the finished wall to the interior drain.',
                'Crack injection: seals individual leaking cracks in poured concrete walls from the inside.',
            ] },
            { type: 'h2', text: 'Exterior or interior: which is right?' },
            { type: 'p', text: 'Exterior waterproofing is usually preferred when you can dig, because it keeps water out of the wall itself. Interior drainage is a strong option when access outside is limited or the problem is mainly water at the footing. Many homes use both: exterior work on the worst wall and an interior system with a sump pump as a backup. The right answer depends on where the water is coming from, so start with an inspection rather than a product.' },
            { type: 'h2', text: 'Protect against sewer backup too' },
            { type: 'p', text: 'Not all basement flooding comes through the walls. During heavy storms, the city sewer can back up into your basement through floor drains. A backwater valve installed on your main drain lets water flow out but stops sewage from flowing back in. The City of Toronto runs a Basement Flooding Protection Subsidy Program that has helped homeowners pay for backwater valves, sump pumps and downspout disconnection. Check the city\'s website for the current rules before you start, as subsidy programs usually require a permit and approval first.' },
            { type: 'callout', title: 'Planning a basement renovation or legal suite?', text: 'Waterproofing is the first step, not the last. We look at moisture, grading and drainage before we frame a single wall, so the finished space stays dry for years.' },
        ],
        faq: [
            { q: 'Is a little dampness in the basement normal?', a: 'Some humidity is normal, especially in summer, and a dehumidifier helps. Water stains, efflorescence, musty smells or water on the floor are not normal and point to water getting through the foundation.' },
            { q: 'Can I waterproof from the inside only?', a: 'Yes. Interior drainage with a sump pump is a proven way to manage water when digging outside isn\'t practical. It manages water that reaches the wall rather than keeping it out, so it is often paired with fixing grading and downspouts outside.' },
            { q: 'Do I need a permit for waterproofing in Toronto?', a: 'It depends on the work. Installing a backwater valve or changing drain plumbing needs a plumbing permit, and the city\'s flooding subsidy program requires one. Check with the City of Toronto before you start.' },
        ],
    },
    {
        slug: 'basement-legalization-steps-toronto',
        title: 'How to Legalize a Basement Apartment in Toronto: Step by Step',
        description: 'The steps to turn a basement into a legal secondary suite in Toronto: zoning, permit drawings, fire separation, egress windows, smoke alarms, electrical and inspections.',
        category: 'Legal Basements',
        published: '2026-10-29',
        readMinutes: 8,
        image: '/guides/legal-basement-suite.jpg',
        imageAlt: 'Finished legal basement suite with a new kitchen and stairs',
        relatedService: { label: 'Basement Finishing', path: '/services/basement-finishing' },
        body: [
            { type: 'p', text: 'A legal basement apartment, called a secondary suite, can add rental income and value to your home. Making it legal also makes it safe: the rules exist so the people living downstairs can get out quickly in a fire and the people upstairs are protected too. Here is how the process works in Toronto, from first idea to final inspection.' },
            { type: 'figure', src: '/guides/basement-before.jpg', alt: 'Dated basement with old kitchen cabinets and tile floor before renovation', caption: 'Before: a dated basement unit that didn\'t meet current safety requirements.' },
            { type: 'h2', text: 'Why legalize your basement?' },
            { type: 'list', items: [
                'Safety for your tenants and your family: proper fire separation, exits and alarms.',
                'Protection for you: an illegal unit can create problems with insurance claims and liability.',
                'A stronger rental: legal suites attract better tenants and support the rent you charge.',
                'Higher resale value: buyers and lenders prefer a suite with permits and inspections on record.',
            ] },
            { type: 'h2', text: 'The steps' },
            { type: 'steps', items: [
                { title: 'Confirm your house qualifies', text: 'Toronto allows secondary suites in most detached, semi-detached and townhouses. Zoning, parking and the existing layout still matter, so confirm what applies to your property first.' },
                { title: 'Get permit drawings', text: 'A qualified designer measures the space and prepares drawings showing the suite layout, fire separations, exits, windows, mechanical and electrical work.' },
                { title: 'Apply for a building permit', text: 'Drawings are submitted to Toronto Building. The city reviews them against the Ontario Building Code and may ask for changes before issuing the permit.' },
                { title: 'Build the fire separation', text: 'Walls and ceilings between the two units are built as fire separations, usually with insulation and fire-rated drywall, and openings such as doors and ducts are protected.' },
                { title: 'Create safe ways out', text: 'Every bedroom needs a way to escape: an egress window or a door to the outside. This often means enlarging a basement window and adding a window well.' },
                { title: 'Install interconnected smoke and CO alarms', text: 'Smoke alarms in both units are wired together so an alarm in one unit sounds in the other, with carbon monoxide alarms where fuel-burning appliances are present.' },
                { title: 'Electrical, plumbing and HVAC', text: 'New wiring needs an Electrical Safety Authority (ESA) permit and inspection. Plumbing and heating changes are inspected under the building permit.' },
                { title: 'Inspections and closing the permit', text: 'Inspectors visit at key stages: framing, insulation, fire separation, and final. Once the final inspection passes, the permit is closed and the suite is on record.' },
            ] },
            { type: 'figure', src: '/guides/fire-separation-insulation.jpg', alt: 'Stone wool insulation between wall studs with resilient channel', caption: 'Fire separation in progress: stone wool insulation and resilient channel before fire-rated drywall goes on.' },
            { type: 'figure', src: '/guides/interconnected-smoke-alarm.jpg', alt: 'Hard-wired interconnected smoke alarm being installed', caption: 'Interconnected smoke alarms make sure both units hear the alarm.' },
            { type: 'callout', title: 'Already have a basement apartment?', text: 'Existing two-unit houses may be inspected by Toronto Fire Services under the Ontario Fire Code, which focuses on fire separation, exits and alarms. If your suite was built without permits, the safest path is to have it assessed and brought up to standard.' },
            { type: 'h2', text: 'How long does it take?' },
            { type: 'p', text: 'Drawings and permit review usually take several weeks, depending on the city\'s workload and any revisions. Construction depends on the starting condition. A basement that is already finished may only need fire separation, alarms and an egress window, while an unfinished basement is a full renovation. On one of our recent projects, construction from demolition to final walkthrough took about two months.' },
            { type: 'figure', src: '/guides/legal-basement-suite.jpg', alt: 'Bright legal basement suite with white kitchen and new stairs', caption: 'After: the same basement as a bright, legal suite with a new kitchen, floors and stairs.' },
        ],
        faq: [
            { q: 'Do I need a permit to legalize a basement apartment in Toronto?', a: 'Yes. Creating a secondary suite requires a building permit, and new electrical work requires an ESA permit. Inspections at each stage confirm the work meets the Ontario Building Code.' },
            { q: 'What is the most common thing that stops a basement from being legal?', a: 'Missing fire separation between the units, bedrooms without a proper egress window, and smoke alarms that aren\'t interconnected are the most common gaps. Ceiling height and room layout can also be issues in older basements.' },
            { q: 'Can I live in the house during the work?', a: 'Usually yes. Most legalization work happens in the basement, though there will be some noise, dust control and short periods when power or water is shut off.' },
        ],
    },
    {
        slug: 'what-is-an-egress-window',
        title: 'What Is an Egress Window and Why Your Basement Needs One',
        description: 'What an egress window is, the Ontario Building Code size requirements, why basement bedrooms need one, and how it is installed step by step.',
        category: 'Legal Basements',
        published: '2026-10-22',
        readMinutes: 5,
        image: '/guides/egress-finished.jpg',
        imageAlt: 'New egress window in a finished basement bedroom',
        relatedService: { label: 'Basement Finishing', path: '/services/basement-finishing' },
        body: [
            { type: 'p', text: 'An egress window is a window big enough, and low enough to reach, that a person can climb out of it in an emergency. In a basement bedroom it is often the only way out if a fire blocks the stairs. That is why the Ontario Building Code requires one, and why it is one of the first things an inspector checks when you legalize or finish a basement.' },
            { type: 'h2', text: 'Why basement bedrooms need one' },
            { type: 'p', text: 'Fires often start at night, and smoke rises up stairwells quickly. If someone sleeping in a basement can\'t reach the stairs, a window they can open and climb through may save their life. It also gives firefighters a way in. Standard small basement windows are almost never big enough, which is why most basement legalization projects include at least one new egress window.' },
            { type: 'h2', text: 'Ontario Building Code requirements' },
            { type: 'p', text: 'Under the Ontario Building Code (section 9.9.10.1), a bedroom without a sprinkler system needs at least one outside window or door that meets these rules:' },
            { type: 'list', items: [
                'It opens from the inside without keys, tools or special knowledge.',
                'The clear opening is at least 0.35 m² (about 3.8 sq. ft.).',
                'No side of the opening is less than 380 mm (about 15 inches).',
                'If the window opens into a window well, there is at least 550 mm (about 22 inches) of clear space in front of the window.',
            ] },
            { type: 'callout', title: 'Measure the opening, not the frame', text: 'The size that counts is the clear space you can climb through when the window is fully open. A window can look big but fail if the sash, hinges or a centre bar block part of the opening.' },
            { type: 'h2', text: 'How an egress window is installed' },
            { type: 'figure', src: '/guides/egress-cutting-foundation.jpg', alt: 'Concrete saw cutting a larger opening in a foundation wall', caption: 'Cutting the larger opening in the concrete foundation with a wall saw.' },
            { type: 'steps', items: [
                { title: 'Plan and permit', text: 'Enlarging a window opening in a foundation wall is structural work, so it is usually part of a building permit.' },
                { title: 'Excavate outside', text: 'Dig down beside the wall to make room for the bigger opening and the window well.' },
                { title: 'Cut the foundation', text: 'A concrete wall saw cuts the new, larger opening cleanly. A header or lintel is added if the opening needs support above it.' },
                { title: 'Install the window', text: 'The new window is set, sealed and insulated in the opening.' },
                { title: 'Install the window well', text: 'A window well holds back the soil, with gravel at the bottom so water drains away.' },
                { title: 'Finish inside', text: 'Drywall, trim and paint around the window complete the job.' },
            ] },
            { type: 'figure', src: '/guides/egress-installed.jpg', alt: 'New basement window installed in an enlarged foundation opening', caption: 'The new window installed in the enlarged opening, before the inside is finished.' },
            { type: 'figure', src: '/guides/egress-finished.jpg', alt: 'Finished egress window with white trim in a basement bedroom', caption: 'Finished: a bigger, brighter window that meets code.' },
            { type: 'h2', text: 'Bonus: more light and a better room' },
            { type: 'p', text: 'An egress window isn\'t only about safety. A larger window brings in much more daylight and fresh air, and makes a basement bedroom feel like a real room. It is one of the upgrades tenants and buyers notice first.' },
        ],
        faq: [
            { q: 'Do I need a permit for an egress window in Toronto?', a: 'Cutting or enlarging an opening in a foundation wall usually requires a building permit. It is normally included in the permit for a basement renovation or legal suite.' },
            { q: 'What size does an egress window need to be in Ontario?', a: 'The clear opening must be at least 0.35 m² with no side smaller than 380 mm, and it must open from the inside without tools or keys. If it opens into a window well, there must be at least 550 mm of clear space in front of it.' },
            { q: 'Does every basement room need an egress window?', a: 'The requirement applies to bedrooms in buildings without sprinklers. Other rooms don\'t need one, but bigger windows are still a great way to add light.' },
        ],
    },
];

export const getGuide = (slug) => guides.find(g => g.slug === slug);

export const formatGuideDate = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Only guides whose publish date has arrived are shown, so future weeks can be
// written ahead of time and appear on their own day.
export const publishedGuides = (today = new Date()) => {
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return guides.filter(g => g.published <= iso).sort((a, b) => b.published.localeCompare(a.published));
};
