const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true
        },
        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hostel",
            required: true,
        },
        roomType: {
            type: String,
            enum: ["single", "shared"],
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        studentsAllotted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        status: {
            type: String,
            enum: ["available", "full"],
            default: "available"
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);
