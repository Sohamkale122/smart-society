export const initialUsers = [
  {
    id: "usr-admin-1",
    name: "Dr. Rajesh Sharma",
    email: "admin@smartsociety.com",
    password: "admin123password",
    role: "admin",
    flatNumber: "A-101",
    block: "Block A",
    phone: "+91 98201 44521",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    designation: "Society Secretary",
    status: "active",
    createdAt: new Date("2024-01-15T09:00:00Z")
  },
  {
    id: "usr-res-1",
    name: "Vikram Malhotra",
    email: "resident@smartsociety.com",
    password: "resident123password",
    role: "resident",
    flatNumber: "B-402",
    block: "Block B",
    phone: "+91 98450 12890",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    emergencyContact: "+91 98450 99881",
    ownershipType: "Owner",
    familyMembers: 3,
    vehicles: ["MH-12-PQ-9081 (Car)", "MH-12-KM-4421 (Bike)"],
    status: "active",
    createdAt: new Date("2024-02-10T10:30:00Z")
  },
  {
    id: "usr-res-2",
    name: "Ananya Deshmukh",
    email: "ananya.d@smartsociety.com",
    password: "resident123password",
    role: "resident",
    flatNumber: "A-304",
    block: "Block A",
    phone: "+91 97654 32109",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    emergencyContact: "+91 97654 11223",
    ownershipType: "Owner",
    familyMembers: 2,
    vehicles: ["MH-12-TR-2311 (Car)"],
    status: "active",
    createdAt: new Date("2024-03-01T12:00:00Z")
  },
  {
    id: "usr-res-3",
    name: "Rohan & Priya Iyer",
    email: "rohan.iyer@smartsociety.com",
    password: "resident123password",
    role: "resident",
    flatNumber: "C-201",
    block: "Block C",
    phone: "+91 91234 56780",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    emergencyContact: "+91 91234 99999",
    ownershipType: "Tenant",
    familyMembers: 2,
    vehicles: ["MH-12-ZZ-5500 (Car)"],
    status: "active",
    createdAt: new Date("2024-04-12T08:00:00Z")
  },
  {
    id: "usr-guard-1",
    name: "Ramesh Singh (Head Gatekeeper)",
    email: "guard@smartsociety.com",
    password: "guard123password",
    role: "security",
    flatNumber: "Gate 1 - Main Entrance",
    block: "Gatehouse Alpha",
    phone: "+91 98888 77665",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
    shift: "Morning (07:00 - 19:00)",
    status: "active",
    createdAt: new Date("2024-01-01T06:00:00Z")
  }
];

