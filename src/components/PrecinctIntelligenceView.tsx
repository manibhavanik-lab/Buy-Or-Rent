import React, { useState } from 'react';
import { PrecinctProfile } from '../data/precinctData';
import { Svy21CadModal } from './Svy21CadModal';
import { HyperparametersModal, HyperparametersConfig } from './HyperparametersModal';
import { ViewAllCaveatsModal } from './ViewAllCaveatsModal';
import { PdfExportModal } from './PdfExportModal';

interface Props {
  precinct: PrecinctProfile;
  onSelectPostal: (postal: string) => void;
  onTriggerRegenerate: (config: HyperparametersConfig) => Promise<void>;
  isRegenerating: boolean;
  hyperConfig: HyperparametersConfig;
  setHyperConfig: React.Dispatch<React.SetStateAction<HyperparametersConfig>>;
}

export const PrecinctIntelligenceView: React.FC<Props> = ({
  precinct,
  onSelectPostal,
  onTriggerRegenerate,
  isRegenerating,
  hyperConfig,
  setHyperConfig,
}) => {
  const [searchInput, setSearchInput] = useState(precinct.postal);
  const [hdbFlatFilter, setHdbFlatFilter] = useState<'3-4' | '5' | 'ALL'>('3-4');
  const [cadModalOpen, setCadModalOpen] = useState(false);
  const [hyperModalOpen, setHyperModalOpen] = useState(false);
  const [caveatsModalOpen, setCaveatsModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [spatialRingMode, setSpatialRingMode] = useState<'1km' | '2km' | 'both'>('both');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim().length >= 3) {
      onSelectPostal(searchInput.trim());
    }
  };

  const handleDownloadCsv = () => {
    const headers = ['Development', 'Tenure', 'Unit Type', 'Floor Area (sqft)', 'Price (SGD)', 'PSF (SGD)', 'District'];
    const rows = precinct.uraCaveats.map((c) => [
      `"${c.development}"`,
      `"${c.tenure}"`,
      `"${c.unitType}"`,
      c.floorAreaSqft,
      c.price,
      c.psf,
      `"${c.district}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `URA_REALIS_${precinct.postal}_CAVEATS.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(precinct, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SG_CAPITAL_${precinct.postal}_DOSSIER.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter HDB caveats according to filter
  const displayedHdbCaveats = precinct.hdbCaveats.filter((c) => {
    if (hdbFlatFilter === '3-4') return c.flatType.includes('3') || c.flatType.includes('4');
    if (hdbFlatFilter === '5') return c.flatType.includes('5') || c.flatType.includes('EXEC');
    return true;
  }).slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Top Search & Active Precinct Overview */}
      <section className="w-full px-margin-desktop py-space-md bg-surface-container-lowest">
        <div className="flex flex-col gap-space-md">
          {/* Search Bar & Presets */}
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm flex-1 max-w-3xl">
              <div className="relative flex-1 flex items-center bg-surface-container-high rounded px-space-md py-2.5 shadow-sm border border-transparent focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-[20px] mr-space-sm">pin_drop</span>
                <input
                  id="postal-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter 6-digit Postal Code..."
                  className="w-full bg-transparent font-data-tabular text-data-tabular text-on-surface focus:outline-none tracking-wide uppercase placeholder:text-outline"
                />
                <button
                  type="submit"
                  id="search-btn"
                  className="ml-space-sm bg-primary hover:bg-[#38c0de] text-on-primary px-3 py-1 rounded font-badge-code text-badge-code uppercase tracking-wider flex items-center gap-1 transition-transform active:scale-95 cursor-pointer font-bold"
                >
                  <span>SCAN</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              {/* Quick Preset Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('560421');
                    onSelectPostal('560421');
                  }}
                  className={`preset-btn px-2.5 py-1.5 rounded font-badge-code text-badge-code transition-colors whitespace-nowrap shadow-sm cursor-pointer ${
                    precinct.postal === '560421'
                      ? 'bg-surface-variant text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  560421 AMK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('310150');
                    onSelectPostal('310150');
                  }}
                  className={`preset-btn px-2.5 py-1.5 rounded font-badge-code text-badge-code transition-colors whitespace-nowrap shadow-sm cursor-pointer ${
                    precinct.postal === '310150'
                      ? 'bg-surface-variant text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  310150 Toa Payoh
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('120401');
                    onSelectPostal('120401');
                  }}
                  className={`preset-btn px-2.5 py-1.5 rounded font-badge-code text-badge-code transition-colors whitespace-nowrap shadow-sm cursor-pointer ${
                    precinct.postal === '120401'
                      ? 'bg-surface-variant text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  120401 Clementi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('238882');
                    onSelectPostal('238882');
                  }}
                  className={`preset-btn px-2.5 py-1.5 rounded font-badge-code text-badge-code transition-colors whitespace-nowrap shadow-sm cursor-pointer ${
                    precinct.postal === '238882'
                      ? 'bg-surface-variant text-primary border border-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  238882 Orchard
                </button>
              </div>
            </form>

            {/* Terminal Status Pill */}
            <div className="flex items-center gap-space-sm shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-container-low shadow-inner border border-surface-container-high">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#4edea3]"></span>
                <span className="font-badge-code text-badge-code text-on-surface-variant">
                  GEO-HASH: <span className="text-secondary font-data-tabular">{precinct.geoHash}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Precinct Summary Headline Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md p-space-md bg-surface-container rounded-lg shadow-md relative overflow-hidden border border-outline-variant/30">
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
            <div className="flex items-start gap-space-sm z-10">
              <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center text-primary shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span id="precinct-address" className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                    {precinct.address}
                  </span>
                  <span id="precinct-badge" className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-primary font-medium tracking-wide uppercase">
                    TOWN: {precinct.town} • {precinct.region.toUpperCase()}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {precinct.cadastralLot} • {precinct.masterPlanGpr} • {precinct.microMarketZone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-md z-10 shrink-0">
              <div className="flex flex-col text-right">
                <span className="font-badge-code text-badge-code text-outline uppercase tracking-wider">Historical Caveats Ingested</span>
                <span className="font-data-tabular text-data-tabular text-on-surface font-bold">{precinct.historicalCaveatsCount}</span>
              </div>
              <button
                onClick={() => setCadModalOpen(true)}
                className="px-3 py-1.5 rounded bg-surface-variant hover:bg-surface-bright text-primary font-badge-code text-badge-code flex items-center gap-1.5 transition-colors cursor-pointer border border-primary/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">spatial_tracking</span>
                <span>SVY21 CAD View</span>
              </button>
            </div>
          </div>

          {/* Live API Gateway Microservices Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-xs">
            <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low border border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-badge-code text-badge-code text-on-surface-variant">HDB Resale (Data.gov.sg)</span>
              </div>
              <span className="font-badge-code text-badge-code text-secondary">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low border border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-badge-code text-badge-code text-on-surface-variant">URA Space API</span>
              </div>
              <span className="font-badge-code text-badge-code text-primary">CACHED 300s</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low border border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-badge-code text-badge-code text-on-surface-variant">OneMap SLA API</span>
              </div>
              <span className="font-badge-code text-badge-code text-on-surface">WGS84/SVY21</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low border border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-badge-code text-badge-code text-on-surface-variant">Google Gemini 2.5 Flash</span>
              </div>
              <span className="font-badge-code text-badge-code text-primary font-bold">READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Overview Grid (Bento Style) */}
      <section className="w-full px-margin-desktop py-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter-desktop">
          {/* Card 1: HDB Resale PSF */}
          <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-md relative group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-badge-code text-badge-code text-outline uppercase tracking-wider">HDB RESALE MEDIAN</span>
              <span className="flex items-center text-secondary font-badge-code text-badge-code gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {precinct.hdbYoyChange}
              </span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-headline text-metric-headline text-on-surface tracking-tight">${precinct.hdbMedianPsf}</span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">/ sqft</span>
            </div>
            <div className="flex flex-col gap-1 mt-space-xs">
              <div className="flex justify-between items-center text-disclaimer font-disclaimer text-outline">
                <span>{precinct.hdbModelDescription}</span>
                <span>{precinct.hdbAvgTransacted}</span>
              </div>
              {/* Inline Sparkline SVG */}
              <div className="w-full h-8 flex items-end">
                <svg className="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" stroke="currentColor" viewBox="0 0 100 24">
                  <path
                    d={`M0 ${precinct.hdbSparkline[0]} L15 ${precinct.hdbSparkline[1]} L30 ${precinct.hdbSparkline[2]} L45 ${precinct.hdbSparkline[3]} L60 ${precinct.hdbSparkline[4]} L75 ${precinct.hdbSparkline[5]} L90 ${precinct.hdbSparkline[6]} L100 ${precinct.hdbSparkline[7] || 4}`}
                    strokeLinecap="round"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={`M0 ${precinct.hdbSparkline[0]} L15 ${precinct.hdbSparkline[1]} L30 ${precinct.hdbSparkline[2]} L45 ${precinct.hdbSparkline[3]} L60 ${precinct.hdbSparkline[4]} L75 ${precinct.hdbSparkline[5]} L90 ${precinct.hdbSparkline[6]} L100 ${precinct.hdbSparkline[7] || 4} L100 24 L0 24 Z`}
                    fill="currentColor"
                    fillOpacity="0.1"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Private Condominium PSF */}
          <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-md relative group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-badge-code text-badge-code text-outline uppercase tracking-wider">PRIVATE CONDO BENCHMARK</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-code text-badge-code text-primary">
                {precinct.privateDistrictCode}
              </span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-headline text-metric-headline text-primary tracking-tight">
                ${precinct.privateMedianPsf.toLocaleString()}
              </span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">/ sqft</span>
            </div>
            <div className="flex flex-col gap-1 mt-space-xs">
              <div className="flex justify-between items-center text-disclaimer font-disclaimer text-outline">
                <span>{precinct.privatePrecinctWeighting}</span>
                <span>{precinct.privateCaveatBase}</span>
              </div>
              <div className="w-full h-8 flex items-end">
                <svg className="w-full h-full text-primary" fill="none" preserveAspectRatio="none" stroke="currentColor" viewBox="0 0 100 24">
                  <path
                    d={`M0 ${precinct.privateSparkline[0]} L20 ${precinct.privateSparkline[1]} L40 ${precinct.privateSparkline[2]} L60 ${precinct.privateSparkline[3]} L80 ${precinct.privateSparkline[4]} L100 ${precinct.privateSparkline[5]}`}
                    strokeLinecap="round"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={`M0 ${precinct.privateSparkline[0]} L20 ${precinct.privateSparkline[1]} L40 ${precinct.privateSparkline[2]} L60 ${precinct.privateSparkline[3]} L80 ${precinct.privateSparkline[4]} L100 ${precinct.privateSparkline[5]} L100 24 L0 24 Z`}
                    fill="currentColor"
                    fillOpacity="0.1"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Price Spread Ratio */}
          <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-md relative group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-badge-code text-badge-code text-outline uppercase tracking-wider">HDB-TO-PRIVATE SPREAD</span>
              <span className="material-symbols-outlined text-outline text-[18px]">balance</span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-headline text-metric-headline text-on-surface tracking-tight">{precinct.spreadRatio}</span>
              <span className="font-data-tabular text-data-tabular text-secondary">Capital Delta</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-space-xs">
              <div className="w-full bg-surface-container-lowest h-2 rounded overflow-hidden flex">
                <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${precinct.spreadHdbPct}%` }}></div>
                <div className="bg-primary h-full transition-all duration-500" style={{ width: `${precinct.spreadPrivatePct}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-disclaimer font-disclaimer text-outline">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> HDB ${precinct.hdbMedianPsf}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Private ${precinct.privateMedianPsf.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Affordability Index */}
          <div className="bg-surface-container p-space-md rounded-xl flex flex-col justify-between shadow-md relative group hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-badge-code text-badge-code text-outline uppercase tracking-wider">AFFORDABILITY INDEX</span>
              <span className="px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary font-badge-code text-badge-code uppercase font-semibold">
                {precinct.affordabilityTier}
              </span>
            </div>
            <div className="flex items-baseline gap-space-xs my-space-xs">
              <span className="font-metric-headline text-metric-headline text-secondary tracking-tight">
                ${precinct.affordabilityMonthly.toLocaleString()}
              </span>
              <span className="font-data-tabular text-data-tabular text-on-surface-variant">/ mo est.</span>
            </div>
            <div className="flex flex-col gap-1 mt-space-xs">
              <div className="flex items-center justify-between text-disclaimer font-disclaimer text-outline">
                <span>CPF OA Max Coverage: ${precinct.cpfOaCoverage.toLocaleString()}</span>
                <span className="text-secondary">{precinct.cashOutflowStatus}</span>
              </div>
              <div className="flex items-center gap-1 text-disclaimer font-disclaimer text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[14px]">verified</span>
                <span>{precinct.loanPegDescription}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Transaction Analysis Panels (HDB & URA Realis) */}
      <section className="w-full px-margin-desktop py-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-desktop">
          {/* Table 1: HDB Resale Transactions */}
          <div className="bg-surface-container rounded-xl p-space-md shadow-md flex flex-col border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container">
              <div className="flex items-center gap-space-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">HDB Resale Caveats</h2>
                <span className="font-badge-code text-badge-code text-outline">data.gov.sg feed</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHdbFlatFilter(hdbFlatFilter === '3-4' ? 'ALL' : '3-4')}
                  className={`font-badge-code text-badge-code px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    hdbFlatFilter === '3-4'
                      ? 'text-secondary bg-surface-container-high'
                      : 'text-on-surface-variant bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  3-4 ROOM FLATS
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-outline uppercase font-badge-code text-badge-code">
                    <th className="py-2 px-3 font-semibold">Month</th>
                    <th className="py-2 px-3 font-semibold">Block / Street</th>
                    <th className="py-2 px-3 font-semibold">Model</th>
                    <th className="py-2 px-3 font-semibold text-right">Floor Area</th>
                    <th className="py-2 px-3 font-semibold text-right">Lease Bal</th>
                    <th className="py-2 px-3 font-semibold text-right">Price</th>
                    <th className="py-2 px-3 font-semibold text-right">Safe PSF</th>
                  </tr>
                </thead>
                <tbody className="divide-none">
                  {displayedHdbCaveats.map((c, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        idx % 2 === 0 ? 'bg-surface-container hover:bg-surface-container-high' : 'bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-on-surface whitespace-nowrap">{c.month}</td>
                      <td className="py-2.5 px-3 text-on-surface font-medium whitespace-nowrap">{c.blockStreet}</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">{c.model}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface whitespace-nowrap">
                        {c.floorAreaSqm} sqm <span className="text-outline text-disclaimer">({c.floorAreaSqft} sqft)</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-on-surface-variant whitespace-nowrap">
                        {c.leaseBalYears}y {c.leaseBalMonths.toString().padStart(2, '0')}m
                      </td>
                      <td className="py-2.5 px-3 text-right text-secondary font-bold whitespace-nowrap">
                        ${c.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-on-surface whitespace-nowrap">${c.safePsf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-disclaimer font-disclaimer text-outline">
              <span>* Safe PSF adjusts for remaining lease decay via Bala's Table algorithm</span>
              <button
                onClick={() => setCaveatsModalOpen(true)}
                className="hover:text-primary cursor-pointer transition-colors font-badge-code text-badge-code"
              >
                View 24 More Rows →
              </button>
            </div>
          </div>

          {/* Table 2: URA Private Caveats */}
          <div className="bg-surface-container rounded-xl p-space-md shadow-md flex flex-col border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container">
              <div className="flex items-center gap-space-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">URA Private Residential Caveats</h2>
                <span className="font-badge-code text-badge-code text-outline">REALIS Ingestion</span>
              </div>
              <span className="font-badge-code text-badge-code text-primary px-2 py-0.5 rounded bg-surface-container-high">
                {precinct.privateDistrictCode}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-outline uppercase font-badge-code text-badge-code">
                    <th className="py-2 px-3 font-semibold">Development</th>
                    <th className="py-2 px-3 font-semibold">Tenure</th>
                    <th className="py-2 px-3 font-semibold">Unit Type</th>
                    <th className="py-2 px-3 font-semibold text-right">Floor Area</th>
                    <th className="py-2 px-3 font-semibold text-right">Price (SGD)</th>
                    <th className="py-2 px-3 font-semibold text-right">PSF</th>
                  </tr>
                </thead>
                <tbody className="divide-none">
                  {precinct.uraCaveats.slice(0, 4).map((u, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        idx % 2 === 0 ? 'bg-surface-container hover:bg-surface-container-high' : 'bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-on-surface font-medium whitespace-nowrap">{u.development}</td>
                      <td className="py-2.5 px-3 text-on-surface-variant whitespace-nowrap">{u.tenure}</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">{u.unitType}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface whitespace-nowrap">{u.floorAreaSqft} sqft</td>
                      <td className="py-2.5 px-3 text-right text-primary font-bold whitespace-nowrap">
                        ${u.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-on-surface whitespace-nowrap">${u.psf.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-disclaimer font-disclaimer text-outline">
              <span>Official caveats filtered for &lt;1.5km geofence from Postal {precinct.postal}</span>
              <button
                onClick={handleDownloadCsv}
                className="hover:text-primary cursor-pointer transition-colors font-badge-code text-badge-code"
              >
                Download REALIS CSV →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OneMap GIS Radii & Accessibility Spatial Matrix */}
      <section className="w-full px-margin-desktop py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-desktop">
          {/* Col 1: Spatial Geofence Buffer Map */}
          <div className="lg:col-span-1 bg-surface-container rounded-xl p-space-md shadow-md flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Spatial Geofence Buffer</span>
              </div>
              <span className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-secondary">
                SLA ONEMAP
              </span>
            </div>

            {/* OneMap Map Container with the image from the user prompt */}
            <div
              className="w-full h-64 rounded-lg bg-cover bg-center relative overflow-hidden flex flex-col justify-end p-space-sm shadow-inner group"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAOv7ItS4mprSHScglP1c0wxng4iZJIUV_a-_mKMIomqwhIfkuvmc2ttt1fs6aAkq203gVZP_LKQf7vEDTIFsUVYJobpd711BEnLyDkkgUZP-bkwo89v4NI4eaL0KqewrV8eUbOsWlzT8Pd_KEO25tUrac0GNFO21ijZxITUhzO2nOFyOBUKkFFLyZxgHp-uHtPoPf9GS_p38HZN9h2sbmZ5FmwOrHeESKhKu6N8ISuZmKKnPC25zVK')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

              {/* Crosshair graphic overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {spatialRingMode !== '1km' && (
                  <div className="w-44 h-44 rounded-full border border-primary/30 flex items-center justify-center animate-ping opacity-60" style={{ animationDuration: '4s' }}></div>
                )}
                {spatialRingMode !== '2km' && (
                  <div className="w-24 h-24 rounded-full border border-secondary/50 flex items-center justify-center bg-secondary/5"></div>
                )}
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-primary text-[18px]">adjust</span>
                </div>
              </div>

              {/* Interactive toggle for 1km vs 2km rings */}
              <div className="absolute top-2 right-2 z-20 flex gap-1 bg-surface-container-low/80 backdrop-blur p-1 rounded">
                <button
                  type="button"
                  onClick={() => setSpatialRingMode(spatialRingMode === '1km' ? 'both' : '1km')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-badge-code transition-colors cursor-pointer ${
                    spatialRingMode === '1km' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  1KM
                </button>
                <button
                  type="button"
                  onClick={() => setSpatialRingMode(spatialRingMode === '2km' ? 'both' : '2km')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-badge-code transition-colors cursor-pointer ${
                    spatialRingMode === '2km' ? 'bg-secondary text-[#003824] font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  2KM
                </button>
              </div>

              <div className="relative z-10 flex items-center justify-between bg-surface-container-low/90 backdrop-blur-md px-space-sm py-1.5 rounded border border-outline-variant/30">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-badge-code text-badge-code text-on-surface">Cadastral Core {precinct.postal}</span>
                </div>
                <span className="font-badge-code text-badge-code text-primary uppercase">
                  {spatialRingMode === 'both' ? '1KM / 2KM RINGS ACTIVE' : `${spatialRingMode.toUpperCase()} RING ACTIVE`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-disclaimer font-disclaimer text-outline mt-space-sm">
              <span>Projection: SVY21 Singapore Transverse Mercator</span>
              <span className="font-data-tabular">EPSG:3414</span>
            </div>
          </div>

          {/* Col 2: Primary Schools MOE Priority Rings */}
          <div className="lg:col-span-1 bg-surface-container rounded-xl p-space-md shadow-md flex flex-col border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">MOE School Priority Radii</h3>
              </div>
              <span className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-outline">
                Phase 2C Vector
              </span>
            </div>
            <div className="flex flex-col gap-space-sm flex-1 justify-around">
              {precinct.schools.slice(0, 4).map((s, idx) => (
                <div
                  key={idx}
                  className="p-space-sm rounded bg-surface-container-low flex items-center justify-between hover:bg-surface-container-high transition-colors border border-outline-variant/10"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{s.name}</span>
                      {s.tag === 'SAP' && (
                        <span className="font-badge-code text-badge-code text-error bg-error-container/20 px-1 py-0.2 rounded font-bold">
                          SAP
                        </span>
                      )}
                      {s.isPrimaryChoice && !s.tag && (
                        <span className="material-symbols-outlined text-primary text-[16px]">stars</span>
                      )}
                    </div>
                    <span className="font-disclaimer text-disclaimer text-outline">{s.pathway}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`font-badge-code text-badge-code px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                        s.distanceCategory === 'Within 1km'
                          ? 'text-primary bg-surface-container-highest'
                          : 'text-on-surface-variant bg-surface-container-highest'
                      }`}
                    >
                      {s.distanceCategory}
                    </span>
                    <span
                      className={`font-data-tabular text-data-tabular mt-0.5 ${
                        s.ballotRisk.includes('Ballot Risk')
                          ? 'text-error'
                          : s.ballotRisk.includes('Priority')
                          ? 'text-secondary font-medium'
                          : 'text-secondary'
                      }`}
                    >
                      {s.ballotRisk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Transit & Lifestyle Connectivity */}
          <div className="lg:col-span-1 bg-surface-container rounded-xl p-space-md shadow-md flex flex-col border border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">directions_walk</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Transit & Lifestyle Access</h3>
              </div>
              <span className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-secondary">
                LTA DATAMALL
              </span>
            </div>
            <div className="flex flex-col gap-space-sm flex-1 justify-around">
              {precinct.transits.map((t) => (
                <div key={t.id} className="p-space-sm rounded bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                  <div className="flex items-center gap-space-sm">
                    {t.type === 'mrt' && t.mrtLines && (
                      <div className="flex items-center gap-1">
                        {t.mrtLines.map((line, lIdx) => (
                          <span
                            key={lIdx}
                            style={{ backgroundColor: line.bg, color: line.color }}
                            className="px-1.5 py-0.5 rounded font-badge-code text-badge-code font-bold"
                          >
                            {line.code}
                          </span>
                        ))}
                      </div>
                    )}
                    {t.type === 'market' && (
                      <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                      </div>
                    )}
                    {t.type === 'park' && (
                      <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[18px]">park</span>
                      </div>
                    )}
                    {t.type === 'bus' && (
                      <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{t.name}</span>
                      <span className="font-disclaimer text-disclaimer text-outline">{t.subtitle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-data-tabular text-data-tabular text-on-surface font-bold">{t.distanceMeters}m</span>
                    <span className="font-disclaimer text-disclaimer text-secondary">{t.walkTimeMins} mins walk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Google Gemini AI Property Intelligence Generator */}
      <section className="w-full px-margin-desktop py-space-lg">
        <div className="bg-surface-container-low rounded-xl p-space-lg shadow-lg relative overflow-hidden border border-outline-variant/30">
          {/* Glow accent */}
          <div className="absolute top-0 right-1/4 w-96 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header & Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md border-b border-surface-container-high">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                    Gemini 2.5 Flash Capital Briefing
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-badge-code text-badge-code uppercase font-semibold">
                    AI Synthesized Model
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Real-time analytical dossier synthesized for Postal {precinct.postal} using official SLA, URA & HDB open datasets.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-xs flex-wrap">
              <button
                id="regenerate-btn"
                disabled={isRegenerating}
                onClick={() => onTriggerRegenerate(hyperConfig)}
                className="px-3.5 py-2 rounded bg-primary hover:bg-[#38c0de] text-on-primary font-badge-code text-badge-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${isRegenerating ? 'animate-spin' : ''}`}>
                  {isRegenerating ? 'progress_activity' : 'sync'}
                </span>
                <span>{isRegenerating ? 'Synthesizing Dossier...' : 'Regenerate Analysis (gemini-2.5-flash)'}</span>
              </button>

              <button
                onClick={() => setPdfModalOpen(true)}
                className="px-3 py-2 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-badge-code text-badge-code flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>Download PDF Dossier</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-3 py-2 rounded bg-surface-container-high hover:bg-surface-variant text-outline hover:text-on-surface font-badge-code text-badge-code flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px]">data_object</span>
                <span>Export Raw JSON</span>
              </button>
            </div>
          </div>

          {/* Expandable Intelligence Briefing Content */}
          <div
            id="ai-content-area"
            className={`grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop mt-space-md transition-opacity duration-300 ${
              isRegenerating ? 'opacity-30' : 'opacity-100'
            }`}
          >
            {precinct.briefing.map((mod) => (
              <div
                key={mod.id}
                className="p-space-md rounded-lg bg-surface-container flex flex-col justify-between shadow-sm border border-outline-variant/20 hover:border-outline-variant/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-badge-code text-badge-code text-primary uppercase font-semibold tracking-wider">
                      {mod.moduleNumber}
                    </span>
                    <span className="font-badge-code text-badge-code text-outline">{mod.tag}</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-space-xs">
                    {mod.title}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
                    {mod.body}
                  </p>
                </div>
                <div className="flex items-center gap-space-sm p-space-xs rounded bg-surface-container-high text-disclaimer font-disclaimer text-outline border border-outline-variant/10">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      mod.metricBadge.highlightColor === 'secondary' ? 'text-secondary' : 'text-primary'
                    }`}
                  >
                    {mod.metricBadge.icon}
                  </span>
                  <span>{mod.metricBadge.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Micro Interactive Prompt Bar */}
          <div className="mt-space-md pt-space-md border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#4edea3]"></span>
              <span className="font-disclaimer text-disclaimer text-outline">
                Model Checkpoint: {hyperConfig.checkpoint} • Temperature {hyperConfig.temperature.toFixed(2)} • Seed #{hyperConfig.seed}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHyperModalOpen(true)}
              className="flex items-center gap-1.5 font-badge-code text-badge-code text-primary cursor-pointer hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Adjust Prompt Hyperparameters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mandatory Legal & Open Data Attribution Footer Section */}
      <section className="w-full px-margin-desktop py-space-md bg-surface-container-lowest">
        <div className="bg-surface-container-low rounded-lg p-space-md shadow-sm border border-outline-variant/20">
          <div className="flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">policy</span>
            <div className="flex flex-col gap-1">
              <span className="font-badge-code text-badge-code text-outline uppercase tracking-wider">
                Mandatory Legal & Open Data Licence Attribution
              </span>
              <p className="font-disclaimer text-disclaimer text-outline leading-relaxed">
                Contains public sector information from HDB Resale Transactions and URA Space accessed on February 2026, made available under the terms of the Singapore Open Data Licence version 1.0 (https://data.gov.sg/open-data-licence). Map data and location services provided by OneMap (https://www.onemap.gov.sg). AI insights generated via Google Gemini. This platform is an independent educational tool and is not officially affiliated with or endorsed by HDB, URA, SLA, or the Singapore Government.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <Svy21CadModal precinct={precinct} isOpen={cadModalOpen} onClose={() => setCadModalOpen(false)} />
      <HyperparametersModal
        isOpen={hyperModalOpen}
        onClose={() => setHyperModalOpen(false)}
        config={hyperConfig}
        onSave={(newCfg) => setHyperConfig(newCfg)}
      />
      <ViewAllCaveatsModal isOpen={caveatsModalOpen} onClose={() => setCaveatsModalOpen(false)} precinct={precinct} />
      <PdfExportModal isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} precinct={precinct} />
    </div>
  );
};
