import pytest
from httpx import AsyncClient

# Import the FastAPI app from your main.py file
# You might need to adjust the import path based on your project structure
from backend.api.main import app

@pytest.mark.asyncio
async def test_analyze_endpoint_ok():
    """Test the /analyze endpoint with valid code input."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/analyze", json={"code": "print('hello world')"})
    
    # Assert that the HTTP status code is 200 (OK)
    assert response.status_code == 200
    
    # Assert that the response body matches the expected stub output
    assert response.json() == {"status": "ok", "note": "stub"}

@pytest.mark.asyncio
async def test_analyze_endpoint_invalid_payload():
    """Test the /analyze endpoint with an invalid payload."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/analyze", json={"bad_key": "some value"})
    
    # Assert that the status code is 422 (Unprocessable Entity) for validation errors
    assert response.status_code == 422
    
    # Assert that the response body contains a validation error detail
    assert "detail" in response.json()