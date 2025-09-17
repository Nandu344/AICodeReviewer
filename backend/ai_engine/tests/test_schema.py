from backend.ai_engine.schema import Finding, AIReview

def test_schema_basic():
    f = Finding(
        language="python",
        file="sample.py",
        line=2,
        severity="low",
        type="style",
        message="Use spaces around +",
        suggestion="return a + b"
    )
    review = AIReview(findings=[f], confidence=0.9)
    assert review.findings[0].language == "python"
    assert review.confidence == 0.9
