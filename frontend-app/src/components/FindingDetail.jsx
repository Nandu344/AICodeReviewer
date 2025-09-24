// src/components/FindingDetail.jsx
function FindingDetail({ finding, onClose }) {
    if (!finding) return null;

    return (
        <div className="finding-detail-overlay" onClick={onClose}>
            <div className="finding-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Issue Details</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="finding-info">
                        <div className="info-row">
                            <strong>Type:</strong> {finding.type}
                        </div>
                        {finding.severity && (
                            <div className="info-row">
                                <strong>Severity:</strong>
                                <span className={`severity-badge ${finding.severity.toLowerCase()}`}>
                                    {finding.severity}
                                </span>
                            </div>
                        )}
                        <div className="info-row">
                            <strong>Line:</strong> {finding.line}
                        </div>
                    </div>
                    <div className="finding-description">
                        <h4>Description</h4>
                        <p>{finding.message || finding.description}</p>
                    </div>
                    {finding.code_example && (
                        <div className="code-section">
                            <h4>Example Fix</h4>
                            <pre className="code-block">{finding.code_example}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FindingDetail;