const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid'],
    default: 'Fresher'
  },
  jobType: {
    type: String,
    enum: ['Internship', 'Part-time', 'Full-time', 'Freelance'],
    default: 'Full-time'
  },
  track: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Digital Marketing', 'DevOps', 'Cybersecurity', 'Project Management', 'Other'],
    default: 'Web Development'
  },
  salary: {
    type: String,
    default: 'Competitive'
  },
  applicationLink: {
    type: String,
    default: ''
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Job', jobSchema);
