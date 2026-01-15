import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '30px' }}>
            <ol style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px',
                listStyle: 'none',
                padding: '0px',
                margin: '0px',
                fontSize: '0.9rem',
                color: 'var(--text-dim)',
                marginLeft: '10px',
                marginTop: '0px',
                marginBottom: '-15px'
            }}>
                <li>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-dim)',
                        transition: 'color 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-dim)'}
                    >
                        <Home size={14} /> Home
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ChevronRight size={14} style={{ opacity: 0.5 }} />
                        {item.path ? (
                            <Link to={item.path} style={{
                                color: 'var(--text-dim)',
                                transition: 'color 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-dim)'}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
