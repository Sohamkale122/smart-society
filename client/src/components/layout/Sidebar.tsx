import React from 'react';
import {
  LayoutDashboard,
  Shield,
  UserCheck,
  Wrench,
  Bell,
  Building,
  QrCode,
  Users,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingVisitorsCount: number;
  openComplaintsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingVisitorsCount,
  openComplaintsCount
}) => {
  const { role } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Society Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'visitors',
      label: 'Visitors & Passes',
      icon: UserCheck,
      badge: pendingVisitorsCount > 0 ? pendingVisitorsCount : null
    },
    {
      id: 'complaints',
      label: 'Helpdesk & Repairs',
      icon: Wrench,
      badge: openComplaintsCount > 0 ? openComplaintsCount : null
    },
    {
      id: 'notices',
      label: 'Notices & Circulars',
      icon: Bell,
      badge: null
    },
    {
      id: 'directory',
      label: 'Directory & Amenities',
      icon: Building,
      badge: null
    },
    {
      id: 'guard',
      label: 'Gate Terminal',
      icon: Shield,
      badge: 'Live',
      securityOnly: true
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Main Management
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'Live'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Role Info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Workspace
          </span>
          <p className="font-bold text-slate-800">
            {role === 'admin'
              ? 'Managing Committee Portal'
              : role === 'security'
              ? 'Gatehouse Alpha Terminal'
              : 'Resident Self-Service'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Role: <span className="font-semibold text-indigo-600 capitalize">{role}</span>
          </p>
        </div>
      </div>

      {/* Society Details Card */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-600">Greenfield Heights CHS</p>
        <p>Baner-Pashan Link Rd, Pune</p>
        <p className="text-[10px] text-slate-400">© 2026 SmartSociety ERP</p>
      </div>
    </aside>
  );
};
