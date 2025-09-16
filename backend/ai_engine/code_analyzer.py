import ast

def analyze_code(code_snippet: str) -> dict:
    """
    Input: Python code snippet
    Output: Structured review with:
    - corrected_code
    - errors_and_fixes
    - line_by_line explanation
    """
    errors_and_fixes = []
    try:
        ast.parse(code_snippet)
    except SyntaxError as e:
        errors_and_fixes.append(f"{e.msg} at line {e.lineno}")

    return {
        "corrected_code": code_snippet,
        "errors_and_fixes": errors_and_fixes,
        "line_by_line": []
    }

# Quick test
if __name__ == "__main__":
    sample_code = 'print("Hello world'
    print(analyze_code(sample_code))
