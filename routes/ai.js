const express = require('express');
const {
  createRoadmap,
  getSavedRoadmaps,
  deleteRoadmap,
  chat,
  createSummary,
  improveBullets,
  improveLinkedIn
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/roadmap')
  .post(protect, createRoadmap);

router.route('/roadmaps')
  .get(protect, getSavedRoadmaps);

router.route('/roadmaps/:roadmapId')
  .delete(protect, deleteRoadmap);

router.route('/chat')
  .post(protect, chat);

router.route('/summary')
  .post(protect, createSummary);

router.route('/improve-bullets')
  .post(protect, improveBullets);

router.route('/improve-linkedin')
  .post(protect, improveLinkedIn);

module.exports = router;