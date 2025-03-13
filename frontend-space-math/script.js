document.addEventListener("DOMContentLoaded", function() {
    const loadingBar = document.querySelector('.loading-bar');

    // Simulasi loading progress (loop)
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        loadingBar.style.width = width + '%';

        if (width >= 100) {
            clearInterval(interval);
        }
    }, 50); // Kecepatan loading (50ms untuk 5 detik total)
    setTimeout(function() {
        window.location.href = 'play.html';  // Arahkan ke halaman kedua
    }, 3000);  // Ganti angka 3000 dengan durasi loading dalam milidetik (3 detik)
});
