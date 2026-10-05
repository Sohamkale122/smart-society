import React, { useState } from 'react';
import {
  Bell,
  Pin,
  AlertTriangle,
  Calendar,
  User,
  Users,
  CheckCircle2,
  Download,
  Plus,
  Search,
  FileText,
  Clock
} from 'lucide-react';
import { Notice, NoticeCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { NewNoticeModal } from './NewNoticeModal';

interface NoticeBoardProps {
  notices: Notice[];
  onRefresh: () => void;
  onCreateNotice: (data: Partial<Notice>) => Promise<void>;
  onAcknowledgeNotice: (id: string) => Promise<void>;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  notices,
  onRefresh,
  onCreateNotice,
  onAcknowledgeNotice
}) => {
  const { role, user } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const urgentNotice = notices.find((n) => n.priority === 'urgent');

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      n.authorName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;

    return true;
  });

  const handleAcknowledge = async (id: string) => {
    try {
      setAcknowledgingId(id);
      await onAcknowledgeNotice(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setAcknowledgingId(null);
    }
  };

  const getCategoryColor = (cat: NoticeCategory) => {
    switch (cat) {
      case 'Emergency':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AGM / Meeting':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Finance & Dues':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Events':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Society Notices & Announcements</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {notices.length} Published
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official circulars, maintenance outages, general body notices, and community updates.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setIsNewNoticeOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        )}
      </div>

      {/* Emergency Alert Banner (if any urgent notice) */}
      {urgentNotice && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-700 text-white shadow-card flex items-start space-x-3.5 animate-pulse-subtle">
          <div className="p-2 bg-white/10 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                High Priority Alert
              </span>
              <span className="text-xs text-rose-100 font-mono">{urgentNotice.noticeNumber}</span>
            </div>
            <h3 className="font-bold text-base mt-1">{urgentNotice.title}</h3>
            <p className="text-xs text-rose-100 mt-1 line-clamp-2 leading-relaxed">{urgentNotice.content}</p>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="card-enterprise p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars, subject, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Notices' },
            { id: 'Emergency', label: 'Urgent' },
            { id: 'Maintenance', label: 'Maintenance' },
            { id: 'AGM / Meeting', label: 'Meetings' },
            { id: 'Finance & Dues', label: 'Finance' },
            { id: 'Events', label: 'Events' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition shrink-0 cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map((notice) => {
          const isAcknowledged = notice.acknowledgements?.some(
            (a) => a.userId === (user?.id || user?._id)
          );

          return (
            <div
              key={notice.id}
              className={`card-enterprise p-5 flex flex-col justify-between relative transition duration-200 ${
                notice.pinned ? 'border-amber-300/80 bg-linear-to-b from-amber-50/20 to-white' : ''
              }`}
            >
              {notice.pinned && (
                <div className="absolute top-3 right-4 flex items-center space-x-1 text-amber-600 text-[11px] font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Pin className="w-3 h-3" />
                  <span>Pinned Circular</span>
                </div>
              )}

              {/* Card Top */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`badge-subtle border ${getCategoryColor(notice.category)}`}>
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{notice.noticeNumber}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">{notice.title}</h3>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>

                {/* Attachments (if any) */}
                {notice.attachments && notice.attachments.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Attachments & Circulars
                    </span>
                    {notice.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="truncate font-medium">{att.name}</span>
                          <span className="text-[10px] text-slate-400">({att.size})</span>
                        </div>
                        <button
                          onClick={() => alert(`Downloading attachment: ${att.name}`)}
                          className="p-1 text-slate-500 hover:text-indigo-600 rounded transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 text-[11px]">
                  <p className="font-semibold text-slate-700">{notice.authorName}</p>
                  <p className="text-slate-400">
                    {notice.authorRole} • {new Date(notice.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <Users className="w-3 h-3 mr-1 text-slate-400" />
                    {notice.acknowledgements?.length || 0} acknowledged
                  </span>

                  {role === 'resident' && (
                    <button
                      onClick={() => handleAcknowledge(notice.id)}
                      disabled={isAcknowledged || acknowledgingId === notice.id}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                        isAcknowledged
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAcknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <NewNoticeModal
        isOpen={isNewNoticeOpen}
        onClose={() => setIsNewNoticeOpen(false)}
        onSubmit={async (data) => {
          await onCreateNotice(data);
          onRefresh();
        }}
      />
    </div>
  );
};
