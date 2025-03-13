document.addEventListener("DOMContentLoaded", function () {
  let bgMusic = document.getElementById("bg-music");

  if (!bgMusic) {
      bgMusic = document.createElement("audio");
      bgMusic.id = "bg-music";
      bgMusic.src = "image/bgmusik.mp3"; // Path ke musik latar
      bgMusic.loop = true;
      bgMusic.volume = localStorage.getItem("bgMusicVolume") || 0.5;
      document.body.appendChild(bgMusic);
  }

  const isPlaying = localStorage.getItem("bgMusicPlaying") === "true";

  if (isPlaying) {
      bgMusic.play().catch(() => {
          console.log("Autoplay dibatasi oleh browser.");
      });
  } else {
      bgMusic.pause();
  }

  // === Tombol Musik ===
  let musicButton = document.getElementById("music-toggle");
  if (!musicButton) {
      musicButton = document.createElement("button");
      musicButton.id = "music-toggle";
      musicButton.style.position = "fixed";
      musicButton.style.top = "20px";      // Sejajar leaderboard
      musicButton.style.right = "90px";    // Geser ke kiri dari leaderboard
      musicButton.style.zIndex = "1000";
      musicButton.style.width = "50px";    // Samakan dengan leaderboard
      musicButton.style.height = "50px";   // Samakan dengan leaderboard
      musicButton.style.background = "none";
      musicButton.style.border = "none";
      musicButton.style.cursor = "pointer";
      musicButton.style.transition = "transform 0.2s ease"; // Efek transisi untuk hover
      document.body.appendChild(musicButton);

      // Gambar awal
      musicButton.innerHTML = `<img src="image/sound-${isPlaying ? "on" : "off"}.png" width="50" height="50">`;

      // Hover effect (zoom)
      musicButton.addEventListener("mouseenter", function () {
          musicButton.style.transform = "scale(1.1)"; // Zoom in
      });
      musicButton.addEventListener("mouseleave", function () {
          musicButton.style.transform = "scale(1)"; // Balik normal
      });

      // Toggle musik saat diklik
      musicButton.addEventListener("click", function () {
          if (bgMusic.paused) {
              bgMusic.play();
              musicButton.innerHTML = `<img src="image/sound-on.png" width="50" height="50">`;
          } else {
              bgMusic.pause();
              musicButton.innerHTML = `<img src="image/sound-off.png" width="50" height="50">`;
          }
          localStorage.setItem("bgMusicPlaying", !bgMusic.paused);
      });
  }
});
