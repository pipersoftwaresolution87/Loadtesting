export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface LoadTestConfig {
  target_url: string;
  method: HTTPMethod;
  headers?: Record<string, string>;
  payload?: any;
  virtual_users: number;
  duration_seconds: number;
}

export interface AISummaryResponse {
  performance_grade: string; // 'A+' | 'A' | 'B' | 'C' | 'F'
  status: string; // 'EXCELLENT' | 'STABLE' | 'DEGRADED' | 'CRITICAL'
  executive_summary: string;
  business_recommendation: string;
}

export interface LoadTestSummary {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  requests_per_second: number;
  p50_latency_ms: number;
  p90_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  status_codes: Record<number, number>;
  ai_analysis?: AISummaryResponse;
}

export interface JobStartResponse {
  test_id: string;
  status: string;
  message: string;
  target_url: string;
}

export interface JobStatusResponse {
  test_id: string;
  status: string; // 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  summary?: LoadTestSummary;
  error?: string;
}

export interface HistoryItem {
  id: string;
  config: LoadTestConfig;
  summary?: LoadTestSummary;
  status: 'COMPLETED' | 'FAILED' | 'RUNNING';
  timestamp: string;
}
