const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Job = require('../models/Job.js');
const LearningResource = require('../models/LearningResource.js');

const jobs = [
  // Existing jobs (20)
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
  },
  {
    title: 'Full Stack Developer',
    company: 'InnovateTech',
    location: 'San Francisco, CA',
    description: 'Seeking a full stack developer with experience in both frontend and backend technologies.',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$65,000 - $85,000',
    applicationLink: 'https://example.com/apply/fullstack'
  },
  {
    title: 'Data Analyst Intern',
    company: 'Analytics Pro',
    location: 'Remote',
    description: 'Great opportunity for aspiring data analysts to work with real datasets and learn data visualization.',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Data Visualization', 'Statistics'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Data Science',
    salary: '$18/hour',
    applicationLink: 'https://example.com/apply/data-intern'
  },
  {
    title: 'Junior Data Scientist',
    company: 'ML Solutions',
    location: 'Boston, MA',
    description: 'Join our data science team to work on machine learning projects and predictive analytics.',
    requiredSkills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn', 'SQL'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$70,000 - $90,000',
    applicationLink: 'https://example.com/apply/data-scientist'
  },
  {
    title: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'Austin, TX',
    description: 'Looking for a creative UI/UX designer to create beautiful and intuitive user interfaces.',
    requiredSkills: ['Figma', 'Adobe XD', 'UI Design', 'User Research', 'Prototyping'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'UI/UX Design',
    salary: '$45,000 - $60,000',
    applicationLink: 'https://example.com/apply/uiux'
  },
  {
    title: 'Mobile App Developer',
    company: 'AppWorks',
    location: 'Seattle, WA',
    description: 'Develop cross-platform mobile applications using React Native.',
    requiredSkills: ['React Native', 'JavaScript', 'Mobile Development', 'REST API', 'Git'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$60,000 - $80,000',
    applicationLink: 'https://example.com/apply/mobile-dev'
  },
  {
    title: 'Digital Marketing Intern',
    company: 'GrowthMarketing Co.',
    location: 'Remote',
    description: 'Learn digital marketing strategies including SEO, social media, and content marketing.',
    requiredSkills: ['Social Media', 'SEO', 'Content Writing', 'Google Analytics', 'Marketing'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Digital Marketing',
    salary: '$15/hour',
    applicationLink: 'https://example.com/apply/marketing-intern'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Denver, CO',
    description: 'Help build and maintain CI/CD pipelines and cloud infrastructure.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'DevOps',
    salary: '$75,000 - $95,000',
    applicationLink: 'https://example.com/apply/devops'
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Washington, DC',
    description: 'Monitor and protect organization systems from security threats.',
    requiredSkills: ['Network Security', 'Linux', 'Python', 'Security Tools', 'Risk Assessment'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Cybersecurity',
    salary: '$65,000 - $85,000',
    applicationLink: 'https://example.com/apply/security'
  },
  {
    title: 'Project Coordinator',
    company: 'ProjectPro',
    location: 'Chicago, IL',
    description: 'Assist in managing software development projects and team coordination.',
    requiredSkills: ['Project Management', 'Agile', 'Communication', 'JIRA', 'Documentation'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Project Management',
    salary: '$45,000 - $55,000',
    applicationLink: 'https://example.com/apply/project-coord'
  },
  {
    title: 'Machine Learning Engineer Intern',
    company: 'AI Innovations',
    location: 'Remote',
    description: 'Work on cutting-edge ML projects including NLP and computer vision.',
    requiredSkills: ['Python', 'TensorFlow', 'Deep Learning', 'Mathematics', 'NumPy'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Machine Learning',
    salary: '$25/hour',
    applicationLink: 'https://example.com/apply/ml-intern'
  },
  {
    title: 'WordPress Developer',
    company: 'WebAgency',
    location: 'Remote',
    description: 'Build and customize WordPress websites for various clients.',
    requiredSkills: ['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript'],
    experienceLevel: 'Fresher',
    jobType: 'Freelance',
    track: 'Web Development',
    salary: '$25-40/hour',
    applicationLink: 'https://example.com/apply/wordpress'
  },
  {
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Portland, OR',
    description: 'Ensure software quality through manual and automated testing.',
    requiredSkills: ['Testing', 'Selenium', 'JavaScript', 'Test Cases', 'Bug Tracking'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$55,000 - $70,000',
    applicationLink: 'https://example.com/apply/qa'
  },
  {
    title: 'Content Writer',
    company: 'ContentKing',
    location: 'Remote',
    description: 'Create engaging content for tech blogs and marketing materials.',
    requiredSkills: ['Content Writing', 'SEO', 'Research', 'Communication', 'Editing'],
    experienceLevel: 'Fresher',
    jobType: 'Part-time',
    track: 'Digital Marketing',
    salary: '$20/hour',
    applicationLink: 'https://example.com/apply/content-writer'
  },
  {
    title: 'iOS Developer',
    company: 'AppleTech Solutions',
    location: 'Cupertino, CA',
    description: 'Build native iOS applications using Swift and SwiftUI.',
    requiredSkills: ['Swift', 'iOS', 'Xcode', 'UIKit', 'SwiftUI'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$70,000 - $90,000',
    applicationLink: 'https://example.com/apply/ios-dev'
  },
  {
    title: 'Business Intelligence Analyst',
    company: 'DataDriven Inc.',
    location: 'Minneapolis, MN',
    description: 'Create dashboards and reports to drive business decisions.',
    requiredSkills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Data Analysis'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$60,000 - $75,000',
    applicationLink: 'https://example.com/apply/bi-analyst'
  },
  {
    title: 'Graphic Designer',
    company: 'CreativeStudio',
    location: 'Los Angeles, CA',
    description: 'Design visual content for digital and print media.',
    requiredSkills: ['Photoshop', 'Illustrator', 'Graphic Design', 'Typography', 'Creativity'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'UI/UX Design',
    salary: '$40,000 - $55,000',
    applicationLink: 'https://example.com/apply/graphic-designer'
  },
  {
    title: 'Cloud Engineer Intern',
    company: 'CloudNative',
    location: 'Remote',
    description: 'Learn cloud computing and help manage cloud infrastructure.',
    requiredSkills: ['AWS', 'Linux', 'Networking', 'Python', 'Cloud Computing'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'DevOps',
    salary: '$22/hour',
    applicationLink: 'https://example.com/apply/cloud-intern'
  },
  {
    title: 'Technical Support Specialist',
    company: 'TechHelp Inc.',
    location: 'Phoenix, AZ',
    description: 'Provide technical support and troubleshooting for software products.',
    requiredSkills: ['Technical Support', 'Communication', 'Problem Solving', 'Documentation', 'Customer Service'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Other',
    salary: '$35,000 - $45,000',
    applicationLink: 'https://example.com/apply/tech-support'
  },
  
  // Additional jobs (65)
  // Web Development Jobs (15)
  {
    title: 'Senior Frontend Developer',
    company: 'TechGiant Inc.',
    location: 'San Francisco, CA',
    description: 'Lead frontend development initiatives using React, Vue.js, and modern JavaScript frameworks. Mentor junior developers and architect scalable frontend solutions.',
    requiredSkills: ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Webpack', 'Git'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$120,000 - $150,000',
    applicationLink: 'https://example.com/apply/senior-frontend'
  },
  {
    title: 'Backend Engineer',
    company: 'CloudSystems Ltd.',
    location: 'Remote',
    description: 'Design and implement scalable backend services using Node.js and Python. Work with distributed systems and microservices architecture.',
    requiredSkills: ['Node.js', 'Python', 'Express', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$85,000 - $110,000',
    applicationLink: 'https://example.com/apply/backend-engineer'
  },
  {
    title: 'Full Stack Developer',
    company: 'InnovateSoft',
    location: 'Austin, TX',
    description: 'Develop end-to-end web applications with modern technologies. Collaborate with designers and product managers to deliver exceptional user experiences.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express', 'GraphQL', 'AWS', 'TypeScript'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$75,000 - $95,000',
    applicationLink: 'https://example.com/apply/fullstack-dev'
  },
  {
    title: 'Frontend Intern',
    company: 'StartupHub',
    location: 'New York, NY',
    description: 'Learn modern frontend development practices while contributing to real projects. Gain hands-on experience with React and responsive design.',
    requiredSkills: ['JavaScript', 'HTML', 'CSS', 'React', 'Git'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Web Development',
    salary: '$20 - $25/hour',
    applicationLink: 'https://example.com/apply/frontend-intern'
  },
  {
    title: 'WordPress Developer',
    company: 'WebCreators Agency',
    location: 'Remote',
    description: 'Build and customize WordPress themes and plugins for clients. Optimize sites for performance and SEO.',
    requiredSkills: ['WordPress', 'PHP', 'JavaScript', 'HTML', 'CSS', 'MySQL'],
    experienceLevel: 'Fresher',
    jobType: 'Freelance',
    track: 'Web Development',
    salary: '$30 - $50/hour',
    applicationLink: 'https://example.com/apply/wordpress-dev'
  },
  {
    title: 'JavaScript Developer',
    company: 'CodeCrafters',
    location: 'Seattle, WA',
    description: 'Work on complex JavaScript applications and libraries. Contribute to open-source projects and mentor newcomers.',
    requiredSkills: ['JavaScript', 'Node.js', 'ES6+', 'NPM', 'Testing', 'Performance Optimization'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$80,000 - $100,000',
    applicationLink: 'https://example.com/apply/js-developer'
  },
  {
    title: 'React Developer',
    company: 'ComponentCorp',
    location: 'Boston, MA',
    description: 'Build reusable React components and maintain large-scale React applications. Work with Redux and modern state management.',
    requiredSkills: ['React', 'Redux', 'Hooks', 'Context API', 'Jest', 'Webpack'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$90,000 - $115,000',
    applicationLink: 'https://example.com/apply/react-dev'
  },
  {
    title: 'Vue.js Developer',
    company: 'VueVision',
    location: 'Remote',
    description: 'Develop Vue.js applications with Vuex and Vue Router. Collaborate with UI/UX designers to implement pixel-perfect interfaces.',
    requiredSkills: ['Vue.js', 'Vuex', 'Vue Router', 'JavaScript', 'SCSS', 'Nuxt.js'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$70,000 - $90,000',
    applicationLink: 'https://example.com/apply/vue-dev'
  },
  {
    title: 'Angular Developer',
    company: 'FrameworkForge',
    location: 'Chicago, IL',
    description: 'Build enterprise Angular applications with TypeScript. Implement complex forms, routing, and state management.',
    requiredSkills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Material Design', 'Jasmine'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$85,000 - $105,000',
    applicationLink: 'https://example.com/apply/angular-dev'
  },
  {
    title: 'Web Performance Engineer',
    company: 'SpeedOptimize',
    location: 'Denver, CO',
    description: 'Optimize web applications for speed and performance. Analyze Core Web Vitals and implement improvements.',
    requiredSkills: ['Performance Optimization', 'Lighthouse', 'WebPack', 'Lazy Loading', 'CDN', 'Caching'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$95,000 - $120,000',
    applicationLink: 'https://example.com/apply/performance-eng'
  },
  {
    title: 'Web Accessibility Specialist',
    company: 'InclusiveWeb',
    location: 'Remote',
    description: 'Ensure web applications meet accessibility standards (WCAG). Conduct audits and implement accessible UI components.',
    requiredSkills: ['Accessibility', 'WCAG', 'ARIA', 'Screen Readers', 'axe', 'Section 508'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$65,000 - $80,000',
    applicationLink: 'https://example.com/apply/accessibility-spec'
  },
  {
    title: 'DevOps Engineer - Web',
    company: 'DeployMasters',
    location: 'Portland, OR',
    description: 'Manage CI/CD pipelines for web applications. Implement monitoring and logging solutions.',
    requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$90,000 - $115,000',
    applicationLink: 'https://example.com/apply/web-devops'
  },
  {
    title: 'Web Security Engineer',
    company: 'SecureWeb',
    location: 'Washington, DC',
    description: 'Implement security measures for web applications. Conduct penetration testing and vulnerability assessments.',
    requiredSkills: ['Web Security', 'OWASP', 'Penetration Testing', 'Encryption', 'CSP', 'XSS'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$100,000 - $130,000',
    applicationLink: 'https://example.com/apply/web-security'
  },
  {
    title: 'Web QA Engineer',
    company: 'QualityWeb',
    location: 'Atlanta, GA',
    description: 'Test web applications for functionality, usability, and performance. Automate testing workflows.',
    requiredSkills: ['Testing', 'Selenium', 'Cypress', 'Jest', 'Manual Testing', 'Bug Reporting'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$60,000 - $75,000',
    applicationLink: 'https://example.com/apply/web-qa'
  },
  {
    title: 'Technical Lead - Web Team',
    company: 'TechLeaders',
    location: 'San Jose, CA',
    description: 'Lead a team of web developers in building scalable applications. Architect technical solutions and guide development practices.',
    requiredSkills: ['Leadership', 'Architecture', 'React', 'Node.js', 'System Design', 'Mentoring'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Web Development',
    salary: '$130,000 - $160,000',
    applicationLink: 'https://example.com/apply/web-techlead'
  },

  // Mobile Development Jobs (10)
  {
    title: 'Senior Android Developer',
    company: 'AndroidMasters',
    location: 'Mountain View, CA',
    description: 'Lead Android application development using Kotlin and Java. Architect scalable mobile solutions and mentor team members.',
    requiredSkills: ['Android', 'Kotlin', 'Java', 'MVVM', 'Room', 'Retrofit', 'Firebase'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$125,000 - $155,000',
    applicationLink: 'https://example.com/apply/senior-android'
  },
  {
    title: 'iOS Developer',
    company: 'AppleEnthusiasts',
    location: 'Cupertino, CA',
    description: 'Develop native iOS applications using Swift and SwiftUI. Work on innovative features for iPhone and iPad.',
    requiredSkills: ['iOS', 'Swift', 'SwiftUI', 'Xcode', 'CoreData', 'UIKit'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$90,000 - $115,000',
    applicationLink: 'https://example.com/apply/ios-dev-2'
  },
  {
    title: 'React Native Developer',
    company: 'CrossPlatform Solutions',
    location: 'Remote',
    description: 'Build cross-platform mobile applications using React Native. Work on both iOS and Android platforms.',
    requiredSkills: ['React Native', 'JavaScript', 'Redux', 'Native Modules', 'Push Notifications'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$75,000 - $95,000',
    applicationLink: 'https://example.com/apply/react-native'
  },
  {
    title: 'Flutter Developer',
    company: 'DartExperts',
    location: 'London, UK',
    description: 'Create beautiful mobile applications using Flutter and Dart. Work on complex UI implementations and animations.',
    requiredSkills: ['Flutter', 'Dart', 'Bloc', 'GetX', 'Animations', 'Firebase'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$70,000 - $90,000',
    applicationLink: 'https://example.com/apply/flutter-dev'
  },
  {
    title: 'Mobile App Tester',
    company: 'AppQuality Labs',
    location: 'Remote',
    description: 'Test mobile applications across different devices and platforms. Report bugs and ensure quality releases.',
    requiredSkills: ['Mobile Testing', 'Appium', 'Espresso', 'XCUITest', 'Bug Reporting'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$55,000 - $70,000',
    applicationLink: 'https://example.com/apply/mobile-tester'
  },
  {
    title: 'Mobile DevOps Engineer',
    company: 'MobileDeploy',
    location: 'Austin, TX',
    description: 'Manage CI/CD pipelines for mobile applications. Automate build and deployment processes.',
    requiredSkills: ['Mobile CI/CD', 'Fastlane', 'Bitrise', 'Jenkins', 'App Store', 'Play Store'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$95,000 - $120,000',
    applicationLink: 'https://example.com/apply/mobile-devops'
  },
  {
    title: 'Mobile Security Specialist',
    company: 'SecureMobile',
    location: 'Washington, DC',
    description: 'Ensure mobile applications meet security standards. Conduct security audits and implement protection measures.',
    requiredSkills: ['Mobile Security', 'OWASP Mobile', 'Encryption', 'Certificate Pinning', 'Biometrics'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$105,000 - $135,000',
    applicationLink: 'https://example.com/apply/mobile-security'
  },
  {
    title: 'Mobile UX Designer',
    company: 'MobileExperience',
    location: 'San Francisco, CA',
    description: 'Design intuitive and engaging mobile user experiences. Create wireframes and prototypes for mobile apps.',
    requiredSkills: ['Mobile UX', 'Figma', 'Sketch', 'Prototyping', 'User Research', 'Interaction Design'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$70,000 - $85,000',
    applicationLink: 'https://example.com/apply/mobile-ux'
  },
  {
    title: 'Mobile Architect',
    company: 'ArchitectSolutions',
    location: 'New York, NY',
    description: 'Architect scalable mobile solutions and define technical standards. Guide development teams on best practices.',
    requiredSkills: ['Mobile Architecture', 'Microservices', 'Offline First', 'Push Architecture', 'Performance'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Mobile Development',
    salary: '$140,000 - $170,000',
    applicationLink: 'https://example.com/apply/mobile-architect'
  },
  {
    title: 'Mobile Intern',
    company: 'FutureMobile',
    location: 'Remote',
    description: 'Learn mobile development by working on real projects. Get mentored by experienced mobile engineers.',
    requiredSkills: ['Mobile Development', 'Java/Kotlin or Swift', 'Basic Programming', 'Git'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Mobile Development',
    salary: '$18 - $22/hour',
    applicationLink: 'https://example.com/apply/mobile-intern'
  },

  // Data Science Jobs (10)
  {
    title: 'Senior Data Scientist',
    company: 'DataInsights Inc.',
    location: 'San Francisco, CA',
    description: 'Lead data science initiatives and build machine learning models. Drive data-driven decision making across the organization.',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$130,000 - $160,000',
    applicationLink: 'https://example.com/apply/senior-ds'
  },
  {
    title: 'Data Analyst',
    company: 'Analytica Corp',
    location: 'Chicago, IL',
    description: 'Analyze business data to provide actionable insights. Create dashboards and reports for stakeholders.',
    requiredSkills: ['SQL', 'Python', 'Excel', 'Tableau', 'Power BI', 'Statistics'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$65,000 - $80,000',
    applicationLink: 'https://example.com/apply/data-analyst'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AILabs',
    location: 'Seattle, WA',
    description: 'Deploy and maintain machine learning models in production. Work with big data and cloud platforms.',
    requiredSkills: ['Python', 'Machine Learning', 'Scikit-learn', 'TensorFlow', 'AWS', 'Docker'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$100,000 - $125,000',
    applicationLink: 'https://example.com/apply/ml-engineer'
  },
  {
    title: 'Data Engineer',
    company: 'DataPipeline Co.',
    location: 'Remote',
    description: 'Build and maintain data pipelines and warehouses. Ensure data quality and reliability for analytics.',
    requiredSkills: ['Python', 'SQL', 'Apache Spark', 'Airflow', 'AWS Redshift', 'Kafka'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$90,000 - $115,000',
    applicationLink: 'https://example.com/apply/data-engineer'
  },
  {
    title: 'Business Intelligence Analyst',
    company: 'BizIntel Solutions',
    location: 'Boston, MA',
    description: 'Create business intelligence reports and dashboards. Translate data into strategic business recommendations.',
    requiredSkills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Data Modeling', 'KPIs'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$70,000 - $85,000',
    applicationLink: 'https://example.com/apply/bi-analyst-2'
  },
  {
    title: 'Data Science Intern',
    company: 'LearnData',
    location: 'Mountain View, CA',
    description: 'Learn data science techniques while working on real projects. Get mentored by experienced data scientists.',
    requiredSkills: ['Python', 'Statistics', 'SQL', 'Pandas', 'Basic ML'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Data Science',
    salary: '$25 - $30/hour',
    applicationLink: 'https://example.com/apply/ds-intern'
  },
  {
    title: 'NLP Engineer',
    company: 'LanguageTech',
    location: 'Remote',
    description: 'Build natural language processing systems and chatbots. Work with transformer models and language understanding.',
    requiredSkills: ['Python', 'NLP', 'Transformers', 'BERT', 'spaCy', 'NLTK'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$110,000 - $135,000',
    applicationLink: 'https://example.com/apply/nlp-engineer'
  },
  {
    title: 'Computer Vision Engineer',
    company: 'Visionary AI',
    location: 'San Diego, CA',
    description: 'Develop computer vision applications and image recognition systems. Work with CNNs and deep learning frameworks.',
    requiredSkills: ['Python', 'Computer Vision', 'OpenCV', 'CNN', 'TensorFlow', 'PyTorch'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$115,000 - $140,000',
    applicationLink: 'https://example.com/apply/cv-engineer'
  },
  {
    title: 'Data Science Manager',
    company: 'DataLeaders',
    location: 'New York, NY',
    description: 'Lead a team of data scientists and analysts. Define data strategy and drive innovation in analytics.',
    requiredSkills: ['Leadership', 'Data Strategy', 'Machine Learning', 'Team Management', 'Communication'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$150,000 - $180,000',
    applicationLink: 'https://example.com/apply/ds-manager'
  },
  {
    title: 'Research Scientist - AI',
    company: 'ResearchAI',
    location: 'Cambridge, MA',
    description: 'Conduct cutting-edge research in artificial intelligence and machine learning. Publish papers and advance the field.',
    requiredSkills: ['Research', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Publications', 'PhD'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Data Science',
    salary: '$140,000 - $170,000',
    applicationLink: 'https://example.com/apply/research-scientist'
  },

  // Machine Learning Jobs (5)
  {
    title: 'ML Research Engineer',
    company: 'DeepMind Technologies',
    location: 'London, UK',
    description: 'Research and implement novel machine learning algorithms. Work on pushing the boundaries of AI capabilities.',
    requiredSkills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'PyTorch', 'Research'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Machine Learning',
    salary: '$145,000 - $175,000',
    applicationLink: 'https://example.com/apply/ml-research'
  },
  {
    title: 'Applied ML Engineer',
    company: 'PracticalAI Solutions',
    location: 'Remote',
    description: 'Apply machine learning techniques to solve real-world business problems. Deploy models to production environments.',
    requiredSkills: ['Machine Learning', 'Python', 'Scikit-learn', 'Deployment', 'AWS', 'Docker'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Machine Learning',
    salary: '$95,000 - $120,000',
    applicationLink: 'https://example.com/apply/applied-ml'
  },
  {
    title: 'ML Intern',
    company: 'LearningML',
    location: 'Stanford, CA',
    description: 'Learn machine learning by working on practical projects. Get hands-on experience with real datasets.',
    requiredSkills: ['Python', 'Basic ML', 'Mathematics', 'Statistics', 'Pandas'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Machine Learning',
    salary: '$28 - $35/hour',
    applicationLink: 'https://example.com/apply/ml-intern-2'
  },
  {
    title: 'MLOps Engineer',
    company: 'ModelDeploy',
    location: 'Seattle, WA',
    description: 'Build and maintain ML infrastructure and deployment pipelines. Ensure reliable model serving and monitoring.',
    requiredSkills: ['MLOps', 'Docker', 'Kubernetes', 'MLflow', 'AWS SageMaker', 'CI/CD'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Machine Learning',
    salary: '$110,000 - $135,000',
    applicationLink: 'https://example.com/apply/mlops-engineer'
  },
  {
    title: 'Reinforcement Learning Engineer',
    company: 'RL Innovations',
    location: 'Montreal, Canada',
    description: 'Develop reinforcement learning systems for autonomous agents and decision-making applications.',
    requiredSkills: ['Reinforcement Learning', 'Python', 'PyTorch', 'OpenAI Gym', 'Deep RL', 'Algorithms'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Machine Learning',
    salary: '$120,000 - $150,000',
    applicationLink: 'https://example.com/apply/rl-engineer'
  },

  // UI/UX Design Jobs (5)
  {
    title: 'Senior UX Designer',
    company: 'ExperienceMatters',
    location: 'San Francisco, CA',
    description: 'Lead user experience design initiatives and research. Create intuitive and delightful user experiences.',
    requiredSkills: ['UX Design', 'User Research', 'Figma', 'Prototyping', 'Usability Testing', 'Information Architecture'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'UI/UX Design',
    salary: '$110,000 - $140,000',
    applicationLink: 'https://example.com/apply/senior-ux'
  },
  {
    title: 'UI Designer',
    company: 'VisualAppeal',
    location: 'Remote',
    description: 'Create beautiful and functional user interfaces for web and mobile applications. Work with design systems.',
    requiredSkills: ['UI Design', 'Figma', 'Sketch', 'Design Systems', 'Typography', 'Color Theory'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'UI/UX Design',
    salary: '$70,000 - $85,000',
    applicationLink: 'https://example.com/apply/ui-designer'
  },
  {
    title: 'Product Designer',
    company: 'ProductCraft',
    location: 'New York, NY',
    description: 'Design end-to-end product experiences from concept to launch. Collaborate with product managers and engineers.',
    requiredSkills: ['Product Design', 'Figma', 'User Flows', 'Wireframing', 'Prototyping', 'Design Thinking'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'UI/UX Design',
    salary: '$85,000 - $105,000',
    applicationLink: 'https://example.com/apply/product-designer'
  },
  {
    title: 'UX Researcher',
    company: 'UserInsights',
    location: 'Remote',
    description: 'Conduct user research to inform product design decisions. Create research plans and share findings.',
    requiredSkills: ['User Research', 'Interviews', 'Surveys', 'Analytics', 'Persona Creation', 'Research Planning'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'UI/UX Design',
    salary: '$75,000 - $90,000',
    applicationLink: 'https://example.com/apply/ux-researcher'
  },
  {
    title: 'Design Intern',
    company: 'DesignLearning',
    location: 'Los Angeles, CA',
    description: 'Learn UI/UX design principles while working on real projects. Get mentored by senior designers.',
    requiredSkills: ['Design Principles', 'Figma', 'Basic Prototyping', 'Creativity', 'Communication'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'UI/UX Design',
    salary: '$20 - $25/hour',
    applicationLink: 'https://example.com/apply/design-intern'
  },

  // Digital Marketing Jobs (5)
  {
    title: 'Digital Marketing Manager',
    company: 'MarketingPros',
    location: 'Chicago, IL',
    description: 'Lead digital marketing campaigns across channels. Analyze performance and optimize strategies for growth.',
    requiredSkills: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Analytics', 'Campaign Management'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Digital Marketing',
    salary: '$80,000 - $100,000',
    applicationLink: 'https://example.com/apply/digital-marketing-manager'
  },
  {
    title: 'SEO Specialist',
    company: 'SearchMasters',
    location: 'Remote',
    description: 'Optimize websites for search engines and improve organic traffic. Conduct keyword research and competitor analysis.',
    requiredSkills: ['SEO', 'Google Analytics', 'Keyword Research', 'Content Optimization', 'Link Building'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Digital Marketing',
    salary: '$55,000 - $70,000',
    applicationLink: 'https://example.com/apply/seo-specialist'
  },
  {
    title: 'Social Media Manager',
    company: 'SocialBuzz',
    location: 'New York, NY',
    description: 'Manage social media accounts and create engaging content. Analyze metrics and grow online presence.',
    requiredSkills: ['Social Media', 'Content Creation', 'Facebook', 'Instagram', 'Twitter', 'Analytics'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Digital Marketing',
    salary: '$50,000 - $65,000',
    applicationLink: 'https://example.com/apply/social-media-manager'
  },
  {
    title: 'Content Marketing Specialist',
    company: 'ContentCreators',
    location: 'Remote',
    description: 'Create and distribute valuable content to attract and engage target audiences. Manage content calendars.',
    requiredSkills: ['Content Marketing', 'Writing', 'Blogging', 'Email Marketing', 'CMS', 'Storytelling'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Digital Marketing',
    salary: '$55,000 - $70,000',
    applicationLink: 'https://example.com/apply/content-marketing'
  },
  {
    title: 'Marketing Intern',
    company: 'MarketingLearn',
    location: 'Boston, MA',
    description: 'Learn digital marketing fundamentals while supporting campaigns. Get hands-on experience with marketing tools.',
    requiredSkills: ['Marketing Basics', 'Social Media', 'Content Creation', 'Analytics', 'Communication'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Digital Marketing',
    salary: '$18 - $22/hour',
    applicationLink: 'https://example.com/apply/marketing-intern-2'
  },

  // DevOps Jobs (5)
  {
    title: 'Senior DevOps Engineer',
    company: 'InfrastructureGurus',
    location: 'Seattle, WA',
    description: 'Lead DevOps initiatives and design scalable infrastructure solutions. Mentor junior engineers and establish best practices.',
    requiredSkills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'DevOps',
    salary: '$135,000 - $165,000',
    applicationLink: 'https://example.com/apply/senior-devops'
  },
  {
    title: 'Cloud Engineer',
    company: 'CloudFirst',
    location: 'Remote',
    description: 'Design and maintain cloud infrastructure on AWS, Azure, or GCP. Implement security and compliance measures.',
    requiredSkills: ['Cloud Engineering', 'AWS', 'Azure', 'GCP', 'Networking', 'Security', 'Automation'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'DevOps',
    salary: '$95,000 - $120,000',
    applicationLink: 'https://example.com/apply/cloud-engineer'
  },
  {
    title: 'Site Reliability Engineer',
    company: 'ReliableSystems',
    location: 'San Francisco, CA',
    description: 'Ensure system reliability and performance. Respond to incidents and implement preventive measures.',
    requiredSkills: ['SRE', 'Linux', 'Monitoring', 'Incident Response', 'Automation', 'Scripting'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'DevOps',
    salary: '$110,000 - $135,000',
    applicationLink: 'https://example.com/apply/sre'
  },
  {
    title: 'DevOps Intern',
    company: 'DevOpsLearning',
    location: 'Austin, TX',
    description: 'Learn DevOps practices and tools while supporting infrastructure projects. Get mentored by experienced engineers.',
    requiredSkills: ['Linux', 'Basic Scripting', 'Docker', 'Git', 'Networking'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'DevOps',
    salary: '$22 - $28/hour',
    applicationLink: 'https://example.com/apply/devops-intern'
  },
  {
    title: 'Security Engineer',
    company: 'SecureOps',
    location: 'Washington, DC',
    description: 'Implement security measures in infrastructure and applications. Conduct security audits and vulnerability assessments.',
    requiredSkills: ['Security', 'Compliance', 'Firewalls', 'Encryption', 'Penetration Testing', 'SIEM'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'DevOps',
    salary: '$105,000 - $130,000',
    applicationLink: 'https://example.com/apply/security-engineer'
  },

  // Cybersecurity Jobs (5)
  {
    title: 'Chief Information Security Officer',
    company: 'SecureEnterprise',
    location: 'New York, NY',
    description: 'Lead enterprise security strategy and governance. Oversee security teams and ensure compliance with regulations.',
    requiredSkills: ['Security Leadership', 'Risk Management', 'Compliance', 'Governance', 'Incident Response'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Cybersecurity',
    salary: '$180,000 - $220,000',
    applicationLink: 'https://example.com/apply/ciso'
  },
  {
    title: 'Penetration Tester',
    company: 'EthicalHackers',
    location: 'Remote',
    description: 'Conduct authorized security testing to identify vulnerabilities. Provide detailed reports and remediation advice.',
    requiredSkills: ['Penetration Testing', 'Ethical Hacking', 'Kali Linux', 'Metasploit', 'Reporting', 'OWASP'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Cybersecurity',
    salary: '$85,000 - $110,000',
    applicationLink: 'https://example.com/apply/penetration-tester'
  },
  {
    title: 'Security Analyst',
    company: 'ThreatWatch',
    location: 'Chicago, IL',
    description: 'Monitor security events and respond to incidents. Analyze threats and implement protective measures.',
    requiredSkills: ['Security Analysis', 'SIEM', 'IDS/IPS', 'Log Analysis', 'Incident Response', 'Forensics'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Cybersecurity',
    salary: '$65,000 - $80,000',
    applicationLink: 'https://example.com/apply/security-analyst'
  },
  {
    title: 'Cybersecurity Intern',
    company: 'SecurityLearning',
    location: 'Washington, DC',
    description: 'Learn cybersecurity fundamentals while supporting security operations. Gain hands-on experience with security tools.',
    requiredSkills: ['Cybersecurity Basics', 'Networking', 'Linux', 'Security Concepts', 'Attention to Detail'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Cybersecurity',
    salary: '$20 - $25/hour',
    applicationLink: 'https://example.com/apply/cybersecurity-intern'
  },
  {
    title: 'Security Consultant',
    company: 'ConsultSecure',
    location: 'San Francisco, CA',
    description: 'Advise organizations on security best practices and risk mitigation. Conduct assessments and develop security strategies.',
    requiredSkills: ['Security Consulting', 'Risk Assessment', 'Compliance', 'Architecture Review', 'Communication'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Cybersecurity',
    salary: '$90,000 - $115,000',
    applicationLink: 'https://example.com/apply/security-consultant'
  },

  // Project Management Jobs (5)
  {
    title: 'Senior Project Manager',
    company: 'ProjectLeaders',
    location: 'Boston, MA',
    description: 'Lead complex technology projects from initiation to closure. Manage cross-functional teams and stakeholder expectations.',
    requiredSkills: ['Project Management', 'Agile', 'Scrum', 'Risk Management', 'Budgeting', 'Stakeholder Management'],
    experienceLevel: 'Mid',
    jobType: 'Full-time',
    track: 'Project Management',
    salary: '$110,000 - $140,000',
    applicationLink: 'https://example.com/apply/senior-pm'
  },
  {
    title: 'Agile Coach',
    company: 'AgileMasters',
    location: 'Remote',
    description: 'Coach teams on Agile methodologies and continuous improvement. Facilitate ceremonies and remove impediments.',
    requiredSkills: ['Agile', 'Scrum', 'Coaching', 'Facilitation', 'Continuous Improvement', 'JIRA'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Project Management',
    salary: '$95,000 - $120,000',
    applicationLink: 'https://example.com/apply/agile-coach'
  },
  {
    title: 'Product Manager',
    company: 'ProductSuccess',
    location: 'San Francisco, CA',
    description: 'Define product strategy and roadmap. Work with engineering and design teams to deliver valuable products.',
    requiredSkills: ['Product Management', 'Roadmapping', 'User Stories', 'Market Research', 'Prioritization'],
    experienceLevel: 'Junior',
    jobType: 'Full-time',
    track: 'Project Management',
    salary: '$100,000 - $125,000',
    applicationLink: 'https://example.com/apply/product-manager'
  },
  {
    title: 'Project Coordinator',
    company: 'CoordinationPro',
    location: 'Chicago, IL',
    description: 'Support project managers with planning and execution activities. Track progress and coordinate team efforts.',
    requiredSkills: ['Project Coordination', 'Scheduling', 'Documentation', 'Communication', 'Organization'],
    experienceLevel: 'Fresher',
    jobType: 'Full-time',
    track: 'Project Management',
    salary: '$55,000 - $70,000',
    applicationLink: 'https://example.com/apply/project-coordinator-2'
  },
  {
    title: 'Project Management Intern',
    company: 'LearnPM',
    location: 'New York, NY',
    description: 'Learn project management principles while supporting active projects. Get exposure to various PM methodologies.',
    requiredSkills: ['Project Management Basics', 'Communication', 'Organization', 'MS Project', 'Planning'],
    experienceLevel: 'Fresher',
    jobType: 'Internship',
    track: 'Project Management',
    salary: '$20 - $25/hour',
    applicationLink: 'https://example.com/apply/pm-intern'
  }
];

const learningResources = [
  {
    title: 'The Complete JavaScript Course 2024',
    platform: 'Udemy',
    url: 'https://www.udemy.com/course/the-complete-javascript-course/',
    description: 'Master JavaScript with projects, challenges and theory.',
    relatedSkills: ['JavaScript', 'ES6', 'Web Development'],
    cost: 'Paid',
    duration: '69 hours',
    difficulty: 'Beginner',
    track: 'Web Development',
    rating: 4.7
  },
  {
    title: 'React - The Complete Guide',
    platform: 'Udemy',
    url: 'https://www.udemy.com/course/react-the-complete-guide/',
    description: 'Dive in and learn React.js from scratch with Hooks, Redux, and more.',
    relatedSkills: ['React', 'JavaScript', 'Redux', 'Frontend'],
    cost: 'Paid',
    duration: '48 hours',
    difficulty: 'Intermediate',
    track: 'Web Development',
    rating: 4.6
  },
  {
    title: 'freeCodeCamp Full Stack Curriculum',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/',
    description: 'Free comprehensive web development curriculum with certifications.',
    relatedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    cost: 'Free',
    duration: '300+ hours',
    difficulty: 'Beginner',
    track: 'Web Development',
    rating: 4.8
  },
  {
    title: 'Python for Everybody',
    platform: 'Coursera',
    url: 'https://www.coursera.org/specializations/python',
    description: 'Learn to program and analyze data with Python.',
    relatedSkills: ['Python', 'Programming', 'Data Analysis'],
    cost: 'Freemium',
    duration: '8 months',
    difficulty: 'Beginner',
    track: 'Data Science',
    rating: 4.8
  },
  {
    title: 'Machine Learning by Andrew Ng',
    platform: 'Coursera',
    url: 'https://www.coursera.org/learn/machine-learning',
    description: 'The most popular machine learning course in the world.',
    relatedSkills: ['Machine Learning', 'Python', 'Statistics', 'AI'],
    cost: 'Freemium',
    duration: '60 hours',
    difficulty: 'Intermediate',
    track: 'Machine Learning',
    rating: 4.9
  },
  {
    title: 'Node.js Tutorial for Beginners',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
    description: 'Complete Node.js tutorial covering Express, MongoDB, and REST APIs.',
    relatedSkills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    cost: 'Free',
    duration: '6 hours',
    difficulty: 'Beginner',
    track: 'Web Development',
    rating: 4.5
  },
  {
    title: 'SQL for Data Science',
    platform: 'Coursera',
    url: 'https://www.coursera.org/learn/sql-for-data-science',
    description: 'Learn SQL fundamentals for data analysis and manipulation.',
    relatedSkills: ['SQL', 'Data Analysis', 'Database'],
    cost: 'Freemium',
    duration: '15 hours',
    difficulty: 'Beginner',
    track: 'Data Science',
    rating: 4.6
  },
  {
    title: 'Google UX Design Certificate',
    platform: 'Coursera',
    url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    description: 'Professional certificate in UX design from Google.',
    relatedSkills: ['UI Design', 'UX Design', 'Figma', 'User Research', 'Prototyping'],
    cost: 'Paid',
    duration: '6 months',
    difficulty: 'Beginner',
    track: 'UI/UX Design',
    rating: 4.7
  },
  {
    title: 'React Native - The Practical Guide',
    platform: 'Udemy',
    url: 'https://www.udemy.com/course/react-native-the-practical-guide/',
    description: 'Build native mobile apps with React Native.',
    relatedSkills: ['React Native', 'Mobile Development', 'JavaScript', 'iOS', 'Android'],
    cost: 'Paid',
    duration: '28 hours',
    difficulty: 'Intermediate',
    track: 'Mobile Development',
    rating: 4.6
  },
  {
    title: 'Digital Marketing Specialization',
    platform: 'Coursera',
    url: 'https://www.coursera.org/specializations/digital-marketing',
    description: 'Master digital marketing strategy, social media, and SEO.',
    relatedSkills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Analytics'],
    cost: 'Paid',
    duration: '8 months',
    difficulty: 'Beginner',
    track: 'Digital Marketing',
    rating: 4.5
  },
  {
    title: 'AWS Certified Cloud Practitioner',
    platform: 'Udemy',
    url: 'https://www.udemy.com/course/aws-certified-cloud-practitioner-new/',
    description: 'Prepare for the AWS Cloud Practitioner certification.',
    relatedSkills: ['AWS', 'Cloud Computing', 'DevOps'],
    cost: 'Paid',
    duration: '14 hours',
    difficulty: 'Beginner',
    track: 'DevOps',
    rating: 4.7
  },
  {
    title: 'Docker and Kubernetes: The Complete Guide',
    platform: 'Udemy',
    url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
    description: 'Build, test, and deploy Docker applications with Kubernetes.',
    relatedSkills: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
    cost: 'Paid',
    duration: '22 hours',
    difficulty: 'Intermediate',
    track: 'DevOps',
    rating: 4.6
  },
  {
    title: 'Introduction to Cybersecurity',
    platform: 'edX',
    url: 'https://www.edx.org/learn/cybersecurity',
    description: 'Learn the fundamentals of cybersecurity and network security.',
    relatedSkills: ['Cybersecurity', 'Network Security', 'Linux', 'Security'],
    cost: 'Free',
    duration: '6 weeks',
    difficulty: 'Beginner',
    track: 'Cybersecurity',
    rating: 4.4
  },
  {
    title: 'Agile Project Management',
    platform: 'LinkedIn Learning',
    url: 'https://www.linkedin.com/learning/agile-project-management',
    description: 'Learn Agile methodologies and Scrum framework.',
    relatedSkills: ['Agile', 'Scrum', 'Project Management', 'JIRA'],
    cost: 'Paid',
    duration: '3 hours',
    difficulty: 'Beginner',
    track: 'Project Management',
    rating: 4.5
  },
  {
    title: 'Git & GitHub Crash Course',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    description: 'Learn Git and GitHub from scratch in this beginner tutorial.',
    relatedSkills: ['Git', 'GitHub', 'Version Control'],
    cost: 'Free',
    duration: '1 hour',
    difficulty: 'Beginner',
    track: 'Web Development',
    rating: 4.8
  },
  {
    title: 'Deep Learning Specialization',
    platform: 'Coursera',
    url: 'https://www.coursera.org/specializations/deep-learning',
    description: 'Master deep learning and neural networks with Andrew Ng.',
    relatedSkills: ['Deep Learning', 'TensorFlow', 'Neural Networks', 'Python'],
    cost: 'Paid',
    duration: '5 months',
    difficulty: 'Advanced',
    track: 'Machine Learning',
    rating: 4.9
  },
  {
    title: 'Figma UI/UX Design Tutorial',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
    description: 'Complete Figma tutorial for UI/UX design beginners.',
    relatedSkills: ['Figma', 'UI Design', 'Prototyping'],
    cost: 'Free',
    duration: '3 hours',
    difficulty: 'Beginner',
    track: 'UI/UX Design',
    rating: 4.6
  },
  {
    title: 'Data Analysis with Python',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    description: 'Learn data analysis with Pandas, NumPy, and Matplotlib.',
    relatedSkills: ['Python', 'Pandas', 'NumPy', 'Data Analysis', 'Data Visualization'],
    cost: 'Free',
    duration: '300 hours',
    difficulty: 'Intermediate',
    track: 'Data Science',
    rating: 4.7
  },
  {
    title: 'iOS & Swift Development Bootcamp',
    platform: 'Udemy',
    url: 'https://www.udemy.com/course/ios-13-app-development-bootcamp/',
    description: 'Learn iOS app development with Swift from scratch.',
    relatedSkills: ['Swift', 'iOS', 'Xcode', 'Mobile Development'],
    cost: 'Paid',
    duration: '55 hours',
    difficulty: 'Beginner',
    track: 'Mobile Development',
    rating: 4.7
  },
  {
    title: 'TypeScript Course for Beginners',
    platform: 'YouTube',
    url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    description: 'Learn TypeScript from scratch with practical examples.',
    relatedSkills: ['TypeScript', 'JavaScript', 'Web Development'],
    cost: 'Free',
    duration: '5 hours',
    difficulty: 'Intermediate',
    track: 'Web Development',
    rating: 4.5
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Job.deleteMany({});
    await LearningResource.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Job.insertMany(jobs);
    console.log(`Inserted ${jobs.length} jobs`);

    await LearningResource.insertMany(learningResources);
    console.log(`Inserted ${learningResources.length} learning resources`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();