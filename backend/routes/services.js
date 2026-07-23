const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
