const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const msg = document.querySelector(".msg");

msg.style.display = "none";

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
    msg.style.display = "inline";
    msg.innerText = "You got to input a name";
    return;
  }

  if (!validateEmail(email)) {
    msg.style.display = "inline";
    msg.innerText = "You must input a valid email";
    return;
  }

  if (password.length !== 8) {
    msg.style.display = "inline";
    msg.innerText = "Password must be 8 characters long";
    return;
  }

  msg.style.display = "none";
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
  const msg = e.target.querySelector(".msg-login");
  const values = JSON.parse(localStorage.getItem("Login"));
  var email = document.querySelector("[name=Email-Login]").value;
  var password = document.querySelector("[name=Pass-Login]").value;
  msg.innerText = "";

  if (!values) {
    msg.style.display = "inline";
    msg.innerText = "There not exist any account";
    return;
  }

  if (values[1] !== email) {
    msg.style.display = "inline";
    msg.innerText = "El email no coincide.";
    document.querySelector("[name=Email-Login]").value = "";
    return;
  }

  if (values[2] !== password) {
    msg.style.display = "inline";
    msg.innerText = "The password is incorrect";
    document.querySelector("[name=Pass-Login]").value = "";
    return;
  }

  msg.style.display = "none";
  document.querySelector("[name=Pass-Login]").value = "";
  document.querySelector("[name=Email-Login]").value = "";
  window.location.href = "../../index.html";
}

function clearDiv() {
  const msg = document.querySelector(".msg");
  msg.style.display = "none";
  const msg_login = document.querySelector(".msg-login");
  msg_login.style.display = "none";
}
