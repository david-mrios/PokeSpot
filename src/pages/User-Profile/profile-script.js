document.addEventListener("DOMContentLoaded", function () {
  loadExistingData();

  document.getElementById("update-form").addEventListener("submit", updateData);

  document.getElementById("login").addEventListener("click", () => {
    window.location.href = "../Cards/card.html";
    
  });
});

function loadExistingData() {
  const savedData = JSON.parse(localStorage.getItem("Login"));
  if (savedData) {
    document.getElementById("fullName").value = savedData[0];
    document.getElementById("email").value = savedData[1];
    document.getElementById("nickname").value = savedData[3] || "";
    document.getElementById("dob").value = savedData[4] || "";
    if (savedData[5] === "Male") {
      document.getElementById("male").checked = true;
    } else if (savedData[5] === "Female") {
      document.getElementById("female").checked = true;
    }
  }
}

function updateData(e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const email = document.getElementById("email").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;

  if (fullName === "" || email === "") {
    alert("El nombre y el correo electrónico son campos obligatorios.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Por favor, introduce una dirección de correo electrónico válida.");
    return;
  }

  const savedData = JSON.parse(localStorage.getItem("Login")) || [];
  savedData[0] = fullName;
  savedData[1] = email;
  savedData[3] = nickname;
  savedData[4] = dob;
  savedData[5] = gender;

  localStorage.setItem("Login", JSON.stringify(savedData));

  alert("Data has been updated successfully.");
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
