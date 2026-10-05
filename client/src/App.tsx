import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Visitor, Complaint, Notice, DashboardStats } from './types';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ResidentDashboard } from './components/dashboard/ResidentDashboard';
import { GuardDashboard } from './components/dashboard/GuardDashboard';
import { VisitorList } from './components/visitors/VisitorList';
import { ComplaintList } from './components/complaints/ComplaintList';
import { NoticeBoard } from './components/notices/NoticeBoard';
import { SocietyDirectory } from './components/directory/SocietyDirectory';
import { EmergencyModal } from './components/common/EmergencyModal';

export const App: React.FC = () => {
  const { user, role, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show a temporary banner notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch all primary society data
  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [visRes, compRes, notRes, statsRes] = await Promise.allSettled([
        api.getVisitors(),
        api.getComplaints(),
        api.getNotices(),
        api.getDashboardStats()
      ]);

      if (visRes.status === 'fulfilled') setVisitors(visRes.value);
      if (compRes.status === 'fulfilled') setComplaints(compRes.value);
      if (notRes.status === 'fulfilled') setNotices(notRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    } catch (err) {
      console.error('Error fetching society data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, role]);

  // Handler: Create Pass
  const handleCreatePass = async (passData: Partial<Visitor>) => {
    try {
      const newPass = await api.createVisitor(passData);
      showToast(`Gate Pass issued for ${newPass.visitorName} (Code: ${newPass.passCode})`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to issue pass');
    }
  };

  // Handler: Update Visitor Status
  const handleUpdateVisitorStatus = async (id: string, status: string, notes?: string) => {
    try {
      await api.updateVisitorStatus(id, status, notes);
      showToast(`Visitor status updated to ${status.replace('_', ' ').toUpperCase()}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update visitor');
    }
  };

  // Handler: Create Complaint
  const handleCreateComplaint = async (data: any) => {
    try {
      const comp = await api.createComplaint(data);
      showToast(`Maintenance ticket #${comp.ticketNumber} registered successfully!`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to raise complaint');
    }
  };

  // Handler: Update Complaint
  const handleUpdateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      await api.updateComplaint(id, updates);
      showToast(`Complaint ticket updated successfully.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint');
    }
  };

  // Handler: Create Notice
  const handleCreateNotice = async (noticeData: Partial<Notice>) => {
    try {
      await api.createNotice(noticeData);
      showToast(`Notice broadcasted to society bulletin board.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to publish notice');
    }
  };

  // Handler: Acknowledge Notice
  const handleAcknowledgeNotice = async (id: string) => {
    try {
      await api.acknowledgeNotice(id);
      showToast(`Notice receipt acknowledged.`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to acknowledge notice');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-base tracking-wide">Connecting to SmartSociety System...</p>
        <p className="text-xs text-slate-400 mt-1">Initializing MongoDB & Supabase Authentication</p>
      </div>
    );
  }

  const pendingCount = visitors.filter((v) => v.status === 'pending').length;
  const openComplaintsCount = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'closed'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenEmergency={() => setIsEmergencyOpen(true)} />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-bounce-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingVisitorsCount={pendingCount}
          openComplaintsCount={openComplaintsCount}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <>
              {role === 'admin' && (
                <AdminDashboard
                  stats={stats}
                  visitors={visitors}
                  complaints={complaints}
                  notices={notices}
                  onNavigateTab={setActiveTab}
                />
              )}
              {role === 'resident' && (
                <ResidentDashboard
                  visitors={visitors}
                  complaints={complaints}
                  notices={notices}
                  onRefresh={fetchData}
                  onUpdateVisitorStatus={handleUpdateVisitorStatus}
                  onCreatePass={handleCreatePass}
                  onCreateComplaint={handleCreateComplaint}
                  onAcknowledgeNotice={handleAcknowledgeNotice}
                  onNavigateTab={setActiveTab}
                />
              )}
              {role === 'security' && (
                <GuardDashboard
                  visitors={visitors}
                  onRefresh={fetchData}
                  onUpdateStatus={handleUpdateVisitorStatus}
                  onCreatePass={handleCreatePass}
                />
              )}
            </>
          )}

          {activeTab === 'visitors' && (
            <VisitorList
              visitors={visitors}
              onRefresh={fetchData}
              onUpdateStatus={handleUpdateVisitorStatus}
              onCreatePass={handleCreatePass}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintList
              complaints={complaints}
              onRefresh={fetchData}
              onCreateComplaint={handleCreateComplaint}
              onUpdateComplaint={handleUpdateComplaint}
            />
          )}

          {activeTab === 'notices' && (
            <NoticeBoard
              notices={notices}
              onRefresh={fetchData}
              onCreateNotice={handleCreateNotice}
              onAcknowledgeNotice={handleAcknowledgeNotice}
            />
          )}

          {activeTab === 'directory' && <SocietyDirectory />}

          {activeTab === 'guard' && (
            <GuardDashboard
              visitors={visitors}
              onRefresh={fetchData}
              onUpdateStatus={handleUpdateVisitorStatus}
              onCreatePass={handleCreatePass}
            />
          )}
        </main>
      </div>

      {/* Emergency Hotlines Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        contacts={stats?.society?.emergencyContacts || [
          { label: 'Gatehouse Alpha Security', contact: '+91 98888 77665', icon: 'shield' },
          { label: 'Society Secretary Office', contact: '+91 98201 44521', icon: 'building' },
          { label: 'Emergency Plumber (Ganesh)', contact: '+91 98700 23111', icon: 'wrench' },
          { label: 'Emergency Electrician (Mahesh)', contact: '+91 98600 11222', icon: 'zap' },
          { label: 'Jupiter Multispeciality Hospital', contact: '020-6710-8000', icon: 'cross' },
          { label: 'Police Control Room', contact: '100 / 020-2565-1100', icon: 'alert-triangle' }
        ]}
      />
    </div>
  );
};

export default App;
