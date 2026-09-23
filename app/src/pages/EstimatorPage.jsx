import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import './EstimatorPage.css';

const EstimatorPage = () => {
    return (
        <PageTransition>
            <SEO
                title="Instant Estimate"
                description="Get a fast, ballpark cost range for your renovation or construction project."
            />
            <div className="page-container">
                <div className="container">
                    <div className="section-header text-center">
                        <h1 className="section-title">Get An Instant Estimate</h1>
                        <p className="estimator-subtitle">
                            Pick a project type, answer a few quick questions, and get a ballpark
                            price range in under a minute. Want an exact quote instead? Reach out
                            through the results screen and our team will follow up.
                        </p>
                    </div>

                    <div className="estimator-frame-wrapper glass-panel">
                        <iframe
                            src="/estimator-widget.html"
                            title="Homev Instant Estimator"
                            className="estimator-frame"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EstimatorPage;
