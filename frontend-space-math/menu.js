document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ File menu.js telah terbaca");

  // 🔹 SLIDER INTERAKSI (Biar Bisa Scroll dengan Klik & Drag)
  const slider = document.querySelector(".slider");
  let isDown = false;
  let startX;
  let scrollLeft;

  if (slider) {
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // 🔹 EVENT KLIK PLANET UNTUK PINDAH HALAMAN
  const planetLinks = {
    "Memory Orbit": "memoryorbit.html",
    "Comet Quiz": "cometquiz.html",
    "Meteor Multiplication": "meteormulti.html",
    "Division Galaxy": "divisiongalaxy.html",
  };

  document.querySelectorAll(".menu-item .planet-img").forEach((planet) => {
    const planetName = planet.alt;
    if (planetLinks[planetName]) {
      planet.addEventListener("click", function () {
        window.location.href = planetLinks[planetName];
      });
    }
  });

  // 🔹 LEADERBOARD INTERAKSI
  const leaderboardBtn = document.getElementById("leaderboard-btn");
  const leaderboardPopup = document.getElementById("leaderboard-popup");
  const closeLeaderboard = document.getElementById("close-leaderboard");
  const leaderboardList = document.getElementById("leaderboard-list");
  const gameSelector = document.getElementById("game-selector");

  if (!leaderboardBtn || !leaderboardPopup || !closeLeaderboard || !gameSelector) {
    console.error("❌ Elemen Leaderboard tidak ditemukan! Cek HTML.");
    return;
  }

  // 🔹 Fungsi untuk menampilkan leaderboard dari backend
  async function tampilkanLeaderboard() {
    const selectedMenu = gameSelector.value;
    console.log("📢 Game yang dipilih:", selectedMenu);

    try {
      const response = await fetch(`https://spacemath-production.up.railway.app/get-leaderboard?menu=${selectedMenu}`);
      const data = await response.json();

      leaderboardList.innerHTML = "";

      if (data.length > 0) {
        // Group data berdasarkan nama pemain, ambil entry dengan skor tertinggi
        const uniquePlayers = {};
        data.forEach((entry) => {
          if (!uniquePlayers[entry.nama_pemain] || uniquePlayers[entry.nama_pemain].skor < entry.skor) {
            uniquePlayers[entry.nama_pemain] = entry;
          }
        });
        // Konversi object ke array dan urutkan berdasarkan skor secara menurun
        const uniqueArray = Object.values(uniquePlayers).sort((a, b) => b.skor - a.skor);

        uniqueArray.forEach((pemain, index) => {
          let listItem = document.createElement("li");
          listItem.textContent = `${index + 1}. ${pemain.nama_pemain} - Skor: ${pemain.skor}`;
          leaderboardList.appendChild(listItem);
        });
      } else {
        let listItem = document.createElement("li");
        listItem.textContent = "Belum ada skor untuk game ini.";
        leaderboardList.appendChild(listItem);
      }

      console.log("📊 Leaderboard berhasil dimuat!");
    } catch (error) {
      console.error("❌ Gagal mengambil leaderboard dari backend:", error);
    }
  }

  leaderboardBtn.addEventListener("click", function () {
    console.log("📢 Tombol leaderboard diklik!");
    leaderboardPopup.style.display = "block";
    tampilkanLeaderboard();
  });

  gameSelector.addEventListener("change", tampilkanLeaderboard);

  closeLeaderboard.addEventListener("click", function () {
    leaderboardPopup.style.display = "none";
  });

  // 🔹 MENYIMPAN SKOR KE DATABASE
  async function simpanSkor(menu, nama_pemain, skor) {
    if (!menu || !nama_pemain || skor === undefined) {
      console.error("❌ Gagal menyimpan skor! Data tidak lengkap:", { menu, nama_pemain, skor });
      return;
    }

    try {
      console.log(`📡 Mengirim skor ke backend: ${nama_pemain} - ${skor} - ${menu}`);

      const response = await fetch("https://spacemath-production.up.railway.app/save-score", {
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
        console.log("✅ Skor berhasil disimpan ke database!");
        alert("✅ Skor berhasil disimpan!");
      } else {
        console.error("❌ Gagal menyimpan skor ke backend.");
      }
    } catch (error) {
      console.error("❌ Error saat menyimpan skor:", error);
    }
  }
  
  // 🔹 LISTENER EVENT GAME SELESAI
  document.addEventListener("gameFinished", function (event) {
    console.log("🎮 Event gameFinished diterima!", event.detail);

    const { menu, nama_pemain, skor } = event.detail || {};

    if (!menu || !nama_pemain || skor === undefined) {
      console.error("❌ Data gameFinished tidak lengkap:", event.detail);
      return;
    }

    console.log(`Game ${menu} selesai! Simpan skor: ${nama_pemain} - ${skor}`);
    simpanSkor(menu, nama_pemain, skor);
  });

  console.log("🎯 Listener gameFinished telah diaktifkan!");
});
