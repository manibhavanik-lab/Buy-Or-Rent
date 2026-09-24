import React from 'react';
import { PrecinctProfile } from '../data/precinctData';

interface Props {
  precinct: PrecinctProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const Svy21CadModal: React.FC<Props> = ({ precinct, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#171f33] border border-[#3d494c] rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#2d3449]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[24px]">spatial_tracking</span>
            <div>
              <h3 className="font-headline-sm text-lg font-semibold text-[#dae2fd]">
                SLA Cadastral SVY21 Technical Matrix
              </h3>
              <p className="font-disclaimer text-xs text-[#869397]">
                Official Singapore Transverse Mercator Survey Cadastre (EPSG:3414)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#222a3d] hover:bg-[#2d3449] flex items-center justify-center text-[#bcc9cd] hover:text-[#dae2fd] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-[#131b2e] border border-[#2d3449]/60">
              <span className="font-badge-code text-[11px] text-[#869397] uppercase">Northing (Y)</span>
              <p className="font-data-tabular text-base font-bold text-[#4cd7f6] mt-1">
                {precinct.svy21Northing.toFixed(2)} m
              </p>
              <span className="font-disclaimer text-[10px] text-[#869397]">SVY21 False Northing Origin</span>
            </div>
            <div className="p-3 rounded bg-[#131b2e] border border-[#2d3449]/60">
              <span className="font-badge-code text-[11px] text-[#869397] uppercase">Easting (X)</span>
              <p className="font-data-tabular text-base font-bold text-[#4edea3] mt-1">
                {precinct.svy21Easting.toFixed(2)} m
              </p>
              <span className="font-disclaimer text-[10px] text-[#869397]">SVY21 False Easting Origin</span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#131b2e] border border-[#2d3449]/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#869397]">Cadastral Lot Number:</span>
              <span className="font-data-tabular font-semibold text-[#dae2fd]">{precinct.cadastralLot}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#869397]">WGS84 Coordinates:</span>
              <span className="font-data-tabular font-semibold text-[#4cd7f6]">{precinct.geoHash}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#869397]">Master Plan 2019 Zoning:</span>
              <span className="font-data-tabular font-semibold text-[#dae2fd]">{precinct.masterPlanGpr}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#869397]">Permitted Gross Plot Ratio (GPR):</span>
              <span className="font-data-tabular font-bold text-[#4edea3]">2.80x Net Permitted</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#869397]">Micro-Market Valuation Vector:</span>
              <span className="font-data-tabular text-[#dae2fd]">{precinct.microMarketZone}</span>
            </div>
          </div>

          {/* SVG CAD Blueprint representation */}
          <div className="h-44 w-full bg-[#060e20] rounded border border-[#2d3449] p-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#4cd7f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
            <div className="relative z-10 flex justify-between items-center">
              <span className="font-badge-code text-[10px] text-[#4cd7f6] uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                CAD BOUNDARY GEOMETRY (POLYGON 4192X)
              </span>
              <span className="font-badge-code text-[10px] text-[#869397]">SCALE 1:500</span>
            </div>
            
            <div className="relative z-10 flex items-center justify-center my-auto">
              <svg width="240" height="90" viewBox="0 0 240 90" className="text-[#4cd7f6]">
                <polygon
                  points="20,15 140,10 220,50 180,80 40,75"
                  fill="rgba(76, 215, 246, 0.08)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <circle cx="120" cy="45" r="4" fill="#4edea3" />
                <text x="130" y="48" fill="#4edea3" fontSize="9" fontFamily="JetBrains Mono">LOT CENTROID</text>
                <line x1="20" y1="15" x2="220" y2="50" stroke="#869397" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="80" y="28" fill="#869397" fontSize="8" fontFamily="JetBrains Mono">142.5m SPAN</text>
              </svg>
            </div>

            <div className="relative z-10 flex justify-between items-center text-[10px] font-disclaimer text-[#869397]">
              <span>Survey Authority: Singapore Land Authority (SLA)</span>
              <span>Datum: SVY21 / Kertau 1968</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#2d3449]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#222a3d] hover:bg-[#2d3449] text-xs font-badge-code text-[#dae2fd] transition-colors"
          >
            DISMISS
          </button>
          <button
            onClick={() => {
              alert('Exporting SLA Land Survey DXF/DWG vector payload...');
              onClose();
            }}
            className="px-4 py-2 rounded bg-[#4cd7f6] hover:bg-[#38c0de] text-xs font-badge-code font-bold text-[#003640] uppercase tracking-wider transition-colors"
          >
            DOWNLOAD DXF VECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
