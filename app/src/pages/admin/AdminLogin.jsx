import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './Admin.css';

const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulated Authentication
        if (username === 'admin' && password === 'admin123') {
            onLogin();
            navigate('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-card glass-panel">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div className="icon-circle">
                        <Lock size={24} />
                    </div>
                </div>
                <h2>Admin Access</h2>
                <p style={{ color: 'var(--text-dim)' }}>Restricted Area</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary login-btn">Login</button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '10px' }}>
                        Default: admin / admin123
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
