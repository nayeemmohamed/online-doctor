/**
 * author qiaoli wang
 * wangqiao@deakin.edu.au
 */
 const express = require('express');
 const router  = express.Router();
 const rateAndReviewController = require('../controllers/rateAndReviewController');
 
 router.get('/getAppointment',rateAndReviewController.getAppointmentById);
 router.post('/addReview',rateAndReviewController.addReview);
 router.get('/reviews',rateAndReviewController.getReview);
 router.post('/reviewsSearch',rateAndReviewController.getReviewsSearch);
 router.post('/addRate',rateAndReviewController.addRate);
 router.get('/averageRate',rateAndReviewController.getAverageRate);

 
 module.exports = router;