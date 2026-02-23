// LOGIN GUARD
if (!localStorage.getItem("loggedInUser")) {
  window.location.replace("../index.html");
}

// RESULT GUARD
const resultRaw = localStorage.getItem("examResult");
if (!resultRaw) {
  window.location.replace("../Pages/dashboard.html");
}

// BLOCK BACK BUTTON
history.pushState(null, "", location.href);
window.addEventListener("popstate", () => {
  history.pushState(null, "", location.href);
});

// LOAD RESULT
const resultData = JSON.parse(resultRaw);
const percent = Math.round((resultData.score / resultData.total) * 100);
document.querySelector(".progress-circle").dataset.percent = percent;

// Update texts immediately (fallback)
document.getElementById("correctText").innerText = resultData.score;
document.getElementById("wrongText").innerText =
  resultData.total - resultData.score;
document.getElementById("timeText").innerText = resultData.time + " sec";

const loggedInEmail = localStorage.getItem("loggedInUser");
let fullName = "Student";

if (loggedInEmail) {
  const stored = localStorage.getItem(loggedInEmail);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      const first = data.firstName.trim() || "";
      const last = data.lastName.trim() || "";

      if (first || last) {
        fullName = "";
        if (first) fullName += first;
        if (first && last) fullName += " ";
        if (last) fullName += last;
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
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
  localStorage.removeItem("examSubmitted");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examLocked");
  localStorage.removeItem("examQuestions");
  localStorage.removeItem("examAnswers");
  localStorage.removeItem("examQuestions_live");
  localStorage.removeItem("examAnswers_live");
  sessionStorage.clear();

  window.location.replace("../Pages/quiz-intro.html");
}

function review() {
  let reviewDiv = document.querySelector("#review-answers-section");

  if (reviewDiv) {
    reviewDiv.remove();
    return;
  }

  const questions = JSON.parse(localStorage.getItem("examQuestions") || "[]");
  const userAnswers = JSON.parse(localStorage.getItem("examAnswers") || "[]");

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

      if (idx === correctIdx) {
        optionClass += " correct";
      }
      if (idx === userChoice) {
        if (isCorrect) {
          optionClass += " selected correct";
        } else {
          optionClass += " selected wrong";
        }
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
  localStorage.removeItem("examResult");
  localStorage.removeItem("examSubmitted");
  localStorage.removeItem("examLocked");
  localStorage.removeItem("examQuestions");
  localStorage.removeItem("examAnswers");
  localStorage.removeItem("examQuestions_live");
  localStorage.removeItem("examAnswers_live");
  sessionStorage.clear();
  window.location.replace("../index.html");
}
