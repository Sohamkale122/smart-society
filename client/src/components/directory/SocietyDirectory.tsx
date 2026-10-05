import React, { useState, useEffect } from 'react';
import {
  Users,
  Building,
  Phone,
  Mail,
  Shield,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';

export const SocietyDirectory: React.FC = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'residents' | 'committee' | 'amenities'>('residents');

  useEffect(() => {
    api.getResidentsDirectory()
      .then((data) => setResidents(data))
      .catch((err) => console.error(err));
  }, []);

  const committeeMembers = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Society Secretary',
      flat: 'A-101',
      phone: '+91 98201 44521',
      email: 'secretary@smartsociety.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Mahendra Dave',
      role: 'Treasurer & Accounts',
      flat: 'C-501',
      phone: '+91 98200 99881',
      email: 'treasurer@smartsociety.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Sunita Kapoor',
      role: 'Cultural & Event Convener',
      flat: 'B-203',
      phone: '+91 98111 88776',
      email: 'cultural@smartsociety.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Col. Virender Rawat',
      role: 'Head of Security & Infrastructure',
      flat: 'D-402',
      phone: '+91 98990 12345',
      email: 'security.comm@smartsociety.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    }
  ];

  const amenities = [
    {
      name: 'Grand Clubhouse & Banquet Hall',
      timings: '06:00 AM – 11:00 PM',
      capacity: '150 Persons',
      rules: 'Booking required 7 days in advance via society office. Audio cutoff strictly 10:00 PM.',
      icon: 'Building'
    },
    {
      name: 'Semi-Olympic Swimming Pool',
      timings: '06:00 AM – 10:00 AM, 04:30 PM – 09:00 PM',
      capacity: 'Coached Sessions',
      rules: 'Proper swimwear mandatory. Tuesday closed for chemical purification.',
      icon: 'Sparkles'
    },
    {
      name: 'High-Tech Gymnasium & Cardio Zone',
      timings: '05:30 AM – 10:30 PM (Daily)',
      capacity: 'Keycard Access',
      rules: 'Wipe equipment after use. Indoor trainers only.',
      icon: 'Sparkles'
    },
    {
      name: 'EV Fast Charging Hub (4 Bays)',
      timings: '24 Hours Automated',
      capacity: 'Type 2 AC / 60kW DC',
      rules: 'Automated billing via society app. Maximum 3-hour charging slot to avoid idle fees.',
      icon: 'Sparkles'
    },
    {
      name: 'Floodlit Tennis & Badminton Courts',
      timings: '06:00 AM – 09:30 PM',
      capacity: '2 Courts',
      rules: 'Slot reservations open 24 hours prior via reception desk.',
      icon: 'Sparkles'
    }
  ];

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    if (!matchesSearch) return false;
    if (blockFilter !== 'All' && r.block !== blockFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Society Directory & Amenities</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore resident contacts, managing committee members, and community amenities.
        </p>
      </div>

      {/* Directory Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('residents')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'residents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Resident Members ({residents.length})
        </button>
        <button
          onClick={() => setActiveTab('committee')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'committee'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Managing Committee ({committeeMembers.length})
        </button>
        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeTab === 'amenities'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Amenities & Clubhouse ({amenities.length})
        </button>
      </div>

      {/* Residents Tab View */}
      {activeTab === 'residents' && (
        <div className="space-y-4">
          <div className="card-enterprise p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search resident name, unit #, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
              {['All', 'Block A', 'Block B', 'Block C', 'Block D'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBlockFilter(b)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                    blockFilter === b ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredResidents.map((res) => (
              <div key={res.id} className="card-enterprise p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {res.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{res.name}</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="font-bold text-indigo-700 text-xs bg-indigo-50 px-1.5 py-0.5 rounded">
                        Unit {res.flatNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">{res.block}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{res.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{res.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Committee Tab View */}
      {activeTab === 'committee' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {committeeMembers.map((cm, idx) => (
            <div key={idx} className="card-enterprise p-5 flex items-start space-x-4">
              <img
                src={cm.avatar}
                alt={cm.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 uppercase">
                  {cm.role}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{cm.name}</h3>
                <p className="text-slate-500 font-medium">Flat Unit: <strong>{cm.flat}</strong></p>
                <div className="pt-2 flex items-center space-x-3 text-slate-600">
                  <a
                    href={`tel:${cm.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{cm.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Amenities Tab View */}
      {activeTab === 'amenities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {amenities.map((am, idx) => (
            <div key={idx} className="card-enterprise p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{am.name}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center text-emerald-700 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {am.timings}
                    </span>
                    <span>•</span>
                    <span>{am.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Guidelines: </span>
                {am.rules}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
