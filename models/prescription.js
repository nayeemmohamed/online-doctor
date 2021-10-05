/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema; 
 
 const PrescriptionSchema = new mongoose.Schema({

     appointmentId: {
         type:String,
         required: true
        },
     medicine:{
         type: String
     }
 });
 
 const Prescription = mongoose.model('Prescription',PrescriptionSchema);
 module.exports = Prescription;