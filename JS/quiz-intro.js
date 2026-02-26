// Users Array Management
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

function updateCurrentUser(updates) {
  const email = localStorage.getItem("loggedInUser");
  if (!email) return;
  const users = getUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
}

// LOGIN GUARD
if (!localStorage.getItem("loggedInUser")) {
  window.location.replace("../index.html");
}

const currentUser = getCurrentUser();
if (currentUser && currentUser.examLocked === true) {
  window.location.replace("../Pages/result.html");
}

// RESUME if exam already started
if (sessionStorage.getItem("examInProgress")) {
  window.location.replace("../Pages/exam.html");
}

function startQuiz() {
  updateCurrentUser({
    examSubmitted: false,
    examResult: null,
    examQuestions: [],
    examAnswers: [],
  });

  sessionStorage.setItem("examInProgress", Date.now().toString());
  window.location.replace("../Pages/exam.html");
}

function logout() {
  localStorage.removeItem("loggedInUser");
  sessionStorage.removeItem("examInProgress");
  window.location.replace("../index.html");
}
