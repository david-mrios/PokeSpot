document.addEventListener("DOMContentLoaded", function () {
    // Load existing data from localStorage
    loadExistingData();
  
    // Form submission event listener
    document.getElementById("update-form").addEventListener("submit", updateData);
  
    // Return button event listener
    document.getElementById("login").addEventListener("click", () => {
      window.location.href = "../../index.html";
    });
  });
  
  function loadExistingData() {
    const savedData = JSON.parse(localStorage.getItem("Login"));
    if (savedData) {
      document.getElementById("fullName").value = savedData[0];
      document.getElementById("email").value = savedData[1];
      document.getElementById("nickname").value = savedData[3] || '';
      document.getElementById("dob").value = savedData[4] || '';
      if (savedData[5] === "Male") {
        document.getElementById("male").checked = true;
      } else if (savedData[5] === "Female") {
        document.getElementById("female").checked = true;
      }
    }
  }
  
  function updateData(e) {
    e.preventDefault();
    
    const fullName = document.getElementById("fullName").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
  
    if (fullName === "" || email === "") {
      alert("Name and Email are required fields.");
      return;
    }
  
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
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
    window.location.href = "../../index.html";
  }
  
  function validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  