// src/components/Upload.jsx
import { useState } from 'react';
import { analyzeCode } from '../services/api';
import Loading from './Loading';
import './Loading.css';

// Now receives a function `onAnalysisComplete` as a prop
function Upload({ onAnalysisComplete }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisType, setAnalysisType] = useState('all');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) return;

        setIsAnalyzing(true);
        // We call the parent with `null` results and `null` error to clear old state
        onAnalysisComplete(null, null);

        try {
            const analysisResults = await analyzeCode(selectedFile, analysisType);
            // Report success to the parent!
            onAnalysisComplete(analysisResults, null);
        } catch (err) {
            // Report failure to the parent!
            onAnalysisComplete(null, 'Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isAnalyzing) {
        return <Loading />;
    }

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
                <button type="submit" disabled={!selectedFile || isAnalyzing}>
                    Analyze Code
                </button>
            </form>
        </div>
    );
}

export default Upload;