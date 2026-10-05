import React, { useState } from 'react';
import {
  X,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UserCheck,
  Send,
  Star,
  Building,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onUpdateComplaint
}) => {
  const { role, user } = useAuth();
  const [status, setStatus] = useState<ComplaintStatus>(complaint?.status || 'submitted');
  const [assignedName, setAssignedName] = useState(complaint?.assignedTo?.name || '');
  const [assignedPhone, setAssignedPhone] = useState(complaint?.assignedTo?.phone || '');
  const [assignedRole, setAssignedRole] = useState(complaint?.assignedTo?.role || '');
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');
  const [rating, setRating] = useState<number>(complaint?.rating || 5);
  const [feedback, setFeedback] = useState(complaint?.residentFeedback || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await onUpdateComplaint(complaint.id, {
        status,
        assignedTo: assignedName ? { name: assignedName, phone: assignedPhone, role: assignedRole } : null,
        resolutionNotes
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResidentFeedback = async () => {
    try {
      setIsUpdating(true);
      await onUpdateComplaint(complaint.id, {
        rating,
        residentFeedback: feedback
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return <span className="badge-subtle bg-rose-50 text-rose-700 border border-rose-200">Urgent SLA (4h)</span>;
      case 'high':
        return <span className="badge-subtle bg-amber-50 text-amber-700 border border-amber-200">High Priority</span>;
      default:
        return <span className="badge-subtle bg-slate-100 text-slate-700 border border-slate-200">Normal</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-400/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-300">{complaint.ticketNumber}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-300">{complaint.category}</span>
              </div>
              <h3 className="font-bold text-base text-white truncate max-w-md">{complaint.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status & Priority Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flat Unit</span>
                <span className="font-bold text-slate-800 text-sm">{complaint.flatNumber}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Resident</span>
                <span className="font-medium text-slate-700 text-xs">{complaint.residentName}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getPriorityBadge(complaint.priority)}
              <span className="badge-subtle bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                ● {complaint.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Issue Description</h4>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs leading-relaxed">
              {complaint.description}
            </div>
          </div>

          {/* Current Assignment / Staff info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                Assigned Technician / Vendor
              </span>
              {complaint.assignedTo?.name ? (
                <div className="text-xs">
                  <p className="font-bold text-indigo-950">{complaint.assignedTo.name}</p>
                  <p className="text-indigo-700 text-[11px]">{complaint.assignedTo.role}</p>
                  <p className="font-mono text-indigo-600 text-[11px] mt-1">{complaint.assignedTo.phone}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No technician assigned yet.</p>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Resolution Remarks
              </span>
              <p className="text-xs text-slate-700">
                {complaint.resolutionNotes || 'Investigation / repair notes will appear here once updated.'}
              </p>
            </div>
          </div>

          {/* Activity Log Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Activity Timeline</h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
              {complaint.activityLogs?.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-slate-400 text-[10px] ml-2">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">By {log.performedBy}</p>
                    {log.notes && (
                      <p className="text-slate-600 text-xs bg-slate-50 p-2 rounded-lg mt-1 border border-slate-200/60">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Management Section */}
          {role === 'admin' && (
            <form onSubmit={handleAdminUpdate} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Admin Dispatch & Status Control
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Update Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assign Vendor / Tech Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ganesh Mhatre (Plumber)"
                    value={assignedName}
                    onChange={(e) => setAssignedName(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Resolution Work Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details of action taken or vendor findings..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                >
                  {isUpdating ? 'Saving...' : 'Update Ticket'}
                </button>
              </div>
            </form>
          )}

          {/* Resident Rating & Feedback (if resolved) */}
          {(complaint.status === 'resolved' || complaint.status === 'closed') && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                Service Completion & Resident Review
              </h4>
              {complaint.rating ? (
                <div>
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= complaint.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{complaint.rating} / 5 Stars</span>
                  </div>
                  {complaint.residentFeedback && (
                    <p className="text-xs text-slate-600 italic mt-1.5">"{complaint.residentFeedback}"</p>
                  )}
                </div>
              ) : role === 'resident' ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">Please rate the promptness and quality of this repair:</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add brief feedback for society records..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-emerald-200 bg-white"
                  />
                  <button
                    onClick={handleResidentFeedback}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Submit Feedback
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Awaiting resident rating and review.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
