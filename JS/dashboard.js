//Users Array Management
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  const email = localStorage.getItem("loggedInUser");
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}

// LOGIN GUARD
if (!localStorage.getItem("loggedInUser")) {
  window.location.replace("../index.html");
}

if (sessionStorage.getItem("examInProgress")) {
  window.location.replace("../Pages/exam.html");
}

const currentUser = getCurrentUser();
if (currentUser && currentUser.examSubmitted === true) {
  window.location.replace("../Pages/result.html");
}

function startExam() {
  const user = getCurrentUser();

  if (user && user.examLocked === true) {
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
  sessionStorage.clear();
  window.location.replace("../index.html");
}
