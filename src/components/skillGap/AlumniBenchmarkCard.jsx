import React from 'react';
import { Users, Building2, Sparkles, TrendingUp } from 'lucide-react';

export default function AlumniBenchmarkCard({ targetRole, alumniStats }) {
  const { totalRelevantAlumni, topAlumniSkills = [], topCompanies = [] } = alumniStats || {};

  return (
    <div className="card p-6 bg-gradient-to-r from-accent-bg/40 via-surface to-surface border border-accent/20 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-light">
        <div>
          <h3 className="text-base font-bold text-primary flex items-center gap-2">
            <Users className="text-accent" size={20} />
            Alumni Industry Benchmark ({targetRole})
          </h3>
          <p className="text-xs text-secondary mt-1">
            Real-time skill distribution analyzed across <strong className="text-accent">{totalRelevantAlumni} active alumni</strong> from your institution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-accent text-xxs font-bold px-3 py-1 flex items-center gap-1">
            <TrendingUp size={12} /> Live Alumni Data
          </span>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        {/* Top Alumni Required Skills */}
        <div>
          <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={14} className="text-amber-500" /> Most Frequent Skills Among Alumni
          </h4>
          <div className="flex flex-wrap gap-2">
            {topAlumniSkills.slice(0, 6).map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-1.5 p-1.5 px-2.5 bg-background border rounded-lg text-xs"
              >
                <span className="font-semibold text-primary">{item.name}</span>
                <span className="text-xxs font-bold text-accent bg-accent-bg px-1.5 py-0.5 rounded-full">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Alumni Hiring Companies */}
        <div>
          <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
            <Building2 size={14} className="text-accent" /> Top Alumni Hiring Companies
          </h4>
          <div className="flex flex-wrap gap-2">
            {topCompanies.map((company, idx) => (
              <span key={idx} className="tag tag-outline text-xs font-medium">
                🏢 {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
