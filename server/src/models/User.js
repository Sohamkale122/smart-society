import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'resident', 'security'],
      default: 'resident',
      required: true,
    },
    flatNumber: { type: String, required: true },
    block: { type: String, default: 'Block A' },
    phone: { type: String, required: true },
    avatar: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    designation: { type: String, default: '' },
    ownershipType: { type: String, enum: ['Owner', 'Tenant', 'Staff'], default: 'Owner' },
    familyMembers: { type: Number, default: 1 },
    vehicles: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

// Format user output for API
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.password;
  return obj;
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
