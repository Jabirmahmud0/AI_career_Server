const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  educationLevel: {
    type: String,
    enum: ['High School', 'Diploma', 'Bachelor', 'Master', 'PhD', 'Other'],
    default: 'Bachelor'
  },
  department: {
    type: String,
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid'],
    default: 'Fresher'
  },
  preferredTrack: {
    type: String,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Digital Marketing', 'DevOps', 'Cybersecurity', 'Project Management', 'Other'],
    default: 'Web Development'
  },
  skills: [{
    type: String,
    trim: true
  }],
  targetRoles: [{
    type: String,
    trim: true
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String]
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  cvText: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  generatedSummary: {
    type: String,
    default: ''
  },
  extractedSkills: [{
    type: String,
    trim: true
  }],
  suggestedRoles: [{
    type: String,
    trim: true
  }],
  savedRoadmaps: [{
    targetRole: String,
    timeframe: String,
    hoursPerWeek: Number,
    roadmap: Object,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Log when saving
  console.log('Saving user document:', this._id);
  
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add a post-save hook to log successful saves
userSchema.post('save', function(doc) {
  console.log('User document saved successfully:', doc._id);
});

module.exports = mongoose.model('User', userSchema);
