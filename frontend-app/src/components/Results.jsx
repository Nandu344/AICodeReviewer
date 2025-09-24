// src/components/Results.jsx
import React from 'react';

const FindingItem = ({ finding, onFindingSelect }) => {
    // This helper component is correct and does not need to change
    switch (finding.findingType) {
        case 'style':
            return (
                <div className="issue-item" onClick={() => onFindingSelect(finding)}>
                    <span className="line">Line {finding.line}:</span>
                    <span className="message">{finding.message}</span>
                </div>
            );
        case 'security':
            return (
                <div className="issue-item security" onClick={() => onFindingSelect(finding)}>
                    <span className="severity">{finding.severity}</span>
                    <span className="line">Line {finding.line}:</span>
                    <span className="message">{finding.message}</span>
                </div>
            );
        case 'ai':
            return (
                <div className="ai-suggestion" onClick={() => onFindingSelect(finding)}>
                    <h6>{finding.title}</h6>
                    <p>{finding.description}</p>
                    {finding.code_example && (
                        <pre className="code-example">{finding.code_example}</pre>
                    )}
                </div>
            );
        default:
            return null;
    }
};

function Results({ summary, findings, onFindingSelect }) {
    const filteredSummary = {
        total_issues: findings.length,
        critical: findings.filter(f => f.severity === 'CRITICAL').length,
        high: findings.filter(f => f.severity === 'HIGH').length,
        medium: findings.filter(f => f.severity === 'MEDIUM').length,
        low: findings.filter(f => f.severity === 'LOW').length,
    };

    let lastHeadline = null;

    return (
        <div className="results-container">
            <h3>Analysis Results</h3>
            <div className="summary">
                <h4>Summary</h4>
                <p>Total Issues: {filteredSummary.total_issues}</p>
                <p>
                    Critical: {filteredSummary.critical} | High: {filteredSummary.high} | Medium: {filteredSummary.medium} | Low: {filteredSummary.low}
                </p>
            </div>

            <div className="findings-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {findings.length === 0 ? (
                    <p>No issues match the current filters.</p>
                ) : (
                    findings.map((finding, index) => {
                        const currentHeadline = (finding.findingType === 'style' || finding.findingType === 'security')
                            ? 'Static Analysis'
                            : 'AI Suggestions';

                        let headlineToShow = null;
                        if (currentHeadline !== lastHeadline) {
                            headlineToShow = <h4 style={{ marginTop: '1rem' }}>{currentHeadline}</h4>;
                            lastHeadline = currentHeadline;
                        }

                        return (
                            <React.Fragment key={index}>
                                {headlineToShow}
                                <FindingItem finding={finding} onFindingSelect={onFindingSelect} />
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Results;