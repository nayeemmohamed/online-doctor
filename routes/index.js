const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//This comment is just to test CI/CD Pipeline - IBM Cloud


//Welcome Page
router.get('/',(req,res) => res.render('welcome'));


//Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('patient/dashboard', {
    user: req.user
  })
);
 

module.exports = router;