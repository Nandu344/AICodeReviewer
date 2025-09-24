// src/components/Results.jsx
function Results({ results }) {
    if (!results) return null;

    const { static_analysis, ai_analysis, summary } = results;

    return (
        <div className="results-container">
            <h3>Analysis Results</h3>

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
                        {static_analysis.style && static_analysis.style.length > 0 && (
                            <div className="style-issues">
                                <h5>Style Issues</h5>
                                {static_analysis.style.map((issue, index) => (
                                    <div key={index} className="issue-item">
                                        <span className="line">Line {issue.line}:</span>
                                        <span className="message">{issue.message}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {static_analysis.security && static_analysis.security.length > 0 && (
                            <div className="security-issues">
                                <h5>Security Issues</h5>
                                {static_analysis.security.map((issue, index) => (
                                    <div key={index} className="issue-item security">
                                        <span className="severity">{issue.severity}</span>
                                        <span className="line">Line {issue.line}:</span>
                                        <span className="message">{issue.message}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {ai_analysis && (
                <div className="ai-results">
                    <h4>AI Suggestions</h4>
                    <div className="ai-findings">
                        {ai_analysis.suggestions && ai_analysis.suggestions.map((suggestion, index) => (
                            <div key={index} className="ai-suggestion">
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