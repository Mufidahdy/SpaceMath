document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const videoContainer = document.getElementById("videoContainer");
    const nextButton = document.getElementById("nextButton");
    const backButton = document.getElementById("backButton");

    // Fungsi untuk menampilkan header, grid bintang, dan tombol Back
    function showStarsAndHeader() {
        const gameHeaderHTML = `
            <header id="gameHeader">
                <h1>Meteor Multiplication</h1>
            </header>
        `;

        const starsGridHTML = `
            <div class="orbit-grid">
                ${Array.from({ length: 10 }, (_, i) => `
                    <a href="meteor.html?perkalian=${(i + 1) * 10}" class="star" tabindex="0">
                        <img src="image/star.png" alt="Tabel Perkalian ${(i + 1) * 10}" onerror="this.src='image/default-star.png'">
                        <span>${(i + 1) * 10}</span>
                    </a>
                `).join("")}
            </div>
        `;

        const backButtonHTML = `
            <button class="back-button" id="dynamicBackButton" tabindex="0" 
                style="position: absolute; bottom: 20px; left: 20px; width: 60px; height: 60px; 
                background: url('image/back.png') no-repeat center; background-size: contain; 
                border: none; cursor: pointer;">
            </button>
        `;

        videoContainer.innerHTML = gameHeaderHTML + starsGridHTML + backButtonHTML;

        // Tambahkan event listener untuk tombol Back dinamis (reset video)
        const dynamicBackButton = document.getElementById("dynamicBackButton");
        if (dynamicBackButton) {
            dynamicBackButton.addEventListener("click", resetVideo);
        }
    }

    // Fungsi untuk memutar ulang video
    function resetVideo() {
        videoContainer.innerHTML = `
            <video id="video" autoplay muted>
                <source src="image/Meteor.mp4" type="video/mp4">
                Browser kamu nggak support video, nih.
            </video>
            <button class="next-button" id="nextButton" tabindex="0"></button>
            <button class="back-button" id="backButton" tabindex="0"></button>
        `;

        const newVideo = document.getElementById("video");
        const newNextButton = document.getElementById("nextButton");
        const newBackButton = document.getElementById("backButton");

        // Pasang event listener baru untuk video selesai
        if (newVideo) {
            newVideo.addEventListener("ended", showStarsAndHeader);
        }

        // Event listener untuk tombol Next
        if (newNextButton) {
            newNextButton.addEventListener("click", showStarsAndHeader);
        }

        // Event listener untuk tombol Back yang kembali ke menu
        if (newBackButton) {
            newBackButton.addEventListener("click", () => {
                window.location.href = "menu.html"; // Kembali ke menu utama
            });
        }
    }

    // Event listener untuk video selesai
    if (video) {
        video.addEventListener("ended", showStarsAndHeader);
    }

    // Event listener tombol Next
    if (nextButton) {
        nextButton.addEventListener("click", showStarsAndHeader);
    }

    // Event listener tombol Back untuk kembali ke menu
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "menu.html"; // Kembali ke menu utama
        });
    }
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
