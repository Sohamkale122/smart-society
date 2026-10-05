import { dbStore } from '../data/dbStore.js';

export const getVisitors = async (req, res) => {
  try {
    const { status, hostFlat, search } = req.query;
    let filter = {};

    // If resident, only allow viewing their own flat visitors
    if (req.user.role === 'resident') {
      filter.hostFlat = req.user.flatNumber;
    } else if (hostFlat) {
      filter.hostFlat = hostFlat;
    }

    if (status) {
      filter.status = status;
    }

    let visitors = await dbStore.getVisitors(filter);

    if (search) {
      const q = search.toLowerCase();
      visitors = visitors.filter(
        v =>
          v.visitorName.toLowerCase().includes(q) ||
          v.phone.includes(q) ||
          v.hostFlat.toLowerCase().includes(q) ||
          v.passCode.toLowerCase().includes(q) ||
          (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: visitors.length, visitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVisitorById = async (req, res) => {
  try {
    const visitor = await dbStore.findVisitorById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor entry not found' });
    }
    // Residents can only see their own flat's visitor
    if (req.user.role === 'resident' && visitor.hostFlat.toLowerCase() !== req.user.flatNumber.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied to visitor records for other flats.' });
    }
    res.json({ success: true, visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVisitor = async (req, res) => {
  try {
    const { visitorName, phone, purpose, company, hostFlat, vehicleNumber, notes, isPreApproved } = req.body;

    if (!visitorName || !phone) {
      return res.status(400).json({ success: false, message: 'Visitor name and phone number are required.' });
    }

    const assignedFlat = req.user.role === 'resident' ? req.user.flatNumber : (hostFlat || 'A-101');
    const assignedResident = req.user.role === 'resident' ? req.user.name : (req.body.hostResidentName || 'Society Resident');
    const assignedResidentId = req.user.role === 'resident' ? (req.user.id || req.user._id) : '';

    const newVisitor = await dbStore.createVisitor({
      visitorName,
      phone,
      purpose: purpose || 'Guest',
      company: company || (purpose === 'Delivery' ? 'Delivery Partner' : 'Personal'),
      hostFlat: assignedFlat,
      hostResidentName: assignedResident,
      hostResidentId: assignedResidentId,
      vehicleNumber: vehicleNumber || 'None (Pedestrian)',
      notes: notes || '',
      isPreApproved: Boolean(isPreApproved || req.user.role === 'resident'),
      status: req.user.role === 'resident' ? 'approved' : 'pending',
      photoUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 50000)}?auto=format&fit=crop&w=256&q=80`
    });

    res.status(201).json({
      success: true,
      message: req.user.role === 'resident' ? 'Pre-approved visitor pass generated successfully!' : 'Visitor entry logged successfully!',
      visitor: newVisitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVisitorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const visitor = await dbStore.findVisitorById(id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor record not found' });
    }

    const updates = {};
    if (notes !== undefined) updates.notes = notes;

    if (status) {
      updates.status = status;
      if (status === 'checked_in') {
        updates.checkInTime = new Date().toISOString();
        updates.securityGuardName = req.user.name;
      } else if (status === 'checked_out') {
        updates.checkOutTime = new Date().toISOString();
      }
    }

    const updated = await dbStore.updateVisitor(id, updates);
    res.json({ success: true, message: `Visitor status updated to ${status}`, visitor: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPassCode = async (req, res) => {
  try {
    const { code } = req.params;
    const allVisitors = await dbStore.getVisitors();
    const visitor = allVisitors.find(v => v.passCode.toUpperCase() === code.toUpperCase().trim());

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: `No active pass found with code '${code}'. Please verify the pass code.`
      });
    }

    res.json({
      success: true,
      message: 'Pass code verified successfully',
      visitor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
