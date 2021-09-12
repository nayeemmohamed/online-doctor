//Doctor model
const User = require('../models/User');

const updateProfile = (req,res) => {
    console.log(req.query.id,req.body,'resssss');
   
    const update = req.body;

    let patient = User.findByIdAndUpdate(req.query.id, update);
    
    patient.then(() => {
                res.send({success:true,message:'ok'});
            })
            .catch(err => console.log(err));
}






const bookAppointment = (req,res) => {
    res.send("Appointment booked successfully, details has been send to you email.");
}


module.exports = {
    updateProfile,
    bookAppointment
}