const bcrypt  = require('bcryptjs');
//Doctor model
const Doctor = require('../models/Doctor');

//User model
//const User =  require('../models/Doctor');
//const Doctor =  require('../models/Doctor');

//Handle Registration for Doctor
const register = (req,res)=>{
  const { 
    name, 
    email, 
    password , 
    password2 , 
    speciality,
    description,
    phone,
    starttime,
    endtime
    } = req.body;

    let startTime  = convertTime12to24(starttime);
    let endTime  = convertTime12to24(endtime);

    let errors = [];
  //Checkr required fields
  if(!name || !email || !password || !password2 || !speciality || !description || !phone
    || !startTime || !endTime){
      errors.push({msg: 'Please fill in all fields'});
  }

  //Check password match
  if(password != password2){
      errors.push({msg: 'Password do not match'});
  }

  //Check pass length
  if(password.length<6){
      errors.push({msg: "Password should be at least 6 characters"});
  }

  if(errors.length>0){
      res.render('doctor/register',{
          errors,
          name,
          email,
          password,
          password2,
          speciality,
          description,
          phone,
          startTime,
          endTime
      });
  }else{
      //Validation Passed
      Doctor.findOne({email: email})
      .then(user => {
          if(user){
              //User Exist
              errors.push({msg: 'Email already exist'});
              res.render('doctor/register',{
                  errors,
                  name,
                  email,
                  password,
                  password2,
                  speciality,
                  description,
                  phone,
                  startTime,
                  endTime
              });
          }else {
            startTime = new Date('2021-08-15T'+startTime+':00.000Z');
            endTime = new Date('2021-08-15T'+endTime+':00.000Z');
              const newUser = new Doctor({
                  name,
                  email,
                  password,
                  speciality,
                  description,
                  phone,
                  startTime,
                  endTime
              });

              //Password enryption using bcrypt
              bcrypt.genSalt(10, (err , salt) => bcrypt.hash(newUser.password, salt, (err,hash) => {
                  if(err) throw err;
                  // update password
                  newUser.password = hash;
                  //Save user to mondo db using mongoose
                  newUser.save()
                      .then(user => {
                          req.flash('success_msg','Registered Successfully!');
                          res.redirect('/doctor/login');
                      })
                      .catch(err => console.log(err));
              }));
          }
      });
  }

}



const add = (req,res) => {
    //var date1 = new Date('August 15, 2021 09:30:00');
    //var date2 = new Date('August 15, 2021 13:30:00');

    var date1 = new Date('2021-08-15T20:00:00.000Z');
    var date2 = new Date('2021-08-15T21:00:00.000Z');

    const newDoctor = new Doctor({
        name: 'Henry Bass',
        speciality: 'GP',
        description: 'GP at Eastwood clinic',
        phone:"+61(08) 8328 2050",
        email: 'henry@gmail.com',
        password: '123456789',
        startTime: date1,
        endTime: date2
        });
      
        newDoctor.save()
            .then((result) => {
                res.send(result);
            })
            .catch(err => console.log(err));
}

const deleteByID = (req,res) => {
  const id = req.params.id;
  Doctor.findByIdAndDelete(id).then((result) => {
      // res.render();
  }).catch((err) => {
      console.log(err);
  });
}
const updateByID= (req,res) => {
  const id = req.params.id;
  Doctor.findByIdAndUpdate({ _id: id },
    {
        name:  req.body.name,
        speciality: req.body.speciality,
        description: req.body.description,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    },
    {new:true}
  ).then((result) => {
      // res.render();
  }).catch((err) => {
      console.log(err);
  });
}

const getAll = (req,res) => {
    Doctor.find()
    .then((result)=>{
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

const getByTime = (req,res) => {
    console.log(req.body);
    const reqStartTime  = convertTime12to24(req.params.startTime);
    const reqEndTime  = convertTime12to24(req.params.endTime);
    console.log(reqStartTime,reqEndTime);
    var time1 = new Date('2021-08-15T'+reqStartTime+':00.000Z');
    var time2 = new Date('2021-08-15T'+reqEndTime+':00.000Z');
//1$or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }];
// $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }]
    Doctor.find(
        //{startTime: { $lte: time1 },endTime: { $gt: time1 }}
        {startTime: { $lt: time2 },endTime: { $gt: time1 }}
        //{
            //$or: [
                //{startTime: { $lte: time1 },endTime: { $gt: time1 }}, 
                //{startTime: { $lt: time2 },endTime: { $gte: time2 }}
                //{startTime: { $gte: time1 }, startTime: { $lt: time2 }},
                //{endTime:   { $gt: time1 }, endTime:   { $lte: time2 }}
              //]
        //}
    )
    .then((result)=>{
        // res.render('dashboard',{doctors: result})
        res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
}




const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split('-');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return hours+':'+minutes;
}


const bookAppointment = (req,res) => {
    res.send("Appointment booked successfully, details has been send to you email.");
}


module.exports = {
    register,
    add,
    deleteByID,
    updateByID,
    getAll,
    getByTime,
    bookAppointment
}