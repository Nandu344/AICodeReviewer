from backend.ai_engine.gemini_client import quickcheck
from backend.ai_engine.tests import sample_code

def test_quickcheck_python():
    review = quickcheck(sample_code.python_code, language="python", filename="sample.py")
    assert review.findings
    assert any(f.language == "python" for f in review.findings)
    assert review.confidence is not None

def test_quickcheck_js():
    review = quickcheck(sample_code.js_code, language="javascript", filename="sample.js")
    assert any(f.language == "javascript" for f in review.findings)
