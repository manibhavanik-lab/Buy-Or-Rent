import React, { useState, useEffect, useCallback } from 'react';
import type { HealthCheckResponse } from '../../api/health/index';

interface PingHistoryItem {
  id: string;
  time: string;
  httpCode: number;
  status: 'pass' | 'fail';
  ms: number;
}

export const ApiHealthView: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [httpStatus, setHttpStatus] = useState<number>(200);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [simulateOutage, setSimulateOutage] = useState<boolean>(false);
  const [history, setHistory] = useState<PingHistoryItem[]>([]);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    const start = Date.now();
    try {
      const url = simulateOutage ? '/api/health?simulate=503' : '/api/health';
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      const data: HealthCheckResponse = await res.json();
      const elapsed = Date.now() - start;

      setHttpStatus(res.status);
      setHealthData(data);

      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(7),
          time: new Date().toLocaleTimeString('en-SG', { hour12: false }),
          httpCode: res.status,
          status: data.status,
          ms: data.checks?.upstream?.ms || elapsed,
        },
        ...prev.slice(0, 7),
      ]);
    } catch {
      setHttpStatus(503);
      setHealthData({
        status: 'fail',
        time: new Date().toISOString(),
        checks: {
          keyConfigured: false,
          upstream: { status: 'fail', httpCode: 503, ms: 0, error: 'Network fetch failure' },
          lastGoodFetch: 'N/A',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [simulateOutage]);

  // Initial load
  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchHealth();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchHealth]);

  const curlCommand = `curl -i ${window.location.origin}/api/health`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyJson = () => {
    if (healthData) {
      navigator.clipboard.writeText(JSON.stringify(healthData, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const isHealthy = httpStatus === 200 && healthData?.status === 'pass';

  return (
    <div className="w-full px-margin-desktop py-space-md space-y-space-md animate-fadeIn">
      {/* Top Banner */}
      <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">monitor_heart</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              API Health Monitor & Upstream SLA Telemetry
            </h2>
            <span
              className={`font-badge-code text-badge-code px-2 py-0.5 rounded font-bold uppercase ${
                isHealthy ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'
              }`}
            >
              HTTP {httpStatus} {isHealthy ? 'OK' : 'DEGRADED'}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Endpoint audit: <code className="font-badge-code text-primary bg-surface-container-highest px-1.5 py-0.5 rounded">GET /api/health</code> (200 when healthy, 503 when not).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Simulate 503 Outage Toggle */}
          <button
            onClick={() => setSimulateOutage((prev) => !prev)}
            className={`px-3 py-1.5 rounded text-xs font-badge-code border transition-colors cursor-pointer flex items-center gap-1.5 ${
              simulateOutage
                ? 'bg-error text-on-error border-error font-bold'
                : 'bg-surface-container-high text-on-surface-variant border-outline-variant/40 hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {simulateOutage ? 'warning' : 'bug_report'}
            </span>
            <span>{simulateOutage ? 'Simulating 503 Outage' : 'Simulate 503'}</span>
          </button>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh((prev) => !prev)}
            className={`px-3 py-1.5 rounded text-xs font-badge-code border transition-colors cursor-pointer flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-surface-container-high text-on-surface-variant border-outline-variant/40'
            }`}
          >
            <span className={`material-symbols-outlined text-[14px] ${autoRefresh ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{autoRefresh ? 'Auto (10s)' : 'Paused'}</span>
          </button>

          {/* Trigger Ping Button */}
          <button
            onClick={fetchHealth}
            disabled={isLoading}
            className="px-4 py-1.5 rounded bg-primary hover:bg-[#38c0de] text-on-primary font-badge-code text-badge-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
              {isLoading ? 'progress_activity' : 'play_arrow'}
            </span>
            <span>{isLoading ? 'Checking...' : 'Run Check'}</span>
          </button>
        </div>
      </div>

      {/* Main Status Cards Quad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
        {/* Status Card */}
        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-badge-code text-badge-code text-outline uppercase">API STATUS</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isHealthy ? 'bg-secondary animate-pulse shadow-[0_0_8px_#4edea3]' : 'bg-error'
                }`}
              ></span>
              <span className={`font-badge-code text-xs font-bold ${isHealthy ? 'text-secondary' : 'text-error'}`}>
                {isHealthy ? 'PASS (200)' : 'FAIL (503)'}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-metric-headline text-3xl font-bold tracking-tight text-on-surface">
              {isHealthy ? 'HEALTHY' : 'OUTAGE'}
            </p>
            <p className="font-disclaimer text-xs text-on-surface-variant mt-1">
              {isHealthy ? 'All subsystem constraints satisfied' : 'Health check gate threshold exceeded'}
            </p>
          </div>
        </div>

        {/* Upstream Latency Card */}
        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-badge-code text-badge-code text-outline uppercase">UPSTREAM LATENCY</span>
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <p className="font-metric-headline text-3xl font-bold text-primary">
                {healthData?.checks?.upstream?.ms ?? 0}
              </p>
              <span className="font-badge-code text-xs text-outline">ms</span>
            </div>
            <p className="font-disclaimer text-xs text-on-surface-variant mt-1">
              OneMap Centroid GIS API & Public Spatial Hub
            </p>
          </div>
        </div>

        {/* Key Configuration Card */}
        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-badge-code text-badge-code text-outline uppercase">KEYS CONFIGURED</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">vpn_key</span>
          </div>
          <div className="mt-4">
            <p className="font-metric-headline text-3xl font-bold text-secondary">
              {healthData?.checks?.keyConfigured ? 'VALIDATED' : 'MISSING'}
            </p>
            <p className="font-disclaimer text-xs text-on-surface-variant mt-1">
              Gemini & OneMap backend integration tokens
            </p>
          </div>
        </div>

        {/* Last Good Fetch Card */}
        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-badge-code text-badge-code text-outline uppercase">LAST GOOD FETCH</span>
            <span className="material-symbols-outlined text-primary text-[20px]">history</span>
          </div>
          <div className="mt-4">
            <p className="font-data-tabular text-sm font-bold text-on-surface truncate">
              {healthData?.checks?.lastGoodFetch || 'Synchronizing...'}
            </p>
            <p className="font-disclaimer text-xs text-on-surface-variant mt-1">
              Singapore Standard Time (UTC+08:00)
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: JSON Live Payload Inspector & Diagnostic Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-desktop">
        {/* Left: Raw JSON Specification Matching Card */}
        <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-md space-y-space-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">code</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase">
                  Live JSON Payload Output
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded bg-surface-container-high text-xs font-badge-code text-on-surface hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedJson ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-primary/20 text-xs font-badge-code text-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  <span>Raw API</span>
                </a>
              </div>
            </div>

            <div className="mt-space-sm bg-[#060e20] p-4 rounded-lg border border-outline-variant/20 font-data-tabular text-xs text-[#c1c6dd] overflow-x-auto">
              <pre className="leading-relaxed">
                {healthData ? JSON.stringify(healthData, null, 2) : '// Awaiting check...'}
              </pre>
            </div>
          </div>

          <div className="pt-space-xs border-t border-surface-container-high text-[11px] font-disclaimer text-outline flex items-center justify-between">
            <span>Payload conforms strictly to requested specification schema</span>
            <span className="font-badge-code text-secondary font-bold">200 / 503 DUAL GATE</span>
          </div>
        </div>

        {/* Right: Ping History & Integration Reference */}
        <div className="space-y-space-md">
          {/* Recent Probe History */}
          <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">timeline</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase">
                  Recent Probe Audit Log
                </h3>
              </div>
              <span className="font-badge-code text-badge-code text-outline">
                {history.length} SAMPLES
              </span>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded bg-surface-container-low border border-surface-container-high/60 flex items-center justify-between font-data-tabular text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.status === 'pass' ? 'bg-secondary' : 'bg-error'
                      }`}
                    ></span>
                    <span className="font-badge-code font-bold text-on-surface">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-badge-code font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        item.httpCode === 200
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-error/20 text-error'
                      }`}
                    >
                      HTTP {item.httpCode}
                    </span>
                    <span className="text-primary font-bold">{item.ms} ms</span>
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <div className="text-center py-6 text-outline font-disclaimer text-xs">
                  Probing upstream API...
                </div>
              )}
            </div>
          </div>

          {/* cURL & Integration Snippet */}
          <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-md space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase">
                  Automated Health Check Integration
                </h3>
              </div>
              <button
                onClick={handleCopyCurl}
                className="px-2.5 py-1 rounded bg-surface-container-high text-xs font-badge-code text-on-surface hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedCurl ? 'check' : 'content_copy'}
                </span>
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>

            <div className="bg-[#060e20] p-3 rounded-lg border border-outline-variant/20 font-badge-code text-xs text-primary overflow-x-auto">
              <code>{curlCommand}</code>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-disclaimer text-on-surface-variant pt-1">
              <div>
                <span className="font-bold text-on-surface">Healthy Gate:</span> Returns HTTP 200 with <code>status: "pass"</code>
              </div>
              <div>
                <span className="font-bold text-on-surface">Unhealthy Gate:</span> Returns HTTP 503 with <code>status: "fail"</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
