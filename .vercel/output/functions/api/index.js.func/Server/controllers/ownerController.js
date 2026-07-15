const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// Add new property
const addProperty = async (req, res) => {
  try {
    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval by the Admin. You cannot add properties.' });
    }
    const { title, description, location, rentAmount, propertyType, furnishingStatus, amenities, images } = req.body;
    
    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      location,
      rentAmount,
      propertyType,
      furnishingStatus,
      amenities,
      images
    });
    
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get owner's properties
const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval by the Admin.' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this property' });
    }
    
    const { title, description, location, rentAmount, propertyType, furnishingStatus, amenities, images, status } = req.body;
    
    property.title = title !== undefined ? title : property.title;
    property.description = description !== undefined ? description : property.description;
    property.location = location !== undefined ? location : property.location;
    property.rentAmount = rentAmount !== undefined ? rentAmount : property.rentAmount;
    property.propertyType = propertyType !== undefined ? propertyType : property.propertyType;
    property.furnishingStatus = furnishingStatus !== undefined ? furnishingStatus : property.furnishingStatus;
    property.amenities = amenities !== undefined ? amenities : property.amenities;
    property.images = images !== undefined ? images : property.images;
    property.status = status !== undefined ? status : property.status;
    
    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval by the Admin.' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this property' });
    }
    
    await property.deleteOne();
    
    // Also remove bookings related to this property
    await Booking.deleteMany({ property: req.params.id });
    
    res.json({ message: 'Property and its bookings removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get owner's property bookings
const getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property')
      .populate('tenant', 'name email phone');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle booking status update (Approve/Reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Confirmed' or 'Cancelled' or 'Pending'
    
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }
    
    booking.status = status;
    await booking.save();
    
    if (status === 'Confirmed') {
      await Property.findByIdAndUpdate(booking.property._id, { status: 'Booked' });
      // Cancel all other pending bookings for the same property
      await Booking.updateMany(
        { property: booking.property._id, _id: { $ne: booking._id }, status: 'Pending' },
        { status: 'Cancelled' }
      );
    } else {
      // Revert property status to Available if the confirmed booking is changed
      const hasOtherConfirmed = await Booking.findOne({ property: booking.property._id, status: 'Confirmed' });
      if (!hasOtherConfirmed) {
        await Property.findByIdAndUpdate(booking.property._id, { status: 'Live' });
      }
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProperty,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
  getOwnerBookings,
  updateBookingStatus
};
