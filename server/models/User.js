const mongoose = require('mongoose');

const indianMobileRegex = /^[6-9]\d{9}$/;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    numOfPerson: { type: Number, required: true, min: 1 },
    address: { type: String, required: true, trim: true },

    contact: {
      type: String,
      required: true,
      unique: true,   
      trim: true,
      validate: {
        validator: (v) => indianMobileRegex.test(v),
        message: 'Invalid Indian mobile number',
      },
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
