import React from 'react';
import { HistoryItem } from '../types/load_test';
import { History, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface TestHistoryProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Execution History</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>
          No previous test runs stored yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <span className={`method-pill ${item.config.method} active`}>
                  {item.config.method}
                </span>

                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.config.target_url}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{item.config.virtual_users} VUs</span> •
                    <span>{item.config.duration_seconds}s</span> •
                    <span>{item.timestamp}</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {item.summary ? (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {item.summary.requests_per_second} RPS
                  </span>
                ) : item.status === 'RUNNING' ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                    RUNNING...
                  </span>
                ) : null}
                {item.status === 'COMPLETED' ? (
                  <CheckCircle2 size={16} color="#34d399" />
                ) : item.status === 'RUNNING' ? (
                  <Loader2 size={16} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <XCircle size={16} color="#fb7185" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
