import React from 'react';
import { LoadTestSummary } from '../types/load_test';
import { Gauge, CheckCircle2, AlertTriangle, Zap, Clock, Activity } from 'lucide-react';

interface MetricsOverviewProps {
  summary: LoadTestSummary | null;
  isLoading: boolean;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel skeleton" style={{ height: '110px' }} />
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
        <p style={{ fontWeight: 600 }}>No Load Test Executed Yet</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Configure your target parameters on the left and click "Launch Load Test".
        </p>
      </div>
    );
  }

  const successRate = summary.total_requests > 0
    ? ((summary.successful_requests / summary.total_requests) * 100).toFixed(1)
    : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        {/* RPS */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>THROUGHPUT</span>
            <Zap size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            {summary.requests_per_second.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requests / Sec (RPS)</span>
        </div>

        {/* Total Requests */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL REQUESTS</span>
            <Gauge size={18} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {summary.total_requests.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Executed in test run</span>
        </div>

        {/* Success Rate */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>SUCCESS RATE</span>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
            {successRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {summary.successful_requests.toLocaleString()} OK / {summary.failed_requests.toLocaleString()} Failed
          </span>
        </div>

        {/* Median Latency */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>MEDIAN LATENCY (p50)</span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
            {summary.p50_latency_ms} <span style={{ fontSize: '0.9rem' }}>ms</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>50th Percentile Response Time</span>
        </div>
      </div>

      {/* Latency Percentiles Ribbon */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>p50 (Median)</span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
            {summary.p50_latency_ms} ms
          </p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>p90</span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#c084fc' }}>
            {summary.p90_latency_ms} ms
          </p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>p95 (SLA Threshold)</span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#facc15' }}>
            {summary.p95_latency_ms} ms
          </p>
        </div>
        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>p99 (Tail Latency)</span>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#f87171' }}>
            {summary.p99_latency_ms} ms
          </p>
        </div>
      </div>
    </div>
  );
};
