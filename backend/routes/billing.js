const express = require('express');
const router = express.Router();
const Billing = require('../models/billing');
const auth = require('../middleware/auth');

// Get all billing records
router.get('/', auth, async (req, res) => {
  try {
    const billings = await Billing.find().populate('patientId');
    res.json(billings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create billing record
router.post('/', auth, async (req, res) => {
  const billing = new Billing(req.body);
  try {
    const newBilling = await billing.save();
    res.status(201).json(newBilling);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;