var username;
var password;
function signIn() {
  username = document.getElementById("inputUsername").value;
  password = document.getElementById("inputPassword").value;
  if (username === "admin" && password === "admin") {
    swal("Welcome To LifeSaver", "Succesfully Logged In", "success").then(
      (value) => {
        window.location = "home.html";
      }
    );
  } else if (username == "" || password == "") {
    swal("Warning!", "Please fill all fields to SignIn", "warning");
  } else {
    swal("Incorrect Credentials!", "Username or Password Incorrect", "error");
  }
}
