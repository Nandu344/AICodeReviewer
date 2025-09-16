import subprocess
import json
import sys
from pathlib import Path
from collections import defaultdict
import argparse
import os
import re

OUTPUT_FILE = Path(__file__).parent / "static_output.json"

def run_command(command, timeout=60):
    """Run a shell command and capture stdout/stderr as UTF-8 text, with timeout."""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
            timeout=timeout
        )
        return result.stdout.strip() or result.stderr.strip()
    except subprocess.TimeoutExpired:
        return "ERROR: Static analysis timed out!"
    except Exception as e:
        return str(e)

def parse_flake8(output):
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

def custom_security_scan(target_dir):
    """Scan for risky patterns not covered by Bandit."""
    risky_patterns = [
        r"\bpickle\.load\b",
        r"\byaml\.load\b",
        r"\bos\.system\b",
        r"\binput\s*\(",
        r"\bexec\s*\(",
        r"\beval\s*\(",
        r"\bsubprocess\.Popen\b",
        r"\bsubprocess\.call\b",
        r"\bopen\s*\(.*w\b",  # opening files for writing
    ]
    findings = defaultdict(list)
    for pyfile in Path(target_dir).rglob("*.py"):
        try:
            with open(pyfile, encoding="utf-8", errors="replace") as f:
                content = f.read()
            for pat in risky_patterns:
                for match in re.finditer(pat, content):
                    findings[pyfile.name].append(
                        f"{pyfile.name}: Custom Security: Found risky pattern '{pat}' at position {match.start()}"
                    )
        except Exception as e:
            findings[pyfile.name].append(f"{pyfile.name}: Custom Security: Error scanning file: {e}")
    return findings

def pretty_print_results(flake8_issues, bandit_issues, all_files):
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
    parser = argparse.ArgumentParser(description="AI Code Reviewer (Python static analysis)")
    parser.add_argument(
        "--path",
        default="backend",
        help="Path to analyze (default: backend)"
    )
    args = parser.parse_args()
    TARGET_DIR = Path(args.path).resolve()
    if not TARGET_DIR.exists():
        print(f"❌ Target path does not exist: {TARGET_DIR}")
        sys.exit(1)

    style_output = run_command([sys.executable, "-m", "flake8", str(TARGET_DIR)], timeout=30)
    security_output = run_command([sys.executable, "-m", "bandit", "-r", str(TARGET_DIR)], timeout=60)

    flake8_issues = parse_flake8(style_output)
    bandit_issues = parse_bandit(security_output)

    # Add custom security findings
    custom_findings = custom_security_scan(TARGET_DIR)
    for k, v in custom_findings.items():
        bandit_issues.setdefault(k, []).extend(v)

    all_files = set(flake8_issues.keys()) | set(bandit_issues.keys())

    pretty_print_results(flake8_issues, bandit_issues, all_files)

    results = {
        "style": dict(flake8_issues),
        "security": dict(bandit_issues)
    }
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Static analysis complete. JSON written to {OUTPUT_FILE}")

if __name__ == "__main__":
        main()