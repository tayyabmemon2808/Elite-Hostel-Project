const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const momgoose = require("mongoose");
const cors= require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const roomRoutes = require('./routes/roomRoutes');
const complainRoutes = require("./routes/complaintRoutes")
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complainRoutes);
const PORT = process.env.PORT;

connectDB()
app.listen(PORT, () =>{
      console.log(`Server running on port ${PORT}`);
} )