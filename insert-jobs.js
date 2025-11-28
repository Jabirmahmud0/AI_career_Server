const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Job = require('./models/Job.js');

const jobs = [
  {
    title: 'Junior Frontend Developer',
    company: 'TechStart Inc.',
    location: 'Remote',
    description: 'Looking for a passionate frontend developer to join our growing team. You will work on building responsive web applications using modern frameworks.',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$40,000 - $55,000',
    applicationLink: 'https://example.com/apply/frontend-dev'
  },
  {
    title: 'Backend Developer Intern',
    company: 'DataFlow Systems',
    location: 'New York, NY',
    description: 'Join our backend team to learn and contribute to building scalable APIs and microservices.',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'JavaScript'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Web Development',
    salary: '$20/hour',
    applicationLink: 'https://example.com/apply/backend-intern'
  }
];

const insertJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert new jobs
    await Job.insertMany(jobs);
    console.log(`Inserted ${jobs.length} jobs`);

    console.log('Jobs inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting jobs:', error);
    process.exit(1);
  }
};

insertJobs();