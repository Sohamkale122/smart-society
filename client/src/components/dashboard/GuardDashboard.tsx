import React, { useState } from 'react';
import {
  Shield,
  Search,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  UserPlus,
  Car,
  Phone,
  Clock,
  Building,
  RefreshCw
} from 'lucide-react';
import { Visitor } from '../../types';
import { api } from '../../services/api';
import { DigitalPassBadge } from '../visitors/DigitalPassBadge';
import { NewPassModal } from '../visitors/NewPassModal';

interface GuardDashboardProps {
  visitors: Visitor[];
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: string, notes?: string) => Promise<void>;
  onCreatePass: (data: Partial<Visitor>) => Promise<void>;
}

export const GuardDashboard: React.FC<GuardDashboardProps> = ({
  visitors,
  onRefresh,
  onUpdateStatus,
  onCreatePass
}) => {
  const [passCodeInput, setPassCodeInput] = useState('');
  const [verifiedVisitor, setVerifiedVisitor] = useState<Visitor | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedPass, setSelectedPass] = useState<Visitor | null>(null);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [isNewPassOpen, setIsNewPassOpen] = useState(false);

  const activeInside = visitors.filter((v) => v.status === 'checked_in');
  const pendingApprovals = visitors.filter((v) => v.status === 'pending');

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passCodeInput.trim()) return;

    try {
      setIsVerifying(true);
      setVerifyError('');
      setVerifiedVisitor(null);
      const visitor = await api.verifyPassCode(passCodeInput.trim());
      setVerifiedVisitor(visitor);
    } catch (err: any) {
      setVerifyError(err.message || 'Pass code not found or expired');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickAction = async (id: string, action: string) => {
    await onUpdateStatus(id, action);
    if (verifiedVisitor && verifiedVisitor.id === id) {
      setVerifiedVisitor({ ...verifiedVisitor, status: action as any });
    }
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Security Post Terminal */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Live Gate Command Terminal
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Gate Alpha Main Entrance</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight mt-1 text-white">
                Visitor Access Verification
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNewPassOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Log Walk-in Visitor</span>
            </button>
            <button
              onClick={onRefresh}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              title="Refresh gate data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Code Verification Input */}
        <form onSubmit={handleVerifyCode} className="mt-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <QrCode className="w-5 h-5 text-indigo-300 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Visitor Pass Code (e.g. VP-4821 or VP-7712)..."
                value={passCodeInput}
                onChange={(e) => setPassCodeInput(e.target.value.toUpperCase())}
                className="w-full text-base font-mono uppercase bg-transparent text-white placeholder:text-slate-400 pl-12 pr-4 py-3 focus:outline-none tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying || !passCodeInput.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Searching...' : 'Scan / Verify Pass'}
            </button>
          </div>
        </form>

        {/* Verification Result Card */}
        {verifyError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{verifyError}</span>
          </div>
        )}

        {verifiedVisitor && (
          <div className="mt-4 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {verifiedVisitor.visitorName[0]}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-300">{verifiedVisitor.passCode}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-semibold text-indigo-200 capitalize">
                      {verifiedVisitor.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{verifiedVisitor.visitorName}</h3>
                  <p className="text-xs text-slate-300">
                    Visiting Unit: <strong className="text-white">{verifiedVisitor.hostFlat}</strong> ({verifiedVisitor.hostResidentName})
                  </p>
                </div>
              </div>

              {/* Instant Gate Actions */}
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => {
                    setSelectedPass(verifiedVisitor);
                    setIsBadgeOpen(true);
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition cursor-pointer"
                >
                  View Digital Pass
                </button>

                {verifiedVisitor.status !== 'checked_in' && verifiedVisitor.status !== 'checked_out' && (
                  <button
                    onClick={() => handleQuickAction(verifiedVisitor.id, 'checked_in')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Authorize Entry (Check In)</span>
                  </button>
                )}

                {verifiedVisitor.status === 'checked_in' && (
                  <button
                    onClick={() => handleQuickAction(verifiedVisitor.id, 'checked_out')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Confirm Exit (Check Out)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-enterprise p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Currently Inside
            </span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{activeInside.length} Visitors</p>
            <p className="text-[11px] text-emerald-600 font-medium">On-site in residential towers</p>
          </div>
        </div>

        <div className="card-enterprise p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Approvals
            </span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{pendingApprovals.length} Gate Requests</p>
            <p className="text-[11px] text-amber-600 font-medium">Awaiting resident phone/app approval</p>
          </div>
        </div>

        <div className="card-enterprise p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Active Gates
            </span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">3 Gatehouses</p>
            <p className="text-[11px] text-indigo-600 font-medium">Gate Alpha, Bravo & Cargo 24x7</p>
          </div>
        </div>
      </div>

      {/* Live Gate Entry Ledger */}
      <div className="card-enterprise overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900">Today's Gate Movement Ledger</h2>
          <span className="text-xs text-slate-500">Auto-refreshing gate ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Visitor / Pass</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Host Flat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4 text-right">Quick Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.slice(0, 8).map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{v.visitorName}</p>
                    <p className="text-[11px] font-mono text-indigo-600 font-semibold">{v.passCode}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-700">{v.purpose}</span>
                    <span className="text-[11px] text-slate-400 block">{v.company}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {v.hostFlat}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge-subtle ${
                        v.status === 'checked_in'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : v.status === 'approved'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : v.status === 'checked_out'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {v.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{v.vehicleNumber || 'Pedestrian'}</td>
                  <td className="py-3 px-4 text-right">
                    {v.status !== 'checked_in' && v.status !== 'checked_out' && (
                      <button
                        onClick={() => handleQuickAction(v.id, 'checked_in')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px] transition shadow-xs cursor-pointer"
                      >
                        Check In
                      </button>
                    )}
                    {v.status === 'checked_in' && (
                      <button
                        onClick={() => handleQuickAction(v.id, 'checked_out')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-[11px] transition shadow-xs cursor-pointer"
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DigitalPassBadge
        visitor={selectedPass}
        isOpen={isBadgeOpen}
        onClose={() => {
          setIsBadgeOpen(false);
          setSelectedPass(null);
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
    </div>
  );
};
