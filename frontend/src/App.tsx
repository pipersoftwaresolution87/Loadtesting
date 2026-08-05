import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TestLauncher } from './components/TestLauncher';
import { MetricsOverview } from './components/MetricsOverview';
import { AISummaryCard } from './components/AISummaryCard';
import { TelemetryCharts } from './components/TelemetryCharts';
import { TestHistory } from './components/TestHistory';
import { LoadTestConfig, LoadTestSummary, HistoryItem } from './types/load_test';
import { LoadTestService } from './services/api';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [currentSummary, setCurrentSummary] = useState<LoadTestSummary | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('loadpulse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check backend health on startup
  useEffect(() => {
    LoadTestService.checkHealth().then((healthy) => {
      setIsBackendHealthy(healthy);
      if (!healthy) {
        // Automatically switch to mock mode if backend is not yet started by user
        setIsMockMode(true);
      }
    });
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('loadpulse_history', JSON.stringify(history.slice(0, 15)));
    } catch {
      // Ignore quota errors
    }
  }, [history]);

  const handleRunTest = async (config: LoadTestConfig, isAsyncJob: boolean) => {
    setIsRunning(true);
    setErrorMessage(null);

    const newItemId = `test_${Date.now()}`;

    try {
      if (isMockMode) {
        if (isAsyncJob) {
          // Release UI immediately for background mock run
          const mockItem: HistoryItem = {
            id: newItemId,
            config,
            status: 'RUNNING',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setHistory((prev) => [mockItem, ...prev]);
          setIsRunning(false);

          // Background simulation poller
          setTimeout(() => {
            const mockSummary = LoadTestService.generateMockResult(config);
            setHistory((prev) =>
              prev.map((item) =>
                item.id === newItemId ? { ...item, status: 'COMPLETED', summary: mockSummary } : item
              )
            );
            setCurrentSummary(mockSummary);
          }, Math.max(2000, config.duration_seconds * 1000));
        } else {
          // Direct synchronous mock test
          await new Promise((res) => setTimeout(res, 2000));
          const mockSummary = LoadTestService.generateMockResult(config);
          setCurrentSummary(mockSummary);

          setHistory((prev) => [
            {
              id: newItemId,
              config,
              summary: mockSummary,
              status: 'COMPLETED',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            ...prev,
          ]);
          setIsRunning(false);
        }
      } else {
        if (isAsyncJob) {
          // 1. Launch background job on FastAPI backend
          const job = await LoadTestService.startLoadTest(config);

          // 2. Add RUNNING item to history and RELEASE UI immediately!
          const liveItem: HistoryItem = {
            id: job.test_id,
            config,
            status: 'RUNNING',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setHistory((prev) => [liveItem, ...prev]);
          setIsRunning(false);

          // 3. Non-blocking background poller
          (async () => {
            let completed = false;
            let attempts = 0;
            const maxAttempts = Math.max(60, config.duration_seconds + 30);

            while (!completed && attempts < maxAttempts) {
              await new Promise((res) => setTimeout(res, 1000));
              attempts++;
              try {
                const status = await LoadTestService.getJobStatus(job.test_id);

                if (status.status === 'COMPLETED' && status.summary) {
                  completed = true;
                  setHistory((prev) =>
                    prev.map((item) =>
                      item.id === job.test_id ? { ...item, status: 'COMPLETED', summary: status.summary } : item
                    )
                  );
                  setCurrentSummary(status.summary);
                } else if (status.status === 'FAILED') {
                  completed = true;
                  setHistory((prev) =>
                    prev.map((item) =>
                      item.id === job.test_id ? { ...item, status: 'FAILED' } : item
                    )
                  );
                }
              } catch {
                // Ignore transient polling errors
              }
            }
          })();
        } else {
          // Direct synchronous test
          const summary = await LoadTestService.runLoadTest(config);
          setCurrentSummary(summary);

          setHistory((prev) => [
            {
              id: newItemId,
              config,
              summary,
              status: 'COMPLETED',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            ...prev,
          ]);
          setIsRunning(false);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during load test execution.');
      setIsRunning(false);
    }
  };

  const [selectedConfig, setSelectedConfig] = useState<LoadTestConfig | null>(null);

  const handleSelectHistoryItem = (item: HistoryItem) => {
    if (item.summary) {
      setCurrentSummary(item.summary);
    }
    if (item.config) {
      setSelectedConfig(item.config);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('loadpulse_history');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        isMockMode={isMockMode}
        setIsMockMode={setIsMockMode}
        isBackendHealthy={isBackendHealthy}
        isRunning={isRunning}
      />

      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '24px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Banner when in Mock mode */}
        {isMockMode && (
          <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c084fc', fontSize: '0.85rem' }}>
              <RefreshCw size={16} />
              <span>
                <strong>Mock Telemetry Mode active</strong>: You are viewing frontend design telemetry. Switch to <strong>Live API Mode</strong> when your FastAPI server is running on <code>http://localhost:8000</code>.
              </span>
            </div>
            {isBackendHealthy && (
              <button
                onClick={() => setIsMockMode(false)}
                className="btn-primary"
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                Switch to Live API
              </button>
            )}
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--accent-rose)', color: '#fb7185', padding: '14px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={20} />
            <span style={{ fontSize: '0.9rem', flex: 1 }}>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Grid Layout: Config Launcher on Left (40%), Telemetry Dashboard on Right (60%) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Launcher & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <TestLauncher onRunTest={handleRunTest} isRunning={isRunning} selectedConfig={selectedConfig} />
            <TestHistory
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>

          {/* Right Column: Results Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MetricsOverview summary={currentSummary} isLoading={isRunning} />
            {currentSummary?.ai_analysis && (
              <AISummaryCard aiAnalysis={currentSummary.ai_analysis} isLoading={isRunning} />
            )}
            <TelemetryCharts summary={currentSummary} isLoading={isRunning} />
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', marginTop: '40px' }}>
        LoadPulse AI • Built with FastAPI, httpx & React Telemetry Engine
      </footer>
    </div>
  );
};
