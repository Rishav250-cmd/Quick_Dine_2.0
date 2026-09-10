# 🍽️ Quick Dine 2.0

### A Full-Stack Restaurant Discovery & Table Reservation Platform

**Quick Dine 2.0** is a full-stack restaurant discovery and table reservation platform that allows customers to explore restaurants, check availability, make reservations, and manage their bookings.

It also provides dedicated dashboards for **Restaurant Owners** and **Administrators**, making it a complete multi-role restaurant management system.

## 🔗 Project Links

* 🌐 **Live Demo:** https://quick-dine-2-0-rd.vercel.app/
* 💻 **GitHub Repository:** https://github.com/Rishav250-cmd/Quick_Dine_2.0

---

## ✨ Features

### 👤 Customer Features

* 🔐 User registration and login
* 🔑 Secure authentication using JWT
* 🍴 Browse available restaurants
* 🔎 Search and discover restaurants
* ⭐ View featured restaurants
* 📄 View detailed restaurant information
* 📅 Check restaurant availability
* 🪑 Book tables
* 👥 Select number of guests
* 🎉 Add occasion details
* 📝 Add special requests
* 📋 View booking history
* ❌ Cancel bookings
* 👤 Manage personal dashboard

### 🏪 Restaurant Owner Features

Restaurant owners have their own protected dashboard.

* 🏪 Create restaurant profile
* ✏️ Update restaurant information
* 🖼️ Upload restaurant images
* 🍽️ Add cuisine and pricing information
* 📍 Add restaurant location and address
* 👨‍🍳 Add chef information
* 🏷️ Add restaurant tags
* 🕐 Configure available booking slots
* 🪑 Configure total seating capacity
* 📋 View customer bookings
* ✅ Confirm bookings
* ❌ Cancel bookings
* ✔️ Mark bookings as completed

### 🛡️ Admin Features

Administrators can manage the restaurant platform.

* 📊 Admin dashboard
* 📈 View platform statistics
* 🏪 View registered restaurants
* 🔍 Review restaurant submissions
* ✅ Approve restaurants
* 🔐 Protected admin-only routes

---

# 🔐 Role-Based Access Control

Quick Dine 2.0 uses role-based authorization.

| Role                | Access                                               |
| ------------------- | ---------------------------------------------------- |
| 👤 Customer         | Restaurant discovery, booking and booking management |
| 🏪 Restaurant Owner | Restaurant management and booking management         |
| 🛡️ Admin           | Restaurant approval and platform statistics          |

Protected routes prevent unauthorized users from accessing owner and admin functionality.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │  TypeScript + Vite  │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │    Node.js + TS     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │   MongoDB  │   │ Cloudinary │   │    JWT     │
       │  Database  │   │   Images   │   │   Auth     │
       └────────────┘   └────────────┘   └────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Axios
* React Hot Toast
* Lucide React

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Cloudinary
* CORS
* dotenv

## Deployment

* Frontend: Vercel
* Backend: Node.js/Express deployment
* Database: MongoDB
* Image Storage: Cloudinary

---

# 📁 Project Structure

```text
Quick_Dine_2.0/
│
├── Client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── booking/
│   │   │   ├── home/
│   │   │   ├── owner/
│   │   │   └── restaurant/
│   │   │
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── owner/
│   │   │   ├── BookingConfirmation.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── RestaurantDetail.tsx
│   │   │   └── Search.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   └── package.json
│
├── Server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔗 Frontend Routes

```text
/
├── /search
├── /restaurant/:slug
├── /booking/:slug
├── /dashboard
├── /owner/dashboard
└── /admin/dashboard
```

### Protected Routes

```text
/booking/:slug
/dashboard
/owner/dashboard
/admin/dashboard
```

Access to these routes is controlled through authentication and role-based authorization.

---

# 🔌 API Structure

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Restaurants

```http
GET /api/restuarent
GET /api/restuarent/featured
GET /api/restuarent/:slug
GET /api/restuarent/:id/availability
```

## Bookings

```http
POST /api/booking
GET  /api/booking/my
PUT  /api/booking/:id/cancel
```

## Restaurant Owner

```http
GET /api/owner/restaurant
POST /api/owner/restaurant
PUT /api/owner/restaurant

GET /api/owner/bookings
PUT /api/owner/bookings/:id/status
```

## Admin

```http
GET /api/admin/restaurants
PUT /api/admin/restaurants/:id/approve
GET /api/admin/stats
```

---

# 🔐 Authentication & Security

The application implements several security mechanisms:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based authorization
* Owner-only routes
* Admin-only routes
* Authenticated booking operations
* Environment variables for sensitive configuration
* CORS configuration
* Backend validation

Passwords are never stored as plain text.

---

# 🖼️ Image Management

Restaurant images are uploaded through the backend using **Multer** and stored using **Cloudinary**.

```text
User
 │
 ▼
