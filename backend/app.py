from flask import Flask, render_template, request, jsonify
from ai_engine.code_analyzer import analyze_code       # Python analyzer
from ai_engine.multi_language.java_analyzer import analyze_java  # Java analyzer

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'Python')

    result = {}

    if language == 'Python':
        result = analyze_code(code)
    elif language == 'Java':
        result = analyze_java(code)
    else:
        result = {"error": f"{language} analysis not implemented yet."}

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
