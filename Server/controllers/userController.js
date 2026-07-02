const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'househuntsecret', { expiresIn: '30d' });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, userType, currentLocation, profileImage } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const user = await User.create({
      name,
      email,
      phone,
      password,
      userType,
      currentLocation,
      profileImage
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        isApproved: user.isApproved,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        isApproved: user.isApproved,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot/reset password
const forgotPassword = async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;
    const user = await User.findOne({ email, phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found with matching email and phone' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get properties (all available, with filter)
const getProperties = async (req, res) => {
  try {
    const { location, maxPrice, minPrice, propertyType, furnishingStatus, amenities } = req.query;
    
    let query = { status: 'Available' };
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.rentAmount = {};
      if (minPrice) query.rentAmount.$gte = Number(minPrice);
      if (maxPrice) query.rentAmount.$lte = Number(maxPrice);
    }
    
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }
    
    if (furnishingStatus && furnishingStatus !== 'All') {
      query.furnishingStatus = furnishingStatus;
    }
    
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      const filteredList = amenitiesList.filter(a => a.trim() !== '');
      if (filteredList.length > 0) {
        query.amenities = { $all: filteredList };
      }
    }
    
    const properties = await Property.find(query).populate('owner', 'name email phone profileImage');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone profileImage');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request booking
const bookProperty = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, renterDetails } = req.body;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.status === 'Booked') {
      return res.status(400).json({ message: 'Property is already booked' });
    }
    
    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      startDate,
      endDate,
      renterDetails
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get renter bookings
const getRenterBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone' }
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  getProperties,
  getPropertyById,
  bookProperty,
  getRenterBookings
};
