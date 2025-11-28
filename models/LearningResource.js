const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['YouTube', 'Coursera', 'Udemy', 'edX', 'freeCodeCamp', 'LinkedIn Learning', 'Pluralsight', 'Khan Academy', 'Other'],
    default: 'YouTube'
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  relatedSkills: [{
    type: String,
    trim: true
  }],
  cost: {
    type: String,
    enum: ['Free', 'Paid', 'Freemium'],
    default: 'Free'
  },
  duration: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  track: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Digital Marketing', 'DevOps', 'Cybersecurity', 'Project Management', 'Other'],
    default: 'Web Development'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  }
});

module.exports = mongoose.model('LearningResource', learningResourceSchema);
