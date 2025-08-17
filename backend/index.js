// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fieldRoutes = require('./routes/fieldRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const matchRoutes = require('./routes/matchRoutes');
const serviceRoutes = require('./routes/serviceRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const maintenanceRoutes = require('./routes/maintenanceRoutes'); 
const teamJoinRoutes = require('./routes/teamJoinRoutes'); 
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
//Admin
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // New route for dashboard stats

const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fields', fieldRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/services', serviceRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/team-joins', teamJoinRoutes); 
app.use('/api/contact', contactRoutes);
//Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📊 Admin panel will be available at http://localhost:3000/admin`);
});
