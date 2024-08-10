const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form-singUp").addEventListener("submit", validForm);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form-singIn").addEventListener("submit", validLogin);
});

function validForm(e) {
  e.preventDefault();
  const msg = e.target.querySelector(".msg"); // Selecciona el div 'msg' correspondiente al formulario actual
  msg.innerText = "";

  var fullName = document.querySelector("[name=FullName]").value;
  var email = document.querySelector("[name=Email]").value;
  var password = document.querySelector("[name=Pass]").value;
  var login = [];
  if (fullName === "") {
    msg.innerText = "You got to input a name";
    return;
  }

  if (!validateEmail(email)) {
    console.log("The email is not valid");
    msg.innerText = "You must input a valid email";
    return;
  }

  if (password.length !== 8) {
    console.log("The password must be exactly 8 characters long");
    msg.innerText = "Password must be 8 characters long";
    return;
  }

  login.push(fullName, email, password);
  localStorage.setItem("Login", JSON.stringify(login));

  window.location.href = "../../index.html";
}

function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validLogin(e) {
  e.preventDefault();
  const msg = e.target.querySelector(".msg");
  const values = JSON.parse(localStorage.getItem("Login"));
  var email = document.querySelector("[name=Email-Login]").value;
  var password = document.querySelector("[name=Pass-Login]").value;
  msg.innerText = "";

  if (!values) {
    msg.innerText = "There not exist any account";
    return;
  }

  if (values[1] !== email) {
    msg.innerText = "El email no coincide.";
    document.querySelector("[name=Email-Login]").value = "";

    return;
  }

  if (values[2] !== password) {
    msg.innerText = "The password is incorrect";
    document.querySelector("[name=Pass-Login]").value = "";

    return;
  }
  document.querySelector("[name=Pass-Login]").value = "";
  document.querySelector("[name=Email-Login]").value = "";
  window.location.href = "../../index.html";
}
