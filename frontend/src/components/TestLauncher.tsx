import React, { useState, useEffect } from 'react';
import { HTTPMethod, LoadTestConfig } from '../types/load_test';
import { Play, Users, Clock, Globe, Code2, ChevronDown, ChevronUp, Flame, ShieldAlert, Cpu } from 'lucide-react';

interface TestLauncherProps {
  onRunTest: (config: LoadTestConfig, isAsyncJob: boolean) => void;
  isRunning: boolean;
  selectedConfig?: LoadTestConfig | null;
}

const METHODS: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const TestLauncher: React.FC<TestLauncherProps> = ({ onRunTest, isRunning, selectedConfig }) => {
  const [targetUrl, setTargetUrl] = useState<string>('https://httpbin.org/get');
  const [method, setMethod] = useState<HTTPMethod>('GET');
  const [virtualUsers, setVirtualUsers] = useState<number>(20);
  const [durationSeconds, setDurationSeconds] = useState<number>(10);
  const [headersJson, setHeadersJson] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [payloadJson, setPayloadJson] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isAsyncJob, setIsAsyncJob] = useState<boolean>(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedConfig) {
      setTargetUrl(selectedConfig.target_url);
      setMethod(selectedConfig.method);
      setVirtualUsers(selectedConfig.virtual_users);
      setDurationSeconds(selectedConfig.duration_seconds);
      if (selectedConfig.headers) {
        setHeadersJson(JSON.stringify(selectedConfig.headers, null, 2));
      }
      if (selectedConfig.payload) {
        setPayloadJson(JSON.stringify(selectedConfig.payload, null, 2));
      }
    }
  }, [selectedConfig]);

  const handleApplyPreset = (vus: number, duration: number, url: string, m: HTTPMethod) => {
    setVirtualUsers(vus);
    setDurationSeconds(duration);
    setTargetUrl(url);
    setMethod(m);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);

    let parsedHeaders = {};
    let parsedPayload = null;

    try {
      if (headersJson.trim()) {
        parsedHeaders = JSON.parse(headersJson);
      }
    } catch {
      setJsonError('Invalid JSON in Custom Headers field');
      return;
    }

    try {
      if (payloadJson.trim()) {
        parsedPayload = JSON.parse(payloadJson);
      }
    } catch {
      setJsonError('Invalid JSON in Payload Body field');
      return;
    }

    onRunTest(
      {
        target_url: targetUrl,
        method: method,
        headers: parsedHeaders,
        payload: parsedPayload,
        virtual_users: Number(virtualUsers),
        duration_seconds: Number(durationSeconds),
      },
      isAsyncJob
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Test Engine Configurator</h2>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pydantic Validated Engine</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* HTTP Method Selection */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
            HTTP Method
          </label>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
            {METHODS.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMethod(m)}
                className={`method-pill ${m} ${method === m ? 'active' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Target URL Input */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} /> Target Endpoint URL
          </label>
          <div style={{ position: 'relative' }}>
            <Globe size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="http://localhost:8000/api/v1/health or https://yourdomain.com"
              autoComplete="off"
              spellCheck={false}
              className="code-input"
              style={{ paddingLeft: '40px', fontSize: '0.95rem', fontWeight: 500 }}
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '6px', display: 'block' }}>
            Quick Load Presets
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleApplyPreset(10, 5, 'https://httpbin.org/get', 'GET')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              ⚡ Quick Ping (10 VUs / 5s)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(100, 10, 'https://httpbin.org/delay/1', 'GET')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              🔥 Spike Load (100 VUs / 10s)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset(500, 15, 'https://httpbin.org/post', 'POST')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              🚀 Endurance Stress (500 VUs / 15s)
            </button>
          </div>
        </div>

        {/* Virtual Users Slider */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-cyan)" /> Virtual Users (VUs)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={1}
                max={5000}
                value={virtualUsers}
                onChange={(e) => setVirtualUsers(Math.min(5000, Math.max(1, Number(e.target.value))))}
                className="code-input"
                style={{ width: '80px', textAlign: 'center', padding: '4px 8px' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>VUs</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={5000}
            value={virtualUsers}
            onChange={(e) => setVirtualUsers(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            <span>1 VU (Baseline)</span>
            <span>2,500 VUs</span>
            <span>5,000 VUs (Max)</span>
          </div>
        </div>

        {/* Duration Slider */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--accent-purple)" /> Test Duration
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={1}
                max={3600}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Math.min(3600, Math.max(1, Number(e.target.value))))}
                className="code-input"
                style={{ width: '80px', textAlign: 'center', padding: '4px 8px' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>sec</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={3600}
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            <span>1s</span>
            <span>30m</span>
            <span>60m (3,600s)</span>
          </div>
        </div>

        {/* Advanced Headers & Payload Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Code2 size={16} /> Advanced JSON Headers & Body Payload
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced && (
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                  Custom Headers (JSON Object)
                </label>
                <textarea
                  rows={3}
                  value={headersJson}
                  onChange={(e) => setHeadersJson(e.target.value)}
                  className="code-input"
                  placeholder='{ "Authorization": "Bearer token..." }'
                />
              </div>

              {method !== 'GET' && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                    Request Body Payload (JSON)
                  </label>
                  <textarea
                    rows={4}
                    value={payloadJson}
                    onChange={(e) => setPayloadJson(e.target.value)}
                    className="code-input"
                    placeholder='{ "item_id": 402, "quantity": 2 }'
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {jsonError && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: '#fb7185', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} /> {jsonError}
          </div>
        )}

        {/* Execution Mode & Launch Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={isAsyncJob}
              onChange={(e) => setIsAsyncJob(e.target.checked)}
              style={{ accentColor: 'var(--accent-cyan)', width: '16px', height: '16px' }}
            />
            Run in Background (Async Worker Job)
          </label>

          <button
            type="submit"
            disabled={isRunning}
            className="btn-primary"
            style={{ width: 'auto' }}
          >
            {isRunning ? (
              <>
                <Flame size={18} className="pulse-dot-busy" /> Injecting Load...
              </>
            ) : (
              <>
                <Play size={18} /> Launch Load Test
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
