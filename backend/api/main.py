from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware to allow the frontend to connect to the API
origins = [
    "http://localhost:3000",  # Frontend development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeToAnalyze(BaseModel):
    code: str

@app.post("/analyze")
async def analyze_code(code: CodeToAnalyze):
    """
    Stub for the code analysis endpoint.
    This will eventually run static and AI-based analysis on the provided code.
    """
    return {"status": "ok", "note": "stub"}

@app.get("/")
def read_root():
    return {"Hello": "World"}