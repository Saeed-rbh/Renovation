import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db } from '../firebase';

// EmailJS Configuration
export const SERVICE_ID = 'service_2diktkb';
export const PUBLIC_KEY = 'wLOX4avHYtos4KMZi';
export const TEMPLATE_ID = 'template_32nvlrb';
// Template that emails the customer a copy of their estimate. Leave empty to
// skip it; once the template exists in EmailJS (with "To Email" set to
// {{to_email}}), paste its ID here.
export const CUSTOMER_TEMPLATE_ID = '';

const withTimeout = (promise, ms, label) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms))
]);

// Saves to the admin inbox and emails the team in parallel. Resolves as
// delivered if either one got through, so a single outage doesn't lose a lead.
export const sendEstimateRequest = async ({ name, email, phone, subject, message }) => {
    const [dbResult, emailResult] = await Promise.allSettled([
        withTimeout(addDoc(collection(db, "messages"), {
            name,
            email,
            phone,
            message,
            createdAt: serverTimestamp(),
            read: false
        }), 5000, "Firestore save"),
        withTimeout(emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            title: subject,
            name,
            email,
            phone,
            message,
            to_name: 'Admin',
            to_email: 'Info@homevconstruction.ca',
            date: new Date().toLocaleString()
        }, PUBLIC_KEY), 5000, "Email send")
    ]);

    if (dbResult.status === 'rejected') console.error("DB Error:", dbResult.reason);
    if (emailResult.status === 'rejected') console.error("Email Error:", emailResult.reason);
    const ok = dbResult.status === 'fulfilled' || emailResult.status === 'fulfilled';

    let customerCopy = false;
    if (ok && email && CUSTOMER_TEMPLATE_ID) {
        try {
            await withTimeout(emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, {
                title: subject,
                to_name: name,
                to_email: email,
                message
            }, PUBLIC_KEY), 5000, "Customer copy");
            customerCopy = true;
        } catch (error) {
            console.error("Customer copy Error:", error);
        }
    }

    return { ok, customerCopy };
};
