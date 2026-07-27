const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String, 
        enum : ["superadmin", "subadmin", "Student"],
        required : true
    },
    hostel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hostel",
        default : null
    }
},{timestamps: true})

module.exports = mongoose.model("User",userSchema)