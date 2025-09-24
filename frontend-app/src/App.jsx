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

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    sortBy: 'line'
  });
  const [selectedFinding, setSelectedFinding] = useState(null);

  const handleAnalysisComplete = (analysisResults, analysisError) => {
    if (analysisResults) {
      setResults(analysisResults);
    }
    if (analysisError) {
      setError(analysisError);
      toast.error(analysisError);
    }
  };

  useEffect(() => {
    if (results) {
      toast.success('Analysis complete!');
    }
  }, [results]);

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

      {filteredResults && (
        <>
          <Filters onFilter-change={handleFilterChange} />
          <Results
            results={filteredResults}
            on-finding-select={handleFindingSelect}
          />
        </>
      )}

      <FindingDetail
        finding={selectedFinding}
        on-close={handleCloseDetail}
      />
    </div>
  );
}

export default App;