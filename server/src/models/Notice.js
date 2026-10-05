import mongoose from 'mongoose';

const acknowledgementSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    residentName: { type: String, required: true },
    flatNumber: { type: String, required: true },
    acknowledgedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    size: { type: String, default: '' },
    url: { type: String, default: '#' },
  },
  { _id: false }
);

const noticeSchema = new mongoose.Schema(
  {
    noticeNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['General', 'Emergency', 'Maintenance', 'AGM / Meeting', 'Events', 'Finance & Dues'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['normal', 'high', 'urgent'],
      default: 'normal',
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'Managing Committee' },
    targetAudience: {
      type: String,
      enum: ['All Residents', 'Block A', 'Block B', 'Block C', 'Block D', 'Owners Only', 'Tenants Only'],
      default: 'All Residents',
    },
    pinned: { type: Boolean, default: false },
    attachments: [attachmentSchema],
    acknowledgements: [acknowledgementSchema],
    expiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

noticeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

export const Notice = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);
