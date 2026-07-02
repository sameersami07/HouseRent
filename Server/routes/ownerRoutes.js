const express = require('express');
const router = express.Router();
const {
  addProperty,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
  getOwnerBookings,
  updateBookingStatus
} = require('../controllers/ownerController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');

// Apply auth middleware and check if user is an owner
router.use(authMiddleware);
router.use(restrictTo('owner'));

router.route('/properties')
  .post(addProperty)
  .get(getOwnerProperties);

router.route('/properties/:id')
  .put(updateProperty)
  .delete(deleteProperty);

router.route('/bookings')
  .get(getOwnerBookings);

router.route('/bookings/:id')
  .put(updateBookingStatus);

module.exports = router;
