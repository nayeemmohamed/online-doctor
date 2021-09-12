const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const updateProfile = (req,res) => {

    const update = req.body;

    let patient = User.findByIdAndUpdate(req.query.id, update);
    
    patient.then(() => {
                res.send({success:true,message:'ok'});
            })
            .catch(err => console.log(err));
}






const bookAppointment = (req,res) => {
    console.log(req.body);

    let patient = req.body.patient,
        doctor = req.body.doctor;

    const newPatient = new Patient({
        name: patient.name,
        email:  patient.email,
        birthday: patient.birthday,
        gender:patient.gender,
        date: Date.now(),
        });
      
        newPatient.save()
            .then((result) => {
                const newAppointment = new Appointment({
                    doctor_id: doctor.id,
                    patient_id: result._id,
                    startTime: doctor.startTime,
                    endTime:doctor.endTime,
                    date: Date.now(),
                    });
                  
                    newAppointment.save()
                        .then((result) => {
                            //console.log(result,'result');
                            let startTime = timeCover(result.startTime), endTime = timeCover(result.endTime);
                            const appointmentFilter = {_id: result.doctor_id,startTime:startTime,endTime:endTime};
                            const update ={available:false};

                            let doctor = Doctor.findOneAndUpdate(appointmentFilter, update);
                            
                            doctor.then(() => {
                                        res.send({success:true,message:'ok'});
                                    })
                                    .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
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

timeCover =(timeData)=>{
    const reqTime  = convertTime12to24(timeData);
    var time = new Date('2021-08-15T'+reqTime+':00.000Z');
    return time
}


module.exports = {
    updateProfile,
    bookAppointment
}