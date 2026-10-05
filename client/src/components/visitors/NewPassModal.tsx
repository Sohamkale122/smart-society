import React, { useState } from 'react';
import { X, UserPlus, Car, Phone, ShieldCheck, Tag } from 'lucide-react';
import { Visitor, VisitorPurpose } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface NewPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passData: Partial<Visitor>) => Promise<void>;
}

export const NewPassModal: React.FC<NewPassModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user, role } = useAuth();

  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState<VisitorPurpose>('Guest');
  const [company, setCompany] = useState('');
  const [hostFlat, setHostFlat] = useState(user?.flatNumber || 'B-402');
  const [hostResidentName, setHostResidentName] = useState(user?.name || '');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      setError('Please provide visitor name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide contact phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        visitorName: visitorName.trim(),
        phone: phone.trim(),
        purpose,
        company: company.trim() || (purpose === 'Delivery' ? 'Delivery Agent' : purpose === 'Cab' ? 'Cab Driver' : 'Personal'),
        hostFlat: role === 'resident' ? user?.flatNumber || 'B-402' : hostFlat.trim(),
        hostResidentName: role === 'resident' ? user?.name || '' : hostResidentName.trim(),
        vehicleNumber: vehicleNumber.trim() || 'Pedestrian / None',
        notes: notes.trim(),
        isPreApproved: role === 'resident'
      });
      // reset
      setVisitorName('');
      setPhone('');
      setCompany('');
      setVehicleNumber('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate visitor pass');
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {role === 'resident' ? 'Generate Pre-Approved Gate Pass' : 'Log New Visitor Entry'}
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                {role === 'resident'
                  ? 'Your visitor will receive an instant digital entry code'
                  : 'Record entry at Security Gate Alpha'}
              </p>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visitor Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as VisitorPurpose)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="Guest">Guest / Friend / Family</option>
                <option value="Delivery">Delivery (Food / Ecommerce)</option>
                <option value="Service/Repair">Service / Technician / Maid</option>
                <option value="Cab">Cab / Taxi Pickup</option>
                <option value="Other">Official / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Agency</label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Amazon, Personal"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* If admin or guard, allow specifying host flat */}
          {role !== 'resident' ? (
            <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <div>
                <label className="block text-xs font-semibold text-indigo-900 mb-1">Host Flat Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-402, A-101"
                  value={hostFlat}
                  onChange={(e) => setHostFlat(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-900 mb-1">Resident Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={hostResidentName}
                  onChange={(e) => setHostResidentName(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-700">Destination Flat:</span> {user?.flatNumber} ({user?.name})
              </div>
              <span className="inline-flex items-center text-emerald-600 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Resident Host
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Plate No. (Optional)</label>
              <div className="relative">
                <Car className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. MH-12-AB-1234"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 uppercase font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Instructions / Remarks</label>
              <input
                type="text"
                placeholder="e.g. Leave package at door"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
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
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Pass...' : 'Issue Gate Pass'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
