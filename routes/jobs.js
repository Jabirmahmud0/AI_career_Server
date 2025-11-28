const express = require('express');
const { 
  getJobs, 
  getJobById, 
  getRecommendedJobsForUser, 
  getJobAnalysis 
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Define routes in specific order to avoid conflicts
router.route('/recommended')
  .get(protect, getRecommendedJobsForUser);

router.route('/:id/analysis')
  .get(protect, getJobAnalysis);

router.route('/:id')
  .get(getJobById);

router.route('/')
  .get(getJobs);

module.exports = router;