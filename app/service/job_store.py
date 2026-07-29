import uuid
from typing import Dict, Optional
from app.schemas.load_test import LoadTestConfig, LoadTestSummary

# In-memory dictionary storing all active & completed jobs
JOBS: Dict[str, dict] = {}


def create_job(config: LoadTestConfig) -> str:
    test_id = f"test_{uuid.uuid4().hex[:8]}"
    JOBS[test_id] = {
        "test_id": test_id,
        "status": "PENDING",
        "target_url": str(config.target_url),
        "summary": None,
        "error": None
    }
    return test_id


def update_job(test_id: str, status: str, summary: Optional[LoadTestSummary] = None, error: Optional[str] = None):
    if test_id in JOBS:
        JOBS[test_id]["status"] = status
        if summary:
            JOBS[test_id]["summary"] = summary
        if error:
            JOBS[test_id]["error"] = error


def get_job(test_id: str) -> Optional[dict]:
    return JOBS.get(test_id)
