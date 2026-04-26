/**
 * SmartExamBuilder – Express.js API Server
 *
 * Ana sunucu dosyası. CORS ayarlarıyla React frontend'e bağlantı sağlar.
 * Port: 3001
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const examRoutes = require("./routes/exam");

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// ─── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.use("/api", examRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SmartExamBuilder API",
    lm_studio: "http://localhost:1234/v1",
  });
});

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log();
  console.log("══════════════════════════════════════════════════════════════");
  console.log("  🎓  SMART EXAM BUILDER  –  Express.js API Server");
  console.log(`  🚀  http://localhost:${PORT}`);
  console.log("  🤖  LM Studio: http://localhost:1234/v1");
  console.log("══════════════════════════════════════════════════════════════");
  console.log();
  console.log("  Endpoints:");
  console.log("    GET  /api/outcomes          → Kazanım listesi");
  console.log("    POST /api/generate-question → Soru üretimi");
  console.log("    POST /api/evaluate-answer   → Cevap değerlendirme");
  console.log("    GET  /api/health            → Sağlık kontrolü");
  console.log();
});
