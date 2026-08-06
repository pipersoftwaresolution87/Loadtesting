import { LoadTestConfig, LoadTestSummary, JobStartResponse, JobStatusResponse } from '../types/load_test';

const rawHost = (import.meta.env.VITE_API_URL || '').trim();
const API_HOST = rawHost.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
const BASE_URL = `${API_HOST}/api/v1`;

export class LoadTestService {
  /**
   * Health check to test backend connection
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Trigger direct synchronous load test
   */
  static async runLoadTest(config: LoadTestConfig): Promise<LoadTestSummary> {
    const res = await fetch(`${BASE_URL}/load-tests/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to run load test' }));
      throw new Error(err.detail || 'Load test execution failed');
    }

    return await res.json();
  }

  /**
   * Start async background load test
   */
  static async startLoadTest(config: LoadTestConfig): Promise<JobStartResponse> {
    const res = await fetch(`${BASE_URL}/load-tests/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to start load test job' }));
      throw new Error(err.detail || 'Background job initialization failed');
    }

    return await res.json();
  }

  /**
   * Poll status of background load test
   */
  static async getJobStatus(testId: string): Promise<JobStatusResponse> {
    const res = await fetch(`${BASE_URL}/load-tests/status/${testId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch status for job ${testId}`);
    }
    return await res.json();
  }

  /**
   * Generates high-fidelity mock telemetry data for offline / demo mode
   */
  static generateMockResult(config: LoadTestConfig): LoadTestSummary {
    const vus = config.virtual_users;
    const duration = config.duration_seconds;
    const totalReqs = Math.floor(vus * duration * (15 + Math.random() * 10));
    const failCount = Math.random() > 0.85 ? Math.floor(totalReqs * 0.02) : 0;
    const successCount = totalReqs - failCount;

    const baseLat = 40 + Math.floor(vus * 0.08);
    const p50 = baseLat + Math.random() * 15;
    const p90 = p50 * 1.6 + Math.random() * 20;
    const p95 = p90 * 1.3 + Math.random() * 25;
    const p99 = p95 * 1.5 + Math.random() * 40;

    let grade = 'A+';
    let status = 'EXCELLENT';
    let execSummary = `Your target endpoint successfully handled ${totalReqs.toLocaleString()} total requests across ${vus} virtual users with a 100% success rate. 95% of requests registered latencies under ${Math.round(p95)}ms.`;
    let rec = 'Infrastructure performance is outstanding. Systems are ready for production traffic scale.';

    if (failCount > 0) {
      grade = 'C';
      status = 'DEGRADED';
      execSummary = `System experienced ${failCount} connection drops out of ${totalReqs.toLocaleString()} requests under peak load.`;
      rec = 'Investigate backend database connection pooling and memory limits before running high-volume marketing events.';
    } else if (p95 > 350) {
      grade = 'B';
      status = 'STABLE';
      execSummary = `All ${totalReqs.toLocaleString()} requests succeeded, but 95th percentile latency reached ${Math.round(p95)}ms during peak load.`;
      rec = 'Consider enabling Redis response caching or CDN edge distribution to optimize tail latencies.';
    }

    return {
      total_requests: totalReqs,
      successful_requests: successCount,
      failed_requests: failCount,
      requests_per_second: parseFloat((totalReqs / duration).toFixed(2)),
      p50_latency_ms: parseFloat(p50.toFixed(2)),
      p90_latency_ms: parseFloat(p90.toFixed(2)),
      p95_latency_ms: parseFloat(p95.toFixed(2)),
      p99_latency_ms: parseFloat(p99.toFixed(2)),
      status_codes: failCount > 0 ? { 200: successCount, 500: failCount } : { 200: successCount },
      ai_analysis: {
        performance_grade: grade,
        status: status,
        executive_summary: execSummary,
        business_recommendation: rec,
      },
    };
  }
}
