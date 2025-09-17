// src/App.jsx
import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import Upload from './components/Upload';
import Results from './components/Results';
import Filters from './components/Filters';
import FindingDetail from './components/FindingDetail';
import './components/Upload.css';
import './components/Results.css';
import './components/Filters.css';
import './components/FindingDetail.css';

// Use this comprehensive mock data for testing
const MOCK_RESULTS = {
  summary: { total_issues: 6, critical: 1, high: 1, medium: 1, low: 1 },
  static_analysis: {
    style: [
      { line: 10, message: "Missing docstring in public module" },
      { line: 22, message: "Line too long (95/88 characters)" }
    ],
    security: [
      { line: 50, severity: "CRITICAL", message: "SQL Injection vulnerability detected." },
      { line: 15, severity: "HIGH", message: "Use of insecure function 'eval'." },
      { line: 35, severity: "MEDIUM", message: "Hardcoded password found." }
    ]
  },
  ai_analysis: {
    suggestions: [
      {
        title: "Refactor for Readability",
        description: "The 'calculate_metric' function can be simplified...",
        code_example: "return (value * factor) + offset;",
        line: 28,
        severity: "LOW"
      }
    ]
  }
};

function App() {
  const [results, setResults] = useState(null); // Using mock data
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    sortBy: 'line'
  });
  const [selectedFinding, setSelectedFinding] = useState(null);

  const handleAnalysisComplete = (analysisResults, analysisError) => { /* ... */ };
  useEffect(() => { /* ... */ }, [results]);
  const handleFilterChange = (newFilters) => { setFilters(newFilters); };
  const handleFindingSelect = (finding) => { setSelectedFinding(finding); };
  const handleCloseDetail = () => { setSelectedFinding(null); };

  const sortedAndFilteredFindings = useMemo(() => {
    if (!results) return [];

    const allFindings = [
      ...(results.static_analysis?.style?.map(f => ({ ...f, findingType: 'style', type: 'Style' })) || []),
      ...(results.static_analysis?.security?.map(f => ({ ...f, findingType: 'security', type: 'Security' })) || []),
      ...(results.ai_analysis?.suggestions?.map(f => ({ ...f, findingType: 'ai', type: 'AI Suggestion', line: f.line || 0 })) || [])
    ];

    const filtered = allFindings
      .filter(finding => filters.type === 'all' || finding.findingType === filters.type)
      // --- THIS IS THE CORRECTED SEVERITY FILTER LOGIC ---
      .filter(finding => {
        if (filters.severity === 'all') {
          return true; // Always include if filter is 'all'
        }
        if (!finding.severity) {
          return false; // Exclude if finding has no severity and a specific severity is chosen
        }
        return finding.severity.toLowerCase() === filters.severity.toLowerCase();
      });

    return filtered.sort((a, b) => {
      if (filters.sortBy === 'severity') {
        const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      }
      return a.line - b.line;
    });
  }, [results, filters]);

  return (
    <div className="App">
      <Upload onAnalysisComplete={handleAnalysisComplete} />
      {results && (
        <>
          <Filters onFilterChange={handleFilterChange} />
          <Results
            summary={results.summary}
            findings={sortedAndFilteredFindings}
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

// NOTE: Unchanged function bodies are omitted for brevity.
export default App;