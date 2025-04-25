require('dotenv').config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use(express.json());
app.use(cors());

// 🔹 Koneksi ke MySQL dengan `async/await`
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
console.log("📌 ENV CONFIG:", dbConfig);



let db;
async function connectDB() {
    try {
        db = await mysql.createPool({ ...dbConfig, waitForConnections: true, connectionLimit: 10 });
        console.log("✅ Terhubung ke database MySQL");
    } catch (error) {
        console.error("❌ Koneksi database gagal:", error);
        process.exit(1);
    }
}
connectDB();

// 🔹 Endpoint untuk menyimpan skor ke database
app.post("/submit-score", async (req, res) => {
    try {
        const { nama_pemain, menu, skor, waktu } = req.body;

        console.log("📥 Data diterima:", req.body); // 🔹 Debugging log

        if (!nama_pemain || !menu || skor === undefined || !waktu) {
            return res.status(400).json({ error: "Data tidak lengkap! Pastikan semua field terisi." });
        }

        // 🔹 Konversi waktu ke format MySQL
        const waktuFormatted = moment(waktu).format("YYYY-MM-DD HH:mm:ss");

        const query = "INSERT INTO nilai (nama_pemain, menu, skor, waktu) VALUES (?, ?, ?, ?)";
        await db.execute(query, [nama_pemain, menu, skor, waktuFormatted]);

        console.log("✅ Skor berhasil disimpan:", { nama_pemain, menu, skor, waktuFormatted });
        res.json({ message: "Skor berhasil disimpan!", data: { nama_pemain, menu, skor, waktuFormatted } });
    } catch (error) {
        console.error("❌ Gagal menyimpan skor:", error);
        res.status(500).json({ error: "Gagal menyimpan skor ke database." });
    }
});

// 🔹 Endpoint untuk mengambil leaderboard berdasarkan menu
app.get("/get-leaderboard", async (req, res) => {
    const menu = req.query.menu;

    if (!menu) {
        return res.status(400).json({ error: "Menu tidak valid! Pastikan mengirimkan parameter menu." });
    }

    try {
        const [rows] = await db.execute("SELECT nama_pemain, skor FROM nilai WHERE menu = ? ORDER BY skor DESC, waktu ASC LIMIT 5", [menu]);

        console.log("✅ Leaderboard data:", rows);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error mengambil leaderboard:", error);
        res.status(500).json({ error: "Terjadi kesalahan server." });
    }
});

// 🔹 Route test
app.get("/api/test", (req, res) => {
    res.send("✅ Backend nyala dan bisa diakses!");
});

// 🔹 Jalankan server setelah konek DB
async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`🚀 Server berjalan di http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Gagal start server:", error);
    }
}

startServer();
app.get("/api/test", (req, res) => {
    res.json({ message: "✅ Backend aktif dan merespon dengan baik!" });
});


