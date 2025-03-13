document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const number = parseInt(urlParams.get("perkalian"));

  if (isNaN(number) || number < 1 || number > 10) {
    alert("Parameter perkalian tidak valid. Gunakan angka antara 1 hingga 10.");
    window.location.href = "cometquiz.html";
    return;
  }

  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("choices");
  const nextButton = document.getElementById("next-button");
  const progressBar = document.getElementById("progress-bar");
  const showScoreButton = document.getElementById("show-score-button");

  let currentQuestion = 0;
  let score = 0;
  let questions = [];
  let timer;
  let timeLeft = 20;
  let startTime;

  function generateQuestions() {
    startTime = Date.now(); // Simpan waktu mulai quiz
    for (let i = 1; i <= 10; i++) {
      questions.push({
        num1: number,
        num2: i,
        answer: number * i,
      });
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
    timeLeft = 20;
    progressBar.style.width = "0%";
    timer = setInterval(() => {
      timeLeft--;
      progressBar.style.width = `${(20 - timeLeft) * 5}%`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        // Pastikan pertanyaan masih ada sebelum mengakses properti answer
        if (questions[currentQuestion]) {
          checkAnswer(null, questions[currentQuestion].answer);
        }
      }
    }, 1000);
  }

  function generateQuestion() {
    if (currentQuestion < questions.length) {
      const { num1, num2, answer } = questions[currentQuestion];
      questionElement.textContent = `Berapakah ${num1} x ${num2}?`;

      const options = new Set();
      options.add(answer);
      while (options.size < 4) {
        const randomOption = Math.floor(Math.random() * 100) + 1;
        options.add(randomOption);
      }

      const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
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
      clearInterval(timer);
      progressBar.style.width = "0%";
      startTimer();
    } else {
      showFinalScore();
    }
  }

  function checkAnswer(selectedOption, correctAnswer) {
    clearInterval(timer);
    const buttons = document.querySelectorAll(".option");
    buttons.forEach((button) => {
      button.disabled = true;
      if (parseInt(button.textContent) === correctAnswer) {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    });
    
    if (selectedOption === correctAnswer) {
      score++; // Menambah skor jika jawaban benar
      showPopup("Good!", "green");
      document.getElementById("audioBenar").play();
    } else {
      showPopup("Yahh, salah!", "red");
      document.getElementById("audioSalah").play();
    }
    
    // Lanjut ke soal berikutnya setelah 1 detik
    setTimeout(() => {
      currentQuestion++;
      generateQuestion();
    }, 1000);
  }
  

  nextButton.addEventListener("click", () => {
    currentQuestion++;
    nextButton.classList.add("hidden");
    generateQuestion();
  });

  function showPopup(message, color) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.backgroundColor = color;
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
    }, 1000);
  }

  function showFinalScore() {
    const finalScore = score * 10;
    const playerName = localStorage.getItem("nama_pemain") || "Guest";
    const appreciationMessage =
      finalScore === 100 ? "Yeyy, good job! 🎉✨" :
      finalScore >= 80 ? "Good! Tapi bisa ditingkatkan lagi 🙌" :
      finalScore >= 60 ? "Yuk belajar lagi, semangat! 😊" :
      "Jangan menyerah, tetap semangat! 💪";

    // Buat popup skor seperti di meteor.js
    const popup = document.createElement("div");
    popup.className = "score-popup";
    popup.innerHTML = `<h1>${finalScore}</h1><p>${appreciationMessage}</p>`;
    document.body.appendChild(popup);
    setTimeout(() => { popup.remove(); }, 3000);

    // Kirim skor ke backend (opsional)
    fetch("http://localhost:5000/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_pemain: playerName,
        menu: "Comet Quiz",
        skor: finalScore,
        waktu: new Date().toISOString(),
      }),
    })
    .then(response => response.json())
    .then(data => console.log("Skor berhasil dikirim:", data))
    .catch(error => console.error("Gagal mengirim skor:", error));

    // Dispatch event gameFinished (jika diperlukan)
    document.dispatchEvent(new CustomEvent("gameFinished", {
      detail: { nama_pemain: playerName, skor: finalScore, menu: "Comet Quiz" },
    }));
  }

  // Event listener untuk tombol "Lihat Skor"
  if (showScoreButton) {
    showScoreButton.addEventListener("click", showFinalScore);
  }

  generateQuestions();
});
