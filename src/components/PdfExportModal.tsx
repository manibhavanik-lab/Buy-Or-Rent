import React from 'react';
import { PrecinctProfile } from '../data/precinctData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  precinct: PrecinctProfile;
}

export const PdfExportModal: React.FC<Props> = ({ isOpen, onClose, precinct }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#171f33] border border-[#3d494c] rounded-xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[24px]">picture_as_pdf</span>
            <div>
              <h3 className="font-headline-sm text-lg font-semibold text-[#dae2fd]">
                Institutional Valuation Dossier Export
              </h3>
              <p className="font-disclaimer text-xs text-[#869397]">
                SG Capital Intelligence • Formal Valuation Memorandum
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

        {/* Printable Paper Preview */}
        <div className="overflow-y-auto flex-1 my-4 p-6 bg-[#060e20] rounded border border-[#2d3449] text-[#dae2fd] space-y-5 print:p-0 print:bg-white print:text-black">
          <div className="flex justify-between items-start border-b border-[#2d3449] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">account_balance</span>
                <span className="font-headline-sm text-base uppercase font-bold tracking-tight text-[#dae2fd]">
                  SG CAPITAL INTELLIGENCE
                </span>
              </div>
              <p className="font-disclaimer text-[11px] text-[#869397] mt-0.5">
                Valuation Reference ID: SG-VAL-{precinct.postal}-2026
              </p>
            </div>
            <div className="text-right">
              <span className="font-badge-code text-[11px] text-[#4edea3]">CONFIDENTIAL / INSTITUTIONAL</span>
              <p className="font-data-tabular text-xs text-[#869397]">Date: {new Date().toLocaleDateString('en-SG')}</p>
            </div>
          </div>

          <div className="p-3 bg-[#131b2e] rounded border border-[#2d3449]/70">
            <span className="font-badge-code text-xs text-[#4cd7f6] block">TARGET ASSET IDENTIFIER</span>
            <h4 className="font-headline-md text-xl font-bold text-[#dae2fd] mt-1">{precinct.address}</h4>
            <p className="font-body-sm text-xs text-[#bcc9cd] mt-0.5">
              {precinct.town} • {precinct.region} • {precinct.cadastralLot} • {precinct.geoHash}
            </p>
          </div>

          {/* Metric Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#131b2e] rounded border border-[#2d3449]/50">
              <span className="font-badge-code text-[10px] text-[#869397] uppercase">HDB Resale Median</span>
              <p className="font-metric-headline text-lg text-[#dae2fd] mt-1">${precinct.hdbMedianPsf} / sqft</p>
              <span className="text-[10px] text-[#4edea3] font-data-tabular">{precinct.hdbYoyChange}</span>
            </div>
            <div className="p-3 bg-[#131b2e] rounded border border-[#2d3449]/50">
              <span className="font-badge-code text-[10px] text-[#869397] uppercase">Private Benchmark</span>
              <p className="font-metric-headline text-lg text-[#4cd7f6] mt-1">${precinct.privateMedianPsf} / sqft</p>
              <span className="text-[10px] text-[#869397] font-data-tabular">{precinct.privateDistrictCode}</span>
            </div>
            <div className="p-3 bg-[#131b2e] rounded border border-[#2d3449]/50">
              <span className="font-badge-code text-[10px] text-[#869397] uppercase">HDB/Condo Spread</span>
              <p className="font-metric-headline text-lg text-[#dae2fd] mt-1">{precinct.spreadRatio}</p>
              <span className="text-[10px] text-[#869397] font-data-tabular">Price Delta</span>
            </div>
            <div className="p-3 bg-[#131b2e] rounded border border-[#2d3449]/50">
              <span className="font-badge-code text-[10px] text-[#869397] uppercase">Affordability Index</span>
              <p className="font-metric-headline text-lg text-[#4edea3] mt-1">${precinct.affordabilityMonthly}/mo</p>
              <span className="text-[10px] text-[#869397] font-data-tabular">CPF OA Covered</span>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="space-y-3">
            <span className="font-badge-code text-xs text-[#4cd7f6] uppercase tracking-wider block">
              Gemini Synthesized Executive Findings
            </span>
            {precinct.briefing.map((m) => (
              <div key={m.id} className="p-3 bg-[#131b2e] rounded border border-[#2d3449]/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-badge-code text-[11px] text-[#4cd7f6]">{m.title}</span>
                  <span className="font-badge-code text-[10px] text-[#869397]">{m.tag}</span>
                </div>
                <p className="font-body-sm text-xs text-[#bcc9cd] leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#2d3449] text-[10px] font-disclaimer text-[#869397] leading-relaxed">
            Legal & Regulatory Disclaimer: Synthesized strictly for institutional screening. Complies with Singapore Open Data Licence 1.0 (data.gov.sg, URA Space, SLA OneMap).
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#2d3449]">
          <span className="text-xs text-[#869397]">Formatted for standard A4 Institutional PDF report</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#222a3d] hover:bg-[#2d3449] text-xs font-badge-code text-[#dae2fd]"
            >
              CANCEL
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded bg-[#4cd7f6] hover:bg-[#38c0de] text-xs font-badge-code font-bold text-[#003640] uppercase tracking-wider flex items-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>PRINT / SAVE AS PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
