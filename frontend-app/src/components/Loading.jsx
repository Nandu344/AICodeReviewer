// src/components/Loading.jsx
import { useState, useEffect } from 'react';

function Loading({ message = 'Analyzing your code...' }) {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        'File uploaded',
        'Running static analysis',
        'AI processing',
        'Generating report'
    ];

    useEffect(() => {
        // Set up an interval to cycle through the steps every 1.5 seconds
        const intervalId = setInterval(() => {
            setCurrentStep(prevStep => (prevStep + 1) % steps.length);
        }, 1500);

        // This is a "cleanup function". React runs this when the component
        // is removed from the screen to prevent memory leaks.
        return () => clearInterval(intervalId);
    }, []); // The empty array [] means this effect runs only once when the component mounts.

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{message}</p>
            <div className="loading-steps">
                {steps.map((step, index) => (
                    <div key={index} className={`step ${index === currentStep ? 'active' : ''}`}>
                        {step}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Loading;