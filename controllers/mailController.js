const nodemailer = require("nodemailer");
const mail_id = require('../config/keys').MAIL_ID;
const mail_psw = require('../config/keys').MAIL_PASS;



const sendMailToPatient=(id,appointment)=>{
    const email = appointment.patient.email;
    const email_body = `<center>
                        <h1 style='font-size:200%; color:#2828ff';> Hi ${appointment.patient.name}, thank you for choosing online doctor!</h1>
                        </center>
                        
                        <center>
                            <p><h2> Your appointment detail is:
                            </h2></p>
                        <center>
                            <h4>Doctor details</h4>
                            <div class="display-flex-start">
                                <img src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?size=338&ext=jpg" class="border-radius-6 mb-10 mr-10" width="100" />
                                <div>
                                    <div><b>${appointment.doctor.name}</b></div>
                                    <p>Email: ${appointment.doctor.email}</p>
                                    <p>State: ${appointment.state}</p>
                                    <p><b>Booking Time :</b> ${appointment.startTime} ~ ${appointment.endTime}</p>
                                </div>
                            </div>

                        <center style='color:#D3D3D3';>
                            <b>This message was sent from Online Doctor.</b>
                        </center>`;
    try {
        // initializing the service
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: mail_id,
                pass: mail_psw
            },
        });

        // defining the mail
        let mailOptions = {
            from: mail_id,
            to: email,
            subject: "Appointment Details",
            text: "",
            html: email_body
        };

        // sending the email
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Email Sent");
            }
        });
    } catch (err) {
        console.log(err);
    }

}
const sendMailToDoctor=(id,appointment)=>{
    const email = appointment.doctor.email;
    const email_body = `<center>
                        <h1 style='font-size:200%; color:#2828ff';> Hi ${appointment.doctor.name}, a new appointment need to be confirmed</h1>
                        </center>
                        
                        <center>
                            <p><h2> Your appointment detail is:
                            </h2></p>
                        <center>
                            <h4>Doctor details</h4>
                            <div class="display-flex-start">
                                <div>
                                    <div><b>${appointment.patient.name}</b></div>
                                    <p>Email: ${appointment.patient.email}</p>
                                    <p>State: ${appointment.state}</p>
                                    <p><b>Booking Time :</b> ${appointment.startTime} ~ ${appointment.endTime}</p>
                                </div>
                            </div>

                        <center style='color:#D3D3D3';>
                            <b>This message was sent from Online Doctor.</b>
                        </center>`;
    try {
        // initializing the service
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: mail_id,
                pass: mail_psw
            },
        });

        // defining the mail
        let mailOptions = {
            from: mail_id,
            to: email,
            subject: "Appointment Details",
            text: "",
            html: email_body
        };

        // sending the email
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Email Sent");
            }
        });
    } catch (err) {
        console.log(err);
    }

}
module.exports = {
    sendMailToPatient,
    sendMailToDoctor
}