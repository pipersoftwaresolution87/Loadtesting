import numpy as np
from typing import List, Dict
from collections import Counter
from app.schemas.load_test import LoadTestSummary


def calculate_summary(
    latencies_ms: List[float],
    status_code:List[int],
    duration_seconds: float,
    total_errors:int
) -> LoadTestSummary:

 total_requests = len(latencies_ms)+total_errors
 successful_requests = len(latencies_ms)
 failed_requests = total_errors


 if not latencies_ms:
    return LoadTestSummary(
        total_requests= total_requests,
        successful_requests = 0,
        failed_requests = failed_requests,
        requests_per_second = 0.0,
        p50_latency_ms = 0.0,
        p90_latency_ms = 0.0,
        p95_latency_ms = 0.0,
        p99_latency_ms = 0.0,
        status_codes = dict(Counter(status_code))
)
 actual_duration = max(duration_seconds,0.001)
 rps = round(total_requests / actual_duration,2)

 p50= float(np.percentile(latencies_ms,50))
 p90= float(np.percentile(latencies_ms,90))
 p95= float(np.percentile(latencies_ms,95))
 p99= float(np.percentile(latencies_ms,99))


 return LoadTestSummary(
    total_requests = total_requests,
    successful_requests = successful_requests,
    failed_requests = failed_requests,
    requests_per_second = rps,
    p50_latency_ms = round(p50,2),
    p90_latency_ms = round(p90,2),
    p95_latency_ms = round(p95,2),
    p99_latency_ms = round(p99,2),
    status_codes = dict(Counter(status_code))
 )




 