export const initialVisitors = [
  {
    id: "vis-101",
    visitorName: "Amitabh Verma",
    phone: "+91 98112 33445",
    purpose: "Guest",
    company: "Personal",
    hostFlat: "B-402",
    hostResidentName: "Vikram Malhotra",
    hostResidentId: "usr-res-1",
    vehicleNumber: "MH-12-FA-8890",
    passCode: "VP-4821",
    status: "checked_in",
    checkInTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    checkOutTime: null,
    securityGuardName: "Ramesh Singh",
    notes: "Family friend visiting for lunch",
    isPreApproved: true,
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: "vis-102",
    visitorName: "Sanjay Kumar",
    phone: "+91 98334 55667",
    purpose: "Delivery",
    company: "Amazon Prime",
    hostFlat: "A-304",
    hostResidentName: "Ananya Deshmukh",
    hostResidentId: "usr-res-2",
    vehicleNumber: "MH-14-GH-1290",
    passCode: "VP-7712",
    status: "checked_in",
    checkInTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    checkOutTime: null,
    securityGuardName: "Ramesh Singh",
    notes: "Package delivery (Parcel #AZ-9921)",
    isPreApproved: false,
    photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: "vis-103",
    visitorName: "Pradeep Joshi",
    phone: "+91 98220 11994",
    purpose: "Service/Repair",
    company: "Urban Company (AC Technician)",
    hostFlat: "B-402",
    hostResidentName: "Vikram Malhotra",
    hostResidentId: "usr-res-1",
    vehicleNumber: "MH-12-XX-4001",
    passCode: "VP-3190",
    status: "approved",
    checkInTime: null,
    checkOutTime: null,
    securityGuardName: null,
    notes: "Scheduled AC filter servicing",
    isPreApproved: true,
    photoUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&q=80",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: "vis-104",
    visitorName: "Mohit Shinde",
    phone: "+91 98901 23456",
    purpose: "Cab",
    company: "Uber Premier",
    hostFlat: "C-201",
    hostResidentName: "Rohan & Priya Iyer",
    hostResidentId: "usr-res-3",
    vehicleNumber: "MH-12-UB-7788",
    passCode: "VP-9901",
    status: "checked_out",
    checkInTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    checkOutTime: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    securityGuardName: "Ramesh Singh",
    notes: "Airport drop pickup",
    isPreApproved: false,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    createdAt: new Date(Date.now() - 190 * 60 * 1000).toISOString()
  },
  {
    id: "vis-105",
    visitorName: "Sunil Kulkarni",
    phone: "+91 98111 22334",
    purpose: "Other",
    company: "Direct Marketing / Sales",
    hostFlat: "A-101",
    hostResidentName: "Dr. Rajesh Sharma",
    hostResidentId: "usr-admin-1",
    vehicleNumber: "None (Pedestrian)",
    passCode: "VP-1123",
    status: "denied",
    checkInTime: null,
    checkOutTime: null,
    securityGuardName: "Ramesh Singh",
    notes: "Unsolicited promotional survey - denied entry by resident",
    isPreApproved: false,
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString()
  }
];

