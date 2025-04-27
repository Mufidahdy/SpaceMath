require("dotenv").config();
const express = require("express");
const { createClient } = require('@supabase/supabase-js'); // Import Supabase
const cors = require("cors");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// 🔹 Konfigurasi Supabase dari environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk menyimpan skor
async function saveScore(nama_pemain, menu, skor, waktu) {
  try {
    const waktuFormatted = moment(waktu).format("YYYY-MM-DD HH:mm:ss");
    const { data, error } = await supabase
      .from('nilai')
      .insert([{ nama_pemain, menu, skor, waktu: waktuFormatted }]);

    if (error) {
      throw error;
    }

    console.log("✅ Skor berhasil disimpan:", data);
    return data; // Mengembalikan data yang berhasil disimpan
  } catch (error) {
    console.error("❌ Gagal menyimpan skor:", error.message);
    throw new Error("Gagal menyimpan skor ke database.");
  }
}

// 🔹 Endpoint untuk submit skor
app.post("/submit-score", async (req, res) => {
  try {
    const { nama_pemain, menu, skor, waktu } = req.body;

    // Validasi data
    if (!nama_pemain || !menu || skor === undefined || !waktu) {
      return res.status(400).json({ error: "Data tidak lengkap!" });
    }

    // Menyimpan skor ke Supabase
    const savedScore = await saveScore(nama_pemain, menu, skor, waktu);
    res.json({
      message: "✅ Skor berhasil disimpan!",
      data: savedScore,
    });
  } catch (error) {
    console.error("❌ Gagal menyimpan skor:", error);
    res.status(500).json({ error: "Gagal menyimpan skor ke database.", detail: error.message });
  }
});

// 🔹 Endpoint untuk mendapatkan leaderboard
app.get("/get-leaderboard", async (req, res) => {
  const menu = req.query.menu;

  // Validasi parameter menu
  if (!menu) {
    return res.status(400).json({ error: "Menu tidak valid! Kirimkan parameter menu." });
  }

  try {
    const { data, error } = await supabase
      .from('nilai')
      .select('nama_pemain, skor')
      .eq('menu', menu)
      .order('skor', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Error mengambil leaderboard:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// 🔹 Endpoint test
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend aktif dan merespon dengan baik!" });
});

// 🔹 Endpoint cek sederhana
app.get("/cek", (req, res) => {
  res.send("✅ Backend Space Math aktif!");
});

// 🔹 Start Server
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error saat koneksi DB:", error.message);
  }
}

startServer();
