// backend/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAIResponse } = require('../services/ai');

// Models (ensure these files exist in backend/models/)
const CallSession = require('../models/CallSession');
const Case = require('../models/Case');

// Multer setup for CHV image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder must exist
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

// =======================
// Admin / NGO Insights
// =======================
router.get('/insights/overview', async (req, res) => {
  try {
    const totalCalls = await CallSession.countDocuments();
    const activeCases = await Case.countDocuments({ status: 'pending' });
    const resolvedCases = await Case.countDocuments({ status: { $in: ['verified', 'resolved'] } });

    // Return array format so frontend .reduce() and .map() work without changes
    res.json([
      { _id: "Total Calls", total: totalCalls },
      { _id: "Active Cases", total: activeCases },
      { _id: "Resolved Cases", total: resolvedCases }
    ]);
  } catch (err) {
    console.error('Overview error:', err);
    res.status(500).json({ error: 'Failed to load overview', details: err.message });
  }
});

router.get('/insights/summary', async (req, res) => {
  try {
    const totalCalls = await CallSession.countDocuments();
    const highRiskCases = await Case.countDocuments({ riskLevel: { $in: ['high', 'critical'] } });
    const escalations = await Case.countDocuments({ escalation: true });
    const revenueEvents = await CallSession.countDocuments({ paymentStatus: 'paid' }) || 0;

    res.json({
      totalCalls,
      highRiskCases,
      escalations,
      revenueEvents
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Failed to load summary', details: err.message });
  }
});

router.get('/insights/hospital/leads', async (req, res) => {
  try {
    // Aggregate example (adjust if hospitalId exists in Case model)
    const leads = await Case.aggregate([
      { $group: { _id: '$hospitalId' || 'Unknown', leads: { $sum: 1 } } }
      // Optional lookup if you have a hospitals collection later
      // { $lookup: { from: 'hospitals', localField: '_id', foreignField: '_id', as: 'hospital' } },
      // { $unwind: { path: '$hospital', preserveNullAndEmptyArrays: true } },
      // { $project: { id: '$_id', name: '$hospital.name' || 'Unknown', leads: 1 } }
    ]);

    res.json(leads.length ? leads : [{ _id: "No Data", leads: 0 }]);
  } catch (err) {
    console.error('Hospital leads error:', err);
    res.status(500).json({ error: 'Failed to load hospital leads' });
  }
});

router.get('/insights/heatmap', async (req, res) => {
  try {
    // Placeholder for geo data (add lat/lng to Case model if needed)
    const points = await Case.find({ location: { $exists: true } })
      .select('location riskLevel')
      .limit(100);

    res.json({ points: points.length ? points : [] });
  } catch (err) {
    console.error('Heatmap error:', err);
    res.status(500).json({ error: 'Failed to load heatmap data' });
  }
});

// =======================
// CHV Routes
// =======================

router.post('/chv/cases', upload.array('images', 3), async (req, res) => {
  try {
    const { description, riskLevel } = req.body;

    if (!description?.trim() || !riskLevel) {
      return res.status(400).json({ error: "Description and risk level are required" });
    }

    let aiFeedback = null;
    try {
      // Call your Gemini function
      const aiResponse = await getAIResponse(description);

      // Extract simple steps (customize based on your AI schema)
      aiFeedback = {
        steps: aiResponse?.guidance
          ? aiResponse.guidance.split('. ').filter(s => s.trim())
          : ["Keep patient calm and comfortable", "Monitor breathing and pulse", "Do not give food or drink if unconscious"],
        caution: aiResponse?.escalation
          ? "Do NOT attempt treatment beyond basic first aid. Escalate immediately."
          : null,
        disclaimer: aiResponse?.disclaimer || "This is guidance only — not medical advice."
      };
    } catch (aiErr) {
      console.error("AI feedback failed:", aiErr);
      aiFeedback = {
        steps: ["Ensure patient safety", "Call for help if condition worsens"],
        disclaimer: "AI guidance unavailable — use standard first aid knowledge."
      };
    }

    const newCase = new Case({
      description: description.trim(),
      riskLevel,
      images: req.files?.map(f => `/uploads/${f.filename}`) || [],
      status: 'pending',
      createdAt: new Date(),
      aiFeedback // optional: save to DB too
    });

    await newCase.save();

    res.status(201).json({
      success: true,
      message: 'Case submitted successfully',
      case: newCase,
      aiFeedback // send back to frontend for instant display
    });
  } catch (err) {
    console.error('Case submission error:', err);
    res.status(500).json({ error: 'Failed to submit case', details: err.message });
  }
});
// router.post('/chv/cases', upload.array('images', 3), async (req, res) => {
//   try {
//     const { description, riskLevel } = req.body;

//     if (!description?.trim() || !riskLevel) {
//       return res.status(400).json({
//         error: "Description and risk level are required"
//       });
//     }

//     const newCase = new Case({
//       description: description.trim(),
//       riskLevel,
//       images: req.files?.map(f => `/uploads/${f.filename}`) || [],
//       status: 'pending',
//       createdAt: new Date()
//     });

//     await newCase.save();

//     res.status(201).json({
//       success: true,
//       message: 'Case submitted successfully',
//       case: newCase
//     });
//   } catch (err) {
//     console.error('Case submission error:', err);
//     res.status(500).json({ error: 'Failed to submit case', details: err.message });
//   }
// });

router.get('/chv/cases/me', async (req, res) => {
  try {
    // TODO: Add real auth filter (e.g. from JWT middleware req.user.id)
    const cases = await Case.find().sort({ createdAt: -1 }).limit(50);
    res.json(cases);
  } catch (err) {
    console.error('Fetch CHV cases error:', err);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

router.get('/chv/verification', async (req, res) => {
  res.json({ verified: true, message: "CHV verification status placeholder" });
});

router.get('/chv/activity', async (req, res) => {
  res.json({ activity: [], message: "Activity log placeholder" });
});

// =======================
// Billing Placeholder (for NGO dashboard)
// =======================
router.get('/billing/summary', async (req, res) => {
  res.json({
    totalRevenue: 0,
    pendingPayments: 0,
    paidEvents: 0,
    message: "Billing summary placeholder - implement real logic when ready"
  });
});

module.exports = router;