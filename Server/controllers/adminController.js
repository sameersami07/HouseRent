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

// Accept booking and payment
const acceptBookingAndPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = 'Confirmed';
    await booking.save();

    // Update property status
    if (booking.property) {
      booking.property.status = 'Booked';
      await booking.property.save();

      // Cancel other pending bookings for the same property
      await Booking.updateMany(
        { property: booking.property._id, _id: { $ne: booking._id }, status: 'Pending' },
        { status: 'Cancelled' }
      );
    }

    // Create/simulate payment transaction in WalletTransaction
    const WalletTransaction = require('../models/WalletTransactionSchema');
    const amount = booking.property ? booking.property.rentAmount : 1000;
    
    // Calculate GST (18%) and Commission (5%)
    const gst = Math.round(amount * 0.18 * 100) / 100;
    const commission = Math.round(amount * 0.05 * 100) / 100;

    await WalletTransaction.create({
      user: booking.property ? booking.property.owner : booking.tenant,
      amount: amount,
      type: 'credit',
      status: 'Completed',
      description: `Rent payment processed by Admin for property: ${booking.property?.title || 'Property'} (Renter: ${booking.renterDetails?.name || 'Renter'})`,
      gst: gst,
      commission: commission,
      invoiceNumber: `INV-ADM-${Date.now()}`
    });

    res.json({ message: 'Booking and payment accepted successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new property by admin
const createAdminProperty = async (req, res) => {
  try {
    const { 
      owner, 
      title, 
      description, 
      location, 
      rentAmount, 
      propertyType, 
      furnishingStatus, 
      amenities, 
      images, 
      googleMapUrl, 
      latitude, 
      longitude 
    } = req.body;

    const property = await Property.create({
      owner: owner || req.user._id,
      title,
      description,
      location,
      rentAmount: Number(rentAmount),
      propertyType,
      furnishingStatus,
      amenities,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
      status: 'Live', // Admin created properties are approved immediately
      googleMapUrl,
      latitude: Number(latitude) || 19.0760,
      longitude: Number(longitude) || 72.8777
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  approveOwner,
  getAllProperties,
  getAllBookings,
  acceptBookingAndPayment,
  createAdminProperty
};

