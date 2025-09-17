from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

def gen_id() -> str:
    return str(uuid.uuid4())

class Finding(BaseModel):
    id: str = Field(default_factory=gen_id)
    language: str
    file: str
    line: int
    severity: str   # "low" | "medium" | "high"
    type: str       # "style" | "security" | "performance" | ...
    message: str
    suggestion: Optional[str] = None

class AIReview(BaseModel):
    findings: List[Finding]
    model: str = "mock-gemini"
    confidence: Optional[float] = None
