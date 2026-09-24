import React, { useState } from 'react';
import { HdbCaveat, PrecinctProfile } from '../data/precinctData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  precinct: PrecinctProfile;
}

export const ViewAllCaveatsModal: React.FC<Props> = ({ isOpen, onClose, precinct }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Filter caveats
  const filtered = precinct.hdbCaveats.filter((c) => {
    if (filterType !== 'ALL' && !c.flatType.includes(filterType)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.blockStreet.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.month.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#171f33] border border-[#3d494c] rounded-xl max-w-4xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[24px]">receipt_long</span>
            <div>
              <h3 className="font-headline-sm text-lg font-semibold text-[#dae2fd]">
                Historical HDB Caveats Ledger ({precinct.town})
              </h3>
              <p className="font-disclaimer text-xs text-[#869397]">
                Ingested from Singapore Open Data Licence (data.gov.sg) • Bala's Table Adjusted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#222a3d] hover:bg-[#2d3449] flex items-center justify-center text-[#bcc9cd] hover:text-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {['ALL', '3 ROOM', '4 ROOM', '5 ROOM'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded text-xs font-badge-code transition-colors ${
                  filterType === t
                    ? 'bg-[#4edea3] text-[#003824] font-bold'
                    : 'bg-[#222a3d] text-[#bcc9cd] hover:bg-[#2d3449]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative flex items-center bg-[#131b2e] rounded px-3 py-1.5 border border-[#3d494c] sm:w-64">
            <span className="material-symbols-outlined text-[#869397] text-[16px] mr-1.5">search</span>
            <input
              type="text"
              placeholder="Search block or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent font-data-tabular text-xs text-[#dae2fd] focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 border border-[#2d3449] rounded">
          <table className="w-full text-left font-data-tabular text-xs border-collapse">
            <thead className="sticky top-0 bg-[#222a3d] text-[#869397] uppercase font-badge-code">
              <tr>
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Block / Street</th>
                <th className="py-2.5 px-3">Flat Type</th>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3 text-right">Floor Area</th>
                <th className="py-2.5 px-3 text-right">Lease Bal</th>
                <th className="py-2.5 px-3 text-right">Transacted</th>
                <th className="py-2.5 px-3 text-right">Safe PSF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3449]/40">
              {filtered.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-[#222a3d] transition-colors ${
                    idx % 2 === 0 ? 'bg-[#171f33]' : 'bg-[#131b2e]'
                  }`}
                >
                  <td className="py-2 px-3 text-[#dae2fd] whitespace-nowrap">{item.month}</td>
                  <td className="py-2 px-3 text-[#dae2fd] font-medium whitespace-nowrap">{item.blockStreet}</td>
                  <td className="py-2 px-3 text-[#4edea3]">{item.flatType}</td>
                  <td className="py-2 px-3 text-[#bcc9cd]">{item.model}</td>
                  <td className="py-2 px-3 text-right text-[#dae2fd]">
                    {item.floorAreaSqm} sqm <span className="text-[#869397]">({item.floorAreaSqft} sqft)</span>
                  </td>
                  <td className="py-2 px-3 text-right text-[#bcc9cd] whitespace-nowrap">
                    {item.leaseBalYears}y {item.leaseBalMonths.toString().padStart(2, '0')}m
                  </td>
                  <td className="py-2 px-3 text-right text-[#4edea3] font-bold">
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-[#4cd7f6] font-semibold">
                    ${item.safePsf}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-[#2d3449] flex justify-between items-center text-xs text-[#869397]">
          <span>Showing {filtered.length} transacted caveat entries</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#222a3d] hover:bg-[#2d3449] text-xs font-badge-code text-[#dae2fd]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
