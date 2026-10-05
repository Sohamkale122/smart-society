import React from 'react';
import { X, QrCode, ShieldCheck, Printer, Share2, Clock, Car, Phone, Building } from 'lucide-react';
import { Visitor } from '../../types';

interface DigitalPassBadgeProps {
  visitor: Visitor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalPassBadge: React.FC<DigitalPassBadgeProps> = ({ visitor, isOpen, onClose }) => {
  if (!isOpen || !visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'checked_out':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'denied':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden transform transition-all print:border-none print:shadow-none">
        
        {/* Pass Top Ribbon */}
        <div className="bg-linear-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Gate Entry Pass</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Greenfield Heights CHS</h2>
          <p className="text-xs text-indigo-200">Electronic Visitor Verification System</p>

          <div className="mt-4 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(visitor.status)}`}>
              ● {visitor.status.replace('_', ' ')}
            </span>
            <div className="text-right">
              <span className="text-[10px] text-indigo-300 uppercase block">Pass Code</span>
              <span className="font-mono text-xl font-extrabold text-amber-300 tracking-wider">
                {visitor.passCode}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Divider Simulation */}
        <div className="relative bg-white py-2 flex items-center justify-between">
          <div className="w-4 h-8 bg-slate-900/60 rounded-r-full -ml-2 print:hidden" />
          <div className="border-t-2 border-dashed border-slate-300 flex-1 mx-3" />
          <div className="w-4 h-8 bg-slate-900/60 rounded-l-full -mr-2 print:hidden" />
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-4">
          {/* Visitor & Host Grid */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Visitor</span>
              <p className="font-bold text-slate-800 text-base leading-tight mt-0.5">{visitor.visitorName}</p>
              <p className="text-xs text-slate-500 flex items-center mt-1">
                <Phone className="w-3 h-3 mr-1 text-slate-400" />
                {visitor.phone}
              </p>
              <span className="inline-block mt-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {visitor.purpose} ({visitor.company})
              </span>
            </div>

            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 block">Destination Unit</span>
              <p className="font-black text-indigo-900 text-xl tracking-tight mt-0.5">{visitor.hostFlat}</p>
              <p className="text-xs text-indigo-700 font-medium flex items-center mt-1">
                <Building className="w-3 h-3 mr-1 text-indigo-400" />
                {visitor.hostResidentName}
              </p>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Car className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Vehicle</span>
                <span className="font-mono font-semibold">{visitor.vehicleNumber || 'Pedestrian'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Created</span>
                <span className="font-medium">
                  {new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {visitor.notes && (
            <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-slate-600">
              <span className="font-semibold text-slate-700">Remarks:</span> {visitor.notes}
            </div>
          )}

          {/* Simulated QR & Barcode Section */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center justify-center bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
            <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center relative">
              {/* Scalable Vector QR pattern simulation */}
              <QrCode className="w-full h-full text-slate-800" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <p className="text-[11px] font-mono font-semibold text-slate-500 mt-2">
              SCAN AT MAIN GATE ALPHA • {visitor.passCode}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Valid for one-time admission upon identity check</p>
          </div>
        </div>

        {/* Pass Actions Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/70 flex items-center justify-between print:hidden">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Gate Pass ${visitor.passCode}`,
                  text: `Visitor Pass for Greenfield Heights CHS - Unit ${visitor.hostFlat}. Code: ${visitor.passCode}`
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(`Visitor Pass for Greenfield Heights CHS Unit ${visitor.hostFlat}. Code: ${visitor.passCode}`);
                alert('Pass details copied to clipboard!');
              }
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Pass</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
