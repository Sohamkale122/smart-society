import {
  User,
  Visitor,
  Complaint,
  Notice,
  DashboardStats
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5050/api'
    : '/api');

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('smart_society_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // --- Auth ---
  async login(email: string, password?: string): Promise<{ success: boolean; token: string; user: User; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    localStorage.setItem('smart_society_token', data.token);
    return data;
  }

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch current user');
    return data;
  }

  async getDemoAccounts(): Promise<{ success: boolean; accounts: any[] }> {
    const res = await fetch(`${API_BASE_URL}/auth/demo-accounts`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch demo accounts');
    return data;
  }

  // --- Visitors ---
  async getVisitors(params?: { status?: string; hostFlat?: string; search?: string }): Promise<Visitor[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.hostFlat) query.append('hostFlat', params.hostFlat);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/visitors?${query.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch visitors');
    return data.visitors || [];
  }

  async createVisitor(payload: Partial<Visitor>): Promise<Visitor> {
    const res = await fetch(`${API_BASE_URL}/visitors`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create visitor pass');
    return data.visitor;
  }

  async updateVisitorStatus(id: string, status: string, notes?: string): Promise<Visitor> {
    const res = await fetch(`${API_BASE_URL}/visitors/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update visitor status');
    return data.visitor;
  }

  async verifyPassCode(code: string): Promise<Visitor> {
    const res = await fetch(`${API_BASE_URL}/visitors/verify/${encodeURIComponent(code)}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Pass code invalid');
    return data.visitor;
  }

  // --- Complaints ---
  async getComplaints(params?: { status?: string; category?: string; priority?: string; search?: string }): Promise<Complaint[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/complaints?${query.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch complaints');
    return data.complaints || [];
  }

  async createComplaint(payload: { title: string; description: string; category: string; priority: string }): Promise<Complaint> {
    const res = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to file complaint');
    return data.complaint;
  }

  async updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint> {
    const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update complaint');
    return data.complaint;
  }

  // --- Notices ---
  async getNotices(params?: { category?: string; search?: string }): Promise<Notice[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/notices?${query.toString()}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch notices');
    return data.notices || [];
  }

  async createNotice(payload: Partial<Notice>): Promise<Notice> {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to publish notice');
    return data.notice;
  }

  async acknowledgeNotice(id: string): Promise<Notice> {
    const res = await fetch(`${API_BASE_URL}/notices/${id}/acknowledge`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to acknowledge notice');
    return data.notice;
  }

  // --- Analytics & Directory ---
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
    return data.data;
  }

  async getResidentsDirectory(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/analytics/residents`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch directory');
    return data.residents || [];
  }
}

export const api = new ApiService();
