// src/components/Results.jsx

function Results({ results, onFindingSelect }) {
    if (!results) return null;

    const { static_analysis, ai_analysis, summary } = results;

    const enhanceFinding = (finding, type) => ({ ...finding, type });

    return (
        <div className="results-container">
            <h3>Analysis Results</h3>

            {/* The full summary section is included here */}
            {summary && (
                <div className="summary">
                    <h4>Summary</h4>
                    <p>Total Issues: {summary.total_issues || 0}</p>
                    <p>Critical: {summary.critical || 0} | High: {summary.high || 0} | Medium: {summary.medium || 0}</p>
                </div>
            )}

            {static_analysis && (
                <div className="static-results">
                    <h4>Static Analysis</h4>
                    <div className="findings">
                        {static_analysis.style?.map((issue, index) => (
                            <div
                                key={index}
                                className="issue-item"
                                // The new onClick handler from Day 7
                                onClick={() => onFindingSelect(enhanceFinding(issue, 'Style'))}
                            >
                                <span className="line">Line {issue.line}:</span>
                                <span className="message">{issue.message}</span>
                            </div>
                        ))}
                        {static_analysis.security?.map((issue, index) => (
                            <div
                                key={index}
                                className="issue-item security"
                                // The new onClick handler from Day 7
                                onClick={() => onFindingSelect(enhanceFinding(issue, 'Security'))}
                            >
                                <span className="severity">{issue.severity}</span>
                                <span className="line">Line {issue.line}:</span>
                                <span className="message">{issue.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {ai_analysis && (
                <div className="ai-results">
                    <h4>AI Suggestions</h4>
                    <div className="ai-findings">
                        {ai_analysis.suggestions?.map((suggestion, index) => (
                            <div
                                key={index}
                                className="ai-suggestion"
                                // The new onClick handler from Day 7
                                onClick={() => onFindingSelect(enhanceFinding(suggestion, 'AI Suggestion'))}
                            >
                                <h6>{suggestion.title}</h6>
                                <p>{suggestion.description}</p>
                                {suggestion.code_example && (
                                    <pre className="code-example">{suggestion.code_example}</pre>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Results;