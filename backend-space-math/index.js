require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const dbConfig = {
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'jAjwqrPdBbbWHKlkpCKBWoGXWMWNFWNI',
  database: 'railway',
  port: process.env.DB_PORT || 3306
};

console.log("📌 ENV CONFIG:", dbConfig);

let db;

// 🔹 Koneksi ke database
async function connectDB() {
  try {
    db = await mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log("✅ Terhubung ke database MySQL Railway");
  } catch (error) {
    console.error("❌ Gagal koneksi database:", error.message);
    throw error;
  }
}

// 🔹 Endpoint untuk menyimpan skor
app.post("/submit-score", async (req, res) => {
  try {
    const { nama_pemain, menu, skor, waktu } = req.body;

    if (!nama_pemain || !menu || skor === undefined || !waktu) {
      return res.status(400).json({ error: "Data tidak lengkap!" });
    }

    const waktuFormatted = moment(waktu).format("YYYY-MM-DD HH:mm:ss");

    const query =
      "INSERT INTO nilai (nama_pemain, menu, skor, waktu) VALUES (?, ?, ?, ?)";
    await db.execute(query, [
      nama_pemain,
      menu,
      skor,
      waktuFormatted,
    ]);

    res.json({
      message: "Skor berhasil disimpan!",
      data: { nama_pemain, menu, skor, waktuFormatted },
    });
  } catch (error) {
    console.error("❌ Gagal menyimpan skor:", error);
    res.status(500).json({ error: "Gagal menyimpan skor ke database." });
  }
});

// 🔹 Endpoint leaderboard (route yang bener!)
app.get("/api/leaderboard", async (req, res) => {
  const menu = req.query.menu;

  if (!menu) {
    return res
      .status(400)
      .json({ error: "Menu tidak valid! Kirimkan parameter menu." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT nama_pemain, skor FROM nilai WHERE menu = ? ORDER BY skor DESC, waktu ASC LIMIT 5",
      [menu]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Error mengambil leaderboard:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// 🔹 Route test
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend aktif dan merespon dengan baik!" });
});
app.get("/cek", (req, res) => {
  res.send("✅ Backend Space Math aktif!");
});

// 🔹 Start server
async function startServer() {
  app.listen(PORT, async () => {
    try {
      await connectDB();
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    } catch (error) {
      console.error("❌ Error saat koneksi DB:", error.message);
    }
  });
}

startServer();
