import React, { useState } from 'react';
import { X, FileSpreadsheet, Search, Code, Users, Filter, ExternalLink, FileText } from 'lucide-react';

export default function HackathonRosterModal({ event, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');

  if (!event) return null;

  const registrations = event.registrations || [];

  // Filter registrations
  const filtered = registrations.filter(reg => {
    const nameMatch = (reg.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (reg.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (reg.answers?.teamName || reg.answers?.get?.('teamName') || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (reg.answers?.problemStatement || reg.answers?.get?.('problemStatement') || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const track = (reg.answers?.track || reg.answers?.get?.('track') || '').toLowerCase();
    const trackMatch = trackFilter === 'all' || track.includes(trackFilter.toLowerCase());

    return nameMatch && trackMatch;
  });

  // 1-Click Hackathon Roster & Problem Statement CSV Export
  const handleExportCsv = () => {
    if (registrations.length === 0) {
      alert('No hackathon registrations found to export.');
      return;
    }

    const headers = [
      'User ID', 'Hacker Name', 'Email Address', 'Team Name', 'Track',
      'Selected Problem Statement', 'Solution Idea Summary', 'Specialization Role', 'Tech Stack', 'GitHub Profile', 'Registration Date'
    ];

    const rows = registrations.map(reg => {
      const getAns = (key) => {
        if (!reg.answers) return 'N/A';
        if (typeof reg.answers.get === 'function') return reg.answers.get(key) || 'N/A';
        return reg.answers[key] || 'N/A';
      };

      return [
        `"${reg.userId}"`,
        `"${(reg.userName || 'Hacker').replace(/"/g, '""')}"`,
        `"${(reg.userEmail || '').replace(/"/g, '""')}"`,
        `"${getAns('teamName').replace(/"/g, '""')}"`,
        `"${getAns('track').replace(/"/g, '""')}"`,
        `"${getAns('problemStatement').replace(/"/g, '""')}"`,
        `"${getAns('problemSummary').replace(/"/g, '""')}"`,
        `"${getAns('hackerRole').replace(/"/g, '""')}"`,
        `"${getAns('techStack').replace(/"/g, '""')}"`,
        `"${getAns('githubUrl').replace(/"/g, '""')}"`,
        `"${new Date(reg.registeredAt || Date.now()).toLocaleDateString()}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hackathon_roster_problem_statements_${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg max-w-5xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header flex justify-between items-center pb-4 border-b border-light">
          <div>
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <Code size={22} className="text-accent" /> Hackathon Teams & Problem Statements Roster
            </h3>
            <span className="text-xs text-secondary">{event.title} &bull; Registered Hackers: <strong className="text-accent">{registrations.length}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={handleExportCsv}
              className="btn btn-secondary btn-sm flex items-center gap-1.5 font-bold text-emerald-700 border-emerald-600/30"
              title="Download CSV of Problem Statements & Teams"
            >
              <FileSpreadsheet size={16} className="text-emerald-600" /> Export Roster CSV
            </button>
            <button className="btn btn-ghost p-1" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Search & Track Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-2.5 text-secondary" />
              <input 
                type="text" 
                className="input text-xs pl-9 w-full"
                placeholder="Search hackers by team name, problem statement, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={15} className="text-secondary" />
              <select 
                className="select text-xs"
                value={trackFilter}
                onChange={e => setTrackFilter(e.target.value)}
              >
                <option value="all">All Tracks</option>
                <option value="AI">AI / ML & GenAI</option>
                <option value="Web3">Web3 & Blockchain</option>
                <option value="Full-Stack">Full-Stack Cloud</option>
                <option value="Mobile">Mobile Apps</option>
                <option value="Open">Open Innovation</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background border-b border-light text-secondary uppercase font-semibold text-xxs tracking-wider">
                  <th className="p-3">Hacker / Team</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Problem Statement & Idea</th>
                  <th className="p-3">Role & Stack</th>
                  <th className="p-3">GitHub</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-secondary italic">
                      No hackathon registrants match your search filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((reg, idx) => {
                    const getAns = (key) => {
                      if (!reg.answers) return '-';
                      if (typeof reg.answers.get === 'function') return reg.answers.get(key) || '-';
                      return reg.answers[key] || '-';
                    };

                    const github = getAns('githubUrl');

                    return (
                      <tr key={reg.id || idx} className="hover:bg-surface-hover transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-primary block">{reg.userName || 'Hacker'}</span>
                          <span className="text-xxs text-accent font-semibold">{getAns('teamName')}</span>
                        </td>
                        <td className="p-3">
                          <span className="badge badge-accent text-xxs font-bold">{getAns('track')}</span>
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="font-semibold text-primary block line-clamp-1">{getAns('problemStatement')}</span>
                          <span className="text-xxs text-secondary line-clamp-2">{getAns('problemSummary')}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-primary block">{getAns('hackerRole')}</span>
                          <span className="text-xxs text-secondary">{getAns('techStack')}</span>
                        </td>
                        <td className="p-3">
                          {github && github !== '-' && github !== 'N/A' ? (
                            <a href={github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                              <ExternalLink size={13} /> Link
                            </a>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
