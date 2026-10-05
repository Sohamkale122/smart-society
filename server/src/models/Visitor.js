import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    purpose: {
      type: String,
      enum: ['Guest', 'Delivery', 'Service/Repair', 'Cab', 'Other'],
      default: 'Guest',
    },
    company: { type: String, default: 'Personal' },
    hostFlat: { type: String, required: true },
    hostResidentName: { type: String, default: '' },
    hostResidentId: { type: String, default: '' },
    vehicleNumber: { type: String, default: 'None' },
    passCode: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'checked_in', 'checked_out'],
      default: 'pending',
    },
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    securityGuardName: { type: String, default: '' },
    notes: { type: String, default: '' },
    isPreApproved: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

visitorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  return obj;
};

export const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
