import React, { useState } from 'react';

export interface HyperparametersConfig {
  temperature: number;
  seed: number;
  checkpoint: string;
  focusArea: 'general' | 'capital_growth' | 'rental_yield' | 'school_balloting' | 'lease_decay';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: HyperparametersConfig;
  onSave: (config: HyperparametersConfig) => void;
}

export const HyperparametersModal: React.FC<Props> = ({ isOpen, onClose, config, onSave }) => {
  const [temperature, setTemperature] = useState(config.temperature);
  const [seed, setSeed] = useState(config.seed);
  const [checkpoint, setCheckpoint] = useState(config.checkpoint);
  const [focusArea, setFocusArea] = useState(config.focusArea);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ temperature, seed, checkpoint, focusArea });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#171f33] border border-[#3d494c] rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#2d3449]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">tune</span>
            <h3 className="font-headline-sm text-lg font-semibold text-[#dae2fd]">
              Gemini Synthesis Hyperparameters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#222a3d] hover:bg-[#2d3449] flex items-center justify-center text-[#bcc9cd] hover:text-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-badge-code text-xs text-[#dae2fd]">
                TEMPERATURE SAMPLING: <span className="text-[#4cd7f6]">{temperature.toFixed(2)}</span>
              </label>
              <span className="text-[11px] text-[#869397]">0.0 (Deterministic) - 1.0 (Creative)</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#4cd7f6] bg-[#131b2e] h-2 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="font-badge-code text-xs text-[#dae2fd] block mb-1">
              MODEL CHECKPOINT
            </label>
            <select
              value={checkpoint}
              onChange={(e) => setCheckpoint(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#3d494c] rounded p-2 text-xs font-data-tabular text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            >
              <option value="gemini-2.5-flash-pro">gemini-2.5-flash-pro (Institutional Quantitative Mode)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (Standard Real-Time Synthesis)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Macroeconomic Reasoning)</option>
            </select>
          </div>

          <div>
            <label className="font-badge-code text-xs text-[#dae2fd] block mb-1">
              ANALYTICAL VECTOR PRIORITY
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value as any)}
              className="w-full bg-[#131b2e] border border-[#3d494c] rounded p-2 text-xs font-data-tabular text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            >
              <option value="general">Balanced Institutional Dossier</option>
              <option value="capital_growth">Capital Appreciation & MRT Expansion Alpha</option>
              <option value="rental_yield">Cash-flow & Expatriate Rental Yield Optimization</option>
              <option value="school_balloting">MOE Phase 2C Primary School Geofence Risk</option>
              <option value="lease_decay">Bala's Table 99-Yr Lease Decay Sensitivity</option>
            </select>
          </div>

          <div>
            <label className="font-badge-code text-xs text-[#dae2fd] block mb-1">
              PSEUDO-RANDOM SEED (REPRODUCIBILITY)
            </label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value, 10) || 560421)}
              className="w-full bg-[#131b2e] border border-[#3d494c] rounded p-2 text-xs font-data-tabular text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#2d3449]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#222a3d] hover:bg-[#2d3449] text-xs font-badge-code text-[#dae2fd]"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-[#4cd7f6] hover:bg-[#38c0de] text-xs font-badge-code font-bold text-[#003640] uppercase tracking-wider"
          >
            APPLY PARAMETERS
          </button>
        </div>
      </div>
    </div>
  );
};
