import React, { useState } from 'react';
import { X, Bell, Pin, FileText, AlertTriangle } from 'lucide-react';
import { Notice, NoticeCategory, NoticePriority } from '../../types';

interface NewNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noticeData: Partial<Notice>) => Promise<void>;
}

export const NewNoticeModal: React.FC<NewNoticeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('General');
  const [priority, setPriority] = useState<NoticePriority>('normal');
  const [targetAudience, setTargetAudience] = useState('All Residents');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide both notice title and announcement content.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        targetAudience,
        pinned
      });
      setTitle('');
      setContent('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-400/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Broadcast Society Notice</h3>
              <p className="text-slate-400 text-xs mt-0.5">Publish circular to resident portal & gate monitors</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Heading <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Scheduled Lift AMC Maintenance on Saturday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="General">General Announcement</option>
                <option value="Emergency">Emergency / Urgent Alert</option>
                <option value="Maintenance">Maintenance & Outages</option>
                <option value="AGM / Meeting">AGM / Society Meeting</option>
                <option value="Events">Festival & Cultural Events</option>
                <option value="Finance & Dues">Finance & Maintenance Dues</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="All Residents">All Society Residents</option>
                <option value="Owners Only">Flat Owners Only</option>
                <option value="Tenants Only">Tenants Only</option>
                <option value="Block A">Block A Residents</option>
                <option value="Block B">Block B Residents</option>
                <option value="Block C">Block C Residents</option>
                <option value="Block D">Block D Residents</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NoticePriority)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="normal">Normal Information</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Red Alert</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="flex items-center">
                  <Pin className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                  Pin to top of bulletin board
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Content & Instructions <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Full details of circular, dates, timings, action required by residents..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Bell className="w-4 h-4" />
              <span>{isSubmitting ? 'Broadcasting...' : 'Publish Circular'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
