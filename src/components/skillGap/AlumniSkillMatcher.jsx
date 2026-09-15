import React from 'react';
import { Users, ArrowRight, Award, CheckCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';

export default function AlumniSkillMatcher({ missingSkillGaps = [], matchedAlumni = [] }) {
  if (missingSkillGaps.length === 0) return null;

  return (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 mb-4 pb-3 border-b border-light">
        <div>
          <h3 className="section-title flex items-center gap-2">
            <Users size={20} className="text-accent" /> Connect with Alumni Mentors for Missing Skills
          </h3>
          <p className="text-xs text-secondary mt-1">
            Alumni from your institution who possess skills matching your current gaps: <strong className="text-accent">{missingSkillGaps.join(', ')}</strong>
          </p>
        </div>

        <Link to="/mentorship" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
          Explore All Mentors <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-4 gap-4">
        {matchedAlumni.length === 0 ? (
          <div className="grid-span-4 p-4 bg-background text-center rounded-lg">
            <p className="text-xs text-secondary italic">Explore the main alumni directory to find mentors across all departments.</p>
          </div>
        ) : (
          matchedAlumni.map(alum => (
            <div key={alum.id} className="p-4 bg-background border rounded-xl flex flex-col justify-between gap-3 hover:border-accent/40 transition-all">
              <div>
                <div className="flex justify-between items-start gap-1">
                  <div>
                    <h4 className="font-bold text-xs text-primary flex items-center gap-1">
                      {alum.firstName} {alum.lastName}
                      {alum.isVerified && <CheckCircle size={12} className="text-accent" />}
                    </h4>
                    <span className="text-xxs text-secondary block mt-0.5">
                      {alum.currentRole} {alum.currentCompany ? `@ ${alum.currentCompany}` : ''}
                    </span>
                  </div>
                  {alum.isMentor && (
                    <span className="badge badge-accent text-xxs font-bold">Mentor</span>
                  )}
                </div>

                <div className="text-xxs text-secondary mt-2">
                  <span>Batch: Class of {alum.graduationYear}</span>
                </div>

                <div className="mt-2.5">
                  <span className="text-xxs font-semibold text-secondary uppercase tracking-wider block mb-1">Matches Your Gap:</span>
                  <div className="flex flex-wrap gap-1">
                    {(alum.matchedSkills || []).map((skill, sIdx) => (
                      <span key={sIdx} className="tag tag-success text-xxs font-semibold">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link 
                to={`/mentorship`} 
                className="btn btn-secondary btn-xs w-full flex items-center justify-center gap-1 mt-2"
              >
                <MessageSquare size={12} /> Request Guidance
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
