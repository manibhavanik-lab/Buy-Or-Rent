import React, { useState } from 'react';
import { PrecinctProfile } from '../data/precinctData';

interface Props {
  precinct: PrecinctProfile;
}

export const UraPrivateCaveatsView: React.FC<Props> = ({ precinct }) => {
  const [selectedTenure, setSelectedTenure] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const filtered = precinct.uraCaveats.filter((c) => {
    if (selectedTenure !== 'ALL') {
      if (selectedTenure === 'Freehold' && !c.tenure.toLowerCase().includes('freehold')) return false;
      if (selectedTenure === '99-yr' && !c.tenure.toLowerCase().includes('99-yr')) return false;
    }
    if (selectedDistrict !== 'ALL' && c.district !== selectedDistrict) return false;
    return true;
  });

  const handleDownloadCsv = () => {
    const headers = ['Development', 'Tenure', 'Unit Type', 'Floor Area (sqft)', 'Price (SGD)', 'PSF (SGD)', 'District', 'Completion'];
    const rows = filtered.map((c) => [
      `"${c.development}"`,
      `"${c.tenure}"`,
      `"${c.unitType}"`,
      c.floorAreaSqft,
      c.price,
      c.psf,
      `"${c.district}"`,
      c.completionYear || 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `URA_REALIS_${precinct.town}_CAVEATS.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-margin-desktop py-space-md space-y-space-md">
      {/* Top Banner */}
      <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">apartment</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              URA REALIS Private Residential Caveats
            </h2>
            <span className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-primary uppercase">
              Urban Redevelopment Authority (URA Space)
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Institutional ledger of non-landed private residential caveats within &lt;1.5km geofence envelope.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 rounded bg-primary hover:bg-[#38c0de] text-on-primary font-badge-code text-badge-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>EXPORT REALIS CSV</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container p-space-sm rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="font-badge-code text-xs text-outline uppercase">TENURE:</span>
          {['ALL', '99-yr', 'Freehold'].map((ten) => (
            <button
              key={ten}
              onClick={() => setSelectedTenure(ten)}
              className={`px-3 py-1 rounded text-xs font-badge-code transition-colors cursor-pointer ${
                selectedTenure === ten
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {ten}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-badge-code text-xs text-outline uppercase">DISTRICT FILTER:</span>
          {['ALL', 'D09', 'D10', 'D11', 'D12', 'D20'].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-2.5 py-1 rounded text-xs font-badge-code transition-colors cursor-pointer ${
                selectedDistrict === d
                  ? 'bg-secondary text-[#003824] font-bold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-md border border-outline-variant/20 overflow-x-auto">
        <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
          <thead>
            <tr className="bg-surface-container-high text-outline uppercase font-badge-code text-badge-code">
              <th className="py-2.5 px-3">Condominium Development</th>
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">Tenure Structure</th>
              <th className="py-2.5 px-3">Unit Configuration</th>
              <th className="py-2.5 px-3 text-right">Floor Area</th>
              <th className="py-2.5 px-3 text-right">Transacted Price</th>
              <th className="py-2.5 px-3 text-right">PSF (SGD)</th>
              <th className="py-2.5 px-3 text-right">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40">
            {filtered.map((item, idx) => (
              <tr
                key={idx}
                className={`hover:bg-surface-container-high transition-colors ${
                  idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'
                }`}
              >
                <td className="py-2.5 px-3 text-on-surface font-semibold whitespace-nowrap">{item.development}</td>
                <td className="py-2.5 px-3 text-primary font-bold">{item.district}</td>
                <td className="py-2.5 px-3 text-on-surface-variant whitespace-nowrap">{item.tenure}</td>
                <td className="py-2.5 px-3 text-on-surface">{item.unitType}</td>
                <td className="py-2.5 px-3 text-right text-on-surface whitespace-nowrap">{item.floorAreaSqft} sqft</td>
                <td className="py-2.5 px-3 text-right text-primary font-bold whitespace-nowrap">
                  ${item.price.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-secondary font-bold whitespace-nowrap">
                  ${item.psf.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-on-surface-variant">{item.completionYear || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-outline font-body-md">
            No private condominium caveats match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
