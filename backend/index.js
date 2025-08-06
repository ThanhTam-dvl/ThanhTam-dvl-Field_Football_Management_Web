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
app.use('/api/team-join', teamJoinRoutes); 
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
