import type { Request, Response } from 'express';

export interface UpstreamCheck {
  status: 'pass' | 'fail';
  httpCode: number;
  ms: number;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'pass' | 'fail';
  time: string;
  checks: {
    keyConfigured: boolean;
    upstream: UpstreamCheck;
    lastGoodFetch: string;
  };
}

export function getSingaporeIsoString(date = new Date()): string {
  // SGT is UTC+8
  const sgtOffset = 8 * 60; // in minutes
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const sgtDate = new Date(utc + (sgtOffset * 60000));

  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = sgtDate.getFullYear();
  const month = pad(sgtDate.getMonth() + 1);
  const day = pad(sgtDate.getDate());
  const hours = pad(sgtDate.getHours());
  const minutes = pad(sgtDate.getMinutes());
  const seconds = pad(sgtDate.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
}

// In-memory state tracking last successful upstream fetch
let lastGoodFetchTimestamp: string = getSingaporeIsoString();

export async function checkApiHealth(options: { simulateFail?: boolean } = {}): Promise<{
  httpCode: number;
  data: HealthCheckResponse;
}> {
  const currentTime = getSingaporeIsoString();
  const keyConfigured = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.URA_ACCESS_KEY ||
    process.env.ONEMAP_API_KEY
  );

  // Forced simulation for test harnesses and SRE verification
  if (options.simulateFail) {
    return {
      httpCode: 503,
      data: {
        status: 'fail',
        time: currentTime,
        checks: {
          keyConfigured,
          upstream: {
            status: 'fail',
            httpCode: 503,
            ms: 0,
            error: 'Simulated 503 dependency degradation',
          },
          lastGoodFetch: lastGoodFetchTimestamp,
        },
      },
    };
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    // Ping OneMap Singapore public spatial data API centroid
    const upstreamRes = await fetch(
      'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=560421&returnGeom=Y&getAddrDetails=Y',
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SGCapitalIntelligence-HealthAudit/2.5',
        },
      }
    );
    clearTimeout(timeoutId);

    const ms = Math.max(1, Date.now() - startTime);
    const isUpstreamOk = upstreamRes.ok;

    if (isUpstreamOk) {
      lastGoodFetchTimestamp = currentTime;
    }

    const isHealthy = keyConfigured && isUpstreamOk;

    return {
      httpCode: isHealthy ? 200 : 503,
      data: {
        status: isHealthy ? 'pass' : 'fail',
        time: currentTime,
        checks: {
          keyConfigured,
          upstream: {
            status: isUpstreamOk ? 'pass' : 'fail',
            httpCode: upstreamRes.status,
            ms,
          },
          lastGoodFetch: lastGoodFetchTimestamp,
        },
      },
    };
  } catch (err: any) {
    const ms = Math.max(1, Date.now() - startTime);
    return {
      httpCode: 503,
      data: {
        status: 'fail',
        time: currentTime,
        checks: {
          keyConfigured,
          upstream: {
            status: 'fail',
            httpCode: 503,
            ms,
            error: err?.message || 'Upstream connection error',
          },
          lastGoodFetch: lastGoodFetchTimestamp,
        },
      },
    };
  }
}

/**
 * Generates a clean, standalone HTML page for browser visits to /api/health
 */
