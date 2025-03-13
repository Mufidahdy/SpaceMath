// Plugin centerText (opsional, tidak digunakan di config chart)
const centerTextPlugin = {
  id: 'centerText',
  afterDraw: function(chart) {
    if (chart.config.options.elements && chart.config.options.elements.center) {
      const ctx = chart.ctx;
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'Arial';
      const txt = centerConfig.text;
      const color = centerConfig.color || '#000';
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

      ctx.font = "bold " + centerConfig.fontSize + "px " + fontStyle;
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(centerConfig.fontSize * widthRatio);
      const elementHeight = (chart.innerRadius * 2);
      const fontSizeToUse = Math.min(newFontSize, elementHeight);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.font = "bold " + fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;
      
      // Jika terdapat lebih dari satu baris, pisahkan dengan newline
      const lines = txt.split('\n');
      const lineHeight = fontSizeToUse * 1.2;
      const totalHeight = lineHeight * lines.length;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], centerX, centerY - totalHeight/2 + lineHeight/2 + i * lineHeight);
      }
    }
  }
};

Chart.register(centerTextPlugin);

/**
 * Fungsi untuk menampilkan popup .score-popup
 * Urutan konten:
 * 1. "Your score" (h1)
 * 2. Persentase skor (p)
 * 3. Chart (canvas)
 * 4. Pesan di bawah chart (p)
 */
