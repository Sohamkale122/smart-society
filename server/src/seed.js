import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initialUsers, initialVisitors, initialComplaints, initialNotices } from './data/mockData.js';
import { User } from './models/User.js';
import { Visitor } from './models/Visitor.js';
import { Complaint } from './models/Complaint.js';
import { Notice } from './models/Notice.js';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_society';
  console.log(`Connecting to MongoDB at: ${uri}`);
  await mongoose.connect(uri);

  console.log('Clearing existing society records...');
  await User.deleteMany({});
  await Visitor.deleteMany({});
  await Complaint.deleteMany({});
  await Notice.deleteMany({});

  console.log('Inserting seed users...');
  await User.insertMany(initialUsers);

  console.log('Inserting seed visitors...');
  await Visitor.insertMany(initialVisitors);

  console.log('Inserting seed complaints...');
  await Complaint.insertMany(initialComplaints);

  console.log('Inserting seed notices...');
  await Notice.insertMany(initialNotices);

  console.log('✅ Database seeded successfully with Greenfield Heights CHS data!');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
