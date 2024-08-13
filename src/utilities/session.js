if (!sessionStorage.getItem("tabActive")) {
  sessionStorage.setItem("tabActive", "true");
}

window.addEventListener("beforeunload", function (event) {
  if (sessionStorage.getItem("tabActive")) {
    localStorage.setItem("navigation", "true");
  }
});

window.addEventListener("load", function () {
  if (!localStorage.getItem("navigation")) {
    localStorage.clear();
  } else {
    localStorage.removeItem("navigation");
  }
});
  