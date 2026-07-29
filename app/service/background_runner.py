from app.schemas.load_test import LoadTestConfig
from app.engine.runner import run_load_test
from app.service.AI_summary import generate_ai_analysis
from app.service.job_store import update_job


async def execute_background_test(test_id: str, config: LoadTestConfig):
    """
    Executes the load test and AI report generation asynchronously in the background.
    """
    update_job(test_id, status="RUNNING")
    try:
        # 1. Run core load test engine
        summary = await run_load_test(config)

        # 2. Generate AI summary
        summary.ai_analysis = await generate_ai_analysis(summary.model_dump())

        # 3. Store completed results
        update_job(test_id, status="COMPLETED", summary=summary)
    except Exception as e:
        update_job(test_id, status="FAILED", error=str(e))
