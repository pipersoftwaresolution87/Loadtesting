import React from 'react';
import { Activity, Zap, Server, ShieldCheck, Wifi, WifiOff } from 'lucide-react';

interface NavbarProps {
  isMockMode: boolean;
  setIsMockMode: (val: boolean) => void;
  isBackendHealthy: boolean | null;
  isRunning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMockMode,
  setIsMockMode,
  isBackendHealthy,
  isRunning,
}) => {
  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', padding: '16px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Zap size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                LoadPulse <span style={{ color: 'var(--accent-cyan)', WebkitTextFillColor: 'initial' }}>AI</span>
              </h1>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.3)', fontFamily: 'var(--font-mono)' }}>
                v1.0.0
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High-Concurrency Telemetry & AI Load Generator</p>
          </div>
        </div>

        {/* Center Live Test Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '8px 18px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
          <div className={isRunning ? 'pulse-dot pulse-dot-busy' : 'pulse-dot'} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isRunning ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
            {isRunning ? 'LOAD TEST IN PROGRESS' : 'ENGINE READY'}
          </span>
        </div>

        {/* Right Controls: Mode Toggle & Backend Health */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Backend Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Server size={16} />
            <span>FastAPI:</span>
            {isBackendHealthy === null ? (
              <span style={{ color: 'var(--text-dim)' }}>Checking...</span>
            ) : isBackendHealthy ? (
              <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wifi size={14} /> Online
              </span>
            ) : (
              <span style={{ color: '#fb7185', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <WifiOff size={14} /> Offline
              </span>
            )}
          </div>

          {/* Mode Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 6px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setIsMockMode(false)}
              className={!isMockMode ? 'btn-secondary' : ''}
              style={{
                border: 'none',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer',
                background: !isMockMode ? 'var(--accent-cyan)' : 'transparent',
                color: !isMockMode ? '#fff' : 'var(--text-muted)',
                boxShadow: !isMockMode ? '0 0 10px rgba(6, 182, 212, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Live API
            </button>
            <button
              onClick={() => setIsMockMode(true)}
              style={{
                border: 'none',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer',
                background: isMockMode ? 'var(--accent-purple)' : 'transparent',
                color: isMockMode ? '#fff' : 'var(--text-muted)',
                boxShadow: isMockMode ? '0 0 10px rgba(139, 92, 246, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Mock Telemetry
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
