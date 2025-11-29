const User = require('../models/User.js');
const {
  generateRoadmap,
  chatWithCareerBot,
  generateProfileSummary,
  improveProjectBullets,
  improveLinkedInProfile
} = require('../services/aiService.js');

// Add logging for API key rotation
console.log('AI Controller loaded - API key rotation enabled');

// @desc    Generate career roadmap
// @route   POST /api/ai/roadmap
// @access  Private
const createRoadmap = async (req, res) => {
  try {
    const { targetRole, timeframe, hoursPerWeek } = req.body;

    if (!targetRole || !timeframe) {
      return res.status(400).json({ message: 'Target role and timeframe are required' });
    }

    const user = await User.findById(req.user._id);
    const currentSkills = user.skills || [];

    const roadmap = await generateRoadmap(
      currentSkills,
      targetRole,
      timeframe,
      hoursPerWeek || 10
    );

    // Save roadmap to user profile
    user.savedRoadmaps.push({
      targetRole,
      timeframe,
      hoursPerWeek: hoursPerWeek || 10,
      roadmap,
      createdAt: new Date()
    });

    await user.save();

    res.json({
      roadmap,
      savedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate roadmap', error: error.message });
  }
};

// @desc    Get user's saved roadmaps
// @route   GET /api/ai/roadmaps
// @access  Private
const getSavedRoadmaps = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.savedRoadmaps || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a saved roadmap
// @route   DELETE /api/ai/roadmaps/:roadmapId
// @access  Private
const deleteRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const user = await User.findById(req.user._id);

    user.savedRoadmaps = user.savedRoadmaps.filter(
      r => r._id.toString() !== roadmapId
    );

    await user.save();
    res.json({ message: 'Roadmap deleted', roadmaps: user.savedRoadmaps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Chat with CareerBot
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Use provided userContext or fetch from database
    let context;
    if (userContext) {
      context = userContext;
    } else {
      const user = await User.findById(req.user._id);
      context = {
        skills: user.skills,
        targetRoles: user.targetRoles,
        experienceLevel: user.experienceLevel,
        preferredTrack: user.preferredTrack
      };
    }

    const response = await chatWithCareerBot(message, context);

    res.json({
      userMessage: message,
      botResponse: response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get response', error: error.message });
  }
};

// @desc    Generate profile summary
// @route   POST /api/ai/summary
// @access  Private
const createSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const summary = await generateProfileSummary(user);

    // Optionally save to user profile
    if (req.body.save) {
      user.generatedSummary = summary;
      await user.save();
    }

    res.json({
      summary,
      saved: req.body.save || false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate summary', error: error.message });
  }
};

// @desc    Improve project bullet points
// @route   POST /api/ai/improve-bullets
// @access  Private
const improveBullets = async (req, res) => {
  try {
    const { projectDescription, technologies } = req.body;

    if (!projectDescription) {
      return res.status(400).json({ message: 'Project description is required' });
    }

    const improvedBullets = await improveProjectBullets(projectDescription, technologies);

    res.json({
      original: projectDescription,
      improved: improvedBullets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to improve bullets', error: error.message });
  }
};

// @desc    Improve LinkedIn profile
// @route   POST /api/ai/improve-linkedin
// @access  Private
const improveLinkedIn = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Generate LinkedIn profile improvement suggestions using AI
    const linkedinImprovements = await improveLinkedInProfile(user);
    
    res.json({
      improvements: linkedinImprovements,
      profileStrength: Math.min(100, (user.skills?.length || 0) * 5 + (user.targetRoles?.length || 0) * 10 + (user.generatedSummary ? 30 : 0))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate LinkedIn suggestions', error: error.message });
  }
};

module.exports = {
  createRoadmap,
  getSavedRoadmaps,
  deleteRoadmap,
  chat,
  createSummary,
  improveBullets,
  improveLinkedIn
};