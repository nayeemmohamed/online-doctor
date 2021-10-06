/**
 *  author qiaoli wang
 *  wangqiao@deakin.edu.au
 */
 const User = require('../models/User');
 const Doctor = require('../models/Doctor');
 const Appointment = require('../models/Appointment');
 const Review = require('../models/Review');
 const Rate = require('../models/Rate');
/**
 * get appointment by id
 * @param {} req 
 * @param {*} res 
 */
 const getAppointmentById = (req, res) => {
  console.log('req'); 
  Appointment.find({'_id': req.query.id})
      .then((result) => {
          res.render('patient/rateAndReview', {
              appointment: result
          });
      })
      .catch((err) => {
          console.log(err);
          res.send(err);
      });
}
/**
   * add a review
   * qiaoli wang (wangqiao@deakin.edu.au)
   */
 const addReview =(req, res, next)=>{
    let review = req.body;
    console.log(review);
    
    try {
        User.findById(review.userId).then((userfound)=>{
            if(userfound){
                Doctor.findById(review.doctor).then((docfound)=>{
                    console.log(userfound,docfound)
                    const newReview = new Review({
                        doctor: docfound,
                        user: userfound,
                        rating: review.rating,
                        review: review.review,
                    });
                   
                    newReview.save()
                        .then((result) => {
                            res.send({ success: true, message: 'ok' });
                        })
                        .catch(err => console.log(err));
                })
            }
        })
       
        

    } catch (err) {
      console.log("Error add a review", err);
      return next(err);
    }
}

  /**
   *  get all reviews by doctor id
   *  qiaoli wang (wangqiao@deakin.edu.au)
   */
  const getReview=(req, res, next)=>{
    let doctorId  = req.query.doctorId;
    try {
     Review.find({doctor:doctorId}).then((result)=>{
         res.send({data:result,success:true})
     })

    } catch (err) {
      console.log("Error on get Review endpoint", err);
      return next(err);
    }
  }
  /**
   * search reviews by review text
   * qiaoli wang (wangqiao@deakin.edu.au)
   */
  const getReviewsSearch =(req, res, next)=>{
    let { doctorId, text } = req.body;

    try {
     Review.find({ doctor: doctorId, review: { $regex: `.*${text}.*` } }).then((result)=>{
         res.send(result);
     })

    }catch (err) {

      console.log("Error on Reviews Search detail endpoint", err);
      return next(err);
    }
  }
  /**
   * add a rating
   * qiaoli wang (wangqiao@deakin.edu.au)
   */
  const addRate =(req, res, next)=>{
    let rate = req.body;
    try {
        Doctor.findById(rate.doctor).then((docfound)=>{
        const newRate = new Rate({
            doctor: docfound,
            rating: rate.rating,
        });
       
        newRate.save()
            .then((result) => {
                res.send({ success: true, message: 'ok' });
            })
            .catch(err => console.log(err));
       })
    } catch (err) {

      console.log("Error when add a rating", err);
      return next(err);
    }
  }
  /**
   *  get average rate by doctor
   *  qiaoli wang (wangqiao@deakin.edu.au)
   */
  const getAverageRate =(req, res, next)=>{
    let { doctorId } = req.query;
    try {
        Rate.find({doctor:doctorId}).then((rate)=>{
              let averageRate = { doctor: "", rating: 0 }, totalRating = 0;
                if (rate.length > 1) {
                    rate.forEach((item) => {
                    let rating = parseFloat(item.rating);
                    averageRate._id = item._id;
                    totalRating += rating;
                    averageRate.rating = (totalRating / rate.length).toFixed(1).toString();
                    averageRate.doctor = item.doctor;
                    });
                    return res.status(200).send(averageRate);

                } else if (rate.length === 0) {
                    return res.status(200).send({ doctor: doctorId, rating: "0.0" });
                } else {
                    return res.status(200).send(rate[0]);
                }
        })
    
    } catch (err) {

      console.log("Error on get average rate by city endpoint", err);
      return next(err);
    }
  }



 module.exports = {
    addReview,
    addRate,
    getReview,
    getReviewsSearch,
    getAverageRate,
    getAppointmentById
}