const express = require('express');
const {
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  addProject,
  removeProject,
  extractSkills
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route('/skills')
  .post(protect, addSkill);

router.route('/skills/:skill')
  .delete(protect, removeSkill);

router.route('/projects')
  .post(protect, addProject);

router.route('/projects/:projectId')
  .delete(protect, removeProject);

router.route('/extract-skills')
  .post(protect, extractSkills);

module.exports = router;