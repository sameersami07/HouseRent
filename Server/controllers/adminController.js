const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// Get stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: { $ne: 'admin' } });
    const totalRenters = await User.countDocuments({ userType: 'renter' });
    const totalOwners = await User.countDocuments({ userType: 'owner' });
    const pendingOwners = await User.countDocuments({ userType: 'owner', isApproved: false });
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    res.json({
      totalUsers,
      totalRenters,
      totalOwners,
      pendingOwners,
      totalProperties,
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve owner
const approveOwner = async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.userType !== 'owner') {
      return res.status(400).json({ message: 'Only owner accounts need approval' });
    }
    
    user.isApproved = isApproved;
    await user.save();
    
    res.json({
      message: `Owner account has been ${isApproved ? 'approved' : 'disapproved'}`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate('owner', 'name email phone');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('property')
      .populate('tenant', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  approveOwner,
  getAllProperties,
  getAllBookings
};
