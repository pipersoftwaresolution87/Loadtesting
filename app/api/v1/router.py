from fastapi import APIRouter
from app.schemas.load_test import LoadTestConfig, LoadTestSummary
from app.engine.runner import run_load_test
from app.service.AI_summary import generate_ai_analysis

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
