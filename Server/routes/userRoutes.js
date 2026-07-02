const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  getProperties, 
  getPropertyById, 
  bookProperty, 
  getRenterBookings 
} = require('../controllers/userController');
const { authMiddleware, restrictTo } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);

// Protected routes for renter/tenant
router.post('/bookings', authMiddleware, restrictTo('renter'), bookProperty);
router.get('/bookings', authMiddleware, restrictTo('renter'), getRenterBookings);

module.exports = router;