React Frontend
 │
 ▼
Multer
 │
 ▼
Express Backend
 │
 ▼
Cloudinary
 │
 ▼
Image URL stored with restaurant
```

This prevents large image files from being stored directly inside MongoDB.

---

# 🗄️ Database

Quick Dine uses **MongoDB** with **Mongoose** for database management.

The database stores information related to:

* Users
* Restaurants
* Bookings
* Restaurant owners
* Admin-managed restaurant approval
* Restaurant availability
* Booking status

### Booking Status

```text
confirmed
cancelled
completed
```

### Restaurant Status

New restaurants submitted by owners can remain pending until they are approved by an administrator.

```text
pending → approved
```

---

# 📅 Booking Flow

The reservation process works approximately as follows:

```text
Customer
   │
   ▼
Select Restaurant
   │
   ▼
View Restaurant Details
   │
   ▼
Check Availability
   │
   ▼
Select Date & Time
   │
   ▼
Select Number of Guests
   │
   ▼
Add Occasion / Special Request
   │
   ▼
Confirm Booking
   │
   ▼
Booking Created
   │
   ▼
View Booking Confirmation
```

The backend checks restaurant approval and seating availability before creating a reservation.

---

# 🏪 Restaurant Owner Flow

```text
Owner Login
     │
     ▼
Owner Dashboard
     │
     ├───────────────┐
     ▼               ▼
Restaurant       Bookings
Management       Management
     │               │
     ▼               ▼
Create / Edit    View Bookings
Restaurant       Update Status
     │
     ▼
Admin Approval
```

---

# 🛡️ Admin Flow

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├───────────────┐
     ▼               ▼
Restaurants        Statistics
     │
     ▼
Review Restaurant
     │
     ▼
Approve Restaurant
```

---

# ⚙️ Environment Variables

Create environment files according to the configuration used by the frontend and backend.

Example backend variables:

```env
PORT=5070
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Never commit real API keys, database credentials, JWT secrets, or Cloudinary credentials to GitHub.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Rishav250-cmd/Quick_Dine_2.0.git
```

```bash
cd Quick_Dine_2.0
```

---

## 2. Setup Client

```bash
cd Client
npm install
```

Start the frontend:

```bash
npm run dev
```

---

## 3. Setup Server

Open another terminal:

```bash
cd Server
npm install
```

Start the backend:

```bash
npm run server
```

or:

```bash
npm start
```

---

# 📜 Available Scripts

## Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Server

```bash
npm start
npm run server
npm run build
```

---

# 🌐 Deployment

The frontend is deployed using Vercel.

### Live Application

https://quick-dine-2-0-rd.vercel.app/

The project also includes Vercel SPA routing configuration so client-side routes can work correctly after deployment.

---

# 📱 Responsive Design

Quick Dine is designed to provide a responsive experience across different screen sizes.

The interface is designed for:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

---

# 💡 Engineering Concepts Demonstrated

This project demonstrates practical knowledge of:

* Full-stack web development
* REST API development
* React component architecture
* TypeScript
* Client-side routing
* Protected routes
* JWT authentication
* Role-based authorization
* MongoDB database design
* Mongoose
* CRUD operations
* File uploads
* Cloud image storage
* API integration using Axios
* Form handling
* Booking and availability logic
* Backend validation
* Error handling
* Deployment
* Git and GitHub

---

# 🎯 Project Goals

The main goal of Quick Dine 2.0 is to create a realistic restaurant reservation platform while demonstrating how a modern full-stack application can be designed and developed.

The project focuses on:

* Clean frontend architecture
* Secure backend APIs
* Role-based dashboards
* Real-world database operations
* Restaurant discovery
* Table reservation
* Restaurant management
* Admin moderation

---

# 🚧 Future Improvements

Some potential improvements for future versions include:

* 💳 Online payment integration
* 🍔 Online food ordering
* 📦 Order tracking
* ⭐ Restaurant reviews and ratings
* ❤️ Favorite restaurants
* 🔔 Email/SMS booking notifications
* 📍 Maps and location integration
* 📊 Advanced analytics for restaurant owners
* 📈 More detailed admin analytics
* 🧾 Digital invoices
* 🤖 AI-based restaurant recommendations
* 🔎 Advanced filtering and sorting
* 📱 Dedicated mobile application

---

# 🤝 Contributing

Contributions are welcome.

### Steps

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Open a Pull Request

---

# 👨‍💻 Author

**Rishav Dev**

GitHub:

https://github.com/Rishav250-cmd

Project:

https://github.com/Rishav250-cmd/Quick_Dine_2.0

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 🍽️ Quick Dine 2.0

**Discover. Reserve. Dine.**

A full-stack restaurant discovery and table reservation platform built to demonstrate modern web development, authentication, role-based access control, database management, and real-world booking workflows.
