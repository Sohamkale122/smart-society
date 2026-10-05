import React, { useState } from 'react';
import {
  Search,
  Plus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  QrCode,
  Clock,
  Car,
  Phone,
  UserCheck
} from 'lucide-react';
import { Visitor, VisitorStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DigitalPassBadge } from './DigitalPassBadge';
import { NewPassModal } from './NewPassModal';

interface VisitorListProps {
  visitors: Visitor[];
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: string, notes?: string) => Promise<void>;
  onCreatePass: (passData: Partial<Visitor>) => Promise<void>;
}

export const VisitorList: React.FC<VisitorListProps> = ({
  visitors,
  onRefresh,
  onUpdateStatus,
  onCreatePass
}) => {
  const { role, user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isNewPassOpen, setIsNewPassOpen] = useState(false);
  const [isDigitalPassOpen, setIsDigitalPassOpen] = useState(false);

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      v.hostFlat.toLowerCase().includes(search.toLowerCase()) ||
      v.passCode.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'inside') return v.status === 'checked_in';
    if (statusFilter === 'approved') return v.status === 'approved';
    if (statusFilter === 'pending') return v.status === 'pending';
    if (statusFilter === 'completed') return v.status === 'checked_out';
    return true;
  });

  const getStatusBadge = (status: VisitorStatus) => {
    switch (status) {
      case 'checked_in':
        return (
          <span className="badge-subtle bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Currently Inside
          </span>
        );
      case 'approved':
        return (
          <span className="badge-subtle bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-500" />
            Pre-Approved
          </span>
        );
      case 'pending':
        return (
          <span className="badge-subtle bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            Pending Approval
          </span>
        );
      case 'checked_out':
        return (
          <span className="badge-subtle bg-slate-100 text-slate-600 border border-slate-200">
            <LogOut className="w-3 h-3 text-slate-400" />
            Checked Out
          </span>
        );
      case 'denied':
        return (
          <span className="badge-subtle bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500" />
            Entry Denied
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Gate & Visitor Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredVisitors.length} Logs
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital pass verification, live entry/exit logs & resident approval tracking.
          </p>
        </div>

        <button
          onClick={() => setIsNewPassOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{role === 'resident' ? 'Pre-Approve Guest Pass' : 'Log New Visitor'}</span>
        </button>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="card-enterprise p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search visitor, unit, phone, pass code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'inside', label: 'Inside Premises' },
            { id: 'approved', label: 'Pre-Approved' },
            { id: 'pending', label: 'Pending Gate' },
            { id: 'completed', label: 'Departed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visitor Records Table */}
      <div className="card-enterprise overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Visitor & Pass Code</th>
                <th className="py-3 px-4">Purpose / Agency</th>
                <th className="py-3 px-4">Destination Unit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamps</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No visitor records matching criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50/60 transition">
                    {/* Visitor name & code */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            visitor.photoUrl ||
                            `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80`
                          }
                          alt={visitor.visitorName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{visitor.visitorName}</p>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center">
                              <Phone className="w-2.5 h-2.5 mr-1" />
                              {visitor.phone}
                            </span>
                            <span>•</span>
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                              {visitor.passCode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Purpose */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-700">{visitor.purpose}</span>
                        <p className="text-[11px] text-slate-500">{visitor.company || 'Personal'}</p>
                        {visitor.vehicleNumber && visitor.vehicleNumber !== 'None' && (
                          <div className="flex items-center text-[10px] text-slate-400 mt-0.5 font-mono">
                            <Car className="w-2.5 h-2.5 mr-1" />
                            {visitor.vehicleNumber}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Destination Unit */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-indigo-900 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
                          {visitor.hostFlat}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">{visitor.hostResidentName}</p>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(visitor.status)}</td>

                    {/* Timestamps */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {visitor.checkInTime ? (
                        <div className="text-[11px]">
                          <span className="text-emerald-700 font-medium">In: </span>
                          {new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {visitor.checkOutTime && (
                            <div className="text-slate-400">
                              <span>Out: </span>
                              {new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Logged: {new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Digital Pass Modal Button */}
                        <button
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setIsDigitalPassOpen(true);
                          }}
                          title="View Digital Pass Badge"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {/* Resident approval buttons if pending */}
                        {role === 'resident' && visitor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onUpdateStatus(visitor.id, 'approved', 'Approved by Resident')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onUpdateStatus(visitor.id, 'denied', 'Denied by Resident')}
                              className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold rounded-lg transition"
                            >
                              Deny
                            </button>
                          </>
                        )}

                        {/* Guard / Admin Check-In & Check-Out buttons */}
                        {(role === 'security' || role === 'admin') && (
                          <>
                            {visitor.status === 'approved' && (
                              <button
                                onClick={() => onUpdateStatus(visitor.id, 'checked_in')}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition shadow-xs cursor-pointer"
                              >
                                <LogIn className="w-3 h-3" />
                                <span>Check In</span>
                              </button>
                            )}

                            {visitor.status === 'pending' && (
                              <button
                                onClick={() => onUpdateStatus(visitor.id, 'checked_in')}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition shadow-xs cursor-pointer"
                              >
                                <LogIn className="w-3 h-3" />
                                <span>Verify & In</span>
                              </button>
                            )}

                            {visitor.status === 'checked_in' && (
                              <button
                                onClick={() => onUpdateStatus(visitor.id, 'checked_out')}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold rounded-lg transition shadow-xs cursor-pointer"
                              >
                                <LogOut className="w-3 h-3" />
                                <span>Check Out</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewPassModal
        isOpen={isNewPassOpen}
        onClose={() => setIsNewPassOpen(false)}
        onSubmit={async (passData) => {
          await onCreatePass(passData);
          onRefresh();
        }}
      />

      <DigitalPassBadge
        visitor={selectedVisitor}
        isOpen={isDigitalPassOpen}
        onClose={() => {
          setIsDigitalPassOpen(false);
          setSelectedVisitor(null);
        }}
      />
    </div>
  );
};
