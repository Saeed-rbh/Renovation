// Default estimator pricing, used until rates are saved from
// Admin → Estimator Rates (stored in Firestore at content/estimator).
// public/estimator-widget.html keeps an identical fallback copy.
// Prices are Homev's cost; overheadPercent is added on top of every price
// before a customer sees it, so it never shows as its own line.
export const DEFAULT_ESTIMATOR_RATES = {
    flooring: {
        materials: {
            laminate: {
                label: 'Laminate',
                material: 3.5,
                labor: 2.5
            },
            vinyl: {
                label: 'Vinyl / LVP',
                material: 4.25,
                labor: 2.25
            },
            engineered: {
                label: 'Engineered hardwood',
                material: 7.5,
                labor: 3.5
            },
            hardwood: {
                label: 'Solid hardwood',
                material: 10.5,
                labor: 4.5
            },
            tile: {
                label: 'Ceramic / porcelain tile',
                material: 6,
                labor: 5.5
            }
        },
        removal: 1.25,
        prep: 1,
        addons: []
    },
    painting: {
        tiers: {
            standard: {
                label: 'Standard paint',
                rate: 1.75
            },
            premium: {
                label: 'Premium paint',
                rate: 2.25
            }
        },
        ceilingAdd: 0.35,
        trimDoors: 450,
        addons: []
    },
    kitchen: {
        cabinets: {
            stock: {
                label: 'Stock cabinets',
                rate: 150
            },
            semicustom: {
                label: 'Semi-custom cabinets',
                rate: 320
            },
            custom: {
                label: 'Custom cabinets',
                rate: 550
            }
        },
        counters: {
            laminate: {
                label: 'Laminate counters',
                rate: 35
            },
            granite: {
                label: 'Granite counters',
                rate: 75
            },
            quartz: {
                label: 'Quartz counters',
                rate: 85
            }
        },
        baseLabor: 45,
        appliances: 4500,
        backsplash: 18,
        addons: []
    },
    bathroom: {
        fixtures: {
            basic: {
                label: 'Basic fixture package',
                flat: 2200
            },
            midrange: {
                label: 'Mid-range fixture package',
                flat: 4500
            },
            highend: {
                label: 'High-end fixture package',
                flat: 8500
            }
        },
        baseLabor: 55,
        tile: 22,
        plumbingMove: 2800,
        addons: []
    },
    stairs: {
        work: {
            retread: {
                label: 'Retread & riser replacement (carpet to wood)',
                perStep: 180
            },
            refinish: {
                label: 'Refinish existing wood stairs',
                perStep: 65
            },
            rebuild: {
                label: 'Full structural rebuild',
                perStep: 450
            }
        },
        railing: 95,
        addons: []
    },
    basement: {
        tiers: {
            basic: {
                label: 'Basic finish',
                perSqft: 35
            },
            midrange: {
                label: 'Mid-range finish',
                perSqft: 55
            },
            highend: {
                label: 'High-end finish',
                perSqft: 85
            }
        },
        bathroomAddition: 12000,
        egressWindow: 4500,
        waterproofing: 3.5,
        addons: []
    },
    overheadPercent: 18,
    rangeSpread: 10
};

// Dropdown groups the admin can add/remove choices in, and the price
// fields each choice has.
export const OPTION_GROUPS = {
    flooring: { materials: ['material', 'labor'] },
    painting: { tiers: ['rate'] },
    kitchen: { cabinets: ['rate'], counters: ['rate'] },
    bathroom: { fixtures: ['flat'] },
    stairs: { work: ['perStep'] },
    basement: { tiers: ['perSqft'] }
};

const validNumber = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const pick = (v, fallback) => (validNumber(v) ? v : fallback);
const text = (v) => (typeof v === 'string' ? v.trim() : '');

// Saved choices replace the defaults entirely (so deletions stick), sorted
// by the order they were saved in. Falls back to defaults if none are valid.
const mergeOptions = (defaults, saved, fields) => {
    if (!saved || typeof saved !== 'object') return defaults;
    const entries = Object.entries(saved)
        .filter(([, opt]) => opt && text(opt.label))
        .map(([key, opt], i) => [key, {
            label: text(opt.label),
            ...Object.fromEntries(fields.map(f => [f, pick(opt[f], defaults[key]?.[f] ?? 0)])),
            order: pick(opt.order, i)
        }])
        .sort((a, b) => a[1].order - b[1].order);
    return entries.length ? Object.fromEntries(entries) : defaults;
};

// Custom checkbox add-ons: a flat price, or a price per unit the customer
// enters a quantity for.
const mergeAddons = (saved) => (Array.isArray(saved) ? saved : [])
    .filter(a => a && text(a.label) && validNumber(a.price))
    .map((a, i) => ({
        id: text(a.id) || `addon_${i}`,
        label: text(a.label),
        unit: a.unit === 'qty' ? 'qty' : 'flat',
        qtyLabel: text(a.qtyLabel) || 'units',
        price: a.price
    }));

// Build the full rate set from saved data, falling back to defaults for
// anything missing or invalid, so a partial or stale save can't break the
// calculator.
export const mergeRates = (defaults, saved) => Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => {
        if (typeof value === 'number') return [key, pick(saved?.[key], value)];
        const groups = OPTION_GROUPS[key] || {};
        const s = saved?.[key];
        return [key, Object.fromEntries(Object.entries(value).map(([k, d]) => {
            if (groups[k]) return [k, mergeOptions(d, s?.[k], groups[k])];
            if (k === 'addons') return [k, mergeAddons(s?.addons)];
            return [k, pick(s?.[k], d)];
        }))];
    })
);
