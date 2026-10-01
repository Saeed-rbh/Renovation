import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { BRAND_NAME, EMAIL, PHONE_DISPLAY, ADDRESS } from '../data/business';
import './PrivacyPage.css';

const UPDATED = 'September 30, 2026';

const PrivacyPage = () => (
    <PageTransition>
        <SEO
            title="Privacy Policy"
            description={`How ${BRAND_NAME} collects, uses and protects the personal information you share through our website.`}
        />
        <div className="page-container">
            <div className="container privacy-page">
                <h1 className="section-title">Privacy Policy</h1>
                <p className="privacy-updated">Last updated: {UPDATED}</p>

                <p>
                    {BRAND_NAME} ("we", "us") respects your privacy. This policy explains what personal
                    information we collect through homevconstruction.ca, why we collect it, and the choices
                    you have. We handle personal information in line with Canada's Personal Information
                    Protection and Electronic Documents Act (PIPEDA).
                </p>

                <h2>Information we collect</h2>
                <ul>
                    <li>
                        <strong>Information you give us.</strong> When you send a message or request a quote
                        (including from the instant estimator), we collect your name, email address, phone
                        number, project address or city, your message, and the project details and estimate
                        you chose.
                    </li>
                    <li>
                        <strong>Website usage.</strong> We use Google Analytics, which uses cookies to tell us
                        how visitors find and use the site: pages viewed, approximate location (city level),
                        device and browser type, and which links or forms were used. It does not give us your
                        name or contact details.
                    </li>
                    <li>
                        <strong>Advertising.</strong> If you reach our site from a Google ad, Google may record
                        that the visit led to an enquiry so we can measure our advertising. We do not sell or
                        share your contact details with advertisers.
                    </li>
                </ul>

                <h2>How we use it</h2>
                <ul>
                    <li>To reply to your enquiry, prepare quotes, and schedule and carry out your project.</li>
                    <li>To keep records of the work we've discussed or done for you.</li>
                    <li>To understand and improve our website and advertising.</li>
                </ul>
                <p>We do not sell your personal information, and we do not send marketing emails unless you ask us to.</p>

                <h2>Who we share it with</h2>
                <p>
                    We use trusted service providers to run the website and handle enquiries: Google Firebase
                    (website hosting and storing messages), EmailJS (delivering form submissions to our inbox)
                    and Google Analytics. These providers process information on our behalf and may store it
                    outside Canada, including in the United States. We may also disclose information if
                    required by law.
                </p>

                <h2>How long we keep it</h2>
                <p>
                    We keep enquiry and project information only as long as we need it for the purposes above,
                    or as required for legal, tax or warranty reasons, and then delete it.
                </p>

                <h2>Your choices</h2>
                <ul>
                    <li>You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it.</li>
                    <li>
                        You can block or delete cookies in your browser settings, or opt out of Google Analytics
                        with Google's <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">opt-out browser add-on</a>.
                    </li>
                </ul>

                <h2>Contact us</h2>
                <p>
                    For any privacy question or request, contact {BRAND_NAME} at{' '}
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, {PHONE_DISPLAY}, or {ADDRESS}.
                </p>

                <p className="privacy-back"><Link to="/">← Back to home</Link></p>
            </div>
        </div>
    </PageTransition>
);

export default PrivacyPage;
