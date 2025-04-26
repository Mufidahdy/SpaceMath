// Ambil elemen-elemen yang dibutuhkan
const usernameInput = document.getElementById("username");
const popup = document.getElementById("popup");
const playButton = document.getElementById("playButton");

// Fokus ke input saat halaman dimuat
window.onload = function () {
    popup.style.display = "block";
    usernameInput.focus();
};

// Event listener untuk menekan Enter di input
usernameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const nama_pemain = usernameInput.value.trim(); // Sesuaikan dengan backend

        if (nama_pemain) {
            // Simpan nama pemain ke localStorage
            localStorage.setItem("nama_pemain", nama_pemain);

            // Cek apakah leaderboard sudah ada di localStorage
            let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

            // Pastikan leaderboard dalam format objek
            if (typeof leaderboard !== "object") {
                leaderboard = {};
            }

            // Inisialisasi leaderboard jika belum ada
            if (!leaderboard["Comet Quiz"]) {
                leaderboard["Comet Quiz"] = [];
            }

            // Cek apakah pemain sudah ada di leaderboard
            let pemainSudahAda = leaderboard["Comet Quiz"].some(pemain => pemain.nama_pemain === nama_pemain);
            if (!pemainSudahAda) {
                leaderboard["Comet Quiz"].push({ nama_pemain, skor: 0 });
            }

            // Simpan kembali ke localStorage
            localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

            // Sembunyikan popup dan tampilkan tombol play
            popup.style.display = "none";
            playButton.style.visibility = "visible"; // Ubah dari display:block ke visibility:visible

            // Kirim data ke backend dengan default nilai skor & waktu
            fetch("https://space-math-pzag.vercel.app/api/submit-score", { // Ganti dengan endpoint yang benar
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    nama_pemain, 
                    menu: "intro", // Default menu sementara
                    skor: 0,       // Skor awal 0
                    waktu: new Date().toISOString() // Waktu sekarang dalam format ISO
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Nama tersimpan:", data);
                })
                .catch(error => {
                    console.error("Error menyimpan nama:", error);
                });
        } else {
            alert("Nama tidak boleh kosong!");
        }
    }
});

// Event listener agar tombol play bisa diklik
playButton.addEventListener("click", function () {
    window.location.href = "untitled-1.html"; // Pindah ke halaman permainan
});
