import { dbStore } from '../data/dbStore.js';

export const getComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    let filter = {};

    // Resident only views their own flat's complaints
    if (req.user.role === 'resident') {
      filter.flatNumber = req.user.flatNumber;
    }

    if (status) filter.status = status;

    let complaints = await dbStore.getComplaints(filter);

    if (category) {
      complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (priority) {
      complaints = complaints.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.ticketNumber.toLowerCase().includes(q) ||
          c.flatNumber.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.assignedTo && c.assignedTo.name && c.assignedTo.name.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await dbStore.findComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
    }

    if (req.user.role === 'resident' && complaint.flatNumber.toLowerCase() !== req.user.flatNumber.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied: You can only view tickets for your unit.' });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
    }

    const flatNumber = req.user.role === 'resident' ? req.user.flatNumber : (req.body.flatNumber || 'General Area');
    const residentName = req.user.role === 'resident' ? req.user.name : (req.body.residentName || 'Society Member');
    const residentId = req.user.id || req.user._id || 'usr-temp';

    const newTicket = await dbStore.createComplaint({
      title,
      description,
      category,
      priority: priority || 'medium',
      flatNumber,
      residentName,
      residentId,
      residentPhone: req.user.phone || '+91 99000 00000',
      assignedTo: null,
      resolutionNotes: ''
    });

    res.status(201).json({
      success: true,
      message: `Complaint registered successfully with Ticket ID #${newTicket.ticketNumber}`,
      complaint: newTicket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionNotes, estimatedCompletion, rating, residentFeedback } = req.body;

    const existing = await dbStore.findComplaintById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
    }

    const updates = {};
    if (status) {
      updates.status = status;
      if (status === 'resolved') {
        updates.resolvedAt = new Date().toISOString();
      }
    }
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;
    if (estimatedCompletion !== undefined) updates.estimatedCompletion = estimatedCompletion;
    if (rating !== undefined) updates.rating = rating;
    if (residentFeedback !== undefined) updates.residentFeedback = residentFeedback;

    const updated = await dbStore.updateComplaint(id, updates, req.user.name);
    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
