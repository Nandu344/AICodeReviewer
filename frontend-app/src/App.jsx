// src/App.jsx
import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { analyzeCode } from './services/api';
import Upload from './components/Upload';
import Loading from './components/Loading';
import Results from './components/Results';
import Filters from './components/Filters';
import FindingDetail from './components/FindingDetail';

// All CSS imports are here to ensure styling is always correct.
import './components/Upload.css';
import './components/Results.css';
import './components/Filters.css';
import './components/FindingDetail.css';
import './components/Loading.css';

function App() {
  // All state is managed here.
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    sortBy: 'line'
  });
  const [selectedFinding, setSelectedFinding] = useState(null);

  // Main analysis and retry logic is handled here.
  const handleAnalysisRequest = async (file, analysisType) => {
    setIsAnalyzing(true);
    setResults(null);

    try {
      const analysisResults = await analyzeCode(file, analysisType);
      setResults(analysisResults);
    } catch (err) {
      toast.error(
        (t) => (
          <span style={{ textAlign: 'center' }}>
            Analysis failed.
            <button
              style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
              onClick={() => {
                toast.dismiss(t.id);
                handleAnalysisRequest(file, analysisType);
              }}
            >
              Retry
            </button>
          </span>
        ), { duration: 6000 }
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Effect for success toast is correct.
  useEffect(() => {
    if (results) {
      toast.success('Analysis complete!');
    }
  }, [results]);

  // Handlers for filters and modals are correct.
  const handleFilterChange = (newFilters) => { setFilters(newFilters); };
  const handleFindingSelect = (finding) => { setSelectedFinding(finding); };
  const handleCloseDetail = () => { setSelectedFinding(null); };

  // Filtering and sorting logic is correct.
  const sortedAndFilteredFindings = useMemo(() => {
    if (!results) return [];
    const allFindings = [
      ...(results.static_analysis?.style?.map(f => ({ ...f, findingType: 'style', type: 'Style' })) || []),
      ...(results.static_analysis?.security?.map(f => ({ ...f, findingType: 'security', type: 'Security' })) || []),
      ...(results.ai_analysis?.suggestions?.map(f => ({ ...f, findingType: 'ai', type: 'AI Suggestion', line: f.line || 0 })) || [])
    ];
    const filtered = allFindings
      .filter(finding => filters.type === 'all' || finding.findingType === 'all' || finding.findingType === filters.type)
      .filter(finding => {
        if (filters.severity === 'all') return true;
        if (!finding.severity) return false;
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

  // Main render logic.
  if (isAnalyzing) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Upload
        onTriggerAnalysis={handleAnalysisRequest}
        isAnalyzing={isAnalyzing}
      />

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

export default App;