import React from 'react';
import { Phone, Shield, Building2, Wrench, Zap, HeartPulse, AlertTriangle, X } from 'lucide-react';
import { EmergencyContact } from '../../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, contacts }) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield':
        return <Shield className="w-5 h-5 text-emerald-600" />;
      case 'building':
        return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'wrench':
        return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'cross':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Phone className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Emergency Society Hotlines</h3>
              <p className="text-rose-100 text-xs mt-0.5">24/7 Gate, Medical & Maintenance Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {contacts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {getIcon(item.icon)}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-800">{item.label}</h4>
                  <p className="text-xs font-semibold text-slate-500 font-mono tracking-wide">{item.contact}</p>
                </div>
              </div>
              <a
                href={`tel:${item.contact.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-lg border border-rose-200 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
