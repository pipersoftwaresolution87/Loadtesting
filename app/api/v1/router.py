import asyncio
from fastapi import APIRouter, HTTPException
from app.schemas.load_test import (
    LoadTestConfig,
    LoadTestSummary,
    JobStartResponse,
    JobStatusResponse,
)
from app.engine.runner import run_load_test
from app.service.AI_summary import generate_ai_analysis
from app.service.job_store import create_job, get_job
from app.service.background_runner import execute_background_test

api_router = APIRouter()


@api_router.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Load Testing API"
    }


@api_router.post("/load-tests/run", response_model=LoadTestSummary, tags=["Load Test"])
async def trigger_load_test(config: LoadTestConfig):
    """
    Triggers a concurrent load test against the target URL and returns summary metrics.
    """
    summary = await run_load_test(config)
    summary.ai_analysis = await generate_ai_analysis(summary.model_dump())
    return summary


@api_router.post("/load-tests/start", response_model=JobStartResponse, tags=["Load Test"])
async def start_load_test(config: LoadTestConfig):
    """
    Starts an asynchronous background load test and returns test_id immediately.
    """
    test_id = create_job(config)
    asyncio.create_task(execute_background_test(test_id, config))
    return JobStartResponse(
        test_id=test_id,
        status="RUNNING",
        message="Load test launched in background. Use test_id to check status.",
        target_url=str(config.target_url)
    )


@api_router.get("/load-tests/status/{test_id}", response_model=JobStatusResponse, tags=["Load Test"])
async def get_load_test_status(test_id: str):
    """
    Checks status and retrieves results for a background load test.
    """
    job = get_job(test_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Load test '{test_id}' not found.")

    return JobStatusResponse(
        test_id=job["test_id"],
        status=job["status"],
        summary=job["summary"],
        error=job["error"]
    )