export const initialComplaints = [
  {
    id: "cmp-201",
    ticketNumber: "TKT-1042",
    title: "Water seepage in master bedroom ceiling",
    description: "Persistent dampness and moisture patches appearing along the ceiling cornice. Possible leakage from flat B-502 bathroom plumbing directly above.",
    category: "Plumbing",
    priority: "urgent",
    status: "in_progress",
    flatNumber: "B-402",
    residentName: "Vikram Malhotra",
    residentId: "usr-res-1",
    residentPhone: "+91 98450 12890",
    assignedTo: {
      name: "Ganesh Mhatre",
      phone: "+91 98700 23111",
      role: "Lead Society Plumber"
    },
    estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: "Inspected flat B-502 trap pipe. Found hairline crack in outer flange. Replacement pipe ordered from hardware vendor.",
    resolvedAt: null,
    rating: null,
    residentFeedback: null,
    activityLogs: [
      {
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        action: "Ticket Raised",
        performedBy: "Vikram Malhotra (Resident)",
        notes: "Complaint submitted with photos"
      },
      {
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        action: "Reviewed & Assigned",
        performedBy: "Dr. Rajesh Sharma (Secretary)",
        notes: "Assigned to Ganesh Mhatre (Plumbing Dept). Marked as Urgent due to moisture damage."
      },
      {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        action: "Status Changed to In Progress",
        performedBy: "Ganesh Mhatre",
        notes: "Initial site inspection completed. Repair scheduled for tomorrow morning 10 AM."
      }
    ],
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "cmp-202",
    ticketNumber: "TKT-1043",
    title: "Block A Elevator No. 2 jerky descent & display flicker",
    description: "The passenger lift in Block A is making a grinding sound between 4th and 3rd floor, and the floor indicator display flickers intermittently.",
    category: "Elevator",
    priority: "high",
    status: "under_review",
    flatNumber: "A-304",
    residentName: "Ananya Deshmukh",
    residentId: "usr-res-2",
    residentPhone: "+91 97654 32109",
    assignedTo: {
      name: "Schindler Elevator AMC Team",
      phone: "1800-200-3344",
      role: "Elevator Maintenance Partner"
    },
    estimatedCompletion: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: "Service ticket logged with AMC contractor. Technician visit expected by 3:00 PM.",
    resolvedAt: null,
    rating: null,
    residentFeedback: null,
    activityLogs: [
      {
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        action: "Ticket Raised",
        performedBy: "Ananya Deshmukh (Resident)",
        notes: "Elevator malfunction noticed by multiple residents"
      },
      {
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        action: "Under Review",
        performedBy: "Dr. Rajesh Sharma (Admin)",
        notes: "Logged emergency call with Schindler AMC team."
      }
    ],
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "cmp-203",
    ticketNumber: "TKT-1039",
    title: "Clubhouse Gymnasium treadmill belt slipping",
    description: "Treadmill #2 belt slips suddenly when running over 8 km/h. Poses safety risk for users.",
    category: "Common Area",
    priority: "medium",
    status: "resolved",
    flatNumber: "C-201",
    residentName: "Rohan & Priya Iyer",
    residentId: "usr-res-3",
    residentPhone: "+91 91234 56780",
    assignedTo: {
      name: "Deepak S (Gym Equipment Tech)",
      phone: "+91 98200 44551",
      role: "Fitness Facility Vendor"
    },
    estimatedCompletion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: "Tension pulleys readjusted, motor drive belt lubricated and tightened. Calibrated and tested for 30 minutes under load.",
    resolvedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    residentFeedback: "Thank you for the super prompt resolution! Tested it today and running smoothly.",
    activityLogs: [
      {
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        action: "Ticket Raised",
        performedBy: "Rohan Iyer",
        notes: "Reported gym equipment issue"
      },
      {
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        action: "Assigned & In Progress",
        performedBy: "Society Admin",
        notes: "Vendor arrived for inspection"
      },
      {
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        action: "Resolved & Closed",
        performedBy: "Dr. Rajesh Sharma",
        notes: "Repairs verified. Resident notified."
      }
    ],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "cmp-204",
    ticketNumber: "TKT-1045",
    title: "Basement B2 corridor floodlight bulb dead",
    description: "Dark patch near parking bay #42 to #46. Difficult to park and unsafe for pedestrians late evening.",
    category: "Electrical",
    priority: "medium",
    status: "submitted",
    flatNumber: "B-402",
    residentName: "Vikram Malhotra",
    residentId: "usr-res-1",
    residentPhone: "+91 98450 12890",
    assignedTo: null,
    estimatedCompletion: null,
    resolutionNotes: null,
    resolvedAt: null,
    rating: null,
    residentFeedback: null,
    activityLogs: [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        action: "Ticket Raised",
        performedBy: "Vikram Malhotra",
        notes: "Requested LED fixture replacement"
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export const initialNotices = [
  {
    id: "not-301",
    noticeNumber: "NOT-2026-08",
    title: "Urgent: Municipal Water Supply Pipe Maintenance & Scheduled Shutdown",
    content: "Please be informed that the Pune Municipal Corporation (PMC) will carry out scheduled main pipeline maintenance on Thursday, 9th October, between 09:00 AM and 05:00 PM. Society overhead tanks have been fully charged; however, all residents are earnestly requested to store adequate water and use water judiciously. Pumping will resume from 06:30 PM.",
    category: "Emergency",
    priority: "urgent",
    authorName: "Dr. Rajesh Sharma",
    authorRole: "Secretary, Managing Committee",
    targetAudience: "All Residents",
    pinned: true,
    attachments: [
      { name: "PMC_Maintenance_Circular_Oct2026.pdf", size: "284 KB", url: "#" }
    ],
    acknowledgements: [
      { userId: "usr-res-1", residentName: "Vikram Malhotra", flatNumber: "B-402", acknowledgedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
      { userId: "usr-res-2", residentName: "Ananya Deshmukh", flatNumber: "A-304", acknowledgedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "not-302",
    noticeNumber: "NOT-2026-07",
    title: "Annual General Body Meeting (AGM) 2026 – Notice & Agenda",
    content: "The 14th Annual General Body Meeting of Greenfield Heights CHS will be held on Sunday, 26th October at 10:30 AM in the Grand Clubhouse Amphitheater. Agenda includes: (1) Approval of FY2025-26 audited accounts, (2) Rooftop Solar PV installation tender review, (3) Election of three vacant committee seats. All flat owners are cordially invited. High tea will follow.",
    category: "AGM / Meeting",
    priority: "high",
    authorName: "Dr. Rajesh Sharma",
    authorRole: "Secretary, Managing Committee",
    targetAudience: "Owners Only",
    pinned: true,
    attachments: [
      { name: "AGM_Agenda_Audited_Accounts_2026.pdf", size: "1.4 MB", url: "#" },
      { name: "Solar_Tender_Specifications.pdf", size: "820 KB", url: "#" }
    ],
    acknowledgements: [
      { userId: "usr-res-1", residentName: "Vikram Malhotra", flatNumber: "B-402", acknowledgedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "not-303",
    noticeNumber: "NOT-2026-06",
    title: "Diwali Celebration & Cultural Evening: Registration for Resident Talent Show",
    content: "The Cultural Committee is thrilled to announce our Grand Diwali Extravaganza on Saturday, November 1st! Registrations are now open for children's dance performances, musical bands, rangoli competition, and food stalls. Contact the cultural desk in the clubhouse or submit your entry through the resident portal before October 20th.",
    category: "Events",
    priority: "normal",
    authorName: "Sunita Kapoor",
    authorRole: "Cultural Committee Convener",
    targetAudience: "All Residents",
    pinned: false,
    attachments: [],
    acknowledgements: [],
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "not-304",
    noticeNumber: "NOT-2026-05",
    title: "Quarterly Maintenance Dues Q3 (Oct-Dec 2026) Bill Generation Notice",
    content: "Maintenance bills for Q3 have been generated and dispatched via email. Members are requested to pay on or before 15th October to avoid late interest charges of 1.5% per month. Online payment through UPI / Net Banking can be cleared directly through the society bank account details listed in the attachment.",
    category: "Finance & Dues",
    priority: "normal",
    authorName: "Managing Committee Treasurer",
    authorRole: "Treasurer",
    targetAudience: "All Residents",
    pinned: false,
    attachments: [
      { name: "Q3_Maintenance_Schedule.pdf", size: "340 KB", url: "#" }
    ],
    acknowledgements: [],
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const societyMetadata = {
  name: "Greenfield Heights Cooperative Housing Society",
  registrationNumber: "PNA/HSG/TC/14022/2012",
  address: "Baner-Pashan Link Road, Pune, Maharashtra 411045",
  totalBlocks: 4,
  blocks: ["Block A", "Block B", "Block C", "Block D"],
  totalFlats: 160,
  occupiedFlats: 148,
  residentsCount: 486,
  securityStaffCount: 12,
  maintenanceStaffCount: 8,
  gateCount: 3,
  amenities: [
    "Clubhouse & Banquet Hall",
    "Semi-Olympic Swimming Pool",
    "Equipped Gymnasium",
    "Children Play Area",
    "Tennis & Badminton Courts",
    "EV Fast Charging Station"
  ],
  emergencyContacts: [
    { label: "Main Security Gate Alpha", contact: "+91 98888 77665", icon: "shield" },
    { label: "Society Office / Manager", contact: "+91 98201 44521", icon: "building" },
    { label: "Emergency Plumber (Ganesh)", contact: "+91 98700 23111", icon: "wrench" },
    { label: "Emergency Electrician (Mahesh)", contact: "+91 98600 11222", icon: "zap" },
    { label: "Nearest Hospital (Jupiter Hospital)", contact: "020-6710-8000", icon: "cross" },
    { label: "Police Control Room / Local Station", contact: "100 / 020-2565-1100", icon: "alert-triangle" }
  ]
};
