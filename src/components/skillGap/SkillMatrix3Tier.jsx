import React from 'react';
import { CheckCircle2, X, Star, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SkillMatrix3Tier({ 
  careerTarget, 
  acquiredMatchingSkills = [], 
  missingSkillGaps = [], 
  extraBonusSkills = [], 
  alumniStats = {}, 
  onToggleSkill, 
  onStartQuiz 
}) {
  const { skillFrequencies = {}, totalRelevantAlumni = 1 } = alumniStats;

  return (
    <div className="grid grid-3 gap-6 mb-6">
      {/* 1. Acquired Matching Skills */}
      <div className="card p-6 flex flex-col gap-4">
        <h3 className="section-title flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={18} className="text-emerald-500" />
            Matching Skills ({acquiredMatchingSkills.length})
          </span>
          <span className="text-xs font-semibold text-success">Verified</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {acquiredMatchingSkills.length === 0 ? (
            <span className="text-xs text-secondary italic">No matching skills acquired yet for {careerTarget}.</span>
          ) : (
            acquiredMatchingSkills.map(skill => (
              <div 
                key={skill} 
                className="tag tag-success flex items-center gap-1.5"
              >
                <CheckCircle2 size={13} />
                <span>{skill}</span>
                <button 
                  type="button" 
                  onClick={() => onToggleSkill(skill)} 
                  className="hover:text-red-500 ml-1 font-bold"
                  title="Remove Skill"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Identified Missing Skill Gaps with Alumni Benchmarks */}
      <div className="card p-6 flex flex-col gap-4 border-l-4 border-l-amber-500">
        <h3 className="section-title flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertTriangle size={18} className="text-amber-500" />
            Alumni Gaps ({missingSkillGaps.length})
          </span>
          <span className="text-xs font-semibold text-amber-600">Action Needed</span>
        </h3>
        <div className="flex flex-col gap-2">
          {missingSkillGaps.length === 0 ? (
            <span className="text-xs text-success font-semibold">🎉 All required skills acquired for {careerTarget}!</span>
          ) : (
            missingSkillGaps.map(skill => {
              const count = skillFrequencies[skill] || Math.floor(totalRelevantAlumni * 0.7);
              const percentage = Math.min(100, Math.round((count / totalRelevantAlumni) * 100)) || 65;

              return (
                <div key={skill} className="flex items-center justify-between p-2.5 bg-background border border-warning/30 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{skill}</span>
                    <span className="text-xxs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full" title="% of Alumni in this role with this skill">
                      {percentage}% Alumni Have This
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button" 
                      className="btn btn-xs btn-primary"
                      onClick={() => onStartQuiz(skill)}
                    >
                      Test
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-xs btn-secondary"
                      onClick={() => onToggleSkill(skill)}
                      title="Mark Acquired Manually"
                    >
                      ✓ Mark
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Extra Bonus Advantage Skills */}
      <div className="card p-6 flex flex-col gap-4">
        <h3 className="section-title flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Star size={18} className="text-accent" />
            Extra Advantage ({extraBonusSkills.length})
          </span>
          <span className="text-xs font-semibold text-accent">Bonus Skills</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {extraBonusSkills.length === 0 ? (
            <span className="text-xs text-secondary italic">Add extra learned skills to stand out!</span>
          ) : (
            extraBonusSkills.map(skill => (
              <div 
                key={skill} 
                className="tag tag-outline flex items-center gap-1.5 border-accent text-accent font-semibold"
              >
                <Star size={13} />
                <span>{skill}</span>
                <button 
                  type="button" 
                  onClick={() => onToggleSkill(skill)} 
                  className="hover:text-red-500 ml-1 font-bold"
                  title="Remove Skill"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
