const mongoose = require('mongoose');

const ALLOWED_CHAIRS = [2, 4, 6, 8];

const tableSchema = new mongoose.Schema({
  tableName: {
    type: String,
    trim: true,
    default: 'Table'
  },

  tableNum: {
    type: Number,
    required: true,
    min: 1,
    unique: true,
    index: true
  },

  chairs: {
    type: Number,
    required: true,
    enum: ALLOWED_CHAIRS
  },

  isOccupied: {
    type: Boolean,
    default: false,
    index: true
  },

  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
    index: true
  }

}, { timestamps: true });

tableSchema.index({ isOccupied: 1, chairs: 1, tableNum: 1 });

module.exports = mongoose.model('Table', tableSchema);
module.exports.ALLOWED_CHAIRS = ALLOWED_CHAIRS;
