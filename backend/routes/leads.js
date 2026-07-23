const express = require('express');
const router = express.Router();
const { createLead, getLeads, getLead, updateLead, deleteLead, getStats } = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.post('/', createLead);
router.get('/', protect, getLeads);
router.get('/stats', protect, getStats);
router.get('/:id', protect, getLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
