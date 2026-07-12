const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Stats
router.get('/stats/owner', getOwnerStats);
router.get('/stats/admin', getAdminStats);

// Messages / Chat
router.get('/messages', getChatThreads);
router.get('/messages/:partnerId', getChatMessages);
router.post('/messages', sendChatMessage);

// Wallet
router.get('/wallet', getWalletInfo);
router.post('/wallet/withdraw', requestWithdrawal);

// Reviews
router.get('/reviews', getReviews);
router.post('/reviews', addReview);
router.post('/reviews/:id/reply', replyToReview);
router.post('/reviews/:id/report', reportFakeReview);

// Complaints
router.get('/complaints', getComplaints);
router.post('/complaints', addComplaint);
router.put('/complaints/:id', updateComplaint);

// Rent Requests
router.get('/rent-requests', getRentRequests);
router.post('/rent-requests', addRentRequest);
router.put('/rent-requests/:id', updateRentRequest);

// Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', addAnnouncement);

// CMS
router.get('/cms', getCms);
router.put('/cms', updateCms);

// Admin Moderation
router.get('/admin/users', adminGetUsers);
router.get('/admin/properties', adminGetProperties);
router.get('/admin/bookings', adminGetBookings);
router.put('/admin/users/:id', adminModerateUser);
router.put('/admin/properties/:id', adminModerateProperty);
router.post('/admin/properties/bulk', adminBulkProperties);

module.exports = router;
