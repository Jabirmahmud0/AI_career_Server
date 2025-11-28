const User = require('../models/User.js');
const { extractSkillsFromCV } = require('../services/aiService.js');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      educationLevel,
      department,
      experienceLevel,
      preferredTrack,
      skills,
      targetRoles,
      projects,
      experience,
      cvText,
      bio,
      generatedSummary
    } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = fullName || user.fullName;
      user.educationLevel = educationLevel || user.educationLevel;
      user.department = department || user.department;
      user.experienceLevel = experienceLevel || user.experienceLevel;
      user.preferredTrack = preferredTrack || user.preferredTrack;
      user.skills = skills || user.skills;
      user.targetRoles = targetRoles || user.targetRoles;
      user.projects = projects || user.projects;
      user.experience = experience || user.experience;
      user.cvText = cvText !== undefined ? cvText : user.cvText;
      user.bio = bio !== undefined ? bio : user.bio;
      user.generatedSummary = generatedSummary !== undefined ? generatedSummary : user.generatedSummary;

      // Save to MongoDB
      const updatedUser = await user.save();
      console.log('Profile updated and saved to MongoDB for user:', user._id);
      
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add skill to profile
// @route   POST /api/profile/skills
// @access  Private
const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || skill.trim() === '') {
      return res.status(400).json({ message: 'Skill is required' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      if (!user.skills.includes(skill.trim())) {
        user.skills.push(skill.trim());
        // Save to MongoDB
        await user.save();
        console.log('Skill added and saved to MongoDB:', skill.trim(), 'for user:', user._id);
      }
      res.json(user.skills);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove skill from profile
// @route   DELETE /api/profile/skills/:skill
// @access  Private
const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    const user = await User.findById(req.user._id);

    if (user) {
      user.skills = user.skills.filter(s => s.toLowerCase() !== skill.toLowerCase());
      // Save to MongoDB
      await user.save();
      console.log('Skill removed and saved to MongoDB:', skill, 'for user:', user._id);
      res.json(user.skills);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add project to profile
// @route   POST /api/profile/projects
// @access  Private
const addProject = async (req, res) => {
  try {
    const { title, description, technologies } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.projects.push({ title, description, technologies: technologies || [] });
      await user.save();
      res.json(user.projects);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove project from profile
// @route   DELETE /api/profile/projects/:projectId
// @access  Private
const removeProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const user = await User.findById(req.user._id);

    if (user) {
      user.projects = user.projects.filter(p => p._id.toString() !== projectId);
      await user.save();
      res.json(user.projects);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Extract skills from CV using AI
// @route   POST /api/profile/extract-skills
// @access  Private
const extractSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cvText = req.body.cvText || user.cvText;

    if (!cvText || cvText.trim() === '') {
      return res.status(400).json({ message: 'CV text is required' });
    }

    const extracted = await extractSkillsFromCV(cvText, user.skills);

    // Update user with extracted data
    user.extractedSkills = [
      ...new Set([...(extracted.technicalSkills || []), ...(extracted.softSkills || [])])
    ];
    user.suggestedRoles = extracted.suggestedRoles || [];
    
    // Optionally merge with existing skills
    if (req.body.mergeSkills) {
      user.skills = [...new Set([...user.skills, ...user.extractedSkills])];
    }

    // Save the user document to MongoDB
    await user.save();
    
    console.log('User profile saved to MongoDB:', user._id);

    res.json({
      extracted,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        educationLevel: user.educationLevel,
        department: user.department,
        experienceLevel: user.experienceLevel,
        preferredTrack: user.preferredTrack,
        skills: user.skills,
        targetRoles: user.targetRoles,
        projects: user.projects,
        experience: user.experience,
        cvText: user.cvText,
        bio: user.bio,
        generatedSummary: user.generatedSummary,
        extractedSkills: user.extractedSkills,
        suggestedRoles: user.suggestedRoles
      }
    });
  } catch (error) {
    console.error('Skills extraction error:', error);
    res.status(500).json({ message: 'Failed to extract skills', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  addProject,
  removeProject,
  extractSkills
};
