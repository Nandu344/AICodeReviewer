# minimal prompts used for later real integration or logging
LANG_PROMPTS = {
    "python": (
        "You are an assistant that analyzes Python code. "
        "Return a JSON object with a 'findings' array; each finding must include: "
        "language, file, line, severity, type, message, suggestion."
    ),
    "javascript": "You are an assistant that analyzes JavaScript code. Return findings as JSON.",
    "java": "You are an assistant that analyzes Java code. Return findings as JSON.",
    "cpp": "You are an assistant that analyzes C++ code. Return findings as JSON.",
}

def build_prompt(code: str, language: str = "python", filename: str = "file"):
    p = LANG_PROMPTS.get(language.lower(), LANG_PROMPTS["python"])
    return f"{p}\n\nFilename: {filename}\n\nCode:\n{code}\n\nReturn strictly JSON."
