import React, { useState } from 'react';
import { PrecinctProfile } from '../data/precinctData';

interface Props {
  precinct: PrecinctProfile;
  onSelectPostal: (postal: string) => void;
}

export const HdbResaleRecordsView: React.FC<Props> = ({ precinct, onSelectPostal }) => {
  const [selectedFlatType, setSelectedFlatType] = useState<string>('ALL');
  const [remainingLeaseFilter, setRemainingLeaseFilter] = useState<number>(45);
  const [balaSliderLease, setBalaSliderLease] = useState<number>(52);
  const [searchBlock, setSearchBlock] = useState<string>('');

  // Bala's Table approximation curve formula: percentage of freehold value based on remaining lease
  const calculateBalaPct = (years: number) => {
    if (years >= 99) return 100;
    if (years <= 0) return 0;
    // Approximating standard Singapore Land Authority (SLA) Bala's Table:
    // 99y = 100%, 60y = ~80%, 30y = ~60%, 10y = ~30%
    return Math.round(100 * Math.pow(years / 99, 0.42));
  };

  const currentBalaPct = calculateBalaPct(balaSliderLease);

  // Filter caveats
  const filteredCaveats = precinct.hdbCaveats.filter((c) => {
    if (selectedFlatType !== 'ALL' && !c.flatType.includes(selectedFlatType)) return false;
    if (c.leaseBalYears < remainingLeaseFilter) return false;
    if (searchBlock && !c.blockStreet.toLowerCase().includes(searchBlock.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full px-margin-desktop py-space-md space-y-space-md">
      {/* Top Banner */}
      <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">database</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              HDB Resale Records & Bala's Table Engine
            </h2>
            <span className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-secondary uppercase">
              data.gov.sg Ingestion
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Analyzing historical resale transactions for {precinct.town} across 1990 - 2026 with statutory lease decay adjustments.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="text-right">
            <span className="font-badge-code text-badge-code text-outline uppercase block">Current Town</span>
            <span className="font-data-tabular text-data-tabular text-primary font-bold">{precinct.town}</span>
          </div>
        </div>
      </div>

      {/* Bala's Table Interactive Calculator */}
      <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-md space-y-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container-high pb-space-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Interactive Bala's Table Lease Decay Simulator
            </h3>
          </div>
          <span className="font-disclaimer text-disclaimer text-outline">
            Singapore Land Authority (SLA) State Land Valuation Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop items-center">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-badge-code text-xs text-on-surface">REMAINING LEASE BALANCE:</label>
              <span className="font-data-tabular text-base font-bold text-primary">{balaSliderLease} Years</span>
            </div>
            <input
              type="range"
              min="10"
              max="99"
              value={balaSliderLease}
              onChange={(e) => setBalaSliderLease(parseInt(e.target.value, 10))}
              className="w-full accent-primary bg-surface-container h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-outline font-data-tabular">
              <span>10 Years (Extinction Risk)</span>
              <span>60Y Threshold</span>
              <span>99 Years (Full)</span>
            </div>
          </div>

          <div className="p-space-sm rounded bg-surface-container flex flex-col justify-center border border-outline-variant/20">
            <span className="font-badge-code text-[11px] text-outline uppercase">Bala's Equivalent Freehold Value</span>
            <p className="font-metric-headline text-2xl text-secondary mt-1">{currentBalaPct}%</p>
            <span className="font-disclaimer text-[11px] text-on-surface-variant">
              Asset retains {currentBalaPct}% of equivalent Freehold land value.
            </span>
          </div>

          <div className="p-space-sm rounded bg-surface-container flex flex-col justify-center border border-outline-variant/20">
            <span className="font-badge-code text-[11px] text-outline uppercase">CPF & Bank Financing Limits</span>
            <p className="font-body-sm text-xs font-semibold text-on-surface mt-1">
              {balaSliderLease >= 30 ? (
                <span className="text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Full CPF Housing Grant & HDB Loan Permitted
                </span>
              ) : (
                <span className="text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Restricted CPF Usage (&lt;30y remaining lease)
                </span>
              )}
            </p>
            <span className="font-disclaimer text-[11px] text-outline mt-0.5">
              Youngest buyer age + lease must be ≥ 95 to withdraw max CPF.
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm bg-surface-container p-space-sm rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', '3 ROOM', '4 ROOM', '5 ROOM', 'EXEC'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedFlatType(t)}
              className={`px-3 py-1.5 rounded text-xs font-badge-code transition-colors cursor-pointer ${
                selectedFlatType === t
                  ? 'bg-secondary text-[#003824] font-bold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="relative flex items-center bg-surface-container-lowest rounded px-space-sm py-1.5 border border-outline-variant/40">
            <span className="material-symbols-outlined text-outline text-[16px] mr-1">search</span>
            <input
              type="text"
              placeholder="Search block or street..."
              value={searchBlock}
              onChange={(e) => setSearchBlock(e.target.value)}
              className="bg-transparent font-data-tabular text-xs text-on-surface focus:outline-none w-48 placeholder:text-outline"
            />
          </div>
        </div>
      </div>

      {/* Detailed Caveats Table */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-md border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
          <thead>
            <tr className="bg-surface-container-high text-outline uppercase font-badge-code text-badge-code">
              <th className="py-2.5 px-3">Transaction Month</th>
              <th className="py-2.5 px-3">Block / Street Address</th>
              <th className="py-2.5 px-3">Flat Type</th>
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3 text-right">Floor Area</th>
              <th className="py-2.5 px-3 text-right">Lease Balance</th>
              <th className="py-2.5 px-3 text-right">Transacted Price</th>
              <th className="py-2.5 px-3 text-right">Safe PSF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40">
            {filteredCaveats.map((c, idx) => (
              <tr
                key={idx}
                className={`hover:bg-surface-container-high transition-colors ${
                  idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'
                }`}
              >
                <td className="py-2.5 px-3 text-on-surface whitespace-nowrap">{c.month}</td>
                <td className="py-2.5 px-3 text-on-surface font-semibold whitespace-nowrap">{c.blockStreet}</td>
                <td className="py-2.5 px-3 text-secondary font-medium">{c.flatType}</td>
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
                <td className="py-2.5 px-3 text-right text-primary font-bold whitespace-nowrap">${c.safePsf}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCaveats.length === 0 && (
          <div className="py-12 text-center text-outline font-body-md">
            No resale caveats match your current filter parameters.
          </div>
        )}
      </div>
    </div>
  );
};
