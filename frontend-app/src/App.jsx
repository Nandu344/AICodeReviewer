// src/App.jsx
import { useState, useMemo } from 'react';
import Upload from './components/Upload';
import Results from './components/Results';
import Filters from './components/Filters';
import FindingDetail from './components/FindingDetail';
import './components/Upload.css';
import './components/Results.css';
import './components/Filters.css';
import './components/FindingDetail.css';
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
  // This line is now corrected
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    sortBy: 'line'
  });
  const [selectedFinding, setSelectedFinding] = useState(null);

  const handleAnalysisComplete = (analysisResults, analysisError) => {
    setResults(analysisResults);
    setError(analysisError);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFindingSelect = (finding) => {
    setSelectedFinding(finding);
  };

  const handleCloseDetail = () => {
    setSelectedFinding(null);
  };

  const filteredResults = useMemo(() => {
    if (!results) return null;
    return JSON.parse(JSON.stringify(results));
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
          <Results
            results={filteredResults}
            onFindingSelect={handleFindingSelect}
          />
        </>
      )}

      <FindingDetail
        finding={selectedFinding}
        onClose={handleCloseDetail}
      />
    </div>
  );
}

export default App;