import React, { useState } from 'react';
import {
  Home,
  UserCheck,
  Wrench,
  Bell,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  Car,
  Phone,
  QrCode,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Visitor, Complaint, Notice } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DigitalPassBadge } from '../visitors/DigitalPassBadge';
import { NewPassModal } from '../visitors/NewPassModal';
import { NewComplaintModal } from '../complaints/NewComplaintModal';

interface ResidentDashboardProps {
  visitors: Visitor[];
  complaints: Complaint[];
  notices: Notice[];
  onRefresh: () => void;
  onUpdateVisitorStatus: (id: string, status: string, notes?: string) => Promise<void>;
  onCreatePass: (data: Partial<Visitor>) => Promise<void>;
  onCreateComplaint: (data: any) => Promise<void>;
  onAcknowledgeNotice: (id: string) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  visitors,
  complaints,
  notices,
  onRefresh,
  onUpdateVisitorStatus,
  onCreatePass,
  onCreateComplaint,
  onAcknowledgeNotice,
  onNavigateTab
}) => {
  const { user } = useAuth();
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isDigitalPassOpen, setIsDigitalPassOpen] = useState(false);
  const [isNewPassOpen, setIsNewPassOpen] = useState(false);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);

  // Filter only for this resident's unit
  const myVisitors = visitors.filter(
    (v) => v.hostFlat.toLowerCase() === (user?.flatNumber || 'B-402').toLowerCase()
  );
  const myComplaints = complaints.filter(
    (c) => c.flatNumber.toLowerCase() === (user?.flatNumber || 'B-402').toLowerCase()
  );
  const activeGateVisitors = myVisitors.filter(
    (v) => v.status === 'checked_in' || v.status === 'pending' || v.status === 'approved'
  );
  const openComplaints = myComplaints.filter((c) => c.status !== 'resolved' && c.status !== 'closed');
  const urgentNotice = notices.find((n) => n.priority === 'urgent');

  return (
    <div className="space-y-6">
      {/* Resident Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Unit {user?.flatNumber || 'B-402'} • {user?.block || 'Block B'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-indigo-300 font-semibold">{user?.ownershipType || 'Owner'}</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight mt-1 text-white">
                Welcome home, {user?.name}!
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Greenfield Heights CHS Resident Portal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsNewPassOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Pre-Approve Guest</span>
            </button>
            <button
              onClick={() => setIsNewComplaintOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Raise Ticket</span>
            </button>
          </div>
        </div>

        {/* Quick Resident Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registered Unit</span>
            <p className="font-bold text-white text-sm">{user?.flatNumber || 'B-402'}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Visitors</span>
            <p className="font-bold text-emerald-400 text-sm">{activeGateVisitors.length} at Gate/Inside</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Open Tickets</span>
            <p className="font-bold text-amber-300 text-sm">{openComplaints.length} Ongoing</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Vehicles Tagged</span>
            <p className="font-bold text-white text-sm">2 RFID Passes</p>
          </div>
        </div>
      </div>

      {/* Urgent Society Alert (if any) */}
      {urgentNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold uppercase tracking-wider text-amber-800 text-[10px] block">
              Urgent Notice from Managing Committee
            </span>
            <p className="font-bold text-sm text-amber-950 mt-0.5">{urgentNotice.title}</p>
            <p className="text-amber-800/80 mt-1 line-clamp-1">{urgentNotice.content}</p>
          </div>
          <button
            onClick={() => onNavigateTab('notices')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 px-2 py-1 rounded bg-amber-100/80 shrink-0 cursor-pointer"
          >
            Read Notice
          </button>
        </div>
      )}

      {/* Main Resident Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: My Visitors & Gate Activity */}
        <div className="card-enterprise p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-base">My Visitors & Delivery Passes</h2>
            </div>
            <button
              onClick={() => onNavigateTab('visitors')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myVisitors.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <UserCheck className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                <p className="text-xs">No active visitor passes for your flat.</p>
              </div>
            ) : (
              myVisitors.slice(0, 4).map((vis) => (
                <div
                  key={vis.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {vis.visitorName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{vis.visitorName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {vis.purpose} ({vis.company}) • <span className="font-mono text-indigo-600">{vis.passCode}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedVisitor(vis);
                        setIsDigitalPassOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition cursor-pointer"
                      title="View Pass"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    {vis.status === 'pending' ? (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onUpdateVisitorStatus(vis.id, 'approved', 'Approved by Resident')}
                          className="px-2 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onUpdateVisitorStatus(vis.id, 'denied', 'Denied by Resident')}
                          className="px-2 py-1 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-lg"
                        >
                          Deny
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`badge-subtle ${
                          vis.status === 'checked_in'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : vis.status === 'approved'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {vis.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: My Maintenance Tickets */}
        <div className="card-enterprise p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Wrench className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-base">My Maintenance Tickets</h2>
            </div>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-3">
            {myComplaints.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-1 text-emerald-400" />
                <p className="text-xs font-medium text-slate-600">No active complaints</p>
                <p className="text-[11px] text-slate-400">Everything is running smoothly in your unit!</p>
              </div>
            ) : (
              myComplaints.slice(0, 4).map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onNavigateTab('complaints')}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold text-sm">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {ticket.ticketNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">{ticket.category}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mt-0.5 truncate max-w-xs">{ticket.title}</h4>
                    </div>
                  </div>

                  <span
                    className={`badge-subtle capitalize ${
                      ticket.status === 'resolved' || ticket.status === 'closed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ticket.status === 'in_progress'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <DigitalPassBadge
        visitor={selectedVisitor}
        isOpen={isDigitalPassOpen}
        onClose={() => {
          setIsDigitalPassOpen(false);
          setSelectedVisitor(null);
        }}
      />

      <NewPassModal
        isOpen={isNewPassOpen}
        onClose={() => setIsNewPassOpen(false)}
        onSubmit={async (data) => {
          await onCreatePass(data);
          onRefresh();
        }}
      />

      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSubmit={async (data) => {
          await onCreateComplaint(data);
          onRefresh();
        }}
      />
    </div>
  );
};
