import { initialUsers, initialVisitors, initialComplaints, initialNotices, societyMetadata } from './mockData.js';
import { getDBStatus } from '../config/db.js';
import { User } from '../models/User.js';
import { Visitor } from '../models/Visitor.js';
import { Complaint } from '../models/Complaint.js';
import { Notice } from '../models/Notice.js';

class DataStore {
  constructor() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.visitors = JSON.parse(JSON.stringify(initialVisitors));
    this.complaints = JSON.parse(JSON.stringify(initialComplaints));
    this.notices = JSON.parse(JSON.stringify(initialNotices));
    this.society = JSON.parse(JSON.stringify(societyMetadata));
  }

  // --- Users ---
  async getUsers() {
    if (getDBStatus().connected) {
      try {
        const users = await User.find();
        if (users.length > 0) return users.map(u => u.toJSON());
      } catch (e) {
        console.warn('MongoDB query failed, using memory store:', e.message);
      }
    }
    return this.users;
  }

  async findUserByEmail(email) {
    if (getDBStatus().connected) {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) return user.toJSON();
      } catch (e) {
        console.warn('MongoDB query failed, using memory store:', e.message);
      }
    }
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    if (getDBStatus().connected) {
      try {
        const user = await User.findById(id);
        if (user) return user.toJSON();
      } catch (e) {
        // fallback
      }
    }
    return this.users.find(u => u.id === id || u._id === id) || null;
  }

  async createUser(userData) {
    const id = 'usr-' + Date.now();
    const newUser = {
      ...userData,
      id,
      _id: id,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    if (getDBStatus().connected) {
      try {
        const doc = await User.create(userData);
        return doc.toJSON();
      } catch (e) {
        console.warn('MongoDB create failed, persisting in-memory:', e.message);
      }
    }
    this.users.push(newUser);
    return newUser;
  }

  // --- Visitors ---
  async getVisitors(filter = {}) {
    if (getDBStatus().connected) {
      try {
        const query = {};
        if (filter.hostFlat) query.hostFlat = filter.hostFlat;
        if (filter.status) query.status = filter.status;
        const visitors = await Visitor.find(query).sort({ createdAt: -1 });
        if (visitors.length > 0) return visitors.map(v => v.toJSON());
      } catch (e) {
        // fallback
      }
    }
    let results = [...this.visitors];
    if (filter.hostFlat) {
      results = results.filter(v => v.hostFlat.toLowerCase() === filter.hostFlat.toLowerCase());
    }
    if (filter.status) {
      results = results.filter(v => v.status === filter.status);
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findVisitorById(id) {
    if (getDBStatus().connected) {
      try {
        const doc = await Visitor.findById(id);
        if (doc) return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    return this.visitors.find(v => v.id === id || v._id === id) || null;
  }

  async createVisitor(visitorData) {
    const id = 'vis-' + Math.floor(100 + Math.random() * 900);
    const passCode = 'VP-' + Math.floor(1000 + Math.random() * 9000);
    const newVisitor = {
      ...visitorData,
      id,
      _id: id,
      passCode: visitorData.passCode || passCode,
      status: visitorData.status || (visitorData.isPreApproved ? 'approved' : 'pending'),
      createdAt: new Date().toISOString()
    };

    if (getDBStatus().connected) {
      try {
        const doc = await Visitor.create(newVisitor);
        return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    this.visitors.unshift(newVisitor);
    return newVisitor;
  }

  async updateVisitor(id, updates) {
    if (getDBStatus().connected) {
      try {
        const doc = await Visitor.findByIdAndUpdate(id, updates, { new: true });
        if (doc) return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    const idx = this.visitors.findIndex(v => v.id === id || v._id === id);
    if (idx !== -1) {
      this.visitors[idx] = { ...this.visitors[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.visitors[idx];
    }
    return null;
  }

  // --- Complaints ---
  async getComplaints(filter = {}) {
    if (getDBStatus().connected) {
      try {
        const query = {};
        if (filter.residentId) query.residentId = filter.residentId;
        if (filter.flatNumber) query.flatNumber = filter.flatNumber;
        if (filter.status) query.status = filter.status;
        const complaints = await Complaint.find(query).sort({ createdAt: -1 });
        if (complaints.length > 0) return complaints.map(c => c.toJSON());
      } catch (e) {
        // fallback
      }
    }
    let results = [...this.complaints];
    if (filter.residentId) {
      results = results.filter(c => c.residentId === filter.residentId);
    }
    if (filter.flatNumber) {
      results = results.filter(c => c.flatNumber.toLowerCase() === filter.flatNumber.toLowerCase());
    }
    if (filter.status) {
      results = results.filter(c => c.status === filter.status);
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findComplaintById(id) {
    if (getDBStatus().connected) {
      try {
        const doc = await Complaint.findById(id);
        if (doc) return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    return this.complaints.find(c => c.id === id || c._id === id) || null;
  }

  async createComplaint(complaintData) {
    const id = 'cmp-' + Math.floor(200 + Math.random() * 800);
    const ticketNumber = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newComplaint = {
      ...complaintData,
      id,
      _id: id,
      ticketNumber,
      status: 'submitted',
      activityLogs: [
        {
          timestamp: new Date().toISOString(),
          action: 'Ticket Raised',
          performedBy: complaintData.residentName || 'Resident',
          notes: 'New maintenance request filed.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (getDBStatus().connected) {
      try {
        const doc = await Complaint.create(newComplaint);
        return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  async updateComplaint(id, updates, performedBy = 'Admin') {
    if (getDBStatus().connected) {
      try {
        const doc = await Complaint.findByIdAndUpdate(id, updates, { new: true });
        if (doc) return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    const idx = this.complaints.findIndex(c => c.id === id || c._id === id);
    if (idx !== -1) {
      const current = this.complaints[idx];
      const logs = current.activityLogs || [];
      if (updates.status && updates.status !== current.status) {
        logs.push({
          timestamp: new Date().toISOString(),
          action: `Status updated to ${updates.status.replace('_', ' ').toUpperCase()}`,
          performedBy,
          notes: updates.resolutionNotes || updates.adminNotes || 'Status changed'
        });
      }
      this.complaints[idx] = {
        ...current,
        ...updates,
        activityLogs: logs,
        updatedAt: new Date().toISOString()
      };
      return this.complaints[idx];
    }
    return null;
  }

  // --- Notices ---
  async getNotices() {
    if (getDBStatus().connected) {
      try {
        const notices = await Notice.find().sort({ pinned: -1, createdAt: -1 });
        if (notices.length > 0) return notices.map(n => n.toJSON());
      } catch (e) {
        // fallback
      }
    }
    return [...this.notices].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.pinned ? -1 : 1;
    });
  }

  async createNotice(noticeData) {
    const id = 'not-' + Math.floor(300 + Math.random() * 700);
    const noticeNumber = 'NOT-2026-' + String(Math.floor(10 + Math.random() * 90));
    const newNotice = {
      ...noticeData,
      id,
      _id: id,
      noticeNumber,
      acknowledgements: [],
      createdAt: new Date().toISOString()
    };

    if (getDBStatus().connected) {
      try {
        const doc = await Notice.create(newNotice);
        return doc.toJSON();
      } catch (e) {
        // fallback
      }
    }
    this.notices.unshift(newNotice);
    return newNotice;
  }

  async acknowledgeNotice(id, residentInfo) {
    const idx = this.notices.findIndex(n => n.id === id || n._id === id);
    if (idx !== -1) {
      const already = this.notices[idx].acknowledgements.find(a => a.userId === residentInfo.userId);
      if (!already) {
        this.notices[idx].acknowledgements.push({
          userId: residentInfo.userId,
          residentName: residentInfo.name,
          flatNumber: residentInfo.flatNumber,
          acknowledgedAt: new Date().toISOString()
        });
      }
      return this.notices[idx];
    }
    return null;
  }

  // --- Society Info & Stats ---
  async getSocietyStats() {
    const allVisitors = await this.getVisitors();
    const allComplaints = await this.getComplaints();
    const allNotices = await this.getNotices();

    const checkedInVisitors = allVisitors.filter(v => v.status === 'checked_in').length;
    const pendingVisitors = allVisitors.filter(v => v.status === 'pending').length;
    const openComplaints = allComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;
    const resolvedComplaints = allComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

    return {
      society: this.society,
      stats: {
        totalFlats: this.society.totalFlats,
        occupiedFlats: this.society.occupiedFlats,
        occupancyRate: Math.round((this.society.occupiedFlats / this.society.totalFlats) * 100),
        activeVisitorsInside: checkedInVisitors,
        pendingApprovals: pendingVisitors,
        totalComplaints: allComplaints.length,
        openComplaints,
        resolvedComplaints,
        activeNotices: allNotices.length,
        securityGatesOnline: 3
      }
    };
  }
}

export const dbStore = new DataStore();
