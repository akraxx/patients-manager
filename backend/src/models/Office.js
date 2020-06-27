const mongoose = require('mongoose');

var OfficeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    zipCode: String,
    city: String,
    price: Number,
    paymentTypes: [String],
});

module.exports = mongoose.model('Office', OfficeSchema);