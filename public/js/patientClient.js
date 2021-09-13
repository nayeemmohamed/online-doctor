/**
 *  modify by qiaoli wang
 */
function searchDoctors() {
    var selectFrom = document.getElementById('appointFrom');
    var selectTo = document.getElementById('appointTo');
    var valueFrom = selectFrom.options[selectFrom.selectedIndex].value;
    var valueTo = selectTo.options[selectTo.selectedIndex].value;

    var docList = document.getElementById("doctorList");

    var nameList = [];
    var doctors = [];
    fetch("/doctor/getByTime/" + valueFrom + "/" + valueTo + "").then(res => res.json()).then((out) => {
      //http://host.docker.internal:3000     
      nameList = [];
      nameList.innerHTML = "";
      doctors = []; docList.innerHTML = "";
      console.log('OutPut: ', out);
      // alert(JSON.stringify(out));
      doctors = out;
      for (var i = 0; i < doctors.length; i++) {
        date1 = new Date(doctors[i].startTime);
        var startTime = new Date(date1).toLocaleTimeString('en',
          { timeStyle: 'short', hour12: false, timeZone: 'UTC' });
        date2 = new Date(doctors[i].endTime);
        var endTime = new Date(date2).toLocaleTimeString('en',
          { timeStyle: 'short', hour12: false, timeZone: 'UTC' });

        let template = `<div class="col-sm-3 mb-3"><div class="card border-0 shadow">
          <img src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg?size=338&ext=jpg" class="card-img-top" alt="${doctors[i].name}">
          <div class="card-body">
            <h5 class="card-title">Dr.
            </span><u>${doctors[i].name}</u></h5>
            <div id="timePara">
              <div class="fs-14">${doctors[i].available == false ? '<b style="color:red">Not Available</b>' : '<b style="color:green">Available</b>'} :${startTime}- ${endTime}</div>
            </div>
            <p class="card-text fs-14"  id="descrip">${doctors[i].description}</p>
            <p id="specPara">
              <p class="fs-14"><b>Speciality</b> : ${doctors[i].speciality}</p>
              </p>
              <button class="btn btn-primary  mr-10" data-bs-toggle="modal" data-bs-target="#exampleModal2"
              value="Email : ${doctors[i].email} | Phone: ${doctors[i].phone}" onclick="onContact(this)"
              id="btnContact">Contact</button>
              <button   ${doctors[i].available == false ? 'disabled' : ''} id="booking" type="button" class="btn btn-success" value="${doctors[i].name},${startTime},${endTime},${doctors[i]._id}"
              onclick="makeApointment(this)">Book Now</button>
          </div>
        </div> </div>`

        $('#doctorList').append(template);
      }
    })
  }

  function onContact(ele) {
    emailPhone = document.createElement('p');
    emailPhone.innerHTML = ele.value;
    contactDetail = document.getElementById('emailNumber');
    contactDetail.innerHTML = '';
    contactDetail.appendChild(emailPhone);
  }


  /**
   *  patient profile
   *  author : Qiaoli Wang 
   *  wangqiao@deakin.edu.au
   */

  let uid = $('.profile-form-container').data('uid');

  goToProfileForm = ()=>{
    $('#nav-profile-tab').trigger('click');
  }

  goToAppointmentTab = ()=>{
    $('#nav-appointment-tab').trigger('click');
  }

  $('#profileUpdate').on('click',function(){
    editProfile();
  })

  editProfile = ()=>{
    const data = {
        birthday:$('#Birthday').val(),
        gender:$( "#Gender option:selected" ).text(),
        phoneNumber:$('#PhoneNumber').val(),
    };
    fetch(`/patient/updateProfile?id=${uid}`, {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      location.reload();
    })
    .catch((error) => {
    console.error('Error:', error);
    });
  }

  /**
   * make a appointment
   * author qiaoli wang
   */

  let patient ={}, doctor ={};

   makeApointment =(ele)=> {

    $('#exampleModal').modal('show'); 

       let doctorInfo = ele.value.toString().split(',');
       $('#appointmentDoctor').text(doctorInfo[0]);
       $('#appointmentTime').text(`${doctorInfo[1]}-${doctorInfo[2]}`);

       doctor ={
         id:doctorInfo[3],
         startTime:doctorInfo[1],
         endTime:doctorInfo[2]
       }
       
   }

   $('#confirmBooking').on('click',function(){
    
    patient ={
      name:$('#patientName').val(),
      email:$('#patientEmail').val(),
      birthday:$('#patientBirthday').val(),
      gender:$('#patientGender').val(),
     }
    
    let dataToSend = {
      patient:patient,
      doctor:doctor
    };

    fetch(`/patient/bookAppointment`, {
       method: 'POST', // or 'PUT'
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(dataToSend),
       })
       .then(response => response.json())
       .then(data => {
         if(data.success){
           $('#exampleModal').modal('hide'); 
           alert('Your appointment was successfully!!')
         }
       })
       .catch((error) => {
       console.error('Error:', error);
       });
   })

   /**
    *  get patient appointment history by patien _id
    *  author qiaoli wang
    *  wangqiao@deakin.edu.au
    */
  
   getAppointments =()=>{
    
    fetch(`/patient/patientAppointments`, {
      method: 'GET', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      })
      .then(response => response.json())
      .then(data => {
        let result = data;
        let template;
        console.log(result);
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          template = `<tr>
          <th scope="row">${index}</th>
          <td>${index}</td>
          <td>${element.doctor_id}</td>
          <td>@mdo</td>
          <td>${element.patient_id}</td>
          <td><button value=${element._id}  onclick="cancelAppointmentById(this)">Cancle</button></td>
        </tr>`;
          $('#appointments').append(template);
        }
        
        console.log(data);
      })
      .catch((error) => {
      console.error('Error:', error);
      });
   }

   getAppointments();

   cancelAppointmentById=(e)=>{
     //console.log(e.value);
     if (confirm('Are you sure you want to cancel this appointment?')) {
      let dataToSend = {
        id:e.value
      }
      fetch(`/patient/cancelPatientAppointment`, {
       method: 'POST', // or 'PUT'
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(dataToSend),
       })
       .then(response => response.json())
       .then(data => {
         console.log(data);
         if(data.success){
           alert('Your appointment was canceled!!')
           location.reload();
         }
       })
       .catch((error) => {
       console.error('Error:', error);
       });
    } else {
      alert('Your appointment was not cancel!!')
    }
   }
   
