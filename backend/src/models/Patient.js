var mongoose = require('mongoose');

var PatientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    numberOfChildren: {
        type: Number,
        required: true,
        min: [0, 'Children can be less than 0']
    },
    updated_date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Patient', PatientSchema);