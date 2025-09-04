// src/components/Upload.jsx
import { useState } from 'react';
import { analyzeCode } from '../services/api';
import Results from './Results'; // <-- ADD THIS IMPORT
import './Results.css'; // <-- ADD THIS IMPORT
/*const MOCK_RESULTS = {
    summary: { total_issues: 4, critical: 0, high: 1, medium: 1 },
    static_analysis: {
        style: [
            { line: 5, message: "Missing docstring in public module" },
            { line: 12, message: "Line too long (90/88 characters)" }
        ],
        security: [
            { line: 25, severity: "HIGH", message: "Use of insecure function 'eval'" }
        ]
    },
    ai_analysis: {
        suggestions: [
            {
                title: "Refactor for Readability",
                description: "The 'calculate_metric' function can be simplified by removing the temporary variable.",
                code_example: "return (value * factor) + offset"
            }
        ]
    }
};*/

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
        setResults(null);

        try {
            const analysisResults = await analyzeCode(selectedFile, analysisType);
            setResults(analysisResults);
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
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
                <button type="submit" disabled={!selectedFile || isAnalyzing}>
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
                </button>
            </form>

            {error && (
                <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
                    {error}
                </div>
            )}

            {/* This part is now cleaner, just using the Results component */}
            {results && <Results results={results} />}
        </div>
    );
}

export default Upload;