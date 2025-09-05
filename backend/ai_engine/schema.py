from pydantic import BaseModel
from typing import List

class Finding(BaseModel):
    id: int
    language: str
    file: str
    line: int
    severity: str
    type: str
    message: str
    suggestion: str

class AIReview(BaseModel):
    findings: List[Finding]
