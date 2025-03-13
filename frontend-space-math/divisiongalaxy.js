document.addEventListener("DOMContentLoaded", () => {

  // Mengambil elemen HTML
  const videoContainer = document.getElementById("videoContainer");
  const nama_pemain = localStorage.getItem("nama_pemain") || "Guest";
  const menu = "Division Galaxy"; // Nama menu sesuai dengan tabel
  const skor = 100; // Skor default saat video selesai

  // Fungsi untuk menyimpan skor ke database
  async function saveScore() {
      try {
          const response = await fetch("http://localhost:5000/submit-score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nama_pemain, menu, skor })
          });

          const result = await response.json();
          console.log("Skor berhasil disimpan:", result);
      } catch (error) {
          console.error("Gagal menyimpan skor:", error);
      }
  }

  // Fungsi untuk menampilkan header, grid bintang, dan tombol Back
  function showStarsAndHeader() {
      videoContainer.innerHTML = `
          <header id="gameHeader">
              <h1>Division Galaxy</h1>
          </header>
          <div class="orbit-grid">
              ${Array.from({ length: 10 }, (_, i) => `
                  <a href="division.html?pembagian=${i + 1}&nama=${encodeURIComponent(nama_pemain)}" class="star" tabindex="0">
                      <img src="image/star.png" alt="Tabel Pembagian ${i + 1}" onerror="this.src='image/default-star.png'">
                      <span>${i + 1}</span>
                  </a>
              `).join("")}
          </div>
          <button class="back-button" id="dynamicBackButton" tabindex="0" 
              style="position: absolute; bottom: 20px; left: 20px; width: 60px; height: 60px; 
              background: url('image/back.png') no-repeat center; background-size: contain; 
              border: none; cursor: pointer;">
          </button>
      `;

      // Simpan skor setelah video selesai
      saveScore();

      // Event listener tombol Back
      document.getElementById("dynamicBackButton").addEventListener("click", resetVideo);
  }

  // Fungsi untuk menampilkan video dan tombol navigasi
  function showVideo() {
      videoContainer.innerHTML = `
          <video id="video" autoplay muted>
              <source src="image/division.mp4" type="video/mp4">
              Browser kamu nggak support video, nih.
          </video>
          <button class="next-button" id="nextButton" tabindex="0"></button>
          <button class="back-button" id="backButton" tabindex="0"></button>
      `;

      const video = document.getElementById("video");

      if (video) {
          video.addEventListener("ended", showStarsAndHeader);
      }

      // Event listener tombol Next
      document.getElementById("nextButton").addEventListener("click", showStarsAndHeader);

      // Event listener tombol Back ke menu
      document.getElementById("backButton").addEventListener("click", () => {
          window.location.href = "menu.html";
      });
  }

  // Fungsi reset video (kembali ke awal video)
  function resetVideo() {
      showVideo();
  }

  // Jalankan video saat halaman dimuat
  showVideo();
});
