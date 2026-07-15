const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  approveOwner,
  getAllProperties,
  getAllBookings
} = require('../controllers/adminController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');

// Apply auth middleware and check if user is an admin
router.use(authMiddleware);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/approve', approveOwner);
router.get('/properties', getAllProperties);
router.get('/bookings', getAllBookings);

module.exports = router;
