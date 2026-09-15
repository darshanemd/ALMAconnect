import React, { useState } from 'react';
import { 
  X, Printer, Copy, Check, ShieldCheck, Trophy, Sparkles, Plus, Calendar, MapPin, Compass
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { formatDate } from '../../utils/formatters';
import { useData } from '../../contexts/DataContext';

export default function DigitalGatePassModal({ event, user, onClose, onRegisterAnother, onRegisterAnotherEvent }) {
  const { getAlumniById } = useData();
  const profileData = getAlumniById ? getAlumniById(user?.id) : null;
  const fullName = user?.name || (profileData ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() : '') || 'Rahul Kumar';
  
  const [copied, setCopied] = useState(false);

  if (!event || !user) return null;

  // Retrieve user's registration record for this event
  const regRecord = (event.registrations || []).find(r => r.userId === user.id);
  const rawSports = regRecord?.registeredSports || [];
  const rawCategories = regRecord?.registeredCategories || [];

  // Construct comprehensive registered categories/disciplines list
  let categoriesList;
  if (rawCategories && rawCategories.length > 0) {
    categoriesList = rawCategories.map(c => {
      if (typeof c === 'string') {
        return {
          name: c,
          entryType: regRecord?.entryType || 'Individual Entry',
          role: regRecord?.roleOrPosition || '',
          team: regRecord?.teamName || ''
        };
      }
      return {
        name: c.category || c.name || 'General Registration',
        entryType: c.entryType || regRecord?.entryType || 'Individual Entry',
        role: c.roleOrPosition || regRecord?.roleOrPosition || '',
        team: c.teamName || regRecord?.teamName || ''
      };
    });
  } else if (rawSports && rawSports.length > 0) {
    categoriesList = rawSports.map(s => ({
      name: s,
      entryType: regRecord?.entryType || 'Individual Entry',
      role: regRecord?.roleOrPosition || '',
      team: regRecord?.teamName || ''
    }));
  } else if (regRecord?.category || regRecord?.answers?.category || regRecord?.answers?.sport || regRecord?.answers?.track) {
    const singleCat = regRecord.category || regRecord.answers.category || regRecord.answers.sport || regRecord.answers.track;
    categoriesList = [{
      name: singleCat,
      entryType: regRecord.entryType || 'Individual Entry',
      role: regRecord.roleOrPosition || '',
      team: regRecord.teamName || ''
    }];
  } else {
    categoriesList = [{
      name: 'General Entry & Attendee Pass',
      entryType: 'Individual Entry',
      role: '',
      team: ''
    }];
  }

  const passId = `ALMA-PASS-${(event.id || 'EVT').replace(/[^a-zA-Z0-9]/g, '')}-${(user?.id || 'USR').slice(-4)}-${new Date(event.date).getFullYear()}`;
  
  const qrPayload = JSON.stringify({
    passId,
    eventId: event.id,
    eventTitle: event.title,
    userId: user.id,
    userName: fullName,
    role: user.role,
    categories: categoriesList.map(c => c.name),
    issuedAt: regRecord?.registeredAt || new Date().toISOString()
  });

  const handleCopyPassId = () => {
    navigator.clipboard.writeText(passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedEventDate = `${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${event.time})`;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1060 }}>
      <div 
        className="modal max-w-md p-6 sm:p-7 bg-white text-slate-800 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col items-center"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      >
        {/* Header with Title and Close */}
        <div className="w-full flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700">
            Verified Digital Gate Pass
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all print:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Center High-Contrast QR Code */}
        <div className="my-4 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center">
          <QRCode 
            value={qrPayload} 
            size={160} 
            level="H"
          />
        </div>

        {/* Event Title */}
        <h2 className="text-xl font-bold text-slate-900 text-center leading-tight">
          {event.title}
        </h2>

        {/* Category Pill */}
        <div className="my-1.5">
          <span className="px-3 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
            {event.type || 'campus'}
          </span>
        </div>

        {/* Metadata Details Table */}
        <div className="w-full flex flex-col gap-1 text-xs text-slate-600 my-2 px-1 text-left">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Date &amp; Time</span>
            <span className="font-semibold text-slate-800">{formattedEventDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Attendee</span>
            <span className="font-semibold text-slate-800">{fullName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Venue</span>
            <span className="font-semibold text-slate-800">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Pass Status</span>
            <span className="font-bold text-emerald-600">Verified Pass</span>
          </div>
        </div>

        {/* Registered Sports & Categories Container */}
        <div className="w-full mt-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Trophy size={14} className="text-emerald-600" />
            Registered Sports &amp; Categories ({categoriesList.length})
          </span>

          <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-0.5">
            {categoriesList.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-2 shadow-2xs">
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Entry: {item.entryType}
                    {item.role && ` • Role: ${item.role}`}
                    {item.team && ` • Team: ${item.team}`}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200 flex-shrink-0">
                  Registered
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <p className="text-[11px] text-slate-400 text-center my-3 leading-snug">
          Show this QR code at campus gate security or registration desk for fast check-in.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 print:hidden">
          <button 
            type="button"
            onClick={onRegisterAnotherEvent || onClose}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Compass size={15} /> Register for Another Event
          </button>

          <button 
            type="button"
            onClick={onRegisterAnother}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={14} /> Register Another Category in this Event
          </button>

          <div className="w-full grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={handlePrint}
              className="py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Printer size={14} /> Print Pass
            </button>

            <button 
              type="button"
              onClick={handleCopyPassId}
              className="py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? 'Copied ID!' : 'Copy Pass ID'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
