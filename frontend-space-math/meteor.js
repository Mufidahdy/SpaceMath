// Fungsi untuk mendapatkan parameter query string dari URL
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Variabel untuk soal yang sudah diajukan
let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let timer;
let timeLeft = 30; // Set waktu awal 30 detik

// Fungsi untuk mengacak soal berdasarkan angka perkalian yang dipilih
function shuffleQuestions(multiplyBy) {
  const tempQuestions = [];
  for (let i = 1; i <= 10; i++) {
      tempQuestions.push({ 
          question: `${multiplyBy} x ${i}`, 
          answer: multiplyBy * i 
      });
  }
  questions = tempQuestions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
}

// Fungsi untuk memulai game
function startGame() {
  const multiplyBy = parseInt(getQueryParameter('perkalian'));  // Ambil parameter dari URL
  if (isNaN(multiplyBy)) {
      alert('Pilih level perkalian dari halaman sebelumnya!');
      return;
  }
  
  shuffleQuestions(multiplyBy);
  showQuestion();
  startTimer();
}

// Fungsi untuk menampilkan soal
function showQuestion() {
  if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      document.getElementById('question-container').innerHTML = `<p>${question.question} = </p>`;
      document.getElementById('answer-input').value = '';
      document.getElementById('result-container').innerHTML = '';

      resetProgressBar();
      startTimer();
  } else {
      showFinalScore();
  }
}

// Fungsi untuk memeriksa jawaban
function checkAnswer() {
  if (!questions[currentQuestionIndex]) return;

  const answerInput = document.getElementById('answer-input');
  const userAnswer = parseInt(answerInput.value);
  const correctAnswer = questions[currentQuestionIndex].answer;

  if (userAnswer === correctAnswer) {
      correctAnswers++;
      document.getElementById('result-container').innerHTML = "<p>Good!</p>";
      document.getElementById('audioBenar').play();
  } else {
      document.getElementById('result-container').innerHTML = `<p>Salah! Jawaban yang benar adalah ${correctAnswer}.</p>`;
      document.getElementById('audioSalah').play();
  }

  answerInput.value = '';

  currentQuestionIndex++;
  setTimeout(() => showQuestion(), 1000);
}

// Fungsi untuk menampilkan skor akhir dan mengirim ke backend
function showFinalScore() {
  const finalScore = correctAnswers * 10;
  const playerName = localStorage.getItem("nama_pemain") || "Guest";
  const currentTime = new Date().toISOString();

  const appreciationMessage =
      finalScore === 100 ? "Yeyy, good job! 🎉✨" :
      finalScore >= 80 ? "Good! Tapi bisa ditingkatkan lagi🙌 " :
      finalScore >= 60 ? "Yuk belajar lagi, semangat! 😊" :
      "Jangan menyerah, tetap semangat! 💪";

  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.innerHTML = `<h1>${finalScore}</h1><p>${appreciationMessage}</p>`;
  document.body.appendChild(popup);

  setTimeout(() => { popup.remove(); }, 3000);

  // Kirim skor ke backend
  fetch("https://space-math-pzag.vercel.app/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          nama_pemain: playerName,
          menu: "Meteor Multiplication",
          skor: finalScore,
          waktu: currentTime
      })
  })
  .then(response => response.json())
  .then(data => console.log("Skor berhasil disimpan:", data))
  .catch(error => console.error("Gagal menyimpan skor:", error));

  // Dispatch event gameFinished
  document.dispatchEvent(new CustomEvent("gameFinished", {
      detail: { gameName: "Meteor Multiplication", playerName: playerName, score: finalScore }
  }));
}

// Fungsi untuk mereset progress bar
function resetProgressBar() {
  document.getElementById("progress-bar").style.width = "0%";
}

// Fungsi untuk memulai timer dan progress bar
function startTimer() {
  timeLeft = 30;
  let progress = 0;
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
      timeLeft--;
      progress += (100 / 30);
      progressBar.style.width = `${progress}%`;

      if (timeLeft <= 0) {
          clearInterval(timer);
          checkAnswer();
      }
  }, 1000);
}

// Event listener tombol untuk melihat skor
const showScoreButton = document.getElementById("show-score-button");
if (showScoreButton) {
  showScoreButton.addEventListener("click", showFinalScore);
}

// Event listener untuk tombol Enter agar jawaban bisa dikirim langsung
document.getElementById("answer-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Mencegah form submit default
        checkAnswer(); // Periksa jawaban
    }
});

// Mulai game saat halaman dimuat
window.onload = startGame;
