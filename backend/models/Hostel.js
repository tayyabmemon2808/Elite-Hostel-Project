const mongoose = require("mongoose");
const HostelSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    address: {
        type : String,
        required : true
    },
    description : {
        type : String,
        default : ""
    },
    images : [{
        type : String
    }],
    singleRoomPrice : {
        type : Number,
        required : true
    },
    sharedRoomPrice : {
        type : Number, 
        required :true
    },
    subAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }

},{timestamps: true})
module.exports = mongoose.model("Hostel" , HostelSchema)