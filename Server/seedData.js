const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/connect');

// Load schemas
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

dotenv.config();

const indianFirstNames = [
  'Rajesh', 'Amit', 'Priya', 'Sunita', 'Rahul', 'Deepika', 'Anjali', 'Vikram', 'Suresh', 'Meera',
  'Rohan', 'Neha', 'Sanjay', 'Pooja', 'Anil', 'Kavita', 'Harish', 'Shweta', 'Manoj', 'Divya',
  'Karan', 'Sneha', 'Vijay', 'Jyoti', 'Arun', 'Ritu', 'Manish', 'Komal', 'Alok', 'Preeti',
  'Gaurav', 'Nisha', 'Abhishek', 'Swati', 'Pradeep', 'Rekha', 'Vivek', 'Aarti', 'Sandeep', 'Sapna'
];

const indianLastNames = [
  'Kumar', 'Sharma', 'Patel', 'Reddy', 'Verma', 'Sen', 'Nair', 'Singh', 'Iyer', 'Joshi',
  'Gupta', 'Malhotra', 'Rao', 'Deshmukh', 'Patil', 'Choudhary', 'Mishra', 'Teja', 'Trivedi', 'Bose',
  'Mehta', 'Narang', 'Dubey', 'Saxena', 'Pandey', 'Pillai', 'Menon', 'Chatterjee', 'Mukherjee', 'Roy'
];

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];

const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Hostel', 'PG', 'Commercial', 'Land'];

