//Doctor model
const Doctor = require('../models/Doctor');

const add = (req,res) => {
    //var date1 = new Date('August 15, 2021 09:30:00');
    //var date2 = new Date('August 15, 2021 13:30:00');

    var date1 = new Date('2021-08-15T20:00:00.000Z');
    var date2 = new Date('2021-08-15T21:00:00.000Z');

    const newDoctor = new Doctor({
        name: 'Zac Coughlan',
        speciality: 'Psychiatrists',
        description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
        phone:"+61(08) 8328 2050",
        email: 'zac@gmail.com',
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
        {
            $or: [
                //{startTime: { $lte: time1 },endTime: { $gt: time1 }}, 
                //{startTime: { $lt: time2 },endTime: { $gte: time2 }}
                {startTime: { $gte: time1 }, startTime: { $lt: time2 }},
                {endTime:   { $gt: time1 }, endTime:   { $lte: time2 }}
              ]
        }
    )
    .then((result)=>{
        //res.render('dashboard',{doctors: result})
        res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });

 //   const results = await Mechanics.find({
 //       startTime: { $lte: user_date },
//        endTime: { $gte: user_date }
//    });

//    if (results.length > 0) {
//        return results;
//    }
//    return false;
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
    add,
    getAll,
    getByTime,
    bookAppointment
}