def analyze_code(code):
    result = {
        "corrected_code": code,
        "errors_and_fixes": [],
        "line_by_line": [],
        "pros_cons": ["Pros: Easy to read, simple logic."],
        "real_life_example": "This snippet can be used for basic scripting or console output tasks.",
        "references": ["https://www.py4e.com/"]
    }

    lines = code.split('\n')
    for i, line in enumerate(lines):
        stripped = line.strip()
        result["line_by_line"].append(f"Line {i+1}: Statement detected.")
        if "/" in stripped and "0" in stripped:
            result["errors_and_fixes"].append(f"Line {i+1}: Division by zero detected.")

    return result
