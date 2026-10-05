import React from 'react';
import {
  Building2,
  Users,
  UserCheck,
  Wrench,
  Bell,
  TrendingUp,
  Database,
  Cloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DashboardStats, Visitor, Complaint, Notice } from '../../types';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  visitors: Visitor[];
  complaints: Complaint[];
  notices: Notice[];
  onNavigateTab: (tab: string) => void;
}

const CATEGORY_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  visitors,
  complaints,
  notices,
  onNavigateTab
}) => {
  const activeInside = visitors.filter((v) => v.status === 'checked_in');
  const openComplaints = complaints.filter((c) => c.status !== 'resolved' && c.status !== 'closed');
  const urgentComplaints = openComplaints.filter((c) => c.priority === 'urgent' || c.priority === 'high');

  const visitorTrendData = stats?.visitorTrend || [
    { day: 'Mon', guests: 22, deliveries: 45, services: 12 },
    { day: 'Tue', guests: 18, deliveries: 52, services: 8 },
    { day: 'Wed', guests: 25, deliveries: 48, services: 14 },
    { day: 'Thu', guests: 20, deliveries: 60, services: 10 },
    { day: 'Fri', guests: 35, deliveries: 70, services: 16 },
    { day: 'Sat', guests: 58, deliveries: 65, services: 24 },
    { day: 'Sun', guests: 64, deliveries: 55, services: 18 }
  ];

  const categoryBreakdown = stats?.categoryBreakdown || [
    { name: 'Plumbing', value: 3 },
    { name: 'Electrical', value: 2 },
    { name: 'Elevator', value: 1 },
    { name: 'Common Area', value: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Society Overview Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold mb-1">
              <Building2 className="w-4 h-4" />
              <span>Society Administration & Facility Command</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Greenfield Heights CHS — Operations
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Registration: PNA/HSG/TC/14022/2012 • 4 Blocks (A, B, C, D) • 160 Units
            </p>
          </div>

          {/* Database & Cloud Live Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB: Live Connected</span>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Cloud className="w-3.5 h-3.5" />
              <span>Supabase: Active</span>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div
            onClick={() => onNavigateTab('directory')}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition cursor-pointer border border-white/5"
          >
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Residential Units</span>
            <p className="text-xl font-black text-white mt-0.5">148 / 160</p>
            <span className="text-[11px] text-emerald-400 font-medium">93% Occupied</span>
          </div>

          <div
            onClick={() => onNavigateTab('visitors')}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition cursor-pointer border border-white/5"
          >
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Inside</span>
            <p className="text-xl font-black text-white mt-0.5">{activeInside.length} Visitors</p>
            <span className="text-[11px] text-indigo-300 font-medium">Gate Alpha Ledger</span>
          </div>

          <div
            onClick={() => onNavigateTab('complaints')}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition cursor-pointer border border-white/5"
          >
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Helpdesk Tickets</span>
            <p className="text-xl font-black text-white mt-0.5">{openComplaints.length} Open</p>
            <span className="text-[11px] text-amber-300 font-medium">{urgentComplaints.length} Urgent Priority</span>
          </div>

          <div
            onClick={() => onNavigateTab('notices')}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition cursor-pointer border border-white/5"
          >
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Circulars</span>
            <p className="text-xl font-black text-white mt-0.5">{notices.length} Published</p>
            <span className="text-[11px] text-indigo-300 font-medium">Bulletin Active</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Visitor Traffic Bar Chart */}
        <div className="card-enterprise p-5 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gate Entry Traffic Trends</h3>
              <p className="text-xs text-slate-400">Weekly breakdown by Guest, Delivery and Maintenance Services</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorTrendData} barSize={12}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="deliveries" name="Deliveries (E-com/Food)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="guests" name="Guests & Visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="services" name="Technicians / Staff" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Category Breakdown Donut */}
        <div className="card-enterprise p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Complaints by Category</h3>
              <p className="text-xs text-slate-400">Distribution of service requests</p>
            </div>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                />
                <span className="truncate">{cat.name}: <strong>{cat.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Operational Streams: Recent Gate Logs & Pending Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Visitors */}
        <div className="card-enterprise p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Recent Gate Entries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('visitors')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center cursor-pointer"
            >
              <span>Manage Passes</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {visitors.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{v.visitorName}</p>
                  <p className="text-[11px] text-slate-500">
                    Unit <strong>{v.hostFlat}</strong> • {v.purpose} ({v.company})
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`badge-subtle ${
                      v.status === 'checked_in'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {v.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{v.passCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Helpdesk Tickets */}
        <div className="card-enterprise p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Priority Maintenance Tickets</h3>
            </div>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center cursor-pointer"
            >
              <span>Helpdesk Board</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {c.ticketNumber}
                    </span>
                    <span className="font-bold text-slate-800">Unit {c.flatNumber}</span>
                  </div>
                  <p className="font-medium text-slate-900 mt-1 truncate max-w-xs">{c.title}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`badge-subtle capitalize ${
                      c.status === 'in_progress'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {c.status.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{c.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
