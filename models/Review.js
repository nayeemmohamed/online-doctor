/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema; 
 
 const ReviewSchema = new mongoose.Schema({
     doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
     user: [{ type: Schema.Types.Object, ref: 'User' }],
     rating: {type:Schema.Types.Number,default:0},
     review: { type: Schema.Types.String, default:'' },
     createTime:{type:Schema.Types.Date,default:Date.now()}
 });
 
 const Review = mongoose.model('Review',ReviewSchema);
 module.exports = Review;