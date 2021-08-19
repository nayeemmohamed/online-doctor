function startMap(){
  var mark1 = [];
  
  mark1 = [];
  var opt = {
    zoom: 3,
    center: { lat: -36.903992, lng: 144.793762 },
  };
  var map1 = new google.maps.Map(document.getElementById("map"), opt);
  google.maps.event.addListener(map1, "load", function (event) {});
  }
  window.onload=function(){
    startMap();
  };
  
  
  $(document).ready(function () {
    console.log("Document ready");
  
    $("#btnSearch").click(() => {
      $.get("/getAllProfiles", function (data) {
        $("#map").empty();
  
        var selectedBloodType = $("#selectOpt").children("option:selected").val();
        
        if (selectedBloodType == "") {
          $("#map").append(
            '<div class="row">Please select any blood type to find donor.</div>'
          );
          markers = [];
          swal("Try Again!", "Please select any blood group type to find donor", "warning");
        } else {
          markers = [];
          var options = {
            zoom: 3,
            center: { lat: -36.903992, lng: 144.793762 },
          };
          var map = new google.maps.Map(document.getElementById("map"), options);
          google.maps.event.addListener(map, "load", function (event) {});
  
          data.forEach((element) => {
            if (selectedBloodType == element.blood_type) {
              if (element.isDonating == true) {
                var mark = {
                  name:
                    "<h5 style='color:blue'>Name: " +
                    element.name +
                    "</h5><h5 style='color:purple'>Email: " +
                    element.email +
                    "</h5><h5 style='color:red'>Blood Type: " +
                    element.blood_type +
                    `</h5>`,
                  coords: {
                    lat: parseFloat(element.lat),
                    lng: parseFloat(element.lng),
                  },
                };
                markers.push(mark);
              } else {
                markers.splice(element, markers);
              }
            }
          });
        }
  
        setTimeout(function () {
          
          if (markers[0] == null) {
          } else {
            var options = {
              zoom: 7,
              center: markers[0].coords,
            };
  
            var map = new google.maps.Map(
              document.getElementById("map"),
              options
            );
  
            google.maps.event.addListener(map, "load", function (event) {
              addMarker({ coords: event.latLng });
            });
  
            // Loop through markers
            for (var i = 0; i < markers.length; i++) {
              // Add marker
              addMarker(markers[i]);
            }
  
            // Add Marker Function
            function addMarker(props) {
              var marker = new google.maps.Marker({
                position: props.coords,
                map: map
              });
  
              // Check for customicon
              if (props.iconImage) {
                // Set icon image
                marker.setIcon(props.iconImage);
              }
  
              // Check content
              if (props.name) {
                var infoWindow = new google.maps.InfoWindow({
                  content: props.name,
                });
  
                marker.addListener("click", function () {
                  infoWindow.open(map, marker);
                });
              }
            }
            console.clear();
          }
        }, 100);
          console.clear();
      });
    });
  });