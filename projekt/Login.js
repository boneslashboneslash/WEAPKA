// Login and Database at once, taking care of authentication
var Login = function(userEmail, userPassword){
  this.userEmail = userEmail;
  this.userPassword = userPassword;
};

 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  //user is signed in
    document.getElementById("task_div").style.display = "block";
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
  } else {
  //No user is signed in
    document.getElementById("task_div").style.display = "none";
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

    var user = firebase.auth().currentUser;
    if(user != null)
    {
    var email_id = user.email;
    
    }
  }
});
    
var loginbutton = document.querySelector("#btnLogMe");
 loginbutton.addEventListener("click", function(){
  var LogCr = new Login(document.getElementById("email_field").value,document.getElementById("password_field").value);
  firebase.auth().signInWithEmailAndPassword(LogCr.userEmail,LogCr.userPassword).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  window.alert("Error: "+ errorMessage);
  // ...
});
});

var logoutbutton = document.querySelector("#btnUnLogMe");
 logoutbutton.addEventListener("click", function(){

  firebase.auth().signOut();
});


