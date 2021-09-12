const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true 
    },
    email:{
        type: String,
        required: true 
    },
    birthday:{
        type:String,
    },
    gender:{
        type:String,
    },
    date:{
        type: Date,
        default: Date.now 
    }
});

const Patient = mongoose.model('Patient',PatientSchema);
module.exports = Patient;