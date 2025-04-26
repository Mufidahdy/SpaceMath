document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ File cometquiz.js telah terbaca");

  // 🔹 Navigasi ke quiz saat klik bintang
  for (let i = 1; i <= 10; i++) {
    const star = document.getElementById(`star${i}`);

    if (star) {
      star.addEventListener("click", () => {
        window.location.href = `quiz.html?perkalian=${i}`;
      });
    } else {
      console.error(`❌ Elemen "star${i}" tidak ditemukan.`);
    }
  }

  // 🔹 Fungsi untuk mengirim skor ke backend
  async function sendScoreToBackend(nama_pemain, skor, menu) {
    if (!nama_pemain || skor === undefined || !menu) {
      console.error("❌ Data game selesai tidak lengkap!", { nama_pemain, skor, menu });
      return;
    }

    try {
      console.log(`📡 Mengirim skor ke backend: ${nama_pemain} - ${skor} - ${menu}`);

      const response = await fetch("https://space-math-pzag.vercel.app/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_pemain: nama_pemain,
          menu: menu, 
          skor: skor,
          waktu: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log("✅ Skor berhasil dikirim ke database!");
        updateLeaderboard(); // Perbarui leaderboard setelah skor terkirim
      } else {
        console.error("❌ Gagal mengirim skor ke backend.");
      }
    } catch (error) {
      console.error("❌ Error saat mengirim data:", error);
    }
  }

  // 🔹 Fungsi untuk memperbarui leaderboard
  function updateLeaderboard() {
    fetch("https://space-math-pzag.vercel.app/api/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        const leaderboardContainer = document.getElementById("leaderboard");
        if (!leaderboardContainer) return;

        leaderboardContainer.innerHTML = "<h3>🏆 Leaderboard</h3>";
        data.forEach((entry, index) => {
          leaderboardContainer.innerHTML += `<p>${index + 1}. ${entry.nama_pemain} - ${entry.skor}</p>`;
        });

        console.log("📊 Leaderboard diperbarui!");
      })
      .catch((error) => {
        console.error("❌ Gagal mengambil leaderboard:", error);
      });
  }

  // 🔹 Event listener untuk menangkap skor dari quiz.js
  document.addEventListener("gameFinished", (event) => {
    const { nama_pemain, skor, menu } = event.detail;

    if (menu === "Comet Quiz") {
      console.log(`🎮 Game ${menu} selesai! Skor: ${nama_pemain} - ${skor}`);
      sendScoreToBackend(nama_pemain, skor, menu);
    }
  });

  console.log("🎯 Listener gameFinished telah diaktifkan!");
});
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("instruction-btn");
  const popup = document.getElementById("instruction-popup");
  const video = document.getElementById("instruction-video");
  const closeBtn = document.getElementById("close-instruction");

  btn.addEventListener("click", () => {
    popup.style.display = "flex";
    video.currentTime = 0;
    video.play();
  });

  closeBtn.addEventListener("click", () => {
    video.pause();
    popup.style.display = "none";
  });
});