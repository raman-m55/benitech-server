const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    is_used: {
      type: String,
      default: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.model('Otp', otpSchema);
export default OtpModel;
