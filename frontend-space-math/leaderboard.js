// Ambil elemen yang dibutuhkan
const leaderboardBtn = document.getElementById("leaderboard-btn");
const leaderboardPopup = document.getElementById("leaderboard-popup");
const closeLeaderboard = document.getElementById("close-leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");
const gameSelector = document.getElementById("game-selector");

// Pastikan elemen ada di HTML sebelum lanjut
if (!leaderboardBtn || !leaderboardPopup || !closeLeaderboard || !leaderboardList || !gameSelector) {
    console.error("❌ Elemen leaderboard tidak ditemukan! Cek HTML.");
} else {

    // 🔹 Fungsi untuk mengambil leaderboard dari backend
    async function tampilkanLeaderboard() {
        const selectedGame = gameSelector.value;

        if (!selectedGame) {
            console.error("❌ Game belum dipilih.");
            return;
        }

        try {
            // Panggil API dari backend
            const response = await fetch(`https://space-math-pzag.vercel.app/get-leaderboard?menu=${selectedGame}`);
            const leaderboardData = await response.json();

            // Cek apakah response valid
            if (!Array.isArray(leaderboardData)) {
                console.error("❌ Data leaderboard tidak valid:", leaderboardData);
                return;
            }

            // Bersihkan daftar leaderboard
            leaderboardList.innerHTML = "";

            if (leaderboardData.length === 0) {
                let listItem = document.createElement("li");
                listItem.textContent = "Belum ada skor untuk game ini.";
                leaderboardList.appendChild(listItem);
                return;
            }

            // Tampilkan daftar leaderboard
            leaderboardData.forEach((pemain, index) => {
                let listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${pemain.nama_pemain} - Skor: ${pemain.skor}`;
                leaderboardList.appendChild(listItem);
            });

            // Update judul pop-up dengan nama game yang dipilih
            document.querySelector(".popup-content h2").textContent = `Leaderboard - ${selectedGame}`;

            // Tampilkan pop-up leaderboard
            leaderboardPopup.style.display = "block";

        } catch (error) {
            console.error("❌ Gagal mengambil leaderboard:", error);
            alert("Terjadi kesalahan saat mengambil data leaderboard. Coba lagi nanti.");
        }
    }

    // 🔹 Event listener saat tombol leaderboard diklik
    leaderboardBtn.addEventListener("click", tampilkanLeaderboard);

    // 🔹 Event listener untuk mengganti leaderboard saat game dipilih
    gameSelector.addEventListener("change", tampilkanLeaderboard);

    // 🔹 Event listener untuk menutup pop-up leaderboard
    closeLeaderboard.addEventListener("click", function () {
        leaderboardPopup.style.display = "none";
    });
}
