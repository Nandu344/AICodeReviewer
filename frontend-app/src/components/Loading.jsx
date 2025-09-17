// src/components/Loading.jsx
function Loading({ message = 'Analyzing your code...' }) {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{message}</p>
            <div className="loading-steps">
                <div className="step">File uploaded</div>
                <div className="step active">Running static analysis</div>
                <div className="step">AI processing</div>
                <div className="step">Generating report</div>
            </div>
        </div>
    );
}

export default Loading;