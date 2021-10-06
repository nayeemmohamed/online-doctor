/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema; 
 
 const RateSchema = new mongoose.Schema({
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    rating: {type:Schema.Types.Number,default:0},
 });
 
 const Rate = mongoose.model('Rate',RateSchema);
 module.exports = Rate;