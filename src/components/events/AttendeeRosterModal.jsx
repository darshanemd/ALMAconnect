import React, { useState } from 'react';
import { X, Search, FileSpreadsheet, Users, Trophy } from 'lucide-react';

export default function AttendeeRosterModal({ event, alumni = [], onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!event) return null;

  const registrations = event.registrations || [];

  // Filtered registrations based on search query
  const filteredRegistrations = registrations.filter(reg => {
    const nameMatch = (reg.userName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (reg.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = (reg.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const teamMatch = (reg.teamName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch || catMatch || teamMatch;
  });

  // 1-Click CSV Export Function
  const handleExportCsv = () => {
    if (registrations.length === 0) {
      alert('No attendee registrations found to export.');
      return;
    }

    // Build CSV Headers
    const headers = [
      'User ID', 'Attendee Name', 'Role', 'Department', 'Email Address', 
      'Registered Category / Sport', 'Entry Type', 'Role / Position', 
      'Team / Squad Name', 'Team Members', 'Registration Date'
    ];

    // Build CSV Rows
    const rows = registrations.map(reg => {
      const teamMembersStr = Array.isArray(reg.teamMembers)
        ? reg.teamMembers.map(m => typeof m === 'string' ? m : `${m.name} (${m.role})`).join('; ')
        : (reg.teamMembers || 'N/A');

      const sportsCategories = (reg.registeredSports && reg.registeredSports.length > 0)
        ? reg.registeredSports.join('; ')
        : (reg.category || 'General Entry');

      const row = [
        `"${reg.userId}"`,
        `"${(reg.userName || 'Participant').replace(/"/g, '""')}"`,
        `"${(reg.userRole || 'student').replace(/"/g, '""')}"`,
        `"${(reg.department || '').replace(/"/g, '""')}"`,
        `"${(reg.userEmail || '').replace(/"/g, '""')}"`,
        `"${String(sportsCategories).replace(/"/g, '""')}"`,
        `"${(reg.entryType || 'Individual Entry').replace(/"/g, '""')}"`,
        `"${(reg.roleOrPosition || reg.answers?.roleOrPosition || '').replace(/"/g, '""')}"`,
        `"${(reg.teamName || reg.answers?.teamName || '').replace(/"/g, '""')}"`,
        `"${String(teamMembersStr).replace(/"/g, '""')}"`,
        `"${new Date(reg.registeredAt || Date.now()).toLocaleDateString()}"`
      ];

      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `event_roster_${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1070 }}>
      <div className="modal modal-lg max-w-5xl bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-100 p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users size={22} className="text-emerald-600" /> Attendee Roster &amp; Registrations
            </h3>
            <span className="text-xs text-slate-500">{event.title} &bull; Total Registered: <strong className="text-emerald-700">{registrations.length} Attendees</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={handleExportCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download CSV for Excel / Sheets"
            >
              <FileSpreadsheet size={15} /> Export CSV
            </button>
            <button className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                placeholder="Search registered attendees by name, email, category, or team..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Showing {filteredRegistrations.length} of {registrations.length}</span>
          </div>

          {/* Attendee Roster Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="p-3">Attendee</th>
                  <th className="p-3">Category / Sport</th>
                  <th className="p-3">Entry Mode</th>
                  <th className="p-3">Role / Position</th>
                  <th className="p-3">Team / Members</th>
                  <th className="p-3">Reg Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      No attendee registrations match your search.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg, idx) => {
                    const sportsList = reg.registeredSports || (reg.category ? [reg.category] : []);
                    const teamMembersDisplay = Array.isArray(reg.teamMembers)
                      ? reg.teamMembers.map(m => typeof m === 'string' ? m : m.name).filter(Boolean).join(', ')
                      : reg.teamMembers;

                    return (
                      <tr key={reg.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{reg.userName || 'Participant'}</div>
                          <div className="text-[11px] text-slate-400">{reg.userEmail}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {sportsList.length > 0 ? (
                              sportsList.map((s, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold text-[11px] border border-emerald-200">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400">General</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">
                          {reg.entryType || 'Individual Entry'}
                        </td>
                        <td className="p-3 text-slate-700">
                          {reg.roleOrPosition || reg.guestOption || reg.experienceLevel || '-'}
                        </td>
                        <td className="p-3">
                          {reg.teamName ? (
                            <div>
                              <strong className="text-slate-900 block">{reg.teamName}</strong>
                              {teamMembersDisplay && (
                                <span className="text-[10px] text-slate-500 block truncate max-w-xs">{teamMembersDisplay}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">Solo</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : 'Recently'}
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
