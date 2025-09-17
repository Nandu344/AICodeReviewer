// src/components/Upload.jsx
import { useState } from 'react';
import { analyzeCode } from '../services/api';
import Results from './Results';
import './Results.css';
import Loading from './Loading'; // <-- ADD THIS IMPORT
import './Loading.css';   // <-- ADD THIS IMPORT

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
        // await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const analysisResults = await analyzeCode(selectedFile, analysisType);
            setResults(analysisResults);
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // -- NEW LOGIC FROM DAY 5, STEP 3 --
    // If we are in the "analyzing" state, this will show the
    // Loading component and stop, preventing the form from rendering.
    if (isAnalyzing) {
        return <Loading />;
    }
    // -- END OF NEW LOGIC --

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

            {results && <Results results={results} />}
        </div>
    );
}

export default Upload;