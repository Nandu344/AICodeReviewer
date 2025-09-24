// src/services/api.js
const API_BASE_URL = 'http://localhost:8000'; // Adjust based on your backend

export const analyzeCode = async (file, analysisType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('analysis_type', analysisType);

    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};