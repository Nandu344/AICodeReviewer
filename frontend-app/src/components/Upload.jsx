// src/components/Upload.jsx
import { useState } from 'react';

function Upload({ onTriggerAnalysis, isAnalyzing }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pastedCode, setPastedCode] = useState('');
    const [analysisType, setAnalysisType] = useState('all');

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileSubmit = (event) => {
        event.preventDefault();
        if (!selectedFile) return;
        onTriggerAnalysis(selectedFile, analysisType);
    };

    const handleTextSubmit = (event) => {
        event.preventDefault();
        if (!pastedCode.trim()) return;
        // Convert the pasted text into a File object
        const textFile = new File([pastedCode], "pasted_code.txt", { type: "text/plain" });
        onTriggerAnalysis(textFile, analysisType);
    };

    return (
        <div className="upload-container">
            <div className="upload-options-wrapper">
                {/* Left Side: File Upload */}
                <div className="upload-option">
                    <form onSubmit={handleFileSubmit}>
                        <div className="file-input-group">
                            <label htmlFor="file-input">Select Code File:</label>
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleFileSelect}
                            />
                            <span className="file-name">{selectedFile ? selectedFile.name : "No file chosen"}</span>
                        </div>
                        <button type="submit" disabled={!selectedFile || isAnalyzing}>
                            Analyze File
                        </button>
                    </form>
                </div>

                <div className="divider">OR</div>

                {/* Right Side: Paste Text */}
                <div className="upload-option">
                    <form onSubmit={handleTextSubmit}>
                        <div className="text-input-group">
                            <label htmlFor="text-input">Paste Code Here:</label>
                            <textarea
                                id="text-input"
                                value={pastedCode}
                                onChange={(e) => setPastedCode(e.target.value)}
                                placeholder="Your code goes here..."
                                rows="8"
                            />
                        </div>
                        <button type="submit" disabled={!pastedCode.trim() || isAnalyzing}>
                            Analyze Text
                        </button>
                    </form>
                </div>
            </div>

            {/* Shared Analysis Type Dropdown */}
            <div className="analysis-type-group shared">
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
        </div>
    );
}

export default Upload;