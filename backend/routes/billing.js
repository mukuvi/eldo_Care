const express = require("express");
const router = express.Router();

router.get("/summary", async (req, res) => {
  res.json({
    totalRevenue: 12000,
    hospitalSubscriptions: 4,
    ambulanceLeads: 18,
    chvPayouts: 3000
  });
});

module.exports = router;
