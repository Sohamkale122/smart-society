export type UserRole = 'admin' | 'resident' | 'security';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  flatNumber: string;
  block?: string;
  phone: string;
  avatar?: string;
  emergencyContact?: string;
  designation?: string;
  ownershipType?: 'Owner' | 'Tenant' | 'Staff';
  familyMembers?: number;
  vehicles?: string[];
  status?: string;
}

export type VisitorPurpose = 'Guest' | 'Delivery' | 'Service/Repair' | 'Cab' | 'Other';
export type VisitorStatus = 'pending' | 'approved' | 'denied' | 'checked_in' | 'checked_out';

export interface Visitor {
  id: string;
  _id?: string;
  visitorName: string;
  phone: string;
  purpose: VisitorPurpose;
  company: string;
  hostFlat: string;
  hostResidentName: string;
  hostResidentId?: string;
  vehicleNumber: string;
  passCode: string;
  status: VisitorStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  securityGuardName?: string;
  notes?: string;
  isPreApproved: boolean;
  photoUrl?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Elevator'
  | 'Security'
  | 'Cleanliness'
  | 'Common Area'
  | 'Noise'
  | 'Carpentry'
  | 'Other';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ComplaintStatus = 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'closed';

export interface ActivityLog {
  timestamp: string;
  action: string;
  performedBy: string;
  notes: string;
}

export interface Complaint {
  id: string;
  _id?: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  flatNumber: string;
  residentName: string;
  residentId: string;
  residentPhone?: string;
  assignedTo: {
    name: string;
    phone: string;
    role: string;
  } | null;
  estimatedCompletion: string | null;
  resolutionNotes?: string;
  resolvedAt: string | null;
  rating?: number | null;
  residentFeedback?: string | null;
  activityLogs: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export type NoticeCategory = 'General' | 'Emergency' | 'Maintenance' | 'AGM / Meeting' | 'Events' | 'Finance & Dues';
export type NoticePriority = 'normal' | 'high' | 'urgent';

export interface NoticeAttachment {
  name: string;
  size: string;
  url: string;
}

export interface NoticeAcknowledgement {
  userId: string;
  residentName: string;
  flatNumber: string;
  acknowledgedAt: string;
}

export interface Notice {
  id: string;
  _id?: string;
  noticeNumber: string;
  title: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  authorName: string;
  authorRole: string;
  targetAudience: string;
  pinned: boolean;
  attachments?: NoticeAttachment[];
  acknowledgements: NoticeAcknowledgement[];
  createdAt: string;
  expiresAt: string | null;
}

export interface EmergencyContact {
  label: string;
  contact: string;
  icon: string;
}

export interface SocietyInfo {
  name: string;
  registrationNumber: string;
  address: string;
  totalBlocks: number;
  blocks: string[];
  totalFlats: number;
  occupiedFlats: number;
  residentsCount: number;
  securityStaffCount: number;
  maintenanceStaffCount: number;
  gateCount: number;
  amenities: string[];
  emergencyContacts: EmergencyContact[];
}

export interface DashboardStats {
  society: SocietyInfo;
  stats: {
    totalFlats: number;
    occupiedFlats: number;
    occupancyRate: number;
    activeVisitorsInside: number;
    pendingApprovals: number;
    totalComplaints: number;
    openComplaints: number;
    resolvedComplaints: number;
    activeNotices: number;
    securityGatesOnline: number;
  };
  categoryBreakdown: { name: string; value: number }[];
  visitorTrend: { day: string; guests: number; deliveries: number; services: number }[];
  systemStatus: {
    mongodb: { connected: boolean; type: string };
    supabase: { initialized: boolean; url: string; status: string };
  };
}
