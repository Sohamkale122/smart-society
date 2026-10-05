import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Elevator', 'Security', 'Cleanliness', 'Common Area', 'Noise', 'Carpentry', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'in_progress', 'resolved', 'closed'],
      default: 'submitted',
    },
    flatNumber: { type: String, required: true },
    residentName: { type: String, required: true },
    residentId: { type: String, required: true },
    residentPhone: { type: String, default: '' },
    assignedTo: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      role: { type: String, default: '' },
    },
    estimatedCompletion: { type: Date, default: null },
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    residentFeedback: { type: String, default: '' },
    activityLogs: [activityLogSchema],
  },
  {
    timestamps: true,
  }
);

complaintSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

export const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
