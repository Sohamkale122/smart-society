import React, { useState } from 'react';
import {
  Search,
  Plus,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  Filter,
  Eye,
  Star,
  ChevronRight
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import { NewComplaintModal } from './NewComplaintModal';

interface ComplaintListProps {
  complaints: Complaint[];
  onRefresh: () => void;
  onCreateComplaint: (data: { title: string; description: string; category: ComplaintCategory; priority: ComplaintPriority }) => Promise<void>;
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
}

export const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  onRefresh,
  onCreateComplaint,
  onUpdateComplaint
}) => {
  const { role, user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.residentName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return c.status === 'in_progress' || c.status === 'under_review';
    if (statusFilter === 'submitted') return c.status === 'submitted';
    if (statusFilter === 'resolved') return c.status === 'resolved' || c.status === 'closed';

    return true;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="badge-subtle bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            In Progress
          </span>
        );
      case 'under_review':
        return (
          <span className="badge-subtle bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            Under Review
          </span>
        );
      case 'resolved':
      case 'closed':
        return (
          <span className="badge-subtle bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="badge-subtle bg-blue-50 text-blue-700 border border-blue-200">
            Submitted
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Urgent</span>;
      case 'high':
        return <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">High</span>;
      case 'medium':
        return <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Medium</span>;
      default:
        return <span className="text-[11px] text-slate-400">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Complaints & Maintenance Helpdesk</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredComplaints.length} Tickets
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track repairs, vendor dispatching, SLAs, and resident satisfaction ratings.
          </p>
        </div>

        {role === 'resident' && (
          <button
            onClick={() => setIsNewComplaintOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>File Maintenance Request</span>
          </button>
        )}
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="card-enterprise p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ticket #, title, resident, unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Elevator">Elevator</option>
            <option value="Common Area">Common Area</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Security">Security</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'submitted', label: 'Pending Review' },
            { id: 'active', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' }
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

      {/* Tickets List View */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredComplaints.length === 0 ? (
          <div className="card-enterprise p-12 text-center text-slate-400">
            <Wrench className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No tickets found</p>
            <p className="text-xs text-slate-400 mt-1">All maintenance issues have been addressed.</p>
          </div>
        ) : (
          filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedComplaint(item);
                setIsDetailOpen(true);
              }}
              className="card-enterprise p-4.5 hover:border-indigo-300 hover:shadow-card transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded">
                      {item.ticketNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                    <span>•</span>
                    <span className="text-xs font-bold text-slate-800">Flat {item.flatNumber}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-2xl">{item.description}</p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center space-x-4 self-end md:self-center">
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {getPriorityBadge(item.priority)}
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    {item.assignedTo?.name && (
                      <span className="ml-1 text-slate-500 font-medium">
                        • Assigned: {item.assignedTo.name.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedComplaint(null);
        }}
        onUpdateComplaint={async (id, updates) => {
          await onUpdateComplaint(id, updates);
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
