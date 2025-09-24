// src/components/Filters.jsx
import { useState } from 'react';

function Filters({ onFilterChange }) {
    const [filters, setFilters] = useState({
        severity: 'all',
        type: 'all',
        sortBy: 'line'
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="filters-container">
            <h4>Filter Results</h4>
            <div className="filter-controls">
                <div className="filter-group">
                    <label>Severity:</label>
                    <select
                        value={filters.severity}
                        onChange={(e) => handleFilterChange('severity', e.target.value)}
                    >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Type:</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="style">Style Issues</option>
                        <option value="security">Security Issues</option>
                        <option value="ai">AI Suggestions</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Sort by:</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="line">Line Number</option>
                        <option value="severity">Severity</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Filters;