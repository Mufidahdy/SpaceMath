document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ File memoryorbit.js telah terbaca");

  // 🔹 Navigasi saat klik bintang (level game)
  for (let i = 1; i <= 10; i++) {
    const star = document.getElementById(`star${i}`);

    if (star) {
      star.addEventListener("click", () => {
        window.location.href = "memory1.html"; // Nanti bisa diubah sesuai level
      });
    } else {
      console.error(`❌ Elemen "star${i}" tidak ditemukan.`);
    }
  }

  // ❌ Hapus event gameFinished dari sini, harus dipanggil di file game utama (memory1.js)
});
