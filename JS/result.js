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
if (!currentUser || !currentUser.examResult) {
  window.location.replace("../Pages/dashboard.html");
}

// BLOCK BACK BUTTON
history.pushState(null, "", location.href);
window.addEventListener("popstate", () => {
  history.pushState(null, "", location.href);
});

const resultData = currentUser.examResult;
const percent = Math.round((resultData.score / resultData.total) * 100);
document.querySelector(".progress-circle").dataset.percent = percent;

document.getElementById("correctText").innerText = resultData.score;
document.getElementById("wrongText").innerText =
  resultData.total - resultData.score;
document.getElementById("timeText").innerText = resultData.time + " sec";

let fullName = "Student";
const first = (currentUser.firstName || "").trim();
const last = (currentUser.lastName || "").trim();
if (first || last) {
  fullName = [first, last].filter(Boolean).join(" ");
}

document.getElementById("userName").textContent =
  `${fullName}, here is your result summary`;

// PASS / FAIL + title
const statusEl = document.getElementById("statusText");
const resultTitle = document.getElementById("resultTitle");

if (percent >= 50) {
  statusEl.innerText = "Passed";
  statusEl.classList.add("pass");
  resultTitle.innerText = "🎉 Congratulations!";

  setTimeout(() => {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#7494ec", "#4caf50", "#ffeb3b", "#f44336", "#9c27b0"],
      });
    }
  }, 900);
} else {
  statusEl.innerText = "Failed";
  statusEl.classList.add("fail");
  resultTitle.innerText = "❌ Try Again!";
}

// Circular Progress + Counter Animation
function startProgressAnimation() {
  const container = document.querySelector(".progress-circle");
  const circle = container.querySelector(".fg");
  const percentEl = document.getElementById("percentText");

  if (!circle || !percentEl || !container) return;

  const percent = parseFloat(container.dataset.percent) || 0;
  const circumference = 340;
  const offset = (circumference * (100 - percent)) / 100;

  circle.style.strokeDashoffset = circumference;

  setTimeout(() => {
    container.classList.add("animate");
    circle.style.strokeDashoffset = offset;
  }, 600);

  let current = 0;
  const duration = 1800;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = percent / steps;

  const counter = setInterval(() => {
    current += increment;
    if (current >= percent) {
      current = percent;
      clearInterval(counter);
      percentEl.parentElement.classList.add("counted");
    }
    percentEl.textContent = Math.round(current) + "%";
  }, stepTime);
}

window.addEventListener("load", () => {
  startProgressAnimation();
});

// START NEW EXAM
function startNew() {
  updateCurrentUser({
    examSubmitted: false,
    examLocked: false,
    examResult: null,
    examQuestions: [],
    examAnswers: [],
  });

  sessionStorage.clear();
  window.location.replace("../Pages/quiz-intro.html");
}

// REVIEW ANSWERS
function review() {
  let reviewDiv = document.querySelector("#review-answers-section");

  if (reviewDiv) {
    reviewDiv.remove();
    return;
  }

  const user = getCurrentUser();
  const questions = user.examQuestions || [];
  const userAnswers = user.examAnswers || [];

  if (questions.length === 0) {
    alert("No previous exam data to review");
    return;
  }

  reviewDiv = document.createElement("div");
  reviewDiv.id = "review-answers-section";
  reviewDiv.className = "review-section";

  const title = document.createElement("h2");
  title.textContent = "Answer Review";
  title.className = "review-title";
  reviewDiv.appendChild(title);

  questions.forEach((q, i) => {
    const userChoice = userAnswers[i];
    const correctIdx = q.answer;
    const isCorrect = userChoice === correctIdx;

    const qDiv = document.createElement("div");
    qDiv.className = "review-question";

    let html = `
      <div class="review-question-text">
        Question ${i + 1}: ${q.text}
      </div>
      <div class="options-review">
    `;

    q.options.forEach((option, idx) => {
      let optionClass = "review-option";
      if (idx === correctIdx) optionClass += " correct";
      if (idx === userChoice) {
        optionClass += isCorrect ? " selected correct" : " selected wrong";
      }

      html += `
        <div class="${optionClass}">
          ${String.fromCharCode(65 + idx)}. ${option}
        </div>
      `;
    });

    html += `
      </div>
      <div class="review-feedback ${isCorrect ? "correct" : "wrong"}">
        ${
          isCorrect
            ? "Your answer is correct ✓"
            : `Correct answer: ${String.fromCharCode(65 + correctIdx)}. ${q.options[correctIdx]}`
        }
      </div>
    `;

    qDiv.innerHTML = html;
    reviewDiv.appendChild(qDiv);
  });

  const resultCard = document.querySelector(".result-card");
  if (resultCard) {
    resultCard.appendChild(reviewDiv);
  }

  reviewDiv.scrollIntoView({ behavior: "smooth", block: "start" });
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedInUser");
  sessionStorage.clear();
  window.location.replace("../index.html");
}
