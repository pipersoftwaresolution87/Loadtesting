import time
import asyncio
import httpx
from typing import List
from app.schemas.load_test import LoadTestConfig, LoadTestSummary
from app.engine.stats import calculate_summary


async def worker(
    client: httpx.AsyncClient,
    config: LoadTestConfig,
    end_time: float,
    latencies_ms: List[float],
    status_code: List[int],
    error_container: List[int]
):
    """
    Simulates a single Virtual User (VU) continuously sending requests
    until end_time is reached.
    """
    target_url_str = str(config.target_url)

    while time.perf_counter() < end_time:
        start_time = time.perf_counter()
        try:
            response = await client.request(
                method=config.method.value,
                url=target_url_str,
                headers=config.headers,
                json=config.payload,
                timeout=10.0
            )

            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            latencies_ms.append(elapsed_ms)
            status_code.append(response.status_code)

        except Exception:
            # Network timeout, DNS error, or connection drop
            error_container[0] += 1


async def run_load_test(config: LoadTestConfig) -> LoadTestSummary:
    """
    Orchestrates the concurrent load test across all Virtual Users.
    """
    latencies_ms: List[float] = []
    status_code: List[int] = []
    error_container: List[int] = [0]  # Mutable list to hold error count across tasks

    limits = httpx.Limits(
        max_connections=config.virtual_users,
        max_keepalive_connections=config.virtual_users
    )

    async with httpx.AsyncClient(limits=limits) as client:
        start_time = time.perf_counter()
        end_time = start_time + config.duration_seconds

        # Spawn all Virtual User worker tasks
        tasks = [
            worker(client, config, end_time, latencies_ms, status_code, error_container)
            for _ in range(config.virtual_users)
        ]

        await asyncio.gather(*tasks)
        actual_duration = time.perf_counter() - start_time

    return calculate_summary(
        latencies_ms=latencies_ms,
        status_code=status_code,
        duration_seconds=actual_duration,
        total_errors=error_container[0]
    )
