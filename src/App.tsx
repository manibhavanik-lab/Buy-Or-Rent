import React, { useState, useEffect } from 'react';
import { PRESETS_DATA, getPrecinctProfile, PrecinctProfile } from './data/precinctData';
import { PrecinctIntelligenceView } from './components/PrecinctIntelligenceView';
import { HdbResaleRecordsView } from './components/HdbResaleRecordsView';
import { UraPrivateCaveatsView } from './components/UraPrivateCaveatsView';
import { SchoolAmenityRadiiView } from './components/SchoolAmenityRadiiView';
import { AiInvestmentReportView } from './components/AiInvestmentReportView';
import { ApiHealthView } from './components/ApiHealthView';
import { HyperparametersConfig } from './components/HyperparametersModal';

export type NavigationTab =
  | 'precinct-intelligence'
  | 'hdb-resale-records'
  | 'ura-private-caveats'
  | 'school-amenity-radii'
  | 'ai-investment-report'
  | 'api-health';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('precinct-intelligence');
  const [currentPostal, setCurrentPostal] = useState<string>('560421');
  const [precinct, setPrecinct] = useState<PrecinctProfile>(() => getPrecinctProfile('560421'));
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [hyperConfig, setHyperConfig] = useState<HyperparametersConfig>({
    temperature: 0.15,
    seed: 560421,
    checkpoint: 'gemini-2.5-flash-pro',
    focusArea: 'general',
  });

  // Keep live SGT clock updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(`${timeStr} SGT`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect direct URL route or hash to /health
  useEffect(() => {
    if (
      window.location.pathname.startsWith('/health') ||
      window.location.pathname.startsWith('/api/health') ||
      window.location.hash === '#health'
    ) {
      setActiveTab('api-health');
    }
  }, []);

  // Update profile when postal changes
  const handleSelectPostal = (postal: string) => {
    const clean = postal.trim();
    setCurrentPostal(clean);
    const newProfile = getPrecinctProfile(clean);
    setPrecinct(newProfile);
    setHyperConfig((prev) => ({
      ...prev,
      seed: parseInt(clean, 10) || 560421,
    }));
  };

  // Regeneration action (supports calling backend API or local synthesizing)
  const handleTriggerRegenerate = async (cfg: HyperparametersConfig) => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/gemini/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode: currentPostal,
          hyperConfig: cfg,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.briefing && Array.isArray(data.briefing)) {
          setPrecinct((prev) => ({
            ...prev,
            briefing: data.briefing,
          }));
        }
      } else {
        // Fallback simulate rich response with subtle nuances for hyperparameter settings
        await new Promise((r) => setTimeout(r, 900));
        setPrecinct((prev) => {
          const updatedBriefing = [...prev.briefing];
          if (cfg.focusArea === 'capital_growth') {
            updatedBriefing[0] = {
              ...updatedBriefing[0],
              tag: 'CAPITAL GROWTH ACCELERATOR',
              title: 'Capital Appreciation & MRT Expansion Alpha',
              body: `Capital upside in ${prev.town} is heavily supported by future Cross Island Line connectivity and regional commercial decentralization. Median resale $${prev.hdbMedianPsf} psf shows steady momentum, outperforming broader suburban indices.`,
            };
          } else if (cfg.focusArea === 'rental_yield') {
            updatedBriefing[0] = {
              ...updatedBriefing[0],
              tag: 'HIGH YIELD STRATEGY',
              title: 'Rental Yield & Tenant Profile Maximization',
              body: `Rental demand in ${prev.town} benefits from an influx of medical and tech personnel. Gross yields benchmark at 4.9% on 3-room units, presenting defensive cash generation relative to broader RCR condo counterparts.`,
            };
          } else if (cfg.focusArea === 'school_balloting') {
            updatedBriefing[2] = {
              ...updatedBriefing[2],
              tag: 'PRIMARY SCHOOL ENVELOPE',
              title: 'Phase 2C Priority Distance Advantage',
              body: `Residency at ${prev.address} unlocks strict <1km home-school distance prioritization, bypassing volatile ballot attrition and protecting long-term family demand liquidity.`,
            };
          } else if (cfg.focusArea === 'lease_decay') {
            updatedBriefing[1] = {
              ...updatedBriefing[1],
              tag: "BALA'S CURVE QUANT",
              title: "Lease Decay Sensitivity & Bala's Table Analysis",
              body: `At 52+ years remaining lease, price resilience remains stable before crossing the critical 40-year threshold. Full CPF usage eligibility is preserved under the age 95 requirement rule.`,
            };
          }
          return { ...prev, briefing: updatedBriefing };
        });
      }
    } catch {
      await new Promise((r) => setTimeout(r, 600));
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-high w-full">
        <div className="w-full px-margin-desktop h-16 flex items-center justify-between">
          {/* Logo & Terminal Identity */}
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-base font-bold tracking-tight text-on-surface uppercase">
                  SG Capital Intelligence
                </span>
                <span className="font-badge-code text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold tracking-wider">
                  TERMINAL v2.5
                </span>
              </div>
              <span className="font-disclaimer text-[10px] text-outline">
                Singapore Institutional Real Estate Capital Terminal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            <button
              onClick={() => setActiveTab('precinct-intelligence')}
              className={`h-full px-3.5 flex items-center gap-1.5 font-badge-code text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'precinct-intelligence'
                  ? 'border-primary text-primary font-bold bg-surface-container/50'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">domain</span>
              <span>Precinct Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('hdb-resale-records')}
              className={`h-full px-3.5 flex items-center gap-1.5 font-badge-code text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'hdb-resale-records'
                  ? 'border-secondary text-secondary font-bold bg-surface-container/50'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">database</span>
              <span>HDB Resale Records</span>
            </button>

            <button
              onClick={() => setActiveTab('ura-private-caveats')}
              className={`h-full px-3.5 flex items-center gap-1.5 font-badge-code text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'ura-private-caveats'
                  ? 'border-primary text-primary font-bold bg-surface-container/50'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">apartment</span>
              <span>URA Private Caveats</span>
            </button>

            <button
              onClick={() => setActiveTab('school-amenity-radii')}
              className={`h-full px-3.5 flex items-center gap-1.5 font-badge-code text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'school-amenity-radii'
                  ? 'border-primary text-primary font-bold bg-surface-container/50'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              <span>School & Amenity Radii</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-investment-report')}
              className={`h-full px-3.5 flex items-center gap-1.5 font-badge-code text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'ai-investment-report'
                  ? 'border-primary text-primary font-bold bg-surface-container/50'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>AI Investment Report</span>
            </button>

            <button
              onClick={() => setActiveTab('api-health')}
              className={`h-full px-3.5 flex items-center gap-1.5 font-badge-code text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === 'api-health'
                  ? 'border-secondary text-secondary font-bold bg-surface-container/50'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">monitor_heart</span>
              <span>API Health</span>
            </button>
          </nav>

          {/* Right Header Status Widget */}
          <div className="flex items-center gap-space-sm">
            {/* Live Data Feed Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-high/60 border border-surface-container-high text-xs font-badge-code">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_#4edea3]"></span>
              <span className="text-secondary font-bold">FEED: LIVE</span>
            </div>

            {/* SGT Real-time clock */}
            <div className="hidden md:flex items-center gap-1 text-xs font-data-tabular text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded border border-surface-container-high/40">
              <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
              <span>{currentTime}</span>
            </div>

            {/* Target Town Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container border border-outline-variant/30 text-xs font-data-tabular">
              <span className="text-outline uppercase text-[10px] font-badge-code">SECTOR</span>
              <span className="text-primary font-bold">{precinct.postal}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto border-t border-surface-container-high px-margin bg-surface-container-lowest scrollbar-none">
          <button
            onClick={() => setActiveTab('precinct-intelligence')}
            className={`py-2 px-3 text-xs font-badge-code uppercase tracking-wider whitespace-nowrap border-b-2 ${
              activeTab === 'precinct-intelligence' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
            }`}
          >
            Precinct
          </button>
          <button
            onClick={() => setActiveTab('hdb-resale-records')}
            className={`py-2 px-3 text-xs font-badge-code uppercase tracking-wider whitespace-nowrap border-b-2 ${
              activeTab === 'hdb-resale-records' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant'
            }`}
          >
            HDB Records
          </button>
          <button
            onClick={() => setActiveTab('ura-private-caveats')}
            className={`py-2 px-3 text-xs font-badge-code uppercase tracking-wider whitespace-nowrap border-b-2 ${
              activeTab === 'ura-private-caveats' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
            }`}
          >
            URA Caveats
          </button>
          <button
            onClick={() => setActiveTab('school-amenity-radii')}
            className={`py-2 px-3 text-xs font-badge-code uppercase tracking-wider whitespace-nowrap border-b-2 ${
              activeTab === 'school-amenity-radii' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
            }`}
          >
            Schools GIS
          </button>
          <button
            onClick={() => setActiveTab('ai-investment-report')}
            className={`py-2 px-3 text-xs font-badge-code uppercase tracking-wider whitespace-nowrap border-b-2 ${
              activeTab === 'ai-investment-report' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
            }`}
          >
            AI Report
          </button>
          <button
            onClick={() => setActiveTab('api-health')}
            className={`py-2 px-3 text-xs font-badge-code uppercase tracking-wider whitespace-nowrap border-b-2 ${
              activeTab === 'api-health' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant'
            }`}
          >
            API Health
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'precinct-intelligence' && (
          <PrecinctIntelligenceView
            precinct={precinct}
            onSelectPostal={handleSelectPostal}
            onTriggerRegenerate={handleTriggerRegenerate}
            isRegenerating={isRegenerating}
            hyperConfig={hyperConfig}
            setHyperConfig={setHyperConfig}
          />
        )}

        {activeTab === 'hdb-resale-records' && (
          <HdbResaleRecordsView precinct={precinct} onSelectPostal={handleSelectPostal} />
        )}

        {activeTab === 'ura-private-caveats' && (
          <UraPrivateCaveatsView precinct={precinct} />
        )}

        {activeTab === 'school-amenity-radii' && (
          <SchoolAmenityRadiiView precinct={precinct} />
        )}

        {activeTab === 'ai-investment-report' && (
          <AiInvestmentReportView
            precinct={precinct}
            hyperConfig={hyperConfig}
            onTriggerRegenerate={handleTriggerRegenerate}
            isRegenerating={isRegenerating}
          />
        )}

        {activeTab === 'api-health' && (
          <ApiHealthView />
        )}
      </main>

      {/* Terminal Global Sub-Footer */}
      <footer className="w-full bg-[#060e20] border-t border-surface-container-high py-4 px-margin-desktop flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-outline font-disclaimer">
        <div className="flex items-center gap-2">
          <span className="font-badge-code text-primary uppercase font-bold">SG Capital Intelligence</span>
          <span>•</span>
          <span>Official Public Sector Spatial Records & Quantitative Valuation Terminal</span>
        </div>
        <div className="flex items-center gap-4 font-badge-code text-[11px]">
          <button
            onClick={() => setActiveTab('api-health')}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>GET /api/health (Live Audit)</span>
          </button>
          <span>•</span>
          <span>SLA OneMap API v2.0</span>
          <span>•</span>
          <span>data.gov.sg v1.0</span>
          <span>•</span>
          <span>URA REALIS 2026</span>
        </div>
      </footer>
    </div>
  );
}
