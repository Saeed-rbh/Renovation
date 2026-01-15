import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    textAlign: 'center',
                    background: 'var(--bg-dark)'
                }}>
                    <div className="glass-panel" style={{ padding: '40px', maxWidth: '600px' }}>
                        <div style={{ color: '#ef4444', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                            <AlertTriangle size={64} />
                        </div>
                        <h2 style={{ marginBottom: '15px' }}>Something went wrong.</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>
                            We're sorry, but an unexpected error has occurred. Please try refreshing the page.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                        >
                            <RefreshCw size={18} /> Reload Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div style={{
                                marginTop: '30px',
                                textAlign: 'left',
                                padding: '15px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                maxHeight: '200px',
                                overflow: 'auto',
                                fontSize: '0.85rem',
                                fontFamily: 'monospace'
                            }}>
                                <p style={{ color: '#f87171', marginBottom: '5px' }}>{this.state.error.toString()}</p>
                                <p style={{ color: '#9ca3af', whiteSpace: 'pre-wrap' }}>{this.state.errorInfo.componentStack}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
