# gemini_client.py
# This will contain functions to call Gemini API later

def quickcheck():
    """
    Placeholder function.
    If GEMINI_API_KEY is set, later we will make a tiny test call.
    For now, it returns a mock AIReview.
    """
    from schema import AIReview, Finding

    mock_finding = Finding(
        id=1,
        language="Python",
        file="sample_code.py",
        line=1,
        severity="info",
        type="style",
        message="Mock message",
        suggestion="Mock suggestion"
    )

    return AIReview(findings=[mock_finding])
