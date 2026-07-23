const express = require('express');
const router = express.Router();
const { getGallery, uploadImage, deleteImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

router.get('/', getGallery);
router.post('/', protect, upload.single('image'), uploadImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
