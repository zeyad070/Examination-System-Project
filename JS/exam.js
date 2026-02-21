if (
  sessionStorage.getItem("examInProgress") &&
  localStorage.getItem("examSubmitted") === "true"
) {
  localStorage.removeItem("examSubmitted");
  localStorage.removeItem("examLocked");
  localStorage.removeItem("examResult");
  localStorage.removeItem("examQuestions");
  localStorage.removeItem("examAnswers");
}

// LOGIN GUARD
////////////////////////////////
if (!localStorage.getItem("loggedInUser")) {
  window.location.replace("../index.html");
}

// PREVENT DIRECT ACCESS
////////////////////////////////
if (!sessionStorage.getItem("examInProgress")) {
  window.location.replace("../Pages/dashboard.html");
}

// IF ALREADY SUBMITTED
////////////////////////////////
if (localStorage.getItem("examSubmitted") === "true") {
  window.location.replace("../Pages/result.html");
}

// ALLOW LEAVE FLAG
////////////////////////////////
var allowLeave = false;

// BACK NAVIGATION FLAG
////////////////////////////////
var isBackNavigation = false;

// BLOCK BACK BUTTON
////////////////////////////////
history.pushState(null, "", location.href);

window.addEventListener("popstate", function () {
  if (!allowLeave) {
    isBackNavigation = true;
    history.pushState(null, "", location.href);
    setTimeout(function () {
      isBackNavigation = false;
    }, 200);
  }
});

// QUESTIONS
///////////////////////////////
var questions = [
  {
    text: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Internet",
      "Applied Program Interaction",
      "Application Process Integration",
    ],
    answer: 0,
  },
  {
    text: "Which method is used to select an element by ID in JavaScript?",
    options: [
      "getElementByClass()",
      "querySelectorAll()",
      "getElementById()",
      "selectById()",
    ],
    answer: 2,
  },
  {
    text: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
    ],
    answer: 1,
  },
  {
    text: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Marketing Language",
      "Hyper Text Markup Language",
      "Hyper Tool Markup Language",
    ],
    answer: 2,
  },
  {
    text: "Which company developed JavaScript?",
    options: ["Microsoft", "Netscape", "Google", "IBM"],
    answer: 1,
  },
  {
    text: "Which of the following is a JavaScript framework?",
    options: ["Django", "React", "Laravel", "Flask"],
    answer: 1,
  },
  {
    text: "Which language runs in a web browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: 3,
  },
  {
    text: "Which symbol is used for comments in JavaScript?",
    options: ["/<!-- -->", "//", "/* */", "#"],
    answer: 1,
  },
  {
    text: "Which of these is NOT a programming language?",
    options: ["Ruby", "Python", "HTML", "Swift"],
    answer: 2,
  },
  {
    text: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query List",
      "Sequential Question Language",
      "Standard Query Layout",
    ],
    answer: 0,
  },
];

// SHUFFLE QUESTIONS
////////////////////////////////
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

let shuffled = sessionStorage.getItem("shuffledQuestions");

if (!shuffled) {
  shuffled = shuffle([...questions]);
  sessionStorage.setItem("shuffledQuestions", JSON.stringify(shuffled));
} else {
  shuffled = JSON.parse(shuffled);
}

questions = shuffled;

// LOAD SESSION
///////////////////////////////
var currentQuestion = Number(sessionStorage.getItem("currentQuestion")) || 0;
var answers = JSON.parse(sessionStorage.getItem("answers") || "[]");
var markedQuestions = JSON.parse(sessionStorage.getItem("marked") || "[]");

var examDuration = 5 * 60;

var examEndTime = Number(sessionStorage.getItem("examEndTime"));

if (!examEndTime || examEndTime < Date.now()) {
  examEndTime = Date.now() + examDuration * 1000;
  sessionStorage.setItem("examEndTime", examEndTime);
}

