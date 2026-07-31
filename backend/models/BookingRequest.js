const mongooose = require("mongoose");

const bookingRequestSchema = new mongooose.Schema({
 name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  hostel: {
    type: mongooose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'shared'],
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  calculatedPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['jazzcash', 'easypaisa', 'bank_transfer'],
    required: true
  },
  paymentReference: {
    type: String,
    required: true
  },
  referenceId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
},{
    timestamps: true
});
module.exports = mongooose.model("BookingRequest" , bookingRequestSchema)
