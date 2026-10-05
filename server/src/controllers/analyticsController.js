import { dbStore } from '../data/dbStore.js';
import { getDBStatus } from '../config/db.js';
import { getSupabaseStatus } from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
  try {
    const data = await dbStore.getSocietyStats();
    const visitors = await dbStore.getVisitors();
    const complaints = await dbStore.getComplaints();

    // Category breakdown for complaints
    const categoryCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Weekly visitor trend (past 7 days simulation based on current day)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const visitorTrend = days.map((day, idx) => ({
      day,
      guests: 18 + (idx * 5) % 15,
      deliveries: 35 + (idx * 7) % 22,
      services: 8 + (idx * 3) % 9
    }));

    // System connectivity statuses
    const dbStatus = getDBStatus();
    const supabaseStatus = getSupabaseStatus();

    res.json({
      success: true,
      data: {
        ...data,
        categoryBreakdown,
        visitorTrend,
        systemStatus: {
          mongodb: dbStatus,
          supabase: supabaseStatus
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResidentsDirectory = async (req, res) => {
  try {
    const users = await dbStore.getUsers();
    const residents = users
      .filter(u => u.role === 'resident' || u.role === 'admin')
      .map(u => ({
        id: u.id || u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        flatNumber: u.flatNumber,
        block: u.block,
        role: u.role,
        ownershipType: u.ownershipType || 'Owner',
        vehicles: u.vehicles || []
      }));

    res.json({ success: true, count: residents.length, residents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