const unsplashImages = {
  Villa: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  ],
  Apartment: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
  ],
  'Independent House': [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
  ],
  PG: [
    'https://images.unsplash.com/photo-1555637138-afc70d267b71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
  ],
  Hostel: [
    'https://images.unsplash.com/photo-1555637138-afc70d267b71?auto=format&fit=crop&w=800&q=80'
  ],
  Commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  ],
  Land: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  ]
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await Chat.deleteMany({});
    await WalletTransaction.deleteMany({});
    await Review.deleteMany({});
    await Complaint.deleteMany({});
    await Announcement.deleteMany({});
    await CMS.deleteMany({});
    await RentRequest.deleteMany({});

    console.log('Seeding System Admins...');
    const mainAdmin = await User.create({
      name: 'Shaik Sameer',
      email: 'shaiksameer@gmail.com',
      phone: '9000000000',
      password: 'admin123',
      userType: 'admin',
      isApproved: true,
      currentLocation: 'Hyderabad',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });

    // 1. Seed 20 Owners
    console.log('Seeding 20 Owners...');
    const owners = [];
    for (let i = 1; i <= 20; i++) {
      const fName = indianFirstNames[i % indianFirstNames.length];
      const lName = indianLastNames[i % indianLastNames.length];
      const email = i === 1 ? 'john_owner@gmail.com' : `${fName.toLowerCase()}_owner${i}@gmail.com`;
      const name = i === 1 ? 'John Owner' : `${fName} ${lName}`;
      const owner = await User.create({
        name,
        email,
        phone: `98480223${String(i).padStart(2, '0')}`,
        password: 'password123',
        userType: 'owner',
        isApproved: true,
        currentLocation: cities[i % cities.length],
        profileImage: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&w=150&h=150&q=80`
      });
      owners.push(owner);
    }

    // 2. Seed 50 Renters
    console.log('Seeding 50 Renters...');
    const renters = [];
    for (let i = 1; i <= 50; i++) {
      const fName = indianFirstNames[(i + 20) % indianFirstNames.length];
      const lName = indianLastNames[(i + 15) % indianLastNames.length];
      const email = i === 1 ? 'alice_renter@gmail.com' : `${fName.toLowerCase()}_renter${i}@gmail.com`;
      const name = i === 1 ? 'Alice Renter' : `${fName} ${lName}`;
      const renter = await User.create({
        name,
        email,
        phone: `99660224${String(i).padStart(2, '0')}`,
        password: 'password123',
        userType: 'renter',
        isApproved: true,
        currentLocation: cities[(i + 2) % cities.length],
        familySize: (i % 4) + 1,
        occupation: i % 3 === 0 ? 'Software Engineer' : i % 3 === 1 ? 'Doctor' : 'Business owner',
        monthlyIncome: 35000 + (i * 2000),
        preferredMoveInDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
        rentalDuration: 12,
        latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
        profileImage: `https://images.unsplash.com/photo-${1530000000000 + i * 1200000}?auto=format&fit=crop&w=150&h=150&q=80`
      });
      renters.push(renter);
    }

    // 3. Seed 150 Properties
    console.log('Seeding 150 Properties...');
    const properties = [];
    for (let i = 1; i <= 150; i++) {
      const owner = owners[i % owners.length];
      const pType = propertyTypes[i % propertyTypes.length];
      const city = cities[i % cities.length];
      const rentAmount = 8000 + (i * 300);
      const isLive = i % 5 !== 0; // 4 out of 5 properties are live
      
      const prop = await Property.create({
        owner: owner._id,
        title: `Premium ${pType} in ${city} sector ${i % 10 + 1}`,
        description: `Spacious premium ${pType} listing situated in a prime residential locality. Close to key tech corridors, schools, public parks, and grocery outlets. Modern interiors with full modular cupboards and safety amenities.`,
        location: `${city}, India`,
        rentAmount,
        securityDeposit: rentAmount * 3,
        maintenance: 1500 + (i % 5) * 500,
        bedrooms: (i % 3) + 1,
        bathrooms: (i % 2) + 1,
        balcony: i % 3,
        floor: i % 5,
        totalFloors: 10,
        facing: ['East', 'West', 'North', 'South'][i % 4],
        area: 800 + (i % 10) * 120,
        propertyType: pType,
        furnishingStatus: ['Furnished', 'Semi-Furnished', 'Unfurnished'][i % 3],
        status: isLive ? 'Live' : 'Pending',
        nearbySchools: ['Greenwood High', 'Podar International School'],
        nearbyHospitals: ['Apollo Hospital', 'Fortis Healthcare'],
        nearbyMetro: [`${city} Central Metro`],
        busStop: [`${city} Local bus stand`],
        restaurants: ['Pind Balluchi', 'Absolute Barbecues'],
        shoppingMalls: ['Phoenix Marketcity'],
        parks: ['Nehru Garden'],
        latitude: 19.0760 + (Math.random() - 0.5) * 0.15,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.15,
        images: unsplashImages[pType] || unsplashImages['Apartment'],
        views: 20 + i * 2,
        wishlistCount: i % 5
      });
      properties.push(prop);
    }

    // 4. Seed 80 Rent Requests
    console.log('Seeding 80 Rent Requests...');
    const rentRequests = [];
    const requestStatuses = ['Pending', 'Viewed', 'Accepted', 'Rejected', 'Negotiating', 'Visit Scheduled', 'Agreement Pending', 'Payment Pending', 'Completed'];
    for (let i = 1; i <= 80; i++) {
      const renter = renters[i % renters.length];
      const prop = properties[i % properties.length];
      const status = requestStatuses[i % requestStatuses.length];
      const proposedRent = prop.rentAmount - 1000 + (i % 3) * 500;
      
      const req = await RentRequest.create({
        property: prop._id,
        tenant: renter._id,
        proposedRent,
        status,
        preferredMoveInDate: new Date(Date.now() + 15 * 24 * 3600 * 1000),
        familySize: renter.familySize,
        occupation: renter.occupation,
        monthlyIncome: renter.monthlyIncome,
        rentalDuration: 12,
        distanceFromProperty: Math.round((Math.random() * 5 + 1) * 10) / 10,
        travelTime: `${10 + (i % 4) * 8} mins`,
        agreementText: status === 'Completed' ? 'Standard contract signed between Owner and Client.' : ''
      });
      rentRequests.push(req);
    }

    // 5. Seed 40 Bookings / Visits
    console.log('Seeding 40 Bookings...');
    const bookingStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    for (let i = 1; i <= 40; i++) {
      const prop = properties[(i + 5) % properties.length];
      const renter = renters[(i + 8) % renters.length];
      await Booking.create({
        property: prop._id,
        tenant: renter._id,
        startDate: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        endDate: new Date(Date.now() + 370 * 24 * 3600 * 1000),
        status: bookingStatuses[i % bookingStatuses.length],
        renterDetails: {
          name: renter.name,
          email: renter.email,
          phone: renter.phone,
          occupation: renter.occupation,
          notes: 'Looking forward to inspecting the living layout next Sunday!'
        }
      });
    }

    // 6. Seed 100 Reviews
    console.log('Seeding 100 Reviews...');
    for (let i = 1; i <= 100; i++) {
      const prop = properties[i % properties.length];
      const renter = renters[i % renters.length];
      await Review.create({
        property: prop._id,
        tenant: renter._id,
        rating: (i % 2 === 0) ? 5 : 4,
        comment: 'Very tidy layout and highly cooperative landlord. Standard checks were fast.',
        reply: i % 4 === 0 ? 'Thank you so much for the review!' : ''
      });
    }

    // 7. Seed 30 Notifications
    console.log('Seeding 30 Notifications...');
    for (let i = 1; i <= 30; i++) {
      const owner = owners[i % owners.length];
      await Announcement.create({
        type: 'Push',
        title: `Renter request update for Sector ${i}`,
        content: `A tenant has submitted a negotiable contract offer for your residential listings. Check details now.`,
        isActive: true
      });
    }

    // 8. Seed 25 Chat Messages
    console.log('Seeding 25 Chat Messages...');
    for (let i = 1; i <= 25; i++) {
      const renter = renters[i % renters.length];
      const owner = owners[i % owners.length];
      await Chat.create({
        sender: renter._id,
        receiver: owner._id,
        message: 'Hello, is the property still available for visit next weekend?',
        read: i % 2 === 0
      });
    }

    // 9. Seed 20 Payments
    console.log('Seeding 20 Payments...');
    for (let i = 1; i <= 20; i++) {
      const owner = owners[i % owners.length];
      await WalletTransaction.create({
        user: owner._id,
        amount: 15000 + i * 500,
        type: 'credit',
        status: 'Completed',
        description: 'Rent deposit and advance invoice txn',
        gst: (15000 + i * 500) * 0.05 * 0.18,
        commission: (15000 + i * 500) * 0.05,
        invoiceNumber: `INV-2026-A0${i}`
      });
    }

    // 10. Seed 15 Complaints
    console.log('Seeding 15 Complaints...');
    for (let i = 1; i <= 15; i++) {
      const prop = properties[i % properties.length];
      const renter = renters[i % renters.length];
      await Complaint.create({
        reportedBy: renter._id,
        property: prop._id,
        owner: prop.owner,
        type: 'Wrong Information',
        description: 'The distance to the metro is listed as 500m but it is actually 2.5km.',
        priority: 'Medium',
        status: 'Open'
      });
    }

    // 11. Seed CMS Hero text
    console.log('Seeding CMS options...');
    await CMS.create({
      key: 'homepage_banner',
      value: {
        title: 'Find your dream home with a premium experience.',
        subtitle: 'Browse verified listings, book private tours, and discover neighborhoods that feel like home.'
      }
    });

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