var totalTime = Math.floor((examEndTime - Date.now()) / 1000);
if (totalTime < 0) totalTime = 0;

var timerInterval;

// DOM
//////////////////////////////////
var questionTitle = document.querySelector(".question h2");
var optionsList = document.querySelector(".options-list");
var questionNumber = document.getElementById("question-number");
var totalQuestions = document.getElementById("total-questions");
var solvedCount = document.getElementById("solved-count");
var allQuestions = document.getElementById("all-questions");
var nextBtn = document.getElementById("next-btn");
var prevBtn = document.getElementById("prev-btn");
var gridQuestions = document.querySelectorAll(".questions-grid .question");
var markBtn = document.getElementById("mark-btn");
var answeredStat = document.querySelector(
  ".state-item.answered span:last-child",
);
var markedStat = document.querySelector(".state-item.marked span:last-child");
var notAnsweredStat = document.querySelector(
  ".state-item.not-answered span:last-child",
);
var submitBtn = document.querySelector("#submit-btn button");
var submitModal = document.getElementById("submit-modal");
var cancelSubmit = document.getElementById("cancel-submit");
var confirmSubmit = document.getElementById("confirm-submit");
var modalAnswered = document.getElementById("modal-answered");
var modalUnanswered = document.getElementById("modal-unanswered");
var modalMarked = document.getElementById("modal-marked");
var timesUpModal = document.getElementById("times-up-modal");
var closeTimesUp = document.getElementById("close-times-up");
var timeRemainingElement = document.getElementById("time-remaining");
var progressBar = document.getElementById("progress-bar");

// INIT
//////////////////////////////////
totalQuestions.innerHTML = questions.length;
allQuestions.innerHTML = questions.length;
loadQuestion();
updateNavigator();
startTimer();

// SAVE SESSION
//////////////////////////////////

function saveSession() {
  sessionStorage.setItem("answers", JSON.stringify(answers));
  sessionStorage.setItem("marked", JSON.stringify(markedQuestions));
  sessionStorage.setItem("currentQuestion", currentQuestion);
  localStorage.setItem("examAnswers_live", JSON.stringify(answers));
  localStorage.setItem("examQuestions_live", JSON.stringify(questions));
}

// LOAD QUESTION
//////////////////////////////////

function loadQuestion() {
  var q = questions[currentQuestion];
  questionTitle.innerHTML = q.text;
  questionNumber.innerHTML = currentQuestion + 1;
  optionsList.innerHTML = "";

  for (var i = 0; i < q.options.length; i++) {
    var li = document.createElement("li");
    li.className = "option";
    li.innerHTML =
      "<span class='option-letter'>" +
      String.fromCharCode(65 + i) +
      "</span>" +
      "<span class='option-text'>" +
      q.options[i] +
      "</span>";

    (function (index) {
      li.onclick = function () {
        selectAnswer(index);
      };
    })(i);

    if (answers[currentQuestion] === i) li.className += " selected";
    optionsList.appendChild(li);
  }

  if (markedQuestions[currentQuestion]) markBtn.classList.add("marked");
  else markBtn.classList.remove("marked");

  updateSolvedCount();
  updateNavigator();
  saveSession();
}

function selectAnswer(index) {
  answers[currentQuestion] = index;
  saveSession();
  loadQuestion();
}

function updateSolvedCount() {
  var count = 0;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i] !== undefined) count++;
  }
  solvedCount.innerHTML = count;
}

function updateNavigator() {
  for (var i = 0; i < gridQuestions.length; i++) {
    gridQuestions[i].className = "question";
    if (answers[i] !== undefined) gridQuestions[i].className += " answered";
    else gridQuestions[i].className += " not-answered";
    if (markedQuestions[i]) gridQuestions[i].className += " marked";
    if (i === currentQuestion) gridQuestions[i].className += " current";
  }
  updateStats();
}

