// Ambil elemen menu dan planet
const memoryOrbitMenu = document.getElementById('memory-orbit-menu');
const planet1 = document.querySelector('.planet1'); // Sesuaikan dengan selector planet pertama

// Fungsi untuk menampilkan menu
planet1.addEventListener('click', () => {
  memoryOrbitMenu.classList.remove('hidden'); // Tampilkan menu
});

// Jika ingin menutup menu, tambahkan event listener pada elemen menu
memoryOrbitMenu.addEventListener('click', () => {
  memoryOrbitMenu.classList.add('hidden'); // Sembunyikan menu ketika di-klik
});
document.getElementById('memory-orbit-menu').classList.toggle('hidden');
