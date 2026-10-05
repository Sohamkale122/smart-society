import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building2,
  Phone,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Database,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergency }) => {
  const { user, role, switchRole, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const rolesList: { role: UserRole; label: string; desc: string; email: string }[] = [
    {
      role: 'admin',
      label: 'Society Admin',
      desc: 'Dr. Rajesh Sharma (Secretary)',
      email: 'admin@smartsociety.com'
    },
    {
      role: 'resident',
      label: 'Resident Flat B-402',
      desc: 'Vikram Malhotra (Owner)',
      email: 'resident@smartsociety.com'
    },
    {
      role: 'security',
      label: 'Security Gate Alpha',
      desc: 'Ramesh Singh (Gatekeeper)',
      email: 'guard@smartsociety.com'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-base tracking-tight text-slate-900">
                Smart<span className="text-indigo-600">Society</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                v2.4 Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              Greenfield Heights Cooperative Housing Society
            </p>
          </div>
        </div>

        {/* Center: Live Role Switcher Pill Bar (For Reviewers / Evaluators) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Switch Role:
          </span>
          {rolesList.map((item) => (
            <button
              key={item.role}
              onClick={() => switchRole(item.role, item.email)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                role === item.role
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Emergency Hotline & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Live Clock */}
          <div className="hidden sm:flex flex-col text-right font-mono text-[11px] text-slate-500 pr-2 border-r border-slate-200">
            <span className="font-semibold text-slate-700">{currentTime}</span>
            <span className="text-[10px] text-emerald-600 font-sans font-medium flex items-center justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              Gate Alpha Online
            </span>
          </div>

          {/* Emergency Hotline Button */}
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition shadow-xs cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="hidden sm:inline">Emergency Help</span>
          </button>

          {/* Current User Role Pill & Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition cursor-pointer"
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                }
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name?.split(' ')[0]}</p>
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                <div className="p-3 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    Unit {user?.flatNumber} • {user?.block}
                  </div>
                </div>

                <div className="py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                    Instant Role Demo Switch
                  </span>
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role, item.email);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        role === item.role
                          ? 'bg-indigo-50 text-indigo-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div>
                        <p>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{item.desc}</p>
                      </div>
                      {role === item.role && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Reset / Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
