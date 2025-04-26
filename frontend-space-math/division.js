document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const number = parseInt(urlParams.get("pembagian")) || 1;
  const nama_pemain = urlParams.get("nama") || "Guest";
  const menu = "Division Galaxy";

  if (isNaN(number) || number < 1 || number > 10) {
    alert("Parameter pembagian tidak valid. Gunakan angka antara 1 hingga 10.");
    window.location.href = "division.html";
    return;
  }

  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("choices");
  const nextButton = document.getElementById("next-button");
  const progressBar = document.getElementById("progress-bar");
  const showScoreButton = document.getElementById("show-score-button");
  const hintButton = document.getElementById("hint-button");
  const hintPopup = document.getElementById("hint-popup");

  let currentQuestion = 0;
  let score = 0;
  let questions = [];
  let timer;

  function generateQuestions() {
    let usedNumbers = new Set(); // Menyimpan angka yang sudah digunakan

    while (questions.length < 10) {
      const num1 = Math.floor(Math.random() * 10 + 1) * number;

      if (!usedNumbers.has(num1)) {
        usedNumbers.add(num1);
        questions.push({ num1: num1, num2: number, answer: num1 / number });
      }
    }

    shuffleArray(questions);
    generateQuestion();
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function startTimer() {
    let timeLeft = 20;
    let progressInterval = 100;
    let step = 100 / (timeLeft * (1000 / progressInterval));
    let progress = 0;
    progressBar.style.width = "0%";

    timer = setInterval(() => {
      progress += step;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
      if (progress >= 100) {
        clearInterval(timer);
        checkAnswer(null, questions[currentQuestion].answer);
      }
    }, progressInterval);
  }

  function generateQuestion() {
    if (currentQuestion < 10) {
      const { num1, num2, answer } = questions[currentQuestion];
      questionElement.textContent = `Berapakah ${num1} ÷ ${num2}?`;

      const options = new Set();
      options.add(answer);
      while (options.size < 4) {
        const randomOption = Math.floor(Math.random() * 10 + 1);
        options.add(randomOption);
      }

      const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);
      optionsElement.innerHTML = "";

      shuffledOptions.forEach((option) => {
        const button = document.createElement("button");
        button.classList.add("option");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option, answer, button));
        optionsElement.appendChild(button);
      });

      nextButton.classList.add("hidden");
      nextButton.disabled = true;

      // Reset hint untuk soal baru
      hintButton.disabled = false;
      hintPopup.textContent = "";
      hintPopup.classList.add("hidden");

      clearInterval(timer);
      progressBar.style.width = "0%";
      startTimer();
    } else {
      showFinalScore();
    }
  }

  function showHint() {
    if (hintButton.disabled) return; // Cegah klik berkali-kali

    const { num1, num2 } = questions[currentQuestion];
    hintPopup.textContent = `${num2} dikali berapa yang hasilnya ${num1}?`;
    hintPopup.classList.remove("hidden");
    hintButton.disabled = true; // Hint hanya bisa digunakan sekali per soal

    setTimeout(() => {
      hintPopup.classList.add("hidden");
    }, 3000);
  }

  function checkAnswer(selectedOption, correctAnswer) {
    const buttons = document.querySelectorAll(".option");
    buttons.forEach((button) => {
      button.disabled = true;
      if (parseFloat(button.textContent) === correctAnswer) {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    });

    if (selectedOption === correctAnswer) {
      document.getElementById("audioBenar").play();
      score++;
      showPopup("Good!", "green");
      currentQuestion++;
      setTimeout(generateQuestion, 1000);
    } else {
      document.getElementById("audioSalah").play();
      showPopup("Yahh, Coba lagi!", "red");
      nextButton.classList.remove("hidden");
      nextButton.disabled = false;
    }
  }

  nextButton.addEventListener("click", () => {
    currentQuestion++;
    nextButton.classList.add("hidden");
    generateQuestion();
  });

  hintButton.addEventListener("click", showHint);

  function showPopup(message, color) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.backgroundColor = color;
    popup.style.opacity = "1";
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.style.opacity = "0";
    }, 800);
    setTimeout(() => {
      popup.remove();
    }, 1300);
  }

  function showFinalScore() {
    const finalScore = score * 10;
    saveScoreToDatabase(finalScore);

    const appreciationMessage =
      finalScore === 100 ? "Yeyy, good job! 🎉✨" :
      finalScore >= 80 ? "Good! Tapi bisa ditingkatkan lagi🙌" :
      finalScore >= 60 ? "Yuk belajar lagi, semangat! 😊" :
      "Jangan menyerah, tetap semangat! 💪";

    const popup = document.createElement("div");
    popup.className = "score-popup";
    popup.innerHTML = `<h1>${finalScore}</h1><p>${appreciationMessage}</p>`;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
    }, 2000);
  }

  function saveScoreToDatabase(skor) {
    fetch("https://space-math-pzag.vercel.app/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_pemain, menu, skor, waktu: new Date().toISOString() })
    })
    .then(response => response.json())
    .then(result => console.log("Skor berhasil disimpan:", result))
    .catch(error => console.error("Gagal menyimpan skor:", error));
  }

  generateQuestions();
});
