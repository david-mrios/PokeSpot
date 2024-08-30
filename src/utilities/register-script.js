const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const signUpMsg = document.querySelector(".msg");

signUpMsg.style.display = "none";

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("form-singUp")
    .addEventListener("submit", validateSignUpForm);
  document
    .getElementById("form-singIn")
    .addEventListener("submit", validateLoginForm);
});

function validateSignUpForm(e) {
  e.preventDefault();
  const signUpMsg = e.target.querySelector(".msg");
  signUpMsg.innerText = "";

  var fullName = document.querySelector("[name=FullName]").value;
  var email = document.querySelector("[name=Email]").value;
  var password = document.querySelector("[name=Pass]").value;

  // Comprobar si ya existe un usuario con este correo electrónico
  const existingUserData = JSON.parse(localStorage.getItem("Login"));
  if (existingUserData && existingUserData[1] === email) {
    signUpMsg.style.display = "inline";
    signUpMsg.innerText = "Ya existe una cuenta con este correo electrónico";
    return;
  }

  if (fullName === "") {
    signUpMsg.style.display = "inline";
    signUpMsg.innerText = "You got to input a name";
    return;
  }

  if (!validateEmail(email)) {
    signUpMsg.style.display = "inline";
    signUpMsg.innerText = "You must input a valid email";
    return;
  }

  if (password.length !== 8) {
    signUpMsg.style.display = "inline";
    signUpMsg.innerText = "Password must be 8 characters long";
    return;
  }

  signUpMsg.style.display = "none";
  var userData = [];
  userData.push(fullName, email, password);
  localStorage.setItem("Login", JSON.stringify(userData));

  redirectToCards();
}

function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateLoginForm(e) {
  e.preventDefault();
  const loginMsg = e.target.querySelector(".msg-login");
  const userData = JSON.parse(localStorage.getItem("Login"));
  var email = document.querySelector("[name=Email-Login]").value;
  var password = document.querySelector("[name=Pass-Login]").value;
  loginMsg.innerText = "";

  if (!userData) {
    loginMsg.style.display = "inline";
    loginMsg.innerText = "There not exist any account";
    return;
  }

  if (userData[1] !== email) {
    loginMsg.style.display = "inline";
    loginMsg.innerText = "The email does not match.";
    document.querySelector("[name=Email-Login]").value = "";
    return;
  }

  if (userData[2] !== password) {
    loginMsg.style.display = "inline";
    loginMsg.innerText = "The password is incorrect";
    document.querySelector("[name=Pass-Login]").value = "";
    return;
  }

  loginMsg.style.display = "none";
  document.querySelector("[name=Pass-Login]").value = "";
  document.querySelector("[name=Email-Login]").value = "";
  redirectToCards();
}

function clearDiv() {
  const signUpMsg = document.querySelector(".msg");
  signUpMsg.style.display = "none";
  const loginMsg = document.querySelector(".msg-login");
  loginMsg.style.display = "none";
}

function redirectToCards() {
  const baseUrl = window.location.origin;
  window.location.href = `/pages/Cards/card.html`;
}
