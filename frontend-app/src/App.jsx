// src/App.jsx
import { useState, useMemo } from 'react';
import Upload from './components/Upload';
import Results from './components/Results';
import Filters from './components/Filters';
import './components/Upload.css';
import './components/Results.css';
import './components/Filters.css';
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
function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    sortBy: 'line'
  });

  // This function is passed down to the Upload component
  const handleAnalysisComplete = (analysisResults, analysisError) => {
    setResults(analysisResults);
    setError(analysisError);
  };

  // This function is passed down to the Filters component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // This logic runs whenever results or filters change
  const filteredResults = useMemo(() => {
    if (!results) return null;

    // This is a deep copy to avoid modifying the original results
    const newResults = JSON.parse(JSON.stringify(results));

    // Filtering logic will go here in future steps, for now, we just pass it through

    return newResults;

  }, [results, filters]);

  return (
    <div className="App">
      <Upload onAnalysisComplete={handleAnalysisComplete} />

      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {filteredResults && (
        <>
          <Filters onFilterChange={handleFilterChange} />
          <Results results={filteredResults} />
        </>
      )}
    </div>
  );
}

export default App;