export function renderHealthHtml(data: HealthCheckResponse, httpCode: number): string {
  const isHealthy = httpCode === 200;
  const statusColor = isHealthy ? '#4edea3' : '#ffb4ab';
  const statusBg = isHealthy ? 'rgba(78, 222, 163, 0.12)' : 'rgba(255, 180, 171, 0.12)';
  const statusBorder = isHealthy ? 'rgba(78, 222, 163, 0.3)' : 'rgba(255, 180, 171, 0.3)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Health Status - SG Capital Intelligence</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0c1322;
      color: #dae2fd;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 32px 16px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 680px;
      background: #111a2d;
      border: 1px solid rgba(138, 145, 168, 0.25);
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(138, 145, 168, 0.2);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .title-group h1 {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #dae2fd;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .title-group p {
      font-size: 12px;
      color: #8a91a8;
      margin-top: 4px;
      font-family: 'JetBrains Mono', monospace;
    }
    .status-badge {
      padding: 6px 14px;
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: ${statusColor};
      background: ${statusBg};
      border: 1px solid ${statusBorder};
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${statusColor};
      box-shadow: 0 0 8px ${statusColor};
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .card {
      background: #162036;
      border: 1px solid rgba(138, 145, 168, 0.15);
      border-radius: 10px;
      padding: 14px;
    }
    .card-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #8a91a8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .card-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      margin-top: 6px;
      color: #8cd0ef;
    }
    .json-box {
      background: #060e20;
      border: 1px solid rgba(138, 145, 168, 0.2);
      border-radius: 10px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #c1c6dd;
      overflow-x: auto;
      line-height: 1.5;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      transition: background 0.15s ease;
    }
    .btn-primary {
      background: #8cd0ef;
      color: #003547;
    }
    .btn-primary:hover {
      background: #38c0de;
    }
    .btn-secondary {
      background: #212c45;
      color: #dae2fd;
      border: 1px solid rgba(138, 145, 168, 0.25);
    }
    .btn-secondary:hover {
      background: #2a3754;
    }
    .toggle-link {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: #8a91a8;
      text-decoration: none;
    }
    .toggle-link:hover {
      color: #8cd0ef;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title-group">
        <h1>API Health Monitor</h1>
        <p>GET /api/health → HTTP ${httpCode}</p>
      </div>
      <div class="status-badge">
        <span class="pulse-dot"></span>
        <span>${data.status.toUpperCase()} (${httpCode})</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-label">Key Configured</div>
        <div class="card-val" style="color: ${data.checks.keyConfigured ? '#4edea3' : '#ffb4ab'}">
          ${data.checks.keyConfigured ? 'TRUE (Active)' : 'FALSE'}
        </div>
      </div>
      <div class="card">
        <div class="card-label">Upstream Status</div>
        <div class="card-val" style="color: ${data.checks.upstream.status === 'pass' ? '#4edea3' : '#ffb4ab'}">
          ${data.checks.upstream.status.toUpperCase()} (${data.checks.upstream.httpCode})
        </div>
      </div>
      <div class="card">
        <div class="card-label">Upstream Latency</div>
        <div class="card-val">${data.checks.upstream.ms} ms</div>
      </div>
      <div class="card">
        <div class="card-label">Timezone</div>
        <div class="card-val">SGT (+08:00)</div>
      </div>
    </div>

    <div class="card-label" style="margin-bottom: 8px;">Raw JSON Response:</div>
    <pre class="json-box"><code>${JSON.stringify(data, null, 2)}</code></pre>

    <div class="actions">
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-primary" onclick="window.location.reload()">Refresh Check</button>
        <a class="btn btn-secondary" href="/api/health?format=json">View Raw JSON</a>
        <a class="btn btn-secondary" href="/">Open App Terminal</a>
      </div>
      <div>
        ${
          isHealthy
            ? '<a class="toggle-link" href="/api/health?simulate=503&format=html">Simulate 503 Outage &rarr;</a>'
            : '<a class="toggle-link" href="/api/health?format=html">Clear Simulation &rarr;</a>'
        }
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Express Route Handler for GET /api/health
 */
export async function healthCheckHandler(req: Request, res: Response) {
  const simulateFail = req.query.simulate === '503' || req.query.simulate === 'fail';
  const { httpCode, data } = await checkApiHealth({ simulateFail });

  // If client explicitly requests HTML or query specifies format=html
  const wantsHtml = req.query.format === 'html' || (
    req.headers.accept?.includes('text/html') &&
    !req.headers.accept?.includes('application/json') &&
    req.query.format !== 'json' &&
    !req.xhr
  );

  if (wantsHtml) {
    res.status(httpCode);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(renderHealthHtml(data, httpCode));
  }

  // Standard JSON response matching exact schema:
  // 200 when healthy, 503 when not
  res.status(httpCode);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.json(data);
}
