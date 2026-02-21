// LOGIN GUARD
if (!localStorage.getItem("loggedInUser")) {
  window.location.replace("../index.html");
}

// RESULT GUARD
if (localStorage.getItem("examLocked") === "true") {
  window.location.replace("../Pages/result.html");
}

// RESUME or SETUP
if (sessionStorage.getItem("examInProgress")) {
  window.location.replace("../Pages/exam.html");
} else {
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
  });
}

function startQuiz() {
  localStorage.removeItem("examSubmitted");
  sessionStorage.setItem("examInProgress", Date.now().toString());
  localStorage.removeItem("examResult");
  window.location.replace("../Pages/exam.html");
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examSubmitted");
  localStorage.removeItem("examLocked");
  sessionStorage.removeItem("examInProgress");
  window.location.replace("../index.html");
}
