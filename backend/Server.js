const dns = require("dns");
dns.setServers (["8.8.8.8", "8.8.4.4"]);
const express = require("express")
const mongoose = require("mongoose");
const cors =  require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const hostelRoutes = require("./routes/hostelRoutes")
const roomRoutes = require("./routes/roomRoutes")
const complaintRoutes = require("./routes/complaintRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const stayHistoryRoutes = require("./routes/stayHistoryRoutes")

dotenv.config();
const app = express();

app.use(express.json())
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/hostels" , hostelRoutes);
app.use("/api/rooms" , roomRoutes) 
app.use("/api/complaints" , complaintRoutes)
app.use("/api/bookings", bookingRoutes);
app.use("/api/stay-History" , stayHistoryRoutes)

const PORT = process.env.PORT;
connectDB()


app.listen(PORT, () =>{
      console.log(`Server running on port ${PORT}`);
} )