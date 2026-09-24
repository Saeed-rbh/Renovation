import React, { useState, useEffect } from 'react';
import { Save, Calculator } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DEFAULT_ESTIMATOR_RATES, mergeRates } from '../../data/estimatorRates';
import Loading from '../../components/Loading';

// What the admin can edit, in the order the estimator asks about it.
// `options` are the dropdown choices customers pick from (one row each);
// `extras` are single rates. `percent` values are stored as fractions.
const SECTIONS = [
    {
        key: 'flooring', title: 'Flooring',
        options: [{
            path: 'materials', heading: 'Flooring materials',
            fields: [['material', 'Material', '$/sq ft'], ['labor', 'Install labor', '$/sq ft']]
        }],
        extras: [['removal', 'Remove & haul away old flooring', '$/sq ft'], ['prep', 'Subfloor repair / leveling', '$/sq ft']]
    },
    {
        key: 'painting', title: 'Painting',
        options: [{ path: 'tiers', heading: 'Paint quality', fields: [['rate', 'Rate per coat', '$/sq ft']] }],
        extras: [['ceilingAdd', 'Ceiling add-on (extra area)', '%', true], ['trimDoors', 'Trim & doors', '$ flat']]
    },
    {
        key: 'kitchen', title: 'Kitchen Reno',
        options: [
            { path: 'cabinets', heading: 'Cabinets', fields: [['rate', 'Rate', '$/linear ft']] },
            { path: 'counters', heading: 'Countertops', fields: [['rate', 'Rate', '$/sq ft']] }
        ],
        extras: [
            ['baseLabor', 'Demo, electrical, plumbing & install labor', '$/sq ft of kitchen'],
            ['appliances', 'Appliance package', '$ flat'],
            ['backsplash', 'Backsplash', '$/sq ft']
        ]
    },
    {
        key: 'bathroom', title: 'Bathroom Reno',
        options: [{ path: 'fixtures', heading: 'Fixture packages', fields: [['flat', 'Price', '$ flat']] }],
        extras: [
            ['baseLabor', 'Demo, plumbing & install labor', '$/sq ft of bathroom'],
            ['tile', 'Tile (floor + shower surround)', '$/sq ft'],
            ['plumbingMove', 'Plumbing relocation', '$ flat']
        ]
    },
    {
        key: 'stairs', title: 'Stairs',
        options: [{ path: 'work', heading: 'Type of work', fields: [['perStep', 'Rate', '$/step']] }],
        extras: [['railing', 'Railing & spindles', '$/linear ft']]
    },
    {
        key: 'basement', title: 'Basement Finish',
        options: [{ path: 'tiers', heading: 'Finish level', fields: [['perSqft', 'Rate', '$/sq ft']] }],
        extras: [
            ['bathroomAddition', 'Bathroom addition', '$ flat'],
            ['egressWindow', 'Egress window', '$ flat'],
            ['waterproofing', 'Waterproofing / vapor barrier', '$/sq ft']
        ]
    }
];

const getIn = (obj, path) => path.reduce((o, k) => o?.[k], obj);
const setIn = (obj, [key, ...rest], value) => ({
    ...obj,
    [key]: rest.length ? setIn(obj[key], rest, value) : value
});
const money = (n) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

const AdminEstimator = () => {
    const [rates, setRates] = useState(DEFAULT_ESTIMATOR_RATES);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docSnap = await getDoc(doc(db, "content", "estimator"));
                if (docSnap.exists()) {
                    setRates(mergeRates(DEFAULT_ESTIMATOR_RATES, docSnap.data()));
                }
            } catch (error) {
                console.error("Error fetching estimator rates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Empty inputs are kept as '' while typing and caught on save.
    const handleChange = (path, raw, percent) => {
        const value = raw === '' ? '' : Number(raw) / (percent ? 100 : 1);
        setRates(prev => setIn(prev, path, value));
    };

    const handleSave = async () => {
        const invalid = [];
        (function walk(o, path) {
            Object.entries(o).forEach(([k, v]) => {
                if (v && typeof v === 'object') walk(v, [...path, k]);
                else if (v === '' || (typeof v === 'number' && (!Number.isFinite(v) || v < 0))) invalid.push([...path, k].join(' › '));
            });
        })(rates, []);
        if (invalid.length) {
            alert(`Please enter a valid number (0 or more) for every rate.\n\nCheck: ${invalid.join(', ')}`);
            return;
        }

        setIsSaving(true);
        try {
            await setDoc(doc(db, "content", "estimator"), rates);
            alert("Rates saved. The estimator uses them right away.");
        } catch (error) {
            console.error("Error saving estimator rates:", error);
            alert("Failed to save rates.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loading text="Loading rates..." />;

    const markup = 1 + (Number(rates.overheadPercent) || 0) / 100;

    const RateInput = ({ path, label, unit, percent }) => {
        const value = getIn(rates, path);
        const shown = value === '' ? '' : +(percent ? value * 100 : value).toFixed(4);
        const isPrice = !percent && !['overheadPercent', 'rangeSpread'].includes(path[path.length - 1]);
        return (
            <div className="rate-field">
                <label>{label}</label>
                <div className="rate-input">
                    <input
                        type="number"
                        min="0"
                        step="any"
                        className="form-input"
                        value={shown}
                        onChange={(e) => handleChange(path, e.target.value, percent)}
                    />
                    <span className="rate-unit">{unit}</span>
                </div>
                {isPrice && typeof value === 'number' && (
                    <span className="rate-customer">Customer sees {money(value * markup)}</span>
                )}
            </div>
        );
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="icon-circle" style={{ width: '40px', height: '40px' }}>
                        <Calculator size={20} />
                    </div>
                    <h1>Estimator Rates</h1>
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                    <Save size={18} style={{ marginRight: '8px' }} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gap: '30px' }}>
                <div className="admin-card">
                    <h3 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>Overhead, Profit & Range</h3>
                    <p className="rate-help">
                        Enter every rate below as your cost. Overhead &amp; profit is added on top of each price
                        automatically and is never shown to customers as its own line. The range widens the final
                        total into a low–high ballpark.
                    </p>
                    <div className="rate-grid">
                        {RateInput({ path: ['overheadPercent'], label: 'Overhead & profit', unit: '%' })}
                        {RateInput({ path: ['rangeSpread'], label: 'Estimate range', unit: '± %' })}
                    </div>
                </div>

                {SECTIONS.map(section => (
                    <div className="admin-card" key={section.key}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>{section.title}</h3>

                        {section.options.map(group => (
                            <div key={group.path} className="rate-group">
                                <h4>{group.heading}</h4>
                                {Object.entries(rates[section.key][group.path]).map(([optKey, opt]) => (
                                    <div key={optKey} className="rate-row">
                                        <div className="rate-row-label">{opt.label}</div>
                                        <div className="rate-grid">
                                            {group.fields.map(([field, label, unit]) =>
                                                <React.Fragment key={field}>
                                                    {RateInput({ path: [section.key, group.path, optKey, field], label, unit })}
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="rate-group">
                            <h4>Add-ons &amp; labor</h4>
                            <div className="rate-grid">
                                {section.extras.map(([field, label, unit, percent]) =>
                                    <React.Fragment key={field}>
                                        {RateInput({ path: [section.key, field], label, unit, percent })}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEstimator;
