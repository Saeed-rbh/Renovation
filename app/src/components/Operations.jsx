import { Link } from 'react-router-dom';
import { operations } from '../data/operations';
import './Operations.css';

const Operations = () => {
    return (
        <section className="operations-section">
            <div className="operations-grid">
                {operations.map((op) => (
                    <div key={op.id} className={`op-item ${op.id}`}>
                        <div className="op-bg" style={{ backgroundImage: `url('${op.image}')` }}></div>
                        <div className="op-content">
                            <h2>{op.title.toUpperCase()}</h2>
                            <Link to={`/operations/${op.id}`} className="op-btn">Read More</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Operations;
