var express = require('express');
var expressLayouts = require('express-ejs-layouts')
var mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash =  require('connect-flash');
const User = require('./models/User');
const bodyParser = require('body-parser')
//var moment = require('moment');

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
//app.set('views','myviews');
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

//testing api's
app.use('/getAllusers',(req,res)=>{
  User.find()
    .then((result)=>{
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/single-user',(req,res)=>{
  User.findById('611d24211afcd32220d05087')
    .then((result)=>{
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/single-userid/:id',(req,res)=>{
  User.findById(req.params.id)
    .then((result)=>{
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/add-user',(req,res)=>{
  const newUser = new User({
  name: 'test',
  email: 'test@gmail.com',
  password: '123456'
  });

  newUser.save()
      .then((result) => {
          res.send(result);
      })
      .catch(err => console.log(err));
});


app.use('/add-docter',(req,res)=>{
  const newUser = new User({
  name: 'test',
  email: 'test@gmail.com',
  password: '123456'
  });

  newUser.save()
      .then((result) => {
          res.send(result);
      })
      .catch(err => console.log(err));
});

//Last request
app.use((req,res) => {
  res.send("<h1>404 Page not found<h1>");
});


//app.use(express.static(__dirname + '/public'));


var port = process.env.PORT || 8080;
app.listen(port);
console.log("Server started on port: "+port);

//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://dbuser1:dbuser1@cluster0.9lzkt.mongodb.net/lifesaver?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//let collectionProfiles;
//client.connect(err => {
//  collectionProfiles = client.db("lifesaver").collection("profiles");
  // perform actions on the collection object
//  console.log('DB Connected')
  //client.close();
//});


//const getAllProfiles = (res)=>{
//    if(collectionProfiles){
//        collectionProfiles.find().toArray(function(err,result){
//            if(err) throw err;
//            res.send(result);
//        })
//    }
//}


//app.get("/getAllProfiles",function(req,res){
//    getAllProfiles(res);
//})


//app.use(express.static(__dirname + '/public'));

//var printMessage  = function(message){
//    console.log('[Server] ' + moment().format()+' '+message)
//}

