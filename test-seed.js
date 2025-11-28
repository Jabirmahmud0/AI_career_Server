const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Job = require('./models/Job.js');
const LearningResource = require('./models/LearningResource.js');

const testJob = {
  title: 'Test Job',
  company: 'Test Company',
  location: 'Test Location',
  description: 'This is a test job for debugging purposes.',
  requiredSkills: ['JavaScript', 'React', 'Node.js'],
  experienceLevel: 'Fresher',
  jobType: 'Full-time',
  track: 'Web Development',
  salary: '$50,000 - $60,000',
  applicationLink: 'https://example.com/apply/test-job'
};

const testResource = {
  title: 'Test Resource',
  platform: 'Test Platform',
  url: 'https://example.com/test-resource',
  description: 'This is a test resource for debugging purposes.',
  relatedSkills: ['JavaScript', 'React'],
  cost: 'Free',
  duration: '5 hours',
  difficulty: 'Beginner',
  track: 'Web Development',
  rating: 4.5
};

const seedTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing test data
    await Job.deleteMany({ title: 'Test Job' });
    await LearningResource.deleteMany({ title: 'Test Resource' });
    console.log('Cleared existing test data');

    // Insert test data
    await Job.create(testJob);
    console.log('Inserted test job');

    await LearningResource.create(testResource);
    console.log('Inserted test resource');

    console.log('Test data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
};

seedTestData();