// src/components/Upload.jsx
import { useState } from 'react';
import { analyzeCode } from '../services/api';

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [analysisType, setAnalysisType] = useState('all');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);
        setResults(null); // Clear previous results

        try {
            const analysisResults = await analyzeCode(selectedFile, analysisType);
            setResults(analysisResults);
            console.log('Analysis results:', analysisResults);
        } catch (err) {
            setError('Analysis failed. Please try again.');
            console.error('Analysis error:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>AI Code Reviewer</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                {/* Previous form elements... */}
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
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                </button>
            </form>

            {error && (
                <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
                    {error}
                </div>
            )}

            {/* This part will display the raw results for now */}
            {results && (
                <div className="results-preview" style={{ marginTop: '2rem' }}>
                    <h3>Analysis Complete!</h3>
                    <pre style={{ background: '#f5f5f5', padding: '1rem' }}>
                        {JSON.stringify(results, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default Upload;