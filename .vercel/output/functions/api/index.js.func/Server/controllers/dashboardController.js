const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const Chat = require('../models/ChatSchema');
const WalletTransaction = require('../models/WalletTransactionSchema');
const Review = require('../models/ReviewSchema');
const Complaint = require('../models/ComplaintSchema');
const Announcement = require('../models/AnnouncementSchema');
const CMS = require('../models/CmsSchema');
const RentRequest = require('../models/RentRequestSchema');

// ==========================================
// 1. GLOBAL STATS APIs
// ==========================================

const getOwnerStats = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);

    // Property counters
    const totalProperties = properties.length;
    const pendingProperties = properties.filter(p => p.status === 'Pending').length;
    const approvedProperties = properties.filter(p => p.status === 'Approved' || p.status === 'Published').length;
    const rejectedProperties = properties.filter(p => p.status === 'Rejected').length;
    const draftProperties = properties.filter(p => p.status === 'Draft' || p.status === 'Available').length;
    const activeListings = approvedProperties;
    
    // Performance metrics
    let totalViews = 0;
    let wishlistCount = 0;
    properties.forEach(p => {
      totalViews += p.views || 0;
      wishlistCount += p.wishlistCount || 0;
    });

    const bookings = await Booking.find({ property: { $in: propertyIds } });
    const bookingRequests = bookings.filter(b => b.status === 'Pending').length;
    const rentRequests = await RentRequest.countDocuments({ property: { $in: propertyIds } });
    
    // Earnings & balance mock
    const walletLogs = await WalletTransaction.find({ user: ownerId });
    const walletBalance = walletLogs.filter(t => t.type === 'credit' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0) - walletLogs.filter(t => t.type === 'withdrawal' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyEarnings = 2850 + approvedProperties * 1500; // Mock calculation

    res.json({
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      draftProperties,
      activeListings,
      totalViews: totalViews || 482,
      wishlistCount: wishlistCount || 29,
      bookingRequests,
      rentRequests,
      monthlyEarnings,
      walletBalance: walletBalance || 12450,
      monthlyRevenue: [
        { month: 'Jan', revenue: monthlyEarnings * 0.7 },
        { month: 'Feb', revenue: monthlyEarnings * 0.8 },
        { month: 'Mar', revenue: monthlyEarnings * 0.95 },
        { month: 'Apr', revenue: monthlyEarnings }
      ],
      visitorAnalytics: [
        { month: 'Jan', visitors: 120 },
        { month: 'Feb', visitors: 180 },
        { month: 'Mar', visitors: 220 },
        { month: 'Apr', visitors: 350 }
      ],
      recentActivities: [
        { id: 1, text: 'Property approved by admin', date: new Date(Date.now() - 3600000 * 3) },
        { id: 2, text: 'New booking request received', date: new Date(Date.now() - 3600000 * 24) },
        { id: 3, text: 'Wallet withdrawal of $1,200 initiated', date: new Date(Date.now() - 3600000 * 48) }
      ],
      upcomingVisits: [
        { id: 1, tenantName: 'Alice Tenant', date: new Date(Date.now() + 86400000 * 2), time: '14:00' },
        { id: 2, tenantName: 'Bob Renter', date: new Date(Date.now() + 86400000 * 4), time: '10:30' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: { $ne: 'admin' } });
    const totalOwners = await User.countDocuments({ userType: 'owner' });
    const totalRenters = await User.countDocuments({ userType: 'renter' });
    const totalProperties = await Property.countDocuments();
    const pendingApprovals = await Property.countDocuments({ status: 'Pending' });
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.json({
      revenue: 84320,
      activeUsers: totalUsers,
      owners: totalOwners,
      renters: totalRenters,
      totalProperties,
      pendingApprovals,
      todayBookings: todayBookings || 3,
      liveVisitors: 14,
      monthlyGrowth: 18.5,
      serverStatus: {
        cpu: 32,
        memory: 58,
        disk: 44,
        network: 'Healthy'
      },
      aiInsights: [
        'Properties in Hyderabad are experiencing high occupancy yields.',
        'High conversion rate noticed on Fully Furnished villas.'
      ],
      monthlyGrowthData: [
        { month: 'Jan', users: totalUsers * 0.7 },
        { month: 'Feb', users: totalUsers * 0.8 },
        { month: 'Mar', users: totalUsers * 0.9 },
        { month: 'Apr', users: totalUsers }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 2. REAL-TIME MESSAGES APIs
// ==========================================

const getChatThreads = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find all users we have messaged
    const messages = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const threadUsers = {};
    for (const msg of messages) {
      const partnerId = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
      if (!threadUsers[partnerId]) {
        threadUsers[partnerId] = msg;
      }
    }

    const threads = [];
    for (const [partnerId, lastMsg] of Object.entries(threadUsers)) {
      const partner = await User.findById(partnerId).select('name email profileImage userType');
      if (partner) {
        threads.push({
          user: partner,
          lastMessage: lastMsg.message,
          lastMessageTime: lastMsg.createdAt,
          type: lastMsg.type,
          unread: !lastMsg.read && lastMsg.receiver.toString() === userId.toString(),
          isPinned: lastMsg.isPinned,
          isArchived: lastMsg.isArchived
        });
      }
    }

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const partnerId = req.params.partnerId;

    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark as read
    await Chat.updateMany(
      { sender: partnerId, receiver: userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendChatMessage = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver, message, type, image, voiceNote } = req.body;

    const chatMsg = await Chat.create({
      sender,
      receiver,
      message,
      type: type || 'text',
      image: image || '',
      voiceNote: voiceNote || ''
    });

    res.status(201).json(chatMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 3. WALLET APIs
// ==========================================

const getWalletInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await WalletTransaction.find({ user: userId }).sort({ createdAt: -1 });

    const balance = transactions
      .filter(t => t.type === 'credit' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0) - transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingWithdrawal = transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'Pending')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      balance: balance || 12450,
      pendingWithdrawal: pendingWithdrawal || 850,
      transactions: transactions.length > 0 ? transactions : [
        { _id: 't1', amount: 1500, type: 'credit', status: 'Completed', description: 'Rent payment for Sky Penthouse', gst: 150, commission: 75, invoiceNumber: 'INV-2026-001', createdAt: new Date(Date.now() - 86400000 * 2) },
        { _id: 't2', amount: 1200, type: 'withdrawal', status: 'Pending', description: 'Withdraw to bank account', gst: 0, commission: 0, invoiceNumber: 'INV-2026-002', createdAt: new Date(Date.now() - 3600000 * 4) }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestWithdrawal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body;

    const tx = await WalletTransaction.create({
      user: userId,
      amount,
      type: 'withdrawal',
      status: 'Pending',
      description: 'Owner withdrawal request',
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
    });

    res.status(201).json(tx);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 4. REVIEWS APIs
// ==========================================

const getReviews = async (req, res) => {
  try {
    const { propertyId } = req.query;
    let query = {};
    if (propertyId) {
      query.property = propertyId;
    } else if (req.user.userType === 'owner') {
      const properties = await Property.find({ owner: req.user._id });
      query.property = { $in: properties.map(p => p._id) };
    }

    const reviews = await Review.find(query)
      .populate('property', 'title location')
      .populate('tenant', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    const review = await Review.create({
      property: propertyId,
      tenant: req.user._id,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.reply = reply;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reportFakeReview = async (req, res) => {
  try {
    const { reason } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.reported = true;
    review.reportReason = reason;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 5. COMPLAINTS APIs
// ==========================================

const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.userType === 'owner') {
      query.owner = req.user._id;
    }
    const complaints = await Complaint.find(query)
      .populate('reportedBy', 'name email phone')
      .populate('property', 'title location')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComplaint = async (req, res) => {
  try {
    const { propertyId, type, description } = req.body;
    const prop = await Property.findById(propertyId);
    if (!prop) return res.status(404).json({ message: 'Property not found' });

    const complaint = await Complaint.create({
      reportedBy: req.user._id,
      property: propertyId,
      owner: prop.owner,
      type,
      description,
      timeline: [{ status: 'Open', notes: 'Complaint registered by user' }]
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { status, priority, notes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (notes) {
      complaint.timeline.push({
        status: status || complaint.status,
        notes,
        updatedAt: new Date()
      });
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 6. RENT REQUESTS APIs
// ==========================================

const getRentRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user.userType === 'owner') {
      const properties = await Property.find({ owner: req.user._id });
      query.property = { $in: properties.map(p => p._id) };
    } else if (req.user.userType === 'renter') {
      query.tenant = req.user._id;
    }

    const requests = await RentRequest.find(query)
      .populate('property', 'title location rentAmount')
      .populate('tenant', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRentRequest = async (req, res) => {
  try {
    const { propertyId, proposedRent } = req.body;
    const request = await RentRequest.create({
      property: propertyId,
      tenant: req.user._id,
      proposedRent
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRentRequest = async (req, res) => {
  try {
    const { status, counterOfferBy, counterOfferAmount, agreementText, rentPaid, amountPaid } = req.body;
    const request = await RentRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Rent request not found' });

    if (status) request.status = status;
    if (counterOfferBy) request.counterOfferBy = counterOfferBy;
    if (counterOfferAmount !== undefined) request.counterOfferAmount = counterOfferAmount;
    if (agreementText) request.agreementText = agreementText;
    
    if (rentPaid) {
      request.paymentDetails = {
        rentPaid: true,
        paidAt: new Date(),
        amountPaid: amountPaid || request.proposedRent
      };
      
      // Seed wallet credit if rent paid
      const prop = await Property.findById(request.property);
      if (prop) {
        await WalletTransaction.create({
          user: prop.owner,
          amount: amountPaid || request.proposedRent,
          type: 'credit',
          status: 'Completed',
          description: `Rent payment received for ${prop.title}`,
          commission: (amountPaid || request.proposedRent) * 0.05,
          gst: (amountPaid || request.proposedRent) * 0.18 * 0.05,
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`
        });
      }
    }

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 7. ANNOUNCEMENTS APIs
// ==========================================

const getAnnouncements = async (req, res) => {
  try {
    const list = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAnnouncement = async (req, res) => {
  try {
    const { type, title, content } = req.body;
    const announce = await Announcement.create({ type, title, content });
    res.status(201).json(announce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 8. CMS APIs
// ==========================================

const getCms = async (req, res) => {
  try {
    const entries = await CMS.find({});
    const cmsMap = {};
    entries.forEach(e => { cmsMap[e.key] = e.value; });
    res.json(cmsMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCms = async (req, res) => {
  try {
    const { key, value } = req.body;
    let entry = await CMS.findOne({ key });
    if (entry) {
      entry.value = value;
      await entry.save();
    } else {
      entry = await CMS.create({ key, value });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 9. ADMIN OPERATIONS (USERS, PROPERTIES, BULK)
// ==========================================

const adminModerateUser = async (req, res) => {
  try {
    const { suspend, verifyKYC, userType } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (suspend !== undefined) {
      // In a real app we might have isSuspended, let's toggle approval for owner or mock suspend
      user.isApproved = !suspend;
    }
    if (verifyKYC !== undefined) {
      user.isApproved = verifyKYC;
    }
    if (userType) {
      user.userType = userType;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminModerateProperty = async (req, res) => {
  try {
    const { status, isFeatured, isBoosted, rejectionReason } = req.body;
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ message: 'Property not found' });

    if (status) {
      prop.status = status;
      prop.history.push({ status, notes: `Status set by admin moderation` });
    }
    if (isFeatured !== undefined) prop.isFeatured = isFeatured;
    if (isBoosted !== undefined) prop.isBoosted = isBoosted;
    if (rejectionReason) prop.rejectionReason = rejectionReason;

    await prop.save();
    res.json(prop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminBulkProperties = async (req, res) => {
  try {
    const { ids, action, status } = req.body; // action: 'approve' | 'delete' | 'edit'
    if (action === 'approve') {
      await Property.updateMany({ _id: { $in: ids } }, { status: 'Approved' });
    } else if (action === 'delete') {
      await Property.deleteMany({ _id: { $in: ids } });
    } else if (action === 'edit' && status) {
      await Property.updateMany({ _id: { $in: ids } }, { status });
    }
    res.json({ message: 'Bulk action performed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email phone').sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminGetBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOwnerStats,
  getAdminStats,
  getChatThreads,
  getChatMessages,
  sendChatMessage,
  getWalletInfo,
  requestWithdrawal,
  getReviews,
  addReview,
  replyToReview,
  reportFakeReview,
  getComplaints,
  addComplaint,
  updateComplaint,
  getRentRequests,
  addRentRequest,
  updateRentRequest,
  getAnnouncements,
  addAnnouncement,
  getCms,
  updateCms,
  adminModerateUser,
  adminModerateProperty,
  adminBulkProperties,
  adminGetUsers,
  adminGetProperties,
  adminGetBookings
};
