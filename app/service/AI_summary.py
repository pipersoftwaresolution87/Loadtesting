from google import genai
from app.core.config import settings
from app.schemas.load_test import AISummaryResponse


async def generate_ai_analysis(metrics: dict) -> AISummaryResponse:
    """
    Sends load test metrics to Google Gemini AI and returns structured executive insights.
    Includes smart fallback heuristic so the API never returns a 500 error if the AI model is unreachable.
    """
    # 1. Try available Gemini models
    for model_name in ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]:
        try:
            if not settings.GEMINI_API_KEY:
                break

            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            prompt = (
                f"You are a Senior Performance Engineer. Analyze these load test metrics: {metrics}. "
                "Provide a letter grade (A+ to F), overall status (e.g. EXCELLENT, STABLE, DEGRADED), "
                "a 2-sentence non-technical executive summary for business clients, and an actionable business recommendation."
            )

            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AISummaryResponse,
                }
            )

            if response.parsed:
                return response.parsed
            if response.text:
                return AISummaryResponse.model_validate_json(response.text)
        except Exception:
            continue

    # 2. Smart Fallback Generator (Guarantees your API never returns a 500 error)
    total_req = metrics.get("total_requests", 0)
    failed_req = metrics.get("failed_requests", 0)
    p95 = metrics.get("p95_latency_ms", 0.0)
    rps = metrics.get("requests_per_second", 0.0)

    if failed_req == 0 and p95 < 500:
        grade, status = "A+", "EXCELLENT"
        exec_summary = f"Your site handled {total_req} requests seamlessly with a 100% success rate at {rps} RPS. 95% of users experienced page load speeds under {p95}ms."
        recommendation = "Your backend infrastructure is performing exceptionally well and is fully ready for high traffic spikes."
    elif failed_req == 0:
        grade, status = "A", "STABLE"
        exec_summary = f"Your site processed {total_req} requests successfully at {rps} RPS. User experience remains smooth overall."
        recommendation = "Infrastructure is stable. Minor caching optimizations can further improve peak speeds."
    else:
        grade, status = "C", "DEGRADED"
        exec_summary = f"Your server experienced {failed_req} network failures out of {total_req} requests under load."
        recommendation = "Investigate backend database connections and server logs before scaling marketing traffic."

    return AISummaryResponse(
        performance_grade=grade,
        status=status,
        executive_summary=exec_summary,
        business_recommendation=recommendation
    )
