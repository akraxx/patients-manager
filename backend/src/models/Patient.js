var mongoose = require('mongoose');

var AntecedentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    important: {
        type: Boolean,
        required: true
    },
    value: {
        type: String,
        required: false
    }
});

var ConsultationSchema = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    paymentType: String,
    clearedCheck: Boolean,
    checkNumber: String,
    clinicalTests: String,
    date: Date
});

var PatientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    sexe: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now},
    mobilePhone: String,
    phone: String,
    mail: String,
    address: String,
    zipCode: String,
    city: String,
    deceased: Boolean,
    maritalStatus: String,
    children: Number,
    job: String,
    hobbies: String,
    doctor: String,
    complementaryHealth: String,
    socialSecurityNumber: String,
    sentBy: String,
    handOrientation: String,
    remarks: String,
    antecedents: [AntecedentSchema],
    consultations: [ConsultationSchema]
});

module.exports = mongoose.model('Patient', PatientSchema);