function updateStats() {
  var answered = 0;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i] !== undefined) answered++;
  }

  var marked = 0;
  for (var j = 0; j < markedQuestions.length; j++) {
    if (markedQuestions[j]) marked++;
  }

  answeredStat.innerHTML = answered;
  markedStat.innerHTML = marked;
  notAnsweredStat.innerHTML = questions.length - answered;
}

markBtn.onclick = function () {
  markedQuestions[currentQuestion] = !markedQuestions[currentQuestion];
  saveSession();
  loadQuestion();
};

for (let i = 0; i < gridQuestions.length; i++) {
  gridQuestions[i].onclick = function () {
    currentQuestion = i;
    saveSession();
    loadQuestion();
  };
}

nextBtn.onclick = function () {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    saveSession();
    loadQuestion();
  }
};

prevBtn.onclick = function () {
  if (currentQuestion > 0) {
    currentQuestion--;
    saveSession();
    loadQuestion();
  }
};

// SUBMIT
//////////////////////////////////

submitBtn.onclick = function () {
  var answered = answers.filter((a) => a !== undefined).length;
  var marked = markedQuestions.filter((m) => m).length;

  modalAnswered.innerHTML = answered;
  modalMarked.innerHTML = marked;
  modalUnanswered.innerHTML = questions.length - answered;

  submitModal.classList.remove("hidden");
};

cancelSubmit.onclick = function () {
  submitModal.classList.add("hidden");
};

function finishExam() {
  allowLeave = true;

  clearInterval(timerInterval);

  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) {
      score++;
    }
  }

  const resultData = {
    score: score,
    total: questions.length,
    time: examDuration - totalTime,
  };

  localStorage.setItem("examResult", JSON.stringify(resultData));
  localStorage.setItem("examSubmitted", "true");
  localStorage.setItem("examLocked", "true");

  localStorage.setItem("examQuestions", JSON.stringify(questions));
  localStorage.setItem("examAnswers", JSON.stringify(answers));

  sessionStorage.removeItem("examInProgress");
  sessionStorage.removeItem("currentQuestion");
  sessionStorage.removeItem("answers");
  sessionStorage.removeItem("marked");
  sessionStorage.removeItem("examEndTime");
  sessionStorage.removeItem("shuffledQuestions");
  localStorage.removeItem("examQuestions_live");
  localStorage.removeItem("examAnswers_live");

  window.location.replace("../Pages/result.html");
}
confirmSubmit.onclick = finishExam;
closeTimesUp.onclick = finishExam;

// TIMER
//////////////////////////////////

function startTimer() {
  timerInterval = setInterval(function () {
    totalTime = Math.floor((examEndTime - Date.now()) / 1000);

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      totalTime = 0;
      timesUpModal.classList.remove("hidden");
    }

    var minutes = Math.floor(totalTime / 60);
    var seconds = totalTime % 60;
    if (seconds < 10) seconds = "0" + seconds;

    if (totalTime <= 60) {
      timeRemainingElement.parentElement.classList.add("warning");
    } else {
      timeRemainingElement.parentElement.classList.remove("warning");
    }

    timeRemainingElement.innerHTML = minutes + ":" + seconds;
    progressBar.style.width = (totalTime / examDuration) * 100 + "%";
  }, 1000);
}

// WARNING BEFORE LEAVING PAGE
//////////////////////////////////

window.addEventListener("beforeunload", function (e) {
  if (allowLeave) return;

  if (isBackNavigation) return;

  saveSession();

  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) score++;
  }

  const resultData = {
    score: score,
    total: questions.length,
    time: examDuration - totalTime,
  };

  localStorage.setItem("examResult", JSON.stringify(resultData));
  localStorage.setItem("examSubmitted", "true");
  localStorage.setItem("examLocked", "true");
  localStorage.setItem("examQuestions", JSON.stringify(questions));
  localStorage.setItem("examAnswers", JSON.stringify(answers));

  e.preventDefault();
  e.returnValue = "";
});
