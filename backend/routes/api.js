const express = require('express');
const router = express.Router();

// =======================
// Admin Insights
// =======================
router.get('/insights/overview', async (req, res) => {
  res.json({
    totalCalls: 25,
    activeCases: 10,
    resolvedCases: 5
  });
});

router.get('/insights/hospital/leads', async (req, res) => {
  res.json([
    { id: 1, name: 'Hospital A', leads: 5 },
    { id: 2, name: 'Hospital B', leads: 8 }
  ]);
});

router.get('/insights/summary', async (req, res) => {
  res.json({ summary: 'NGO summary data' });
});

router.get('/insights/heatmap', async (req, res) => {
  res.json({ heatmap: [] });
});

// // =======================
// // CHV Routes
// // =======================
// router.post('/chv/cases', async (req, res) => {
//   res.json({ success: true, message: 'Case submitted' });
// });

// router.get('/chv/cases/me', async (req, res) => {
//   res.json([{ id: 1, name: 'Case 1' }]);
// });

// router.get('/chv/verification', async (req, res) => {
//   res.json({ verified: true });
// });

// router.get('/chv/activity', async (req, res) => {
//   res.json({ activity: [] });
// });

module.exports = router;
