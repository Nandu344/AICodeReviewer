import os
from typing import List
from .schema import AIReview, Finding

# Simple mock generator for common languages. This is your safe fallback for tomorrow.
def _mock_findings_for(language: str, filename: str) -> List[Finding]:
    lang = language.lower()
    if lang in ("py", "python"):
        return [
            Finding(
                language="python",
                file=filename,
                line=2,
                severity="low",
                type="style",
                message="Missing spaces around operator",
                suggestion="Use 'a + b' instead of 'a+b'"
            )
        ]
    if lang in ("js", "javascript"):
        return [
            Finding(
                language="javascript",
                file=filename,
                line=3,
                severity="low",
                type="style",
                message="Missing semicolon",
                suggestion="Add semicolon at the end of the statement"
            )
        ]
    if lang == "java":
        return [
            Finding(
                language="java",
                file=filename,
                line=4,
                severity="medium",
                type="performance",
                message="Consider using StringBuilder for many concatenations",
                suggestion="Use StringBuilder to reduce allocations"
            )
        ]
    if lang in ("cpp", "c++"):
        return [
            Finding(
                language="cpp",
                file=filename,
                line=1,
                severity="low",
                type="style",
                message="Function signature missing const where appropriate",
                suggestion="Mark parameter as const if not modified"
            )
        ]
    # unknown: generic finding
    return [
        Finding(
            language=language,
            file=filename,
            line=1,
            severity="low",
            type="info",
            message="No specific rules for this language in mock",
            suggestion=None
        )
    ]

def _normalize(review: AIReview) -> AIReview:
    # basic normalization: lowercase language field and remove duplicates by (file,line,message)
    seen = set()
    normalized = []
    for f in review.findings:
        f.language = f.language.lower()
        key = (f.file, f.line, f.message.strip())
        if key in seen:
            continue
        seen.add(key)
        normalized.append(f)
    review.findings = normalized
    return review

def quickcheck(code: str, language: str = "python", filename: str = "file") -> AIReview:
    """
    If GEMINI_API_KEY is NOT set -> return a validated mock AIReview object.
    If key is set -> placeholder (you can extend this to call the real API).
    """
    key = os.getenv("GEMINI_API_KEY")
    # For submission: always return a mock unless you implement a real client.
    findings = _mock_findings_for(language, filename)
    review = AIReview(findings=findings, model="mock-gemini", confidence=0.92)
    return _normalize(review)
