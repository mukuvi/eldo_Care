const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/**
 * ======================
 * FILE UPLOAD CONFIG
 * ======================
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/**
 * ======================
 * SUBMIT CASE
 * ======================
 * POST /api/chv/cases
 */
router.post("/cases", upload.array("images", 3), async (req, res) => {
  const { description, riskLevel } = req.body;

  if (!description || !riskLevel) {
    return res.status(400).json({
      error: "Description and risk level are required"
    });
  }

  const caseData = {
    _id: Date.now().toString(),
    description,
    riskLevel,
    status: "pending",
    images: req.files?.map(f => `/uploads/${f.filename}`) || [],
    createdAt: new Date()
  };

  // TODO: save to MongoDB
  res.status(201).json(caseData);
});

/**
 * ======================
 * VIEW MY CASES
 * ======================
 * GET /api/chv/cases/me
 */
router.get("/cases/me", async (req, res) => {
  res.json([
    {
      _id: "1",
      description: "Pregnant mother with severe headache",
      riskLevel: "high",
      status: "verified",
      createdAt: new Date()
    },
    {
      _id: "2",
      description: "Child with fever",
      riskLevel: "medium",
      status: "pending",
      createdAt: new Date()
    }
  ]);
});

module.exports = router;
