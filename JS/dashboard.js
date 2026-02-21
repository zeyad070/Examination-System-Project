if (sessionStorage.getItem("examInProgress")) {
  window.location.replace("../Pages/exam.html");
}

if (localStorage.getItem("examSubmitted") === "true") {
  window.location.replace("../Pages/result.html");
}

function startExam() {
  if (localStorage.getItem("examLocked") === "true") {
    window.location.replace("../Pages/result.html");
    return;
  }

  if (sessionStorage.getItem("examInProgress")) {
    window.location.replace("../Pages/exam.html");
    return;
  }

  window.location.replace("../Pages/quiz-intro.html");
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examSubmitted");
  localStorage.removeItem("examLocked");

  sessionStorage.removeItem("examInProgress");
  sessionStorage.removeItem("shuffledQuestions");

  window.location.replace("../index.html");
}
