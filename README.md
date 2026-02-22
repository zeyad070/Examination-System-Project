# 📝 Examination System

A modern, responsive online examination system built with vanilla JavaScript, HTML, and CSS. This application provides a complete solution for conducting online exams with a student dashboard, timed assessments, and instant results.


---

## ✨ Features

### 📋 Examination System
- **Timed Exams** — Countdown timer to keep students on track
- **Multiple Choice Questions** — Clean, intuitive question interface
- **Auto-submit** — Automatic submission when time expires

### 📊 Results & Scoring
- **Instant Results** — Immediate score calculation upon submission
- **Detailed Statistics** — View correct and incorrect answer counts
- **Performance Feedback** — Visual indicators for pass/fail status

### 🎨 User Experience
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Modern UI** — Clean, professional interface with Font Awesome icons
- **Student Dashboard** — Overview of exam info before starting

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/examination-system.git
   cd examination-system
   ```

2. **Open the application**

   Simply open `index.html` in your web browser, or use a local development server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Using VS Code Live Server
   # Right-click on index.html → "Open with Live Server"
   ```

3. **Access the application**

   Navigate to `http://localhost:8000` (or the appropriate port)

---

## 📁 Project Structure

```
examination-system/
│
├── index.html                  # Main entry point (Intro page)
│
├── Pages/
│   ├── dashboard.html          # Student dashboard
│   ├── quiz-intro.html         # intro page
│   ├── exam.html               # Exam taking page
│   └── result.html             # Results display page
│
├── CSS/
│   ├── style.css               # Global styles
│   ├── dashboard.css           # Dashboard styles
│   ├── quiz-intro.css          # quiz-intro styles
│   ├── exam.css                # Exam page styles
│   └── result.css              # Result page styles
│
├── JS/
│   ├── script.js               # Main / Intro logic
│   ├── dashboard.js            # Dashboard logic
│   ├── quiz-intro.js           # quiz-intro logic
│   ├── exam.js                 # Exam timer & question logic
│   └── result.js               # Score calculation & display
│
└── libs/
    ├── all.min.css             # Font Awesome (full)
    ├── fontawesome.min.css     # Font Awesome core
    └── solid.min.css           # Font Awesome solid icons
```

---

## 🎯 Usage

### For Students
1. **Dashboard** — Review your info and available exams
2. **Intro Page** — Read the exam instructions on the home page
3. **Start Exam** — Begin the timed examination
4. **Answer Questions** — Select answers and navigate between questions
5. **Submit** — Submit your exam before time runs out
6. **View Results** — See your score and performance summary

### Exam Rules
- 📝 Multiple-choice questions
- ⏱️ Time limit per exam
- ✅ 50% required to pass
- ⚠️ Avoid leaving the exam page once started

---

## 🛠️ Technologies Used

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Modern styling with Flexbox/Grid |
| **JavaScript (ES6+)** | Vanilla JS for all functionality |
| **Font Awesome** | Icon library |

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 🖥️ Desktop (1200px+)
- 💻 Laptop (992px - 1199px)
- 📱 Tablet (768px - 991px)
- 📱 Mobile (< 768px)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

Zeyad Rabeea, Toka Mohamed

- GitHub: [zeyad070](https://github.com/zeyad070), [elarabytoka28-gif](https://github.com/elarabytoka28-gif)

---

⭐ Star this repository if you found it helpful!
