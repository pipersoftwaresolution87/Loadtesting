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


class AISummaryResponse(BaseModel):
    performance_grade: str = Field(..., description="Performance letter grade (A+, A, B, C, F)")
    status: str = Field(..., description="Overall health status (EXCELLENT, STABLE, DEGRADED, CRITICAL)")
    executive_summary: str = Field(..., description="Non-technical executive summary for clients")
    business_recommendation: str = Field(..., description="Actionable business recommendation")


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
    ai_analysis: Optional[AISummaryResponse] = None


class JobStartResponse(BaseModel):
    test_id:str
    status: str
    message: str
    target_url:str



class JobStatusResponse(BaseModel):
    test_id:str
    status:str
    summary:Optional[LoadTestSummary] = None
    error: Optional[str] = None
