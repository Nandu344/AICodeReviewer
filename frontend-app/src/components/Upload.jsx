// src/components/Upload.jsx
import { useState } from 'react';

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisType, setAnalysisType] = useState('all');

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }
        // This will connect to API later
        console.log('File selected:', selectedFile.name);
        console.log('Analysis type:', analysisType);
    };

    return (
        <div className="upload-container">
            <h2>AI Code Reviewer</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="file-input-group">
                    <label htmlFor="file-input">Select Python file:</label>
                    <input
                        id="file-input"
                        type="file"
                        accept=".py"
                        onChange={handleFileSelect}
                        required
                    />
                </div>
                <div className="analysis-type-group">
                    <label htmlFor="analysis-type">Analysis Type: </label>
                    <select
                        id="analysis-type"
                        value={analysisType}
                        onChange={(e) => setAnalysisType(e.target.value)}
                    >
                        <option value="all">Complete Analysis</option>
                        <option value="security">Security Only</option>
                        <option value="style">Style Only</option>
                    </select>
                </div>
                <button type="submit" disabled={!selectedFile}>
                    Analyze Code
                </button>
            </form>
        </div>
    );
}

export default Upload;