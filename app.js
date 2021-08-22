var express = require('express');
var expressLayouts = require('express-ejs-layouts')
var mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash =  require('connect-flash');
const User = require('./models/User');
const bodyParser = require('body-parser')


//express app
var app = express();





require('./config/passport')(passport);

//db config 
const db = require('./config/keys').MongoURI;


// Connect to Mongo
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('DB Connected...'))
  .catch(err => console.log(err));



// register view engine
app.use(expressLayouts);
app.set('view engine','ejs');
//app.use(express.urlencoded({extended: true}));

//Bodyparser
//app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// For Flash Msg
app.use(flash());

//Global Variables
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



//Logging
app.use((req,res,next) => {
  console.log('-----------------------');
  console.log(req.hostname,req.method,req.path);
  //console.log('body:',req.body);
  next();
});


//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/doctor',require('./routes/doctor'));




//Last request
app.use((req,res) => {
  res.send("<h1>404 Page not found<h1>");
});





var port = process.env.PORT || 8080;
app.listen(port);
console.log("Server started on port: "+port);


module.exports = app


