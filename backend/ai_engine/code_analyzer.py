import ast

def analyze_code(code_snippet: str) -> dict:
    """
    Input: Python code snippet
    Output: Structured review dictionary with:
        - corrected_code
        - errors_and_fixes
        - line_by_line explanations
        - pros_cons
        - real_life_example
        - references
    """

    errors_and_fixes = []
    line_by_line = []
    pros_cons = []
    references = ["https://www.py4e.com/"]  # default reference

    # -------------------
    # Syntax check
    # -------------------
    try:
        ast.parse(code_snippet)
    except SyntaxError as e:
        errors_and_fixes.append(f"SyntaxError: {e.msg} at line {e.lineno}")

    # -------------------
    # Line-by-line explanation
    # -------------------
    lines = code_snippet.split('\n')
    for i, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            continue

        explanation = f"Line {i}: "
        if stripped.startswith("print"):
            explanation += "Prints output to console."
        elif "=" in stripped:
            explanation += "Assigns value to a variable."
        elif stripped.startswith("for"):
            explanation += "Starts a for loop to iterate over a sequence."
        elif stripped.startswith("if"):
            explanation += "Conditional statement checking a condition."
        elif stripped.startswith("while"):
            explanation += "Starts a while loop that continues while condition is True."
        else:
            explanation += "Statement detected. Explanation pending."

        line_by_line.append(explanation)

    # -------------------
    # Runtime error detection
    # -------------------
    try:
        exec(code_snippet, {})
    except Exception as e:
        errors_and_fixes.append(f"RuntimeError: {e}")

    # -------------------
    # Pros and Cons (simple logic)
    # -------------------
    pros_cons.append("Pros: Easy to read, simple logic.")
    if errors_and_fixes:
        pros_cons.append("Cons: Contains errors, may fail at runtime.")

    # -------------------
    # Real-life example
    # -------------------
    real_life_example = "This snippet can be used for basic scripting or console output tasks."

    return {
        "corrected_code": code_snippet,
        "errors_and_fixes": errors_and_fixes,
        "line_by_line": line_by_line,
        "pros_cons": pros_cons,
        "real_life_example": real_life_example,
        "references": references
    }


# -------------------
# Quick Test
# -------------------
if __name__ == "__main__":
    test_snippets = [
        'print("Hello world',
        'x = 10\nprint(x)',
        'x = 5 / 0',
    ]

    for snippet in test_snippets:
        print("\n--- Testing snippet ---")
        print(snippet)
        print(analyze_code(snippet))
