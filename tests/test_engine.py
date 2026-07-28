import pytest
from app.schemas.load_test import LoadTestConfig, HTTPMethod
from app.engine.runner import run_load_test


@pytest.mark.asyncio
async def test_run_load_test_basic():
    config = LoadTestConfig(
        target_url="https://httpbin.org/get",
        method=HTTPMethod.GET,
        virtual_users=2,
        duration_seconds=2
    )
    summary = await run_load_test(config)

    assert summary.total_requests > 0
    assert summary.successful_requests > 0
    assert summary.requests_per_second > 0
    assert summary.p50_latency_ms >= 0
    assert 200 in summary.status_codes
