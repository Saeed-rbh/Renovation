import React, { useState, useEffect } from 'react';
import { Save, Calculator, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { DEFAULT_ESTIMATOR_RATES, mergeRates } from '../../data/estimatorRates';
import Loading from '../../components/Loading';

// What the admin can edit, in the order the estimator asks about it.
// `options` are the dropdown choices customers pick from (one row each,
// which the admin can rename, add and remove); `extras` are the built-in
// single rates. `percent` values are stored as fractions.
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
const setIn = (obj, [key, ...rest], value) => {
    if (Array.isArray(obj)) {
        const copy = [...obj];
        copy[key] = rest.length ? setIn(obj[key], rest, value) : value;
        return copy;
    }
    return { ...obj, [key]: rest.length ? setIn(obj[key], rest, value) : value };
};
const newKey = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const isBlank = (v) => v === '' || v === undefined || (typeof v === 'number' && (!Number.isFinite(v) || v < 0));
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

    const addOption = (scope, group, fields) => {
        setRates(prev => setIn(prev, [scope, group, newKey('opt')], {
            label: '',
            ...Object.fromEntries(fields.map(([f]) => [f, '']))
        }));
    };

    const removeOption = (scope, group, key) => {
        setRates(prev => {
            const { [key]: _removed, ...rest } = prev[scope][group];
            return setIn(prev, [scope, group], rest);
        });
    };

    const addAddon = (scope) => {
        setRates(prev => setIn(prev, [scope, 'addons'], [
            ...prev[scope].addons,
            { id: newKey('addon'), label: '', unit: 'flat', qtyLabel: '', price: '' }
        ]));
    };

    const removeAddon = (scope, index) => {
        setRates(prev => setIn(prev, [scope, 'addons'], prev[scope].addons.filter((_, i) => i !== index)));
    };

    // Returns a readable list of what still needs filling in.
    const findProblems = () => {
        const problems = [];
        ['overheadPercent', 'rangeSpread'].forEach(k => isBlank(rates[k]) && problems.push(k === 'overheadPercent' ? 'Overhead & profit' : 'Estimate range'));
        SECTIONS.forEach(section => {
            const r = rates[section.key];
            section.options.forEach(group => {
                Object.values(r[group.path]).forEach(opt => {
                    const name = `${section.title} › ${group.heading} › ${opt.label.trim() || '(unnamed option)'}`;
                    if (!opt.label.trim()) problems.push(`${name}: name`);
                    group.fields.forEach(([f, label]) => isBlank(opt[f]) && problems.push(`${name}: ${label}`));
                });
            });
            section.extras.forEach(([f, label]) => isBlank(r[f]) && problems.push(`${section.title} › ${label}`));
            r.addons.forEach(a => {
                const name = `${section.title} › Custom add-on › ${a.label.trim() || '(unnamed)'}`;
                if (!a.label.trim()) problems.push(`${name}: name`);
                if (isBlank(a.price)) problems.push(`${name}: price`);
                if (a.unit === 'qty' && !a.qtyLabel.trim()) problems.push(`${name}: unit (e.g. sq ft, each)`);
            });
        });
        return problems;
    };

    const handleSave = async () => {
        const problems = findProblems();
        if (problems.length) {
            alert(`Please fill in every name and price (numbers 0 or more) before saving.\n\nMissing or invalid:\n• ${problems.join('\n• ')}`);
            return;
        }

        // Record the on-screen order so dropdowns keep it after saving.
        let toSave = rates;
        SECTIONS.forEach(section => section.options.forEach(group => {
            Object.keys(rates[section.key][group.path]).forEach((key, order) => {
                toSave = setIn(toSave, [section.key, group.path, key, 'order'], order);
            });
        }));

        setIsSaving(true);
        try {
            await setDoc(doc(db, "content", "estimator"), toSave);
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
                                {Object.entries(rates[section.key][group.path]).map(([optKey, opt], _i, all) => (
                                    <div key={optKey} className="rate-row">
                                        <div className="rate-field">
                                            <label>Option name</label>
                                            <div className="rate-input">
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={opt.label}
                                                    placeholder="e.g. Walnut cabinets"
                                                    onChange={(e) => setRates(prev => setIn(prev, [section.key, group.path, optKey, 'label'], e.target.value))}
                                                />
                                                <button
                                                    type="button"
                                                    className="action-btn delete"
                                                    title={all.length === 1 ? 'Each list needs at least one option' : 'Remove option'}
                                                    disabled={all.length === 1}
                                                    onClick={() => removeOption(section.key, group.path, optKey)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="rate-grid">
                                            {group.fields.map(([field, label, unit]) =>
                                                <React.Fragment key={field}>
                                                    {RateInput({ path: [section.key, group.path, optKey, field], label, unit })}
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="rate-add-btn" onClick={() => addOption(section.key, group.path, group.fields)}>
                                    <Plus size={16} /> Add option
                                </button>
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

                        <div className="rate-group">
                            <h4>Custom add-ons</h4>
                            <p className="rate-help" style={{ marginBottom: '12px' }}>
                                Extra checkboxes customers can tick for {section.title.toLowerCase()}. Choose a flat
                                price, or a price per unit where the customer enters how many.
                            </p>
                            {rates[section.key].addons.map((addon, index) => (
                                <div key={addon.id} className="rate-row rate-addon">
                                    <div className="rate-field">
                                        <label>Add-on name</label>
                                        <div className="rate-input">
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={addon.label}
                                                placeholder="e.g. Pot lights"
                                                onChange={(e) => setRates(prev => setIn(prev, [section.key, 'addons', index, 'label'], e.target.value))}
                                            />
                                            <button type="button" className="action-btn delete" title="Remove add-on" onClick={() => removeAddon(section.key, index)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="rate-grid">
                                        <div className="rate-field">
                                            <label>Pricing</label>
                                            <select
                                                className="form-input"
                                                value={addon.unit}
                                                onChange={(e) => setRates(prev => setIn(prev, [section.key, 'addons', index, 'unit'], e.target.value))}
                                            >
                                                <option value="flat">Flat price</option>
                                                <option value="qty">Price per unit</option>
                                            </select>
                                        </div>
                                        {addon.unit === 'qty' && (
                                            <div className="rate-field">
                                                <label>Unit</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={addon.qtyLabel}
                                                    placeholder="e.g. each, sq ft, linear ft"
                                                    onChange={(e) => setRates(prev => setIn(prev, [section.key, 'addons', index, 'qtyLabel'], e.target.value))}
                                                />
                                            </div>
                                        )}
                                        {RateInput({
                                            path: [section.key, 'addons', index, 'price'],
                                            label: 'Price',
                                            unit: addon.unit === 'qty' ? `$/${addon.qtyLabel.trim() || 'unit'}` : '$ flat'
                                        })}
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="rate-add-btn" onClick={() => addAddon(section.key)}>
                                <Plus size={16} /> Add custom add-on
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEstimator;
