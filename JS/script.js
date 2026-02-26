//Users Array Management
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find((u) => u.email === email) || null;
}

if (sessionStorage.getItem("examInProgress")) {
  window.location.replace("../Pages/exam.html");
} else {
  const container = document.querySelector(".container");
  const registerBtn = document.querySelector(".register-btn");
  const loginBtn = document.querySelector(".login-btn");

  // Lock Register button if user just registered
  function lockRegisterBtn() {
    registerBtn.disabled = true;
    registerBtn.style.opacity = "0.4";
    registerBtn.style.cursor = "not-allowed";
    registerBtn.title = "You already have an account. Please login.";
  }

  if (localStorage.getItem("justRegistered")) {
    lockRegisterBtn();
  }

  registerBtn.addEventListener("click", () => {
    if (registerBtn.disabled) return;
    container.classList.add("active");
  });

  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });

  // Multi-step Registration Logic
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    const steps = registerForm.querySelectorAll(".step-content");
    const progress = document.getElementById("progress");
    const nextBtns = registerForm.querySelectorAll(".next-btn");
    const prevBtns = registerForm.querySelectorAll(".prev-btn");
    let currentStep = 0;

    function showStep(stepIndex) {
      steps.forEach((s, i) => {
        s.classList.toggle("active", i === stepIndex);
      });

      document.querySelectorAll(".step").forEach((s, i) => {
        s.classList.toggle("active", i <= stepIndex);
      });

      progress.style.width = (stepIndex / (steps.length - 1)) * 100 + "%";
    }

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const inputs = steps[currentStep].querySelectorAll("input");
        let valid = true;

        inputs.forEach((input) => {
          if (!validateInput(input)) valid = false;
        });

        if (valid) {
          currentStep++;
          showStep(currentStep);
        } else {
          showToast("Please fill all fields correctly", "info");
        }
      });
    });

    prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentStep--;
        showStep(currentStep);
      });
    });

    const confirmPassInput = document.getElementById("registerConfirmPass");
    if (confirmPassInput) {
      confirmPassInput.addEventListener("input", validateConfirmPassword);
      confirmPassInput.addEventListener("blur", validateConfirmPassword);
    }

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = steps[currentStep].querySelectorAll("input");
      let isValid = true;

      inputs.forEach((input) => {
        if (!validateInput(input)) isValid = false;
      });

      if (!validateConfirmPassword()) {
        isValid = false;
      }

      if (!isValid) {
        showToast("Please correct the errors in the fields", "warning");
        return;
      }

      const firstName = document
        .getElementById("registerFirstName")
        .value.trim();
      const lastName = document.getElementById("registerLastName").value.trim();
      const email = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPass").value.trim();

      if (findUserByEmail(email)) {
        showToast("Email already registered", "error");
        return;
      }

      const users = getUsers();
      users.push({
        email,
        firstName,
        lastName,
        password,
        examResult: null,
        examSubmitted: false,
        examLocked: false,
        examQuestions: [],
        examAnswers: [],
      });
      saveUsers(users);

      showToast("Account created successfully!", "success");

      localStorage.setItem("justRegistered", "true");
      lockRegisterBtn();

      registerForm.reset();
      container.classList.remove("active");
      currentStep = 0;
      showStep(0);
    });
  }

  // Password Visibility Toggle
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = document.getElementById(icon.dataset.target);

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("bx-eye-slash", "bx-eye");
      } else {
        input.type = "password";
        icon.classList.replace("bx-eye", "bx-eye-slash");
      }
    });
  });

  // Login & General Form Validation
  document.querySelectorAll(".auth-form").forEach((form) => {
    const inputs = form.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener("input", () => validateInput(input));
      input.addEventListener("blur", () => validateInput(input));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (form.closest(".form-box.login")) {
        let isValid = true;
        inputs.forEach((input) => {
          if (!validateInput(input)) isValid = false;
        });

        if (!isValid) return;

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPass").value.trim();

        const user = findUserByEmail(email);

        if (!user) {
          showToast("Invalid email or password", "error");
          return;
        }

        if (user.password !== password) {
          showToast("Invalid email or password", "error");
          return;
        }

        localStorage.setItem("loggedInUser", email);
        window.location.replace("Pages/dashboard.html");
      }
    });
  });

  // Helper Functions

  function showToast(message, type) {
    const toast = document.getElementById("toastAlert");
    const text = document.getElementById("toastMessage");

    toast.className = "toast-custom show " + type;
    text.textContent = message;

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function validateInput(input) {
    const box = input.parentElement;
    const errorSpan = box.querySelector(".error-message");

    box.classList.remove("error", "success");
    if (errorSpan) errorSpan.textContent = "";

    const value = input.value.trim();

    if (input.hasAttribute("required") && value === "") {
      box.classList.add("error");
      errorSpan.textContent = "This field is required";
      return false;
    }

    if (input.id === "registerFirstName" || input.id === "registerLastName") {
      const nameRegex = /^[A-Za-z\s\u0600-\u06FF]{2,}$/;
      if (value !== "" && !nameRegex.test(value)) {
        box.classList.add("error");
        errorSpan.textContent =
          "Must contain letters only and at least 2 characters";
        return false;
      }
    }

    if (input.type === "email" && value !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        box.classList.add("error");
        errorSpan.textContent = "Please enter a valid email";
        return false;
      }
    }

    if (
      input.type === "password" &&
      input.id !== "registerConfirmPass" &&
      value !== ""
    ) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(value)) {
        box.classList.add("error");
        errorSpan.textContent =
          "Password must be at least 8 characters, contain uppercase, lowercase, number and special character";
        return false;
      }
    }

    box.classList.add("success");
    return true;
  }

  function validateConfirmPassword() {
    const passInput = document.getElementById("registerPass");
    const confirmInput = document.getElementById("registerConfirmPass");

    if (!confirmInput) return true;

    const confirmBox = confirmInput.parentElement;
    const errorSpan = confirmBox.querySelector(".error-message");

    confirmBox.classList.remove("error", "success");
    if (errorSpan) errorSpan.textContent = "";

    const passValue = passInput.value.trim() || "";
    const confirmValue = confirmInput.value.trim();

    if (confirmValue === "") {
      if (confirmInput.hasAttribute("required")) {
        confirmBox.classList.add("error");
        errorSpan.textContent = "This field is required";
        return false;
      }
      return true;
    }

    if (confirmValue !== passValue) {
      confirmBox.classList.add("error");
      errorSpan.textContent = "Passwords do not match";
      return false;
    }

    confirmBox.classList.add("success");
    return true;
  }
}
