const express = require('express');
const {
  getResources,
  getResourceById,
  getRecommendedResourcesForUser,
  getResourcesBySkills
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Define routes in specific order to avoid conflicts
router.route('/recommended')
  .get(protect, getRecommendedResourcesForUser);

router.route('/by-skills')
  .post(getResourcesBySkills);

router.route('/:id')
  .get(getResourceById);

router.route('/')
  .get(getResources);

module.exports = router;