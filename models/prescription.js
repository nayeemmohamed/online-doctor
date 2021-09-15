/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema; 
 
 const PrescriptionSchema = new mongoose.Schema({

     appointment: {type:Object},
     medicine:{
         type: String,
         required: true 
     }
 });
 
 const Prescription = mongoose.model('Prescription',PrescriptionSchema);
 module.exports = Prescription;