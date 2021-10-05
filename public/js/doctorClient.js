/**
 * get a doctor appointment list
 * author mike wang
 */
$(document).ready(function(){
    getAppointments();

  });

getAppointments =()=>{
$('#appointments').empty();
fetch(`/doctor/doctorAppointments`, {
    method: 'GET', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    })
    .then(response => response.json())
    .then(data => {
    let result = data;
    let template;
    if(result.length >0){
        for (let index = 0; index < result.length; index++) {
        const element = result[index];
        template = `<tr>
        <th scope="row">${index}</th>
        <td>${element.startTime} - ${element.endTime}</td>
        <td>${element.doctor.name}</td>
        <td>${element.doctor.email}</td>
        <td>${element.patient.name}</td>
        <td>${element.patient.email}</td>
        <td>
            <button style="background-color:green;color:white" value=${element._id} onclick="getAppointmentById(this)">View</button>
            <button value=${element._id}  onclick="cancelAppointmentById(this)">Cancel</button>
        </td>
        </tr>`;
        $('#appointments').append(template);
        }
    }else{
        $('#appointments').append(`<tr><td colspan="7" class="text-center">no appointments</td></tr>`);
    }
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

   /**
    *  cancel appointment by Id
    *  author mike wang
    */
    cancelAppointmentById=(e)=>{
        if (confirm('Are you sure you want to cancel this appointment?')) {
         let dataToSend = {
           id:e.value
         }
         fetch(`/doctor/cancelDoctorAppointment`, {
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
   
      getAppointmentById =(e)=>{
       location.href=`/doctor/appointment?id=${e.value}`;
       console.log(e);
      }
      