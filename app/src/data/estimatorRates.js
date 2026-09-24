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
        prep: 1
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
        trimDoors: 450
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
        backsplash: 18
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
        plumbingMove: 2800
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
        railing: 95
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
        waterproofing: 3.5
    },
    overheadPercent: 18,
    rangeSpread: 10
};

// Keep only known keys with valid numbers from saved rates, falling back to
// defaults, so a partial or stale save can't break the calculator.
export const mergeRates = (defaults, saved) => Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => {
        const incoming = saved?.[key];
        if (value && typeof value === 'object') return [key, mergeRates(value, incoming)];
        if (typeof value === 'number') {
            return [key, typeof incoming === 'number' && Number.isFinite(incoming) && incoming >= 0 ? incoming : value];
        }
        return [key, value];
    })
);
