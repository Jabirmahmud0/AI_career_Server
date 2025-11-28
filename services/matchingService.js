const Job = require('../models/Job.js');
const LearningResource = require('../models/LearningResource.js');

// Calculate match score between user skills and job requirements
const calculateJobMatchScore = (userSkills, userExperience, userTrack, job) => {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const jobSkillsLower = job.requiredSkills.map(s => s.toLowerCase());
  
  // Find matching and missing skills
  const matchedSkills = jobSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
  
  const missingSkills = job.requiredSkills.filter(skill => 
    !userSkillsLower.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  // Calculate base score from skill overlap (70% weight)
  let skillScore = 0;
  if (jobSkillsLower.length > 0) {
    skillScore = (matchedSkills.length / jobSkillsLower.length) * 70;
  }

  // Experience level match (15% weight)
  let experienceScore = 0;
  const experienceLevels = ['Fresher', 'Junior', 'Mid'];
  const userExpIndex = experienceLevels.indexOf(userExperience);
  const jobExpIndex = experienceLevels.indexOf(job.experienceLevel);
  
  if (userExpIndex >= jobExpIndex) {
    experienceScore = 15;
  } else if (userExpIndex === jobExpIndex - 1) {
    experienceScore = 10;
  } else {
    experienceScore = 5;
  }

  // Track alignment (15% weight)
  let trackScore = 0;
  if (userTrack === job.track) {
    trackScore = 15;
  } else {
    // Partial match for related tracks
    const relatedTracks = {
      'Web Development': ['Mobile Development', 'UI/UX Design'],
      'Data Science': ['Machine Learning', 'DevOps'],
      'Mobile Development': ['Web Development', 'UI/UX Design'],
      'Machine Learning': ['Data Science', 'DevOps'],
      'UI/UX Design': ['Web Development', 'Digital Marketing'],
      'Digital Marketing': ['UI/UX Design', 'Project Management'],
      'DevOps': ['Web Development', 'Cybersecurity'],
      'Cybersecurity': ['DevOps', 'Data Science'],
      'Project Management': ['Digital Marketing', 'Other']
    };
    
    if (relatedTracks[userTrack]?.includes(job.track)) {
      trackScore = 8;
    }
  }

  const totalScore = Math.round(skillScore + experienceScore + trackScore);

  return {
    score: Math.min(totalScore, 100),
    matchedSkills: job.requiredSkills.filter(skill => 
      userSkillsLower.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ),
    missingSkills,
    reasons: generateMatchReasons(matchedSkills, missingSkills, userExperience, job)
  };
};

// Generate human-readable match reasons
const generateMatchReasons = (matchedSkills, missingSkills, userExperience, job) => {
  const reasons = [];
  
  if (matchedSkills.length > 0) {
    reasons.push(`Matches: ${matchedSkills.slice(0, 5).join(', ')}`);
  }
  
  if (missingSkills.length > 0) {
    reasons.push(`Missing: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  
  if (userExperience === job.experienceLevel) {
    reasons.push(`Experience level matches (${job.experienceLevel})`);
  }
  
  return reasons;
};

// Get recommended jobs for user
const getRecommendedJobs = async (user, limit = 10) => {
  try {
    const jobs = await Job.find({ isActive: true });
    
    // Return empty array if no jobs found
    if (!jobs || jobs.length === 0) {
      return [];
    }
    
    const jobsWithScores = jobs.map(job => {
      const matchResult = calculateJobMatchScore(
        user.skills || [],
        user.experienceLevel,
        user.preferredTrack,
        job
      );
      
      return {
        job: job.toObject(),
        ...matchResult
      };
    });

    // Sort by score and return top matches
    return jobsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getRecommendedJobs:', error);
    return [];
  }
};

// Get learning resources for missing skills
const getResourcesForSkillGaps = async (missingSkills, limit = 5) => {
  try {
    // Handle case where missingSkills is null, undefined, or empty
    if (!missingSkills || missingSkills.length === 0) {
      return [];
    }
    
    // Filter out any null or undefined skills
    const validSkills = missingSkills.filter(skill => skill && typeof skill === 'string');
    
    if (validSkills.length === 0) {
      return [];
    }

    const resources = await LearningResource.find({
      relatedSkills: {
        $in: validSkills.map(skill => new RegExp(skill, 'i'))
      }
    }).limit(limit);

    return resources;
  } catch (error) {
    console.error('Error in getResourcesForSkillGaps:', error);
    return [];
  }
};

// Get recommended resources based on user skills and interests
const getRecommendedResources = async (user, limit = 10) => {
  try {
    const userSkills = user.skills || [];
    const targetRoles = user.targetRoles || [];
    const preferredTrack = user.preferredTrack;
    
    // Build query conditions
    const queryConditions = [];
    
    if (preferredTrack) {
      queryConditions.push({ track: preferredTrack });
    }
    
    // Only add skills condition if user has skills
    if (userSkills && userSkills.length > 0) {
      // Filter out any null or undefined skills
      const validSkills = userSkills.filter(skill => skill && typeof skill === 'string');
      
      if (validSkills.length > 0) {
        queryConditions.push({ 
          relatedSkills: { $in: validSkills.map(s => new RegExp(s, 'i')) } 
        });
      }
    }
    
    // If no conditions, return empty array
    if (queryConditions.length === 0) {
      return [];
    }

    // Find resources matching user's track and skills they want to improve
    const resources = await LearningResource.find({
      $or: queryConditions
    }).limit(limit * 2);
    
    // If no resources found, return empty array
    if (!resources || resources.length === 0) {
      return [];
    }

    // Score and sort resources
    const scoredResources = resources.map(resource => {
      let score = 0;
      
      // Track match
      if (resource.track === preferredTrack) score += 30;
      
      // Skill relevance
      const matchingSkills = resource.relatedSkills.filter(skill =>
        userSkills.some(userSkill => 
          userSkill && typeof userSkill === 'string' && 
          skill && typeof skill === 'string' &&
          (userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase()))
        )
      );
      score += matchingSkills.length * 10;
      
      // Prefer free resources
      if (resource.cost === 'Free') score += 15;
      if (resource.cost === 'Freemium') score += 10;
      
      // Consider difficulty based on experience
      const difficultyMap = {
        'Fresher': 'Beginner',
        'Junior': 'Intermediate',
        'Mid': 'Advanced'
      };
      if (resource.difficulty === difficultyMap[user.experienceLevel]) score += 10;
      
      return {
        resource: resource.toObject(),
        score,
        matchingSkills
      };
    });

    return scoredResources
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getRecommendedResources:', error);
    return [];
  }
};

// Get job platforms based on job type and location
const getJobPlatforms = (jobType, location) => {
  const platforms = [];
  
  // Add general job platforms
  platforms.push({
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/',
    description: 'Professional networking and job search platform'
  });
  
  // Add location-specific platforms
  if (location.toLowerCase().includes('remote')) {
    platforms.push({
      name: 'Remote.co',
      url: 'https://remote.co/remote-jobs/',
      description: 'Remote job opportunities'
    });
    
    platforms.push({
      name: 'We Work Remotely',
      url: 'https://weworkremotely.com/',
      description: 'Remote jobs in tech and design'
    });
  }
  
  // Add job type specific platforms
  if (jobType === 'Internship') {
    platforms.push({
      name: 'Internshala',
      url: 'https://internshala.com/internships/',
      description: 'Internship opportunities for students'
    });
    
    platforms.push({
      name: 'Chegg Internships',
      url: 'https://www.internships.com/',
      description: 'Internship listings across various fields'
    });
  }
  
  if (jobType === 'Full-time') {
    platforms.push({
      name: 'Indeed',
      url: 'https://www.indeed.com/',
      description: 'Comprehensive job search engine'
    });
    
    platforms.push({
      name: 'Glassdoor',
      url: 'https://www.glassdoor.com/index.htm',
      description: 'Job listings with company reviews and salary info'
    });
  }
  
  // Add tech-specific platforms
  platforms.push({
    name: 'AngelList',
    url: 'https://angel.co/jobs',
    description: 'Startup jobs and networking'
  });
  
  platforms.push({
    name: 'Stack Overflow Jobs',
    url: 'https://stackoverflow.com/jobs',
    description: 'Developer-focused job board'
  });
  
  return platforms;
};

module.exports = {
  calculateJobMatchScore,
  getRecommendedJobs,
  getResourcesForSkillGaps,
  getRecommendedResources,
  getJobPlatforms
};