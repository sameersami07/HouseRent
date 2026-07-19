# HouseHunt

HouseHunt is a modern house rental platform built with a React frontend and an Express/MongoDB backend.

## Project Structure

- `Client/` – React app using Vite, Material UI, Bootstrap, and Axios.
- `Server/` – Express.js API with MongoDB through Mongoose.
- `Server/config/connect.js` – connects to MongoDB.
- `Server/models/` – schemas for User, Property, and Booking.
- `Server/controllers/` – business logic for users, owners, and admin.
- `Server/routes/` – API routes for `users`, `owners`, and `admin`.

## Features

- User authentication for renters, owners, and admin.
- Owner approval workflow managed by admin.
- Filters for location, price, property type, furnishing, and amenities.
- Property booking request flow for renters.
- Owner property management (add/edit/delete, status toggle).
- Admin dashboard for user verification, property review, and booking oversight.
- Embedded map preview in property detail view using Google Maps.
- Demo data seeded at server startup.

## Demo Credentials

- Admin: `shaiksameer@gmail.com` / `admin123`
- Owner: `john_owner@gmail.com` / `password123`
- Renter: `alice_renter@gmail.com` / `password123`

## Running the App

### Backend

```bash
cd Server
npm install
npm run start
```

### Frontend

```bash
cd Client
npm install
npm run dev
```

## Notes

- To configure MongoDB, create a `.env` file inside `Server/` and set `MONGO_URI`.
- If `MONGO_URI` is not set, the server uses `mongodb://127.0.0.1:27017/househunt`.
- Owner registration stays pending until an admin approves the account.
- The admin panel is seeded with `shaiksameer@gmail.com` and includes user/owner approval functions.

 
## Demo video
- https://drive.google.com/file/d/1JypJt01YkOw7eI6r6nRG4fmtpAxQLwVj/view?usp=drivesdk

 
