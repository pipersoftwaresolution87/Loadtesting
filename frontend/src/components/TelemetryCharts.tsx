import React from 'react';
import { LoadTestSummary } from '../types/load_test';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface TelemetryChartsProps {
  summary: LoadTestSummary | null;
  isLoading: boolean;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div className="glass-panel skeleton" style={{ height: '260px' }} />
        <div className="glass-panel skeleton" style={{ height: '260px' }} />
      </div>
    );
  }

  if (!summary) return null;

  // Latency Bar Chart Data
  const latencyData = {
    labels: ['p50 (Median)', 'p90', 'p95 (SLA)', 'p99 (Tail)'],
    datasets: [
      {
        label: 'Latency (ms)',
        data: [
          summary.p50_latency_ms,
          summary.p90_latency_ms,
          summary.p95_latency_ms,
          summary.p99_latency_ms,
        ],
        backgroundColor: [
          'rgba(56, 189, 248, 0.7)',
          'rgba(192, 132, 252, 0.7)',
          'rgba(250, 204, 21, 0.7)',
          'rgba(248, 113, 113, 0.7)',
        ],
        borderColor: ['#38bdf8', '#c084fc', '#facc15', '#f87171'],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const latencyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} ms`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { family: 'Inter', weight: 600 } },
      },
    },
  };

  // Status Codes Donut Chart Data
  const statusCodes = summary.status_codes || {};
  const statusLabels = Object.keys(statusCodes).map((code) => `HTTP ${code}`);
  const statusCounts = Object.values(statusCodes);

  const doughnutData = {
    labels: statusLabels.length ? statusLabels : ['200 OK'],
    datasets: [
      {
        data: statusCounts.length ? statusCounts : [summary.successful_requests],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 } },
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
      {/* Latency Bar Chart */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={18} color="var(--accent-cyan)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Response Latency Distribution (ms)
          </h4>
        </div>
        <div style={{ height: '220px' }}>
          <Bar data={latencyData} options={latencyOptions as any} />
        </div>
      </div>

      {/* HTTP Status Code Donut Chart */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PieChart size={18} color="var(--accent-emerald)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
            HTTP Response Status Breakdown
          </h4>
        </div>
        <div style={{ height: '220px', position: 'relative' }}>
          <Doughnut data={doughnutData} options={doughnutOptions as any} />
        </div>
      </div>
    </div>
  );
};
