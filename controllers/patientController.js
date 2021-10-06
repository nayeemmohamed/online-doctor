/**
 *  author qiaoli wang
 *  wangqiao@deakin.edu.au
 */

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Prescription = require('../models/prescription');

const updateProfile = (req, res) => {

    const update = req.body;

    let patient = User.findByIdAndUpdate(req.query.id, update);

    patient.then(() => {
        res.send({ success: true, message: 'ok' });
    })
        .catch(err => console.log(err));
}



const bookAppointment = (req, res) => {
    console.log(req.body);

    let patient = req.body.patient,
        doctor = req.body.doctor;

    const newPatient = new Patient({
        name: patient.name,
        email: patient.email,
        birthday: patient.birthday,
        gender: patient.gender,
        date: Date.now(),
    });

    newPatient.save()
        .then((result) => {
            const newAppointment = new Appointment({
                user_id:req.user._id,
                doctor: doctor,
                patient: result,
                startTime: doctor.startTime,
                endTime: doctor.endTime,
                date: Date.now(),
            });

            newAppointment.save()
                .then((result) => {
                    let startTime = timeCover(result.doctor.startTime), endTime = timeCover(result.doctor.endTime);
                    const appointmentFilter = { _id: result.doctor.id, startTime: startTime, endTime: endTime };
                    // add one for rating value
                    // author mike wang
                    const update = { available: false };

                    let doctor = Doctor.findOneAndUpdate(appointmentFilter, update);

                    doctor.then(() => {
                        res.send({ success: true, message: 'ok' });
                    })
                    .catch(err => {
                            console.log(err)
                            res.send(err)
                        }
                    );
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

const getPatientAppointment = (req, res) => {
    //console.log(req.user._id);
    Appointment.find({'user_id': req.user._id})
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
}
const cancelPatientAppointment = (req, res) => {
    //console.log(req.body.id);
    Appointment.findByIdAndRemove(req.body.id)
        .then((result) => {
            let startTime = timeCover(result.doctor.startTime), endTime = timeCover(result.doctor.endTime);
            const appointmentFilter = { _id: result.doctor.id, startTime: startTime, endTime: endTime };
            // reduce one for rating value
            // author mike wang
            const update = { available: true };

            let doctor = Doctor.findOneAndUpdate(appointmentFilter, update);

            doctor.then(() => {
                res.send({ success: true, message: 'ok' });
            })
                .catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
}
/**
 * get appointment by id
 * @param {} req 
 * @param {*} res 
 */
const getAppointmentById = (req, res) => {
    Appointment.find({'_id': req.query.id})
        .then((result) => {

            Prescription.find({'appointmentId':req.query.id})
            .then((presc)=>{
                console.log(presc);
                res.render('patient/appointmentDetail', {
                    appointment: result,
                    prescription: presc
                });
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
            
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
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
    return hours + ':' + minutes;
}

timeCover = (timeData) => {
    const reqTime = convertTime12to24(timeData);
    var time = new Date('2021-08-15T' + reqTime + ':00.000Z');
    return time
}


module.exports = {
    updateProfile,
    bookAppointment,
    getPatientAppointment,
    cancelPatientAppointment,
    getAppointmentById
}