function showScorePopup(finalScore) {
  // Buat elemen popup
  const popup = document.createElement("div");
  popup.className = "score-popup"; // Akan menggunakan CSS .score-popup
  
  // 1. Judul
  const title = document.createElement("h1");
  title.textContent = "Your score";
  popup.appendChild(title);

  // 2. Persentase skor
  const scoreText = document.createElement("p");
  scoreText.textContent = finalScore.toFixed(2) + "%";
  popup.appendChild(scoreText);

  // 3. Canvas untuk Chart
  const canvas = document.createElement("canvas");
  canvas.id = "scoreChartCanvas";
  // Width/height di-override lewat CSS agar stabil
  popup.appendChild(canvas);

  // 4. Pesan di bawah chart
  let message = "";
  if (finalScore >= 90 && finalScore <= 100) {
    message = "Good job! Pertahankan!🥳";
  } else if (finalScore >= 70 && finalScore < 90) {
    message = "Kurang sedikit lagi, semangat!💪";
  } else if (finalScore >= 60 && finalScore < 70) {
    message = "Yuk semangat dihafalkan!👍";
  } else if (finalScore < 60) {
    message = "Jangan menyerah🙌😆";
  }

  const messageElem = document.createElement("p");
  messageElem.textContent = message;
  popup.appendChild(messageElem);

  // Masukkan popup ke body
  document.body.appendChild(popup);

  // Buat Chart Doughnut (non-responsive, fixed size)
  const ctx = canvas.getContext("2d");
  const chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Nilai Akhir", "Sisa"],
      datasets: [
        {
          data: [finalScore, 100 - finalScore],
          backgroundColor: ["#283863", "#e0e0e0"]
        }
      ]
    },
    options: {
      responsive: false,           // Nonaktifkan responsive
      maintainAspectRatio: true,   // Pertahankan rasio
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Destroy chart sebelum remove popup untuk mencegah error getParsed() == null
  setTimeout(() => {
    chartInstance.destroy();
    popup.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ File memory1.js telah terbaca");

  // Ambil elemen DOM
  const staticMultiplication = document.getElementById("static-multiplication");
  const interactiveGame = document.getElementById("interactive-game");
  const playButton = document.getElementById("play-button");
  const questionElement = document.getElementById("question");
  const microphone = document.getElementById("microphone");
  const showScoreButton = document.getElementById("show-score-button");
  const scoreModal = document.getElementById("score-modal");
  const closeModalButton = document.getElementById("close-modal");

  let questions = [];
  let currentQuestionIndex = 0;
  let attempts = 0;
  let correctAnswers = 0;

  // Fungsi untuk mendapatkan angka perkalian dari URL
  function getMultiplierFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get("perkalian")) || 1;
  }

  // Fungsi untuk menghasilkan pertanyaan
  function generateQuestions() {
    questions = [];
    const multiplier = getMultiplierFromUrl();
    for (let i = 1; i <= 10; i++) {
      questions.push({ num1: multiplier, num2: i, answer: multiplier * i });
    }
    shuffleArray(questions);
  }

  // Fungsi untuk mengacak array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Rumus penilaian:
  // (((jumlah benar / jumlah soal yang dikerjakan) + (jumlah benar / jumlah percobaan)) / 2) * 100
  function calculateFinalScore() {
    if (currentQuestionIndex === 0 || attempts === 0) return 0;
    const scoreTotal = (correctAnswers / currentQuestionIndex) * 100;
    const scoreAttempts = (correctAnswers / attempts) * 100;
    return (scoreTotal + scoreAttempts) / 2;
  }

  // Tampilkan soal berikutnya
  function nextQuestion() {
    if (currentQuestionIndex < questions.length) {
      const { num1, num2 } = questions[currentQuestionIndex];
      questionElement.textContent = `${num1} x ${num2} = ...`;
      console.log(`📝 Soal Baru: ${questionElement.textContent}`);
    } else {
      displayScore();
      saveScoreToAPI();
    }
  }

  // Periksa jawaban pemain
  function checkAnswer(answer) {
    console.log(`Jawaban yang diberikan: ${answer}`);
    if (answer === null || answer === "") {
      alert("⚠️ Jawaban tidak boleh kosong!");
      return;
    }
    const { answer: correctAnswer } = questions[currentQuestionIndex];
    attempts++;
    console.log(`📊 Menambah attempts, total: ${attempts}`);
    if (parseInt(answer) === correctAnswer) {
      correctAnswers++;
      console.log(`✅ Jawaban benar! Total benar: ${correctAnswers}`);
      currentQuestionIndex++;
      const audioBenar = document.getElementById("audioBenar");
      if (audioBenar) audioBenar.play();
      if (currentQuestionIndex < questions.length) {
        nextQuestion();
      } else {
        displayScore();
        saveScoreToAPI();
      }
    } else {
      const audioSalah = document.getElementById("audioSalah");
      if (audioSalah) audioSalah.play();
    }
  }

  // Konversi kata menjadi angka (misal "dua" => 2)
  function wordToNumber(word) {
    const numbers = {
      nol: 0,
      satu: 1,
      dua: 2,
      tiga: 3,
      empat: 4,
      lima: 5,
      enam: 6,
      tujuh: 7,
      delapan: 8,
      sembilan: 9,
      sepuluh: 10,
    };
    word = word.replace(/\s+/g, "").toLowerCase();
    if (numbers[word] !== undefined) {
      return numbers[word];
    }
    if (!isNaN(parseInt(word))) {
      return parseInt(word);
    }
    return word;
  }

  // Tampilkan skor
  function displayScore() {
    const totalQuestions = currentQuestionIndex;
    if (totalQuestions === 0 || attempts === 0) {
      alert("⚠️ Belum ada soal yang dikerjakan!");
      return;
    }
    const finalScore = parseFloat(calculateFinalScore().toFixed(2));
    console.log(`🎯 Nilai Akhir: ${finalScore}%`);

    // Tampilkan popup
    showScorePopup(finalScore);
  }

  // Simpan skor ke API
  function saveScoreToAPI() {
    const playerName = localStorage.getItem("nama_pemain") || "Guest";
    const menu = "Memory Orbit";
    if (currentQuestionIndex === 0 || attempts === 0) return;
    const finalScore = calculateFinalScore().toFixed(2);

    fetch("http://localhost:5000/submit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_pemain: playerName,
        menu: menu,
        skor: finalScore,
        waktu: new Date().toISOString()
      })
    })
    .then(response => response.json())
    .then(result => console.log("Skor berhasil disimpan:", result))
    .catch(error => console.error("Gagal menyimpan skor:", error));
  }

  // Tombol "Lihat Skor"
  if (showScoreButton) {
    showScoreButton.addEventListener("click", () => {
      console.log("📊 Tombol 'Lihat Skor' diklik!");
      displayScore();
      saveScoreToAPI();
    });
  }

  // Tombol "Tutup" modal lama
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      scoreModal.style.display = "none";
    });
  }

  // Pengenalan suara
  if (microphone) {
    microphone.addEventListener("click", () => {
      console.log("🎤 Mikrofon diklik");
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "id-ID";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.start();
        console.log("🎙️ Pengenalan suara dimulai");

        recognition.onresult = (event) => {
          let spokenAnswer = event.results[0][0].transcript.trim().toLowerCase();
          console.log(`Jawaban yang terdengar: ${spokenAnswer}`);
          let numericAnswer = wordToNumber(spokenAnswer);
          checkAnswer(numericAnswer);
        };

        recognition.onspeechend = () => {
          recognition.stop();
          console.log("🎤 Pengenalan suara dihentikan");
        };

        recognition.onerror = (event) => {
          console.error("Error pengenalan suara:", event.error);
          alert("⚠️ Terjadi kesalahan dalam pengenalan suara. Coba lagi.");
        };
      } else {
        alert("⚠️ Pengenalan suara tidak didukung di browser ini!");
      }
    });
  }

  // Tombol Play
  if (playButton) {
    playButton.addEventListener("click", () => {
      console.log("▶️ Button Play diklik!");
      staticMultiplication.style.display = "none";
      interactiveGame.style.display = "block";
      generateQuestions();
      nextQuestion();
      showScoreButton.style.display = "block";
    });
  }

  // Inisialisasi
  generateQuestions();
  nextQuestion();
});
