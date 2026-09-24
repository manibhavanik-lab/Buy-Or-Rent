import React, { useState } from 'react';
import { PrecinctProfile } from '../data/precinctData';

interface Props {
  precinct: PrecinctProfile;
}

export const SchoolAmenityRadiiView: React.FC<Props> = ({ precinct }) => {
  const [selectedDistance, setSelectedDistance] = useState<'ALL' | 'Within 1km' | '1km - 2km Band'>('ALL');

  const filteredSchools = precinct.schools.filter((s) => {
    if (selectedDistance !== 'ALL' && s.distanceCategory !== selectedDistance) return false;
    return true;
  });

  return (
    <div className="w-full px-margin-desktop py-space-md space-y-space-md">
      {/* Top Banner */}
      <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">school</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              MOE School Priority GIS & Balloting Risk Analysis
            </h2>
            <span className="font-badge-code text-badge-code px-2 py-0.5 rounded bg-surface-container-highest text-primary uppercase">
              Ministry of Education (MOE) Priority Radius
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Measuring SLA OneMap centroid walking distances and Phase 2C priority eligibility for {precinct.address}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Within 1km', '1km - 2km Band'].map((dist) => (
            <button
              key={dist}
              onClick={() => setSelectedDistance(dist as any)}
              className={`px-3 py-1.5 rounded text-xs font-badge-code transition-colors cursor-pointer ${
                selectedDistance === dist
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* MOE Phase Rules Explanatory Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface">Category 1: Within 1km</h4>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Singapore Citizens living &lt;1km from the primary school receive highest priority in Phase 2C balloting. In popular schools, balloting is conducted solely within this tier.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface">Category 2: 1km to 2km Band</h4>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Eligible only if seats remain after Category 1 applicants are absorbed. For competitive SAP/branded institutions, Phase 2C seats rarely reach the 1-2km band.
          </p>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
            <h4 className="font-headline-sm text-sm font-bold text-on-surface">30-Month Residency Rule</h4>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Under MOE regulations, families registering under the home-school distance priority must reside at the registered address for at least 30 months from the registration date.
          </p>
        </div>
      </div>

      {/* School Matrix Table */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-md border border-outline-variant/20">
        <h3 className="font-headline-sm text-base text-on-surface font-semibold mb-space-sm flex items-center gap-2">
          <span>Primary Schools in Precinct Catchment Zone</span>
          <span className="font-badge-code text-badge-code text-outline">({filteredSchools.length} Institutes)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-data-tabular text-data-tabular border-collapse">
            <thead>
              <tr className="bg-surface-container-high text-outline uppercase font-badge-code text-badge-code">
                <th className="py-2.5 px-3">School Name</th>
                <th className="py-2.5 px-3">Institution Type</th>
                <th className="py-2.5 px-3">Walking Path / Access</th>
                <th className="py-2.5 px-3 text-right">Distance (m)</th>
                <th className="py-2.5 px-3 text-center">Priority Category</th>
                <th className="py-2.5 px-3 text-right">Phase 2C Ballot Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40">
              {filteredSchools.map((s, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-surface-container-high transition-colors ${
                    idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'
                  }`}
                >
                  <td className="py-3 px-3 text-on-surface font-semibold flex items-center gap-2">
                    <span>{s.name}</span>
                    {s.isPrimaryChoice && (
                      <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {s.tag === 'SAP' ? (
                      <span className="font-badge-code text-badge-code text-error bg-error-container/20 px-2 py-0.5 rounded font-bold">
                        Special Assistance Plan (SAP)
                      </span>
                    ) : (
                      <span className="font-badge-code text-badge-code text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded">
                        Government Primary
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant text-xs">{s.pathway}</td>
                  <td className="py-3 px-3 text-right font-bold text-on-surface">{s.distanceMeters}m</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-badge-code text-badge-code px-2 py-0.5 rounded font-bold ${
                        s.distanceCategory === 'Within 1km'
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {s.distanceCategory}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-data-tabular font-bold ${
                        s.ballotRisk.includes('Ballot Risk')
                          ? 'text-error'
                          : s.ballotRisk.includes('Priority')
                          ? 'text-primary'
                          : 'text-secondary'
                      }`}
                    >
                      {s.ballotRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transit Infrastructure Matrix */}
      <div className="bg-surface-container rounded-xl p-space-md shadow-md border border-outline-variant/20">
        <h3 className="font-headline-sm text-base text-on-surface font-semibold mb-space-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">commute</span>
          <span>Transit & Civic Connectivity Matrix (LTA DataMall)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {precinct.transits.map((item) => (
            <div key={item.id} className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <span className="font-badge-code text-[10px] text-outline uppercase">{item.type.toUpperCase()} NODE</span>
                <h4 className="font-body-md text-sm font-bold text-on-surface mt-1">{item.name}</h4>
                <p className="font-disclaimer text-[11px] text-on-surface-variant mt-0.5">{item.subtitle}</p>
              </div>

              <div className="flex justify-between items-center mt-3 pt-2 border-t border-surface-container-high/60">
                <span className="font-data-tabular text-xs font-bold text-primary">{item.distanceMeters}m</span>
                <span className="font-disclaimer text-xs text-secondary">{item.walkTimeMins} mins walk</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
