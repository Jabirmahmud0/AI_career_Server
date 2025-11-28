const LearningResource = require('../models/LearningResource.js');
const { getRecommendedResources } = require('../services/matchingService.js');

// @desc    Get all learning resources with filters
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { skill, platform, cost, difficulty, track, search } = req.query;

    let query = {};

    if (skill) {
      query.relatedSkills = new RegExp(skill, 'i');
    }
    if (platform) query.platform = platform;
    if (cost) query.cost = cost;
    if (difficulty) query.difficulty = difficulty;
    if (track) query.track = track;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { relatedSkills: new RegExp(search, 'i') }
      ];
    }

    const resources = await LearningResource.find(query).sort({ rating: -1 });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);

    if (resource) {
      res.json(resource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recommended resources for user
// @route   GET /api/resources/recommended
// @access  Private
const getRecommendedResourcesForUser = async (req, res) => {
  try {
    // Validate user object
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await getRecommendedResources(req.user, limit);
    res.json(recommendations);
  } catch (error) {
    console.error('Error in getRecommendedResourcesForUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get resources by skills
// @route   POST /api/resources/by-skills
// @access  Public
const getResourcesBySkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ message: 'Skills array is required' });
    }

    const resources = await LearningResource.find({
      relatedSkills: {
        $in: skills.map(skill => new RegExp(skill, 'i'))
      }
    }).sort({ rating: -1 });

    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  getRecommendedResourcesForUser,
  getResourcesBySkills
};
