import React from 'react';
import { AISummaryResponse } from '../types/load_test';
import { Sparkles, Award, Lightbulb, ShieldCheck, ShieldAlert } from 'lucide-react';

interface AISummaryCardProps {
  aiAnalysis?: AISummaryResponse;
  isLoading: boolean;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ aiAnalysis, isLoading }) => {
  if (isLoading) {
    return <div className="glass-panel skeleton" style={{ height: '180px' }} />;
  }

  if (!aiAnalysis) {
    return null;
  }

  const { performance_grade, status, executive_summary, business_recommendation } = aiAnalysis;

  // Grade color map
  const getGradeStyle = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A':
        return {
          bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          glow: '0 0 20px rgba(16, 185, 129, 0.5)',
          color: '#ffffff',
        };
      case 'B':
        return {
          bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          glow: '0 0 20px rgba(59, 130, 246, 0.5)',
          color: '#ffffff',
        };
      case 'C':
        return {
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          glow: '0 0 20px rgba(245, 158, 11, 0.5)',
          color: '#ffffff',
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
          glow: '0 0 20px rgba(244, 63, 94, 0.5)',
          color: '#ffffff',
        };
    }
  };

  const gradeStyle = getGradeStyle(performance_grade);

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>
            Gemini AI Executive Telemetry Analysis
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', fontWeight: 600, border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          AI Insights Engine
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Grade Badge */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: gradeStyle.bg,
            boxShadow: gradeStyle.glow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 900,
            color: gradeStyle.color,
            fontFamily: 'var(--font-mono)',
            margin: '0 auto 8px auto'
          }}>
            {performance_grade}
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: status === 'EXCELLENT' ? '#34d399' : status === 'STABLE' ? '#60a5fa' : '#f87171',
            textTransform: 'uppercase'
          }}>
            STATUS: {status}
          </span>
        </div>

        {/* Executive Summary & Recommendation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
              {executive_summary}
            </p>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Lightbulb size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actionable Business Recommendation
              </span>
              <p style={{ fontSize: '0.85rem', color: '#d1d5db', marginTop: '2px' }}>
                {business_recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
