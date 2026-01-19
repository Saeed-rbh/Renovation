import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, limit, query } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// EmailJS Constants
const SERVICE_ID = 'service_2diktkb';
const PUBLIC_KEY = 'wLOX4avHYtos4KMZi';
const TEMPLATE_ID = 'template_32nvlrb';

const DebugPage = () => {
    const [logs, setLogs] = useState([]);

    const log = (msg, type = 'info') => {
        const entry = `${new Date().toLocaleTimeString()} [${type.toUpperCase()}] ${msg}`;
        setLogs(prev => [...prev, entry]);
        console.log(entry);
    };

    const testRead = async () => {
        log('Starting READ Test (content/about)...');
        try {
            const q = query(collection(db, "content"), limit(1));
            const snapshot = await getDocs(q);
            log(`Read Success! Found ${snapshot.size} docs.`);
        } catch (e) {
            log(`Read Failed: ${e.message}`, 'error');
        }
    };

    const testWrite = async () => {
        log('Starting WRITE Test (messages)...');
        try {
            const docRef = await addDoc(collection(db, "messages"), {
                name: "Debug User",
                message: "Test message from DebugPage",
                createdAt: new Date(),
                read: false,
                debug: true
            });
            log(`Write Success! Doc ID: ${docRef.id}`);
        } catch (e) {
            log(`Write Failed: ${e.message}`, 'error');
            if (e.code === 'permission-denied') {
                log('HINT: Check Firestore Security Rules. Public "write" might be disabled.', 'warning');
            }
        }
    };

    const testEmail = async () => {
        log('Starting EMAIL Test...');
        const templateParams = {
            title: 'Debug Test',
            name: 'Debug User',
            email: 'Info@homevconstruction.ca',
            phone: '1234567890',
            message: 'This is a test from the Debug Page.',
            to_name: 'Admin',
            to_email: 'Info@homevconstruction.ca',
            date: new Date().toLocaleString()
        };

        try {
            const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            log(`Email Success! Status: ${result.status}, Text: ${result.text}`);
        } catch (e) {
            log(`Email Failed: ${JSON.stringify(e)}`, 'error');
            // Try to log specific properties if JSON definition is empty
            if (e.text) log(`Error Text: ${e.text}`, 'error');
            if (e.message) log(`Error Message: ${e.message}`, 'error');
        }
    };


    return (
        <div style={{ padding: '40px', background: '#222', color: '#fff', minHeight: '100vh' }}>
            <h1>Firebase & Email Diagnostic</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={testRead} style={{ padding: '10px', background: 'blue', color: 'white' }}>Test Public Read</button>
                <button onClick={testWrite} style={{ padding: '10px', background: 'green', color: 'white' }}>Test Public Write</button>
                <button onClick={testEmail} style={{ padding: '10px', background: 'orange', color: 'black' }}>Test Email</button>
                <button onClick={() => setLogs([])} style={{ padding: '10px', background: 'gray', color: 'white' }}>Clear Logs</button>
            </div>
            <div style={{ background: '#000', padding: '20px', borderRadius: '5px', fontFamily: 'monospace' }}>
                {logs.map((l, i) => <div key={i} style={{ color: l.includes('ERROR') ? 'red' : l.includes('WARNING') ? 'orange' : '#0f0' }}>{l}</div>)}
                {logs.length === 0 && <div>Click a button to start testing...</div>}
            </div>
        </div>
    );
};

export default DebugPage;
