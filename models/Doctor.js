const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true 
    },
    speciality:{
        type: String,
        required: true 
    },
    description:{
        type: String,
        required: true 
    },
    email:{
        type: String,
        required: true 
    },
    phone:{
        type: String,
        required: true 
    },
    password:{
        type: String,
        required: true 
    },
    startTime:{
        type: Date,
        required: true 
    },
    endTime:{
        type: Date,
        required: true 
    },
    available:{
        type:Boolean,
        default:true,
        required: true
    },
    rating:{
        type: Number,
        default:0
    }
});

const Doctor = mongoose.model('Doctor',DoctorSchema);
module.exports = Doctor;