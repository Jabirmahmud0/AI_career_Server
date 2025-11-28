const Job = require('../models/Job.js');
const { getRecommendedJobs, getResourcesForSkillGaps, getJobPlatforms, calculateJobMatchScore } = require('../services/matchingService.js');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { track, location, jobType, experienceLevel, search } = req.query;

    let query = { isActive: true };

    if (track) query.track = track;
    if (location) query.location = new RegExp(location, 'i');
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const jobs = await Job.find(query).sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recommended jobs for user
// @route   GET /api/jobs/recommended
// @access  Private
const getRecommendedJobsForUser = async (req, res) => {
  try {
    // Validate user object
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await getRecommendedJobs(req.user, limit);

    // For each job with missing skills, get learning resources
    const recommendationsWithResources = await Promise.all(
      recommendations.map(async (rec) => {
        try {
          const resources = await getResourcesForSkillGaps(rec.missingSkills, 3);
          return {
            ...rec,
            suggestedResources: resources
          };
        } catch (resourceError) {
          console.error('Error fetching resources for job:', resourceError);
          return {
            ...rec,
            suggestedResources: []
          };
        }
      })
    );

    res.json(recommendationsWithResources);
  } catch (error) {
    console.error('Error in getRecommendedJobsForUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job with match analysis for user
// @route   GET /api/jobs/:id/analysis
// @access  Private
const getJobAnalysis = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const matchResult = calculateJobMatchScore(
      req.user.skills || [],
      req.user.experienceLevel,
      req.user.preferredTrack,
      job
    );

    const resources = await getResourcesForSkillGaps(matchResult.missingSkills, 5);
    
    // Get job platforms based on job type and location
    const jobPlatforms = getJobPlatforms(job.jobType, job.location);

    res.json({
      job,
      analysis: matchResult,
      suggestedResources: resources,
      jobPlatforms: jobPlatforms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  getRecommendedJobsForUser,
  getJobAnalysis
};