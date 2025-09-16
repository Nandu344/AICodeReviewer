# AI Code Reviewer – Static Analysis

## 📌 Overview
This project provides automated static analysis for Python code, focusing on both **style (quality, formatting)** and **security (vulnerabilities, risky patterns)**.  
It uses industry-standard tools and custom rules to help developers write safer, cleaner, and more maintainable code.

---

## ✨ Features
- **Style Checks**: Automated detection of formatting, syntax, and code quality issues using **Flake8**.
- **Security Checks**: Detection of common Python security vulnerabilities using **Bandit** and custom pattern matching.
- **Custom Security Rules**: Extra regex-based checks for risky code patterns not always covered by Bandit.
- **Timeout Protection**: Ensures analysis tools do not hang or run indefinitely.
- **Unified Reporting**: Results are grouped by filename and saved in a clear, structured JSON file (`static_output.json`).

---

## ⚙️ How It Works
1. **Scan Target Directory**: Recursively finds all `.py` files in the specified folder.  
2. **Run Flake8**: Checks each file for style and formatting issues.  
3. **Run Bandit**: Scans each file for security vulnerabilities.  
4. **Custom Security Scan**: Searches for additional risky patterns (e.g., `pickle`, `yaml.load`, `os.system`, `input`, `eval`, etc.).  
5. **Aggregate Results**: Combines findings and outputs them grouped by filename.  
6. **Timeouts**: Each tool is run with a timeout to prevent infinite loops.  

---

## 📝 Static Analysis Rules

### Style (Flake8)
- **E501**: Line too long (max 79 chars).  
- **E302/E305**: Functions and classes must be separated by blank lines.  
- **F401**: Remove unused imports.  
- **E999**: Syntax errors.  
- **W292**: Newline required at EOF.  

### Security (Bandit & Custom)
- **Dangerous Functions**: `eval`, `exec`, `input`, `pickle.load`, `yaml.load`.  
- **B105**: Hardcoded passwords.  
- **B404/B603/B602**: Unsafe subprocess usage.  
- **File Handling**: Unsafe file writes (`open(..., "w")`).  
- **Regex-based Custom Rules**: Detect additional project-specific risks.  

---

## ⚙️ Configuration
- **Target Directory**: Set with the `--path` argument (default: `backend`).  
- **Timeouts**: Configurable in the script (`run_command` function).  
- **Custom Patterns**: Add/modify regexes in `custom_security_scan()`.  

---

## 📊 Output
Results are saved in `static_output.json`:

```json
{
  "style": {
    "long_line.py": [
      "long_line.py: Line 2 Col 80 - E501 line too long (134 > 79 characters)"
    ]
  },
  "security": {
    "eval_danger.py": [
      "eval_danger.py: Custom Security: Found risky pattern '\\beval\\s*\\(' at position 30"
    ]
  }
}
```

- Files with issues: Listed with details.  
- Files with no issues: Appear with an empty list (or omitted if filtered).  

---

## 🚀 Extending the Project
- Add **Flake8 plugins** for more style checks.  
- Add **Bandit plugins** or update Bandit config for stricter security.  
- Add **custom regex patterns** for project-specific risks.  
- Integrate with **CI/CD pipelines** for automated code review.  

---

## ▶️ Getting Started

### 1. Install dependencies
```bash
pip install flake8 bandit
```

### 2. Run the script
```bash
python run_static.py --path backend/static_engine
```

### 3. View results
Open `static_output.json` for a summary of issues.  

---

## 🤝 Support
For questions, suggestions, or contributions, please contact the project maintainer or submit a pull request.  

---

✍️ **Write clean, secure Python code – let the AI Code Reviewer help!**
