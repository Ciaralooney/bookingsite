// setting up mongo database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;     // schema is a blueprint of the database

// these are the attributes of the file
//json value has a description and value for each attribute
var bookingSchemaful = new Schema({
    workshop: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    card: {
        type: Number,
        required: true,
        min: 1000000000000 // minimum value for number with 13 digits
    }
}, {
    timestamps: true    // automatically generated
});

// creating a bookings table, Booking is name of table
var bookings = mongoose.model('Booking', bookingSchemaful);

// exporting the file so it can be used elsewhere, if used elsewhere you need to say require in that file
module.exports = bookings;