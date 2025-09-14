import subprocess
import json
import sys
from pathlib import Path
from collections import defaultdict
import argparse

# Output file path (next to this script)
OUTPUT_FILE = Path(__file__).parent / "static_output.json"


def run_command(command):
    """Run a shell command and capture stdout/stderr as UTF-8 text."""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False
        )
        return result.stdout.strip() or result.stderr.strip()
    except Exception as e:
        return str(e)


def parse_flake8(output):
    import os
    issues = defaultdict(list)
    if not output:
        return issues
    for line in output.splitlines():
        # Example: C:\Users\mdhnd\OneDrive\Documents\ai-code-reviewer\backend\static_engine\long_line.py:2:80: E501 line too long (134 > 79 characters)
        parts = line.split(":", 3)
        if len(parts) == 4:
            # Reconstruct the full path for Windows (drive letter + path)
            file_path = parts[0] + ":" + parts[1]
            line_num = parts[2]
            col_num, msg = parts[3].split(" ", 1)
            filename = os.path.basename(file_path.strip())
            issues[filename].append(f"{filename}: Line {line_num} Col {col_num} - {msg.strip()}")
    return issues


def parse_bandit(output):
    import os
    issues = defaultdict(list)
    current_file = None
    current_issue = []

    for line in output.splitlines():
        line = line.strip()
        if line.startswith("Location:"):
            loc = line.split("Location:")[-1].strip()
            # loc is like 'C:\Users\mdhnd\OneDrive\Documents\ai-code-reviewer\backend\static_engine\run_static.py:1:0'
            file_path = loc.split(":")[0] + ":" + loc.split(":")[1]  # Get 'C:\Users\...'
            filename = os.path.basename(file_path)
            current_file = filename
        elif line.startswith(">> Issue:"):
            current_issue = [line]
        elif current_issue and line and not line.startswith("--------------------------------------------------"):
            current_issue.append(line)
        elif line.startswith("--------------------------------------------------"):
            if current_file and current_issue:
                issues[current_file].append(" | ".join(current_issue))
            current_issue = []
    if current_file and current_issue:
        issues[current_file].append(" | ".join(current_issue))
    return issues


def pretty_print_results(flake8_issues, bandit_issues, all_files):
    """Print clean human-readable report."""
    print("\n📋 Static Analysis Report\n" + "="*40)

    if not all_files:
        print("\n⚠️ No Python files found to analyze.")
        return

    for file in sorted(all_files):
        print(f"\n📂 File: {file}")

        style = flake8_issues.get(file, [])
        security = bandit_issues.get(file, [])

        if not style and not security:
            print("   ✅ No issues found")
        else:
            if style:
                print("   ✨ Style Issues:")
                for s in style:
                    print(f"     - {s}")
            if security:
                print("   🔒 Security Issues:")
                for s in security:
                    print(f"     - {s}")


def main():
    # CLI args
    parser = argparse.ArgumentParser(description="AI Code Reviewer (Python static analysis)")
    parser.add_argument(
        "--path",
        default="backend",
        help="Path to analyze (default: backend)"
    )
    args = parser.parse_args()

    # Resolve absolute path properly
    TARGET_DIR = Path(args.path).resolve()

    if not TARGET_DIR.exists():
        print(f"❌ Target path does not exist: {TARGET_DIR}")
        sys.exit(1)

    # Run analyzers
    style_output = run_command([sys.executable, "-m", "flake8", str(TARGET_DIR)])
    security_output = run_command([sys.executable, "-m", "bandit", "-r", str(TARGET_DIR)])

    # Parse outputs
    flake8_issues = parse_flake8(style_output)
    bandit_issues = parse_bandit(security_output)

    # Collect all files seen by either tool
    all_files = set(flake8_issues.keys()) | set(bandit_issues.keys())

    # Pretty print results
    pretty_print_results(flake8_issues, bandit_issues, all_files)

    # Save structured results to JSON
    results = {
        "style": flake8_issues,
        "security": bandit_issues
    }
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Static analysis complete. JSON written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
