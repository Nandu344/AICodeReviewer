def analyze_java(code):
    result = {
        "corrected_code": code,
        "errors_and_fixes": [],
        "line_by_line": [],
        "pros_cons": ["Pros: Simple logic, readable code."],
        "real_life_example": "This snippet can be used in basic Java applications.",
        "references": ["https://www.w3schools.com/java/"]
    }

    lines = code.split('\n')
    for i, line in enumerate(lines):
        stripped_line = line.strip()
        line_info = f"Line {i+1}: Statement detected."

        if stripped_line and not stripped_line.endswith(';') and "{" not in stripped_line and "}" not in stripped_line:
            result["errors_and_fixes"].append(f"Line {i+1}: Missing semicolon.")
        if "/" in stripped_line and "0" in stripped_line:
            result["errors_and_fixes"].append(f"Line {i+1}: Division by zero detected.")

        result["line_by_line"].append(line_info)

    return result
