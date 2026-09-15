import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, Shield, Calendar, Heart, FileText, Upload, Check, X, AlertCircle, LayoutGrid, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './CollegeDashboard.css';

export default function CollegeDashboard() {
  const { user } = useAuth();
  const { colleges, getAlumni, verifyAlumni, rejectAlumni } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [growthViewMode, setGrowthViewMode] = useState('batch');

  const college = colleges.find(c => c.id === user?.collegeId);

  // Filtered lists
  const collegeAlumni = getAlumni({ collegeId: user?.collegeId, role: 'alumni' });
  const pendingAlumni = getAlumni({ collegeId: user?.collegeId, status: 'pending', role: 'alumni' });
  const verifiedAlumni = getAlumni({ collegeId: user?.collegeId, status: 'active', role: 'alumni' });

  // Stats
  const stats = [
    { label: 'Total Alumni', value: collegeAlumni.length, icon: Users, color: 'var(--accent-bg)', iconColor: 'var(--accent)' },
    { label: 'Verified Accounts', value: verifiedAlumni.length, icon: Check, color: '#ECFDF5', iconColor: '#059669' },
    { label: 'Pending Verification', value: pendingAlumni.length, icon: Shield, color: '#FFFBEB', iconColor: '#D97706' }
  ];

  // Recharts Dept distribution
  const deptData = useMemo(() => {
    const counts = {};
    collegeAlumni.forEach(a => {
      counts[a.department] = (counts[a.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [collegeAlumni]);

  const COLORS = ['#4E715D', '#365443', '#6A8F7A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Real database-backed growth & distribution data
  const growthData = useMemo(() => {
    if (!collegeAlumni || collegeAlumni.length === 0) {
      return [];
    }

    // Tally real alumni from database by graduation batch year
    const batchMap = {};
    collegeAlumni.forEach(alum => {
      const yr = Number(alum.graduationYear);
      if (yr && !isNaN(yr)) {
        if (!batchMap[yr]) {
          batchMap[yr] = { total: 0, verified: 0, pending: 0 };
        }
        batchMap[yr].total += 1;
        if (alum.status === 'active') {
          batchMap[yr].verified += 1;
        } else if (alum.status === 'pending') {
          batchMap[yr].pending += 1;
        }
      }
    });

    const years = Object.keys(batchMap).map(Number).sort((a, b) => a - b);
    if (years.length === 0) return [];

    // Ensure a continuous range from min year (at least 2020) to current/max year
    const minYear = Math.min(...years, 2020);
    const currentYear = new Date().getFullYear();
    const maxYear = Math.max(...years, currentYear);

    const result = [];
    let cumulative = 0;

    for (let y = minYear; y <= maxYear; y++) {
      const stats = batchMap[y] || { total: 0, verified: 0, pending: 0 };
      cumulative += stats.total;
      result.push({
        year: String(y),
        count: stats.total,
        verified: stats.verified,
        pending: stats.pending,
        cumulative: cumulative
      });
    }

    return result;
  }, [collegeAlumni]);

  // Recent 5 registrations
  const recentRegistrations = pendingAlumni.slice(0, 5);

  return (
    <div className="college-dashboard animate-fade-in max-w-7xl mx-auto">
      {/* ── Workspace Header ── */}
      <div className="workspace-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-primary">{college?.name || 'College Administration'}</h2>
              <span className="badge badge-accent text-xs">Official Portal</span>
            </div>
            <p className="text-xs text-secondary">
              College Code: <strong>{college?.code || 'INST-001'}</strong> &bull; {college?.location || 'Campus Administration'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/csv-upload" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Upload size={14} /> Pre-Verify CSV
            </Link>
            <Link to="/verification" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              View Pending ({pendingAlumni.length})
            </Link>
          </div>
        </div>

        {/* Workspace Quick Actions Bar */}
        <div className="workspace-quick-actions">
          <span className="text-xs font-semibold text-tertiary mr-2 flex items-center gap-1">
            <Sparkles size={13} className="text-accent" /> Quick Tools:
          </span>
          <Link to="/csv-upload" className="btn btn-ghost btn-xs text-secondary hover:text-primary">
            <Upload size={13} /> Batch CSV Upload
          </Link>
          <Link to="/survey-builder" className="btn btn-ghost btn-xs text-secondary hover:text-primary">
            <FileText size={13} /> Survey Builder
          </Link>
          <Link to="/verification" className="btn btn-ghost btn-xs text-secondary hover:text-primary">
            <Shield size={13} /> Approvals Queue ({pendingAlumni.length})
          </Link>
        </div>
      </div>

      {/* ── Workspace Tabs Navigation ── */}
      <div className="workspace-tabs-nav">
        <button 
          className={`workspace-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutGrid size={15} /> Overview
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <Shield size={15} /> Verification Queue <span className="tab-badge">{pendingAlumni.length}</span>
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Users size={15} /> Growth & Analytics
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards Strip */}
          <div className="grid grid-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="stat-card-enhanced">
                  <div>
                    <div className="stat-label-text">{stat.label}</div>
                    <div className="stat-main-val mt-1">{stat.value}</div>
                  </div>
                  <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color, color: stat.iconColor }}>
                    <Icon size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="student-dashboard-grid">
            <div className="student-main-column">
              {/* Pending Verifications Table Preview */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="section-title mb-0">Recent Verification Requests</h3>
                  <button onClick={() => setActiveTab('verification')} className="text-xs font-bold text-accent hover:underline">
                    View All ({pendingAlumni.length}) &rarr;
                  </button>
                </div>
                
                {recentRegistrations.length === 0 ? (
                  <div className="empty-state p-6">
                    <div className="empty-icon"><Check size={24} /></div>
                    <h3>All Caught Up!</h3>
                    <p>There are no pending alumni verification requests at the moment.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Dept & Year</th>
                          <th>Email</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRegistrations.map(alum => (
                          <tr key={alum.id}>
                            <td>
                              <div className="font-semibold text-xs text-primary">{alum.firstName} {alum.lastName}</div>
                              <span className="text-[10px] text-secondary">{alum.degree}</span>
                            </td>
                            <td className="text-xs">{alum.department} ({alum.graduationYear})</td>
                            <td className="text-xs">{alum.email}</td>
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                <button 
                                  onClick={() => verifyAlumni(alum.id)} 
                                  className="btn btn-sm btn-ghost text-success p-1"
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </button>
                                <button 
                                  onClick={() => rejectAlumni(alum.id)} 
                                  className="btn btn-sm btn-ghost text-danger p-1"
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="student-sidebar-column">
              {/* Department Breakdown */}
              <div className="card p-5">
                <h3 className="section-title mb-3">Department Share</h3>
                <div className="chart-container mt-2" style={{ height: '180px' }}>
                  <ResponsiveContainer width="100%" height={180} minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie data={deptData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--surface, #ffffff)', borderColor: 'var(--border, #e5e7eb)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: VERIFICATION QUEUE TAB ── */}
      {activeTab === 'verification' && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="section-title mb-0">Pending Verification Queue</h3>
              <p className="text-xs text-secondary mt-0.5">Review and verify registering alumni and student credentials</p>
            </div>
            <Link to="/verification" className="btn btn-primary btn-sm">Full Verification Page &rarr;</Link>
          </div>

          {pendingAlumni.length === 0 ? (
            <div className="empty-state p-8">
              <div className="empty-icon"><Check size={28} /></div>
              <h3>Queue Empty</h3>
              <p className="text-xs text-secondary">All incoming accounts are verified.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Dept & Year</th>
                    <th>Email</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAlumni.map(alum => (
                    <tr key={alum.id}>
                      <td>
                        <div className="font-semibold text-xs text-primary">{alum.firstName} {alum.lastName}</div>
                        <span className="text-[10px] text-secondary">{alum.degree}</span>
                      </td>
                      <td className="text-xs">{alum.department} ({alum.graduationYear})</td>
                      <td className="text-xs">{alum.email}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => verifyAlumni(alum.id)} className="btn btn-primary btn-xs flex items-center gap-1">
                            <Check size={12} /> Approve
                          </button>
                          <button onClick={() => rejectAlumni(alum.id)} className="btn btn-ghost btn-xs text-danger">
                            <X size={12} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: GROWTH & ANALYTICS TAB ── */}
      {activeTab === 'analytics' && (
        <div className="student-dashboard-grid">
          <div className="student-main-column">
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="section-title mb-0">Alumni Registration & Batch Trend</h3>
                  <span className="text-xs text-secondary font-medium">
                    Live Database &bull; {collegeAlumni.length} Total Alumni ({verifiedAlumni.length} Verified, {pendingAlumni.length} Pending)
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-surface-alt p-0.5 rounded-lg border border-light self-start sm:self-auto">
                  <button
                    onClick={() => setGrowthViewMode('batch')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${growthViewMode === 'batch' ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
                  >
                    Per Batch
                  </button>
                  <button
                    onClick={() => setGrowthViewMode('cumulative')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${growthViewMode === 'cumulative' ? 'bg-accent text-white shadow-sm' : 'text-secondary hover:text-primary'}`}
                  >
                    Cumulative Growth
                  </button>
                </div>
              </div>
              <div className="chart-container mt-2" style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={0}>
                  <BarChart data={growthData} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" opacity={0.6} />
                    <XAxis 
                      dataKey="year" 
                      stroke="var(--text-secondary)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={{ stroke: 'var(--border-light)' }} 
                      tickMargin={8} 
                    />
                    <YAxis 
                      stroke="var(--text-secondary)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      width={36} 
                      allowDecimals={false}
                      domain={[0, (dataMax) => Math.max(dataMax + 1, 4)]}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(78, 113, 93, 0.08)', radius: 6 }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div style={{
                              background: 'var(--surface, #ffffff)',
                              border: '1px solid var(--border, #e5e7eb)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              fontSize: 12
                            }}>
                              <p className="font-bold text-primary mb-1">Class of {label}</p>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-4 text-secondary">
                                  <span>Total in Batch:</span>
                                  <span className="font-bold text-primary">{item.count}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-emerald-600">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified:
                                  </span>
                                  <span className="font-semibold">{item.verified}</span>
                                </div>
                                {item.pending > 0 && (
                                  <div className="flex items-center justify-between gap-4 text-amber-600">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending:
                                    </span>
                                    <span className="font-semibold">{item.pending}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-4 text-secondary border-t border-light pt-1 mt-1 text-[11px]">
                                  <span>Cumulative Network:</span>
                                  <span className="font-bold text-primary">{item.cumulative}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle" 
                      wrapperStyle={{ paddingBottom: 12, fontSize: 12, fontWeight: 500 }} 
                    />
                    {growthViewMode === 'batch' ? (
                      <>
                        <Bar 
                          dataKey="verified" 
                          name="Verified Alumni" 
                          fill="var(--accent)" 
                          stackId="a" 
                          radius={[0, 0, 0, 0]} 
                        />
                        <Bar 
                          dataKey="pending" 
                          name="Pending Verification" 
                          fill="#F59E0B" 
                          stackId="a" 
                          radius={[6, 6, 0, 0]} 
                        />
                      </>
                    ) : (
                      <Bar 
                        dataKey="cumulative" 
                        name="Cumulative Alumni" 
                        fill="var(--accent)" 
                        radius={[6, 6, 0, 0]} 
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="student-sidebar-column">
            <div className="card p-6">
              <h3 className="section-title mb-4">Department Distribution</h3>
              <div className="flex flex-col gap-2">
                {deptData.map((d, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="legend-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="truncate max-w-[120px]" title={d.name}>{d.name}</span>
                    </div>
                    <span className="font-bold text-primary">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
