import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { operations as initialData } from '../data/operations'; // Fallback
import './Operations.css';

const Operations = () => {
    const [operationsData, setOperationsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "operations"));
                let ops = [];
                querySnapshot.forEach((doc) => {
                    ops.push({ ...doc.data(), id: doc.id });
                });

                if (ops.length > 0) {
                    // Sort by predefined order
                    const order = ['construction', 'renovation', 'investment'];
                    ops.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                    setOperationsData(ops);
                } else {
                    // Fallback to static data if DB is empty
                    setOperationsData(initialData);
                }
            } catch (error) {
                console.error("Error fetching operations:", error);
                setOperationsData(initialData);
            } finally {
                setLoading(false);
            }
        };

        fetchOperations();
    }, []);

    if (loading) {
        return (
            <section className="operations-section">
                <div className="operations-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="op-item" style={{ background: '#1a1a1a' }}></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="operations-section">
            <div className="operations-grid">
                {operationsData.map((op) => (
                    <div key={op.id} className={`op-item ${op.id}`}>
                        <div className="op-bg" style={{ backgroundImage: `url('${op.image}')` }}></div>
                        <div className="op-content">
                            <h2>{op.title?.toUpperCase()}</h2>
                            <Link to={`/operations/${op.id}`} className="op-btn">Read More</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Operations;
