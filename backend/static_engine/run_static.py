import subprocess
import json
import sys
from pathlib import Path

# Output file path
OUTPUT_FILE = Path(__file__).parent / "static_output.json"


def run_command(command):
    """Run a shell command and capture stdout/stderr as UTF-8 text."""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8",   # force utf-8
            errors="replace",   # replace bad chars instead of crashing
            check=False
        )
        return result.stdout.strip() or result.stderr.strip()
    except Exception as e:
        return str(e)


def main():
    # Run flake8 (style check) only on project code
    style_output = run_command([sys.executable, "-m", "flake8", "backend"])

    # Run bandit (security check) only on project code
    security_output = run_command([sys.executable, "-m", "bandit", "-r", "backend"])

    # Combine results into JSON
    results = {
        "style": style_output,
        "security": security_output
    }

    # Write to static_output.json with UTF-8 encoding
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"✅ Static analysis complete. Results written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
