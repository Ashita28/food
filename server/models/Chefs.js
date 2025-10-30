const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    noOfOrdersTaken: {
        type: Number,
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('Chefs', chefSchema);