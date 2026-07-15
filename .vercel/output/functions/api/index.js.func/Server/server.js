const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connect');
const User = require('./models/UserSchema');
const Property = require('./models/PropertySchema');
const Booking = require('./models/BookingSchema');
const Chat = require('./models/ChatSchema');
const WalletTransaction = require('./models/WalletTransactionSchema');
const Review = require('./models/ReviewSchema');
const Complaint = require('./models/ComplaintSchema');
const Announcement = require('./models/AnnouncementSchema');
const CMS = require('./models/CmsSchema');
const RentRequest = require('./models/RentRequestSchema');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed admin users, owners, renters, properties, and bookings
const seedAllData = async () => {
  try {
    // 1. Seed Admins
    let shaikAdmin = await User.findOne({ email: 'shaiksameer@gmail.com' });
    if (!shaikAdmin) {
      shaikAdmin = await User.create({
        name: 'Shaik Sameer',
        email: 'shaiksameer@gmail.com',
        phone: '9000000000',
        password: 'admin123',
        userType: 'admin',
        currentLocation: 'Hyderabad',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
      });
      console.log('Admin account shaiksameer@gmail.com seeded (password: admin123)');
    }

    let defaultAdmin = await User.findOne({ email: 'admin@househunt.com' });
    if (!defaultAdmin) {
      await User.create({
        name: 'System Admin',
        email: 'admin@househunt.com',
        phone: '1234567890',
        password: 'adminpassword',
        userType: 'admin',
        currentLocation: 'New York',
        profileImage: 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png'
      });
      console.log('Admin account admin@househunt.com seeded (password: adminpassword)');
    }

    // 2. Seed Owners
    let ownerJohn = await User.findOne({ email: 'john_owner@gmail.com' });
    if (!ownerJohn) {
      ownerJohn = await User.create({
        name: 'John Landlord',
        email: 'john_owner@gmail.com',
        phone: '5550199',
        password: 'password123',
        userType: 'owner',
        isApproved: true,
        currentLocation: 'Los Angeles',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      });
      console.log('Approved Owner john_owner@gmail.com seeded (password: password123)');
    }

    let ownerSarah = await User.findOne({ email: 'sarah_owner@gmail.com' });
    if (!ownerSarah) {
      await User.create({
        name: 'Sarah Landlord',
        email: 'sarah_owner@gmail.com',
        phone: '5550244',
        password: 'password123',
        userType: 'owner',
        isApproved: false, // Pending admin approval
        currentLocation: 'San Francisco',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
      });
      console.log('Pending Owner sarah_owner@gmail.com seeded (password: password123)');
    }

    // 3. Seed Renters
    let renterAlice = await User.findOne({ email: 'alice_renter@gmail.com' });
    if (!renterAlice) {
      renterAlice = await User.create({
        name: 'Alice Tenant',
        email: 'alice_renter@gmail.com',
        phone: '5550388',
        password: 'password123',
        userType: 'renter',
        currentLocation: 'Chicago',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
      });
      console.log('Renter alice_renter@gmail.com seeded (password: password123)');
    }

    // 4. Seed Properties
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      const villa = await Property.create({
        owner: ownerJohn._id,
        title: 'Luxury Modern Villa',
        description: 'Stunning luxury villa featuring a private infinity pool, massive outdoor patio, private home theater, fully equipped high-tech gym, and a beautifully landscaped garden. Located in a secure gated community in Beverly Hills.',
        location: 'Beverly Hills, Los Angeles, CA',
        rentAmount: 4500,
        propertyType: 'Villa',
        furnishingStatus: 'Furnished',
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Pet-Friendly', 'Air Conditioning', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'],
        status: 'Available'
      });

      const studio = await Property.create({
        owner: ownerJohn._id,
        title: 'Cozy Brooklyn Studio Apartment',
        description: 'A charming, brick-walled studio apartment situated in the heart of Williamsburg. Steps away from subway lines, trendy restaurants, and scenic East River parks. Perfect for young professionals or students.',
        location: 'Williamsburg, Brooklyn, NY',
        rentAmount: 1850,
        propertyType: 'Studio',
        furnishingStatus: 'Semi-Furnished',
        amenities: ['WiFi', 'Laundry', 'Air Conditioning'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
        status: 'Available'
      });

      const loft = await Property.create({
        owner: ownerJohn._id,
        title: 'Industrial Chic Downtown Loft',
        description: 'Spacious loft with high timber ceilings, exposed brickwork, large steel-framed windows offering breathtaking views of the city skyline. Features premium appliances and underground parking.',
        location: 'Loop District, Chicago, IL',
        rentAmount: 2600,
        propertyType: 'Apartment',
        furnishingStatus: 'Furnished',
        amenities: ['WiFi', 'Parking', 'Gym', 'Balcony', 'Air Conditioning', 'Laundry'],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
        status: 'Booked'
      });

      const penthouse = await Property.create({
        owner: ownerJohn._id,
        title: 'Bayside Premium Penthouse Suite',
        description: 'Ultra-modern penthouse offering wrap-around floor-to-ceiling glass walls with 360-degree views of Biscayne Bay. Premium designer furnishing, state-of-the-art kitchen, and private elevator entry.',
        location: 'Brickell Avenue, Miami, FL',
        rentAmount: 5500,
        propertyType: 'Villa',
        furnishingStatus: 'Furnished',
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym', 'Balcony', 'Air Conditioning', 'Furnished Kitchen'],
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'],
        status: 'Available'
      });

      console.log('Dummy properties seeded successfully');

      // 5. Seed Bookings
      const bookingCount = await Booking.countDocuments();
      if (bookingCount === 0) {
        // Pending booking for studio
        await Booking.create({
          property: studio._id,
          tenant: renterAlice._id,
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          endDate: new Date(Date.now() + (14 + 180) * 24 * 60 * 60 * 1000), // 6 months
          status: 'Pending',
          renterDetails: {
            name: renterAlice.name,
            email: renterAlice.email,
            phone: renterAlice.phone,
            occupation: 'Graduate Researcher at Chicago Uni',
            notes: 'Hello John! I am clean, quiet, and looking for a long term residency starting next month. Looking forward to hearing from you.'
          }
        });

        // Confirmed booking for loft
        await Booking.create({
          property: loft._id,
          tenant: renterAlice._id,
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
          endDate: new Date(Date.now() + (30 + 365) * 24 * 60 * 60 * 1000), // 1 year
          status: 'Confirmed',
          renterDetails: {
            name: renterAlice.name,
            email: renterAlice.email,
            phone: renterAlice.phone,
            occupation: 'Lead Architect at Studio Chicago',
            notes: 'Love the exposed brick layout! Ready to move in as soon as possible.'
          }
        });

        console.log('Dummy bookings seeded successfully');
      }

      // 6. Seed Chats
      const chatCount = await Chat.countDocuments();
      if (chatCount === 0) {
        await Chat.create({
          sender: renterAlice._id,
          receiver: ownerJohn._id,
          message: 'Hi John, is the Bayside Premium Penthouse still available for booking next Sunday?',
          type: 'text',
          read: true
        });
        await Chat.create({
          sender: ownerJohn._id,
          receiver: renterAlice._id,
          message: 'Yes Alice! It is available. Let me know if you would like a virtual tour first.',
          type: 'text',
          read: false
        });
        console.log('Dummy chats seeded successfully');
      }

      // 7. Seed Wallet Transactions
      const txCount = await WalletTransaction.countDocuments();
      if (txCount === 0) {
        await WalletTransaction.create({
          user: ownerJohn._id,
          amount: 4500,
          type: 'credit',
          status: 'Completed',
          description: 'Rent payment for Sky Penthouse',
          gst: 450,
          commission: 225,
          invoiceNumber: 'INV-2026-001'
        });
        await WalletTransaction.create({
          user: ownerJohn._id,
          amount: 1200,
          type: 'withdrawal',
          status: 'Pending',
          description: 'Owner withdrawal request',
          invoiceNumber: 'INV-2026-002'
        });
        console.log('Dummy transactions seeded successfully');
      }

      // 8. Seed Reviews
      const reviewCount = await Review.countDocuments();
      if (reviewCount === 0) {
        const firstProp = await Property.findOne({ owner: ownerJohn._id });
        if (firstProp) {
          await Review.create({
            property: firstProp._id,
            tenant: renterAlice._id,
            rating: 5,
            comment: 'Stunning luxury villa. John is an excellent and helpful host!'
          });
        }
        console.log('Dummy reviews seeded successfully');
      }

      // 9. Seed Complaints
      const complaintCount = await Complaint.countDocuments();
      if (complaintCount === 0) {
        const firstProp = await Property.findOne({ owner: ownerJohn._id });
        if (firstProp) {
          await Complaint.create({
            reportedBy: renterAlice._id,
            property: firstProp._id,
            owner: ownerJohn._id,
            type: 'Wrong Information',
            description: 'The property age seems older than listed in the description.',
            priority: 'Low',
            status: 'Open',
            timeline: [{ status: 'Open', notes: 'Reported by Alice Tenant' }]
          });
        }
        console.log('Dummy complaints seeded successfully');
      }

      // 10. Seed Rent Requests
      const rentRequestCount = await RentRequest.countDocuments();
      if (rentRequestCount === 0) {
        const firstProp = await Property.findOne({ owner: ownerJohn._id });
        if (firstProp) {
          await RentRequest.create({
            property: firstProp._id,
            tenant: renterAlice._id,
            proposedRent: 4300,
            status: 'Negotiating',
            counterOfferBy: ownerJohn._id,
            counterOfferAmount: 4400,
            agreementText: 'This agreement is made between John Landlord and Alice Tenant for the lease of Bayside Penthouse.'
          });
        }
        console.log('Dummy rent requests seeded successfully');
      }

      // 11. Seed Announcements
      const announceCount = await Announcement.countDocuments();
      if (announceCount === 0) {
        await Announcement.create({
          type: 'Banner',
          title: 'Summer Season Discount Campaign!',
          content: 'Register your properties and boost your listings visibility for free during the summer season.'
        });
        console.log('Dummy announcements seeded successfully');
      }

      // 12. Seed CMS settings
      const cmsCount = await CMS.countDocuments();
      if (cmsCount === 0) {
        await CMS.create({
          key: 'homepage_banner',
          value: {
            title: 'Find your dream home with a premium experience.',
            subtitle: 'Browse verified listings, book private tours, and discover neighborhoods that feel like home.'
          }
        });
        await CMS.create({
          key: 'faqs',
          value: [
            { q: 'How do I schedule a property tour?', a: 'Locate the property, click Get Info, fill out your renter details, and submit.' },
            { q: 'Are all landlords verified?', a: 'Yes, our moderation team inspects and approves all owners before they can list properties.' }
          ]
        });
        console.log('Dummy CMS options seeded successfully');
      }
    }
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
};
seedAllData();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/owners', require('./routes/ownerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.send('HouseRent API is running...');
});

const PORT = process.env.PORT || 8000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
