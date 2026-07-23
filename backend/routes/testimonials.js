const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, submitTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

router.get('/', getTestimonials);
router.post('/submit', submitTestimonial);
router.post('/', protect, upload.single('avatar'), createTestimonial);
router.put('/:id', protect, upload.single('avatar'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
