from enum import Enum
from typing import Dict, Optional, Any
from pydantic import BaseModel, HttpUrl, Field


class HTTPMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"


class LoadTestConfig(BaseModel):
    target_url: HttpUrl = Field(..., description="The Target URL to test")
    method: HTTPMethod = Field(default=HTTPMethod.GET, description="HTTP Method")
    headers: Optional[Dict[str, str]] = Field(default_factory=dict, description="Custom headers")
    payload: Optional[Any] = Field(default=None, description="Optional request body/payload")
    virtual_users: int = Field(default=10, ge=1, le=5000, description="Number of concurrent users")
    duration_seconds: int = Field(default=10, ge=1, le=3600, description="Duration of the test in seconds")


class LoadTestSummary(BaseModel):
    total_requests: int
    successful_requests: int
    failed_requests: int
    requests_per_second: float
    p50_latency_ms: float
    p90_latency_ms: float
    p95_latency_ms: float
    p99_latency_ms: float
    status_codes: Dict[int, int]
