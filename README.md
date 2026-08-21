# CareerAI API

> REST API and AI orchestration service for CareerAI—an intelligent career planning, job matching, and skill-development platform.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

This repository contains the backend for [CareerAI](https://github.com/Jabirmahmud0/AI_career_Client). It handles authentication, user profiles, job and resource discovery, profile-aware matching, CV skill extraction, AI roadmaps, CareerBot conversations, and serverless database access.

- **Backend repository:** [AI_career_Server](https://github.com/Jabirmahmud0/AI_career_Server)
- **Frontend repository:** [AI_career_Client](https://github.com/Jabirmahmud0/AI_career_Client)

## Table of contents

- [Capabilities](#capabilities)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Authentication](#authentication)
- [API reference](#api-reference)
- [Request examples](#request-examples)
- [Data models](#data-models)
- [Matching algorithm](#matching-algorithm)
- [AI integration](#ai-integration)
- [Demo account](#demo-account)
- [Seeding](#seeding)
- [Deployment](#deployment)
- [Error handling](#error-handling)
- [Security notes](#security-notes)
- [Project structure](#project-structure)
- [Known limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Capabilities

- JWT registration, login, and authenticated sessions
- bcrypt password hashing
- Structured user profiles, skills, targets, projects, and experience
- Job search, filters, details, recommendations, and match analysis
- Curated learning-resource search and recommendations
- Weighted skill, experience, and career-track matching
- Gemini-powered CV skill extraction
- Gemini-powered career roadmaps
- Context-aware CareerBot responses
- AI profile summaries and project-bullet improvements
- LinkedIn profile improvement suggestions
- Multiple Gemini API keys with quota-triggered rotation
- MongoDB connection caching for serverless execution
- Vercel serverless deployment configuration
- Self-provisioning public recruiter demo account

## Technology stack

| Area | Technology |
|---|---|
| Runtime | Node.js 18+ |
| HTTP framework | Express 4 |
| Database | MongoDB |
| ODM | Mongoose 7 |
| Authentication | JSON Web Tokens |
| Password hashing | bcryptjs |
| Validation | express-validator |
| AI provider | Google Gemini |
| CORS | `cors` middleware plus route headers |
| Development | Nodemon |
| Deployment | Vercel Node serverless function |

## Architecture

```mermaid
flowchart TD
    C[React client] -->|REST JSON| E[Express application]
    E --> R[Route modules]
    R --> A[JWT middleware]
    R --> CT[Controllers]
    CT --> S[AI and matching services]
    CT --> M[Mongoose models]
    M --> DB[(MongoDB Atlas)]
    S --> G[Google Gemini API]
```

The server follows a routes → middleware → controllers → services/models structure. `index.js` exports the Express application for Vercel and starts an HTTP listener only when executed directly for local development.

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string
- Google Gemini API key for AI-powered endpoints

### Installation

```bash
git clone https://github.com/Jabirmahmud0/AI_career_Server.git
cd AI_career_Server
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER/DATABASE
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_AI_API_KEY=your-primary-gemini-key
GOOGLE_AI_MODEL=gemini-2.5-flash
```

Start the development server:

```bash
npm run dev
```

The API is available at `http://localhost:5001/api` when `PORT` is not overridden.

Configure the frontend with:

```env
VITE_API_URL=http://localhost:5001/api
```

## Environment variables

| Variable | Required | Default | Description |
|---|---:|---|---|
| `MONGODB_URI` | Yes | — | MongoDB or MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | — | Secret used to sign 30-day access tokens |
| `GOOGLE_AI_API_KEY` | For AI | — | Primary Gemini API key |
| `GOOGLE_AI_API_KEY_2` | No | — | Rotation key used after quota errors |
| `GOOGLE_AI_API_KEY_3` | No | — | Additional rotation key |
| `GOOGLE_AI_API_KEY_4` | No | — | Additional rotation key |
| `GOOGLE_AI_API_KEY_5` | No | — | Additional rotation key |
| `GOOGLE_AI_API_KEY_6` | No | — | Additional rotation key |
| `GOOGLE_AI_MODEL` | No | `gemini-2.5-flash` | Gemini model identifier |
| `PORT` | No | `5001` | Local HTTP port |
| `NODE_ENV` | No | Runtime-defined | Controls development error detail |

Generate a strong JWT secret with a password manager or a cryptographically secure random generator. Never commit `.env`; environment files are ignored by Git.

## Scripts

| Command | Purpose |
|---|---|
| `npm start` | Start the API with Node |
| `npm run dev` | Start with Nodemon and reload on changes |
| `npm run seed` | Insert the primary jobs and learning resources dataset |
| `npm run test-keys` | Check configured Gemini API keys |

There is currently no automated unit or integration test command.

## Authentication

Protected endpoints require a JWT in the standard bearer header:

```http
Authorization: Bearer YOUR_TOKEN
```

Tokens are returned by registration and login and expire after 30 days.

### Typical authentication flow

1. Register with `POST /api/auth/register` or log in with `POST /api/auth/login`.
2. Store the returned token on the client.
3. Send it as a bearer token to protected endpoints.
4. Call `GET /api/auth/me` to restore the current session.

## API reference

Base URL locally:

```text
http://localhost:5001/api
```

### Health

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/health` | No | Server health response |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `POST` | `/auth/register` | No | Create a user and return a JWT |
| `POST` | `/auth/login` | No | Authenticate and return a JWT |
| `GET` | `/auth/me` | Yes | Return the authenticated user without the password |

Registration fields:

```json
{
  "fullName": "Alex Morgan",
  "email": "alex@example.com",
  "password": "strong-password",
  "educationLevel": "Bachelor",
  "department": "Computer Science",
  "experienceLevel": "Junior",
  "preferredTrack": "Web Development"
}
```

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/profile` | Yes | Get the complete profile |
| `PUT` | `/profile` | Yes | Update profile fields |
| `POST` | `/profile/skills` | Yes | Add one skill; body: `{ "skill": "React" }` |
| `DELETE` | `/profile/skills/:skill` | Yes | Remove a skill by name |
| `POST` | `/profile/projects` | Yes | Add a project |
| `DELETE` | `/profile/projects/:projectId` | Yes | Remove a project |
| `POST` | `/profile/extract-skills` | Yes | Extract skills and suggested roles from CV text |

Supported profile update fields include `fullName`, `educationLevel`, `department`, `experienceLevel`, `preferredTrack`, `skills`, `targetRoles`, `projects`, `experience`, `cvText`, `bio`, and `generatedSummary`.

CV extraction body:

```json
{
  "cvText": "Frontend developer with React and Node.js experience...",
  "mergeSkills": false
}
```

If `cvText` is omitted, the endpoint uses CV text already stored on the user. Setting `mergeSkills` to `true` adds extracted skills to the profile.

### Jobs

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/jobs` | No | List active jobs with optional filters |
| `GET` | `/jobs/:id` | No | Get a job by MongoDB ID |
| `GET` | `/jobs/recommended?limit=10` | Yes | Get scored recommendations |
| `GET` | `/jobs/:id/analysis` | Yes | Analyze the user's match for one job |

Supported list query parameters:

- `track`
- `location`
- `jobType`
- `experienceLevel`
- `search`

### Learning resources

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| `GET` | `/resources` | No | List resources with optional filters |
| `GET` | `/resources/:id` | No | Get one resource |
| `GET` | `/resources/recommended?limit=10` | Yes | Get profile-aware recommendations |
| `POST` | `/resources/by-skills` | No | Find resources for a skills array |

Supported list query parameters:

- `skill`
- `platform`
- `cost`
- `difficulty`
- `track`
- `search`

Skills request:

```json
{
  "skills": ["React", "TypeScript", "Testing"]
}
```

### AI

All AI endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/roadmap` | Generate and save a career roadmap |
| `GET` | `/ai/roadmaps` | List saved roadmaps |
| `DELETE` | `/ai/roadmaps/:roadmapId` | Delete a saved roadmap |
| `POST` | `/ai/chat` | Send a message to CareerBot |
| `POST` | `/ai/summary` | Generate a profile summary; `{ "save": true }` persists it |
| `POST` | `/ai/improve-bullets` | Improve a project description |
| `POST` | `/ai/improve-linkedin` | Generate profile-aware LinkedIn suggestions |

Roadmap request:

```json
{
  "targetRole": "Frontend Developer",
  "timeframe": "6 months",
  "hoursPerWeek": 10
}
```

CareerBot request:

```json
{
  "message": "What should I learn next for frontend roles?",
  "userContext": {
    "currentGoal": "Get a junior frontend role"
  }
}
```

Project improvement request:

```json
{
  "projectDescription": "Built a dashboard using React.",
  "technologies": ["React", "Node.js", "MongoDB"]
}
```

## Request examples

### Register

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alex Morgan",
    "email": "alex@example.com",
    "password": "strong-password",
    "educationLevel": "Bachelor",
    "experienceLevel": "Junior",
    "preferredTrack": "Web Development"
  }'
```

### Log in

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"strong-password"}'
```

### Get recommendations

```bash
curl "http://localhost:5001/api/jobs/recommended?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Generate a roadmap

```bash
curl -X POST http://localhost:5001/api/ai/roadmap \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetRole":"Frontend Developer","timeframe":"6 months","hoursPerWeek":10}'
```

## Data models

### User

A user stores:

- Identity: full name, email, hashed password
- Background: education, department, and experience level
- Direction: preferred track and target roles
- Evidence: skills, projects, and work experience
- Career content: bio, CV text, generated summary
- AI results: extracted skills, suggested roles, and saved roadmaps
- Creation timestamp

Allowed education values are `High School`, `Diploma`, `Bachelor`, `Master`, `PhD`, and `Other`.

Allowed experience values are `Fresher`, `Junior`, and `Mid`.

### Job

A job stores title, company, location, description, required skills, experience level, job type, career track, salary, application link, posted date, and active status.

Supported job types are `Internship`, `Part-time`, `Full-time`, and `Freelance`.

### LearningResource

A resource stores title, platform, URL, description, related skills, cost, duration, difficulty, career track, and rating.

Supported costs are `Free`, `Paid`, and `Freemium`; difficulty values are `Beginner`, `Intermediate`, and `Advanced`.

## Matching algorithm

Job recommendations use a transparent weighted score:

| Signal | Weight | Behavior |
|---|---:|---|
| Required-skill overlap | 70% | Case-insensitive partial matching |
| Experience alignment | 15% | Full, near, or partial score based on level distance |
| Career-track alignment | 15% | Full score for exact track and partial score for related tracks |

The service returns:

```json
{
  "score": 86,
  "matchedSkills": ["React", "JavaScript"],
  "missingSkills": ["TypeScript"],
  "reasons": ["Matches: React, JavaScript", "Missing: TypeScript"]
}
```

Recommendations are sorted by score and limited by the `limit` query parameter.

## AI integration

The AI service uses `@google/generative-ai`. Up to six API keys can be configured. When a quota or rate-limit error is detected, the service rotates to the next available key and retries once.

AI powers:

- Structured career roadmaps
- CareerBot conversations
- CV skill extraction
- Professional profile summaries
- Project-bullet improvements
- LinkedIn suggestions

The default model is `gemini-2.5-flash`; override it with `GOOGLE_AI_MODEL` if the configured account supports another model.

## Demo account

Published reviewer credentials:

```text
Email:    demo@careerai.app
Password: Recruiter123!
```

When these exact credentials are submitted, the login controller creates the demo user if it does not exist and restores its canonical sample profile if it does. This removes the need to run a separate user seed before a recruiter review.

The account is public and shared. It must never contain real personal data. It is a standard user account—there is no admin role in the current application.

## Seeding

Seed jobs and learning resources after configuring `MONGODB_URI`:

```bash
npm run seed
```

The seed dataset includes multiple career tracks, experience levels, job types, platforms, and resource difficulties. Review seed behavior before running it against a production database.

Additional maintenance scripts include `insert-jobs.js`, `seeds/additionalJobs.js`, and `test-seed.js`; use them deliberately because they mutate database data.

## Deployment

The server includes `vercel.json` configured to deploy `index.js` with `@vercel/node` and route all requests to the Express application.

### Vercel environment

Configure at minimum:

```env
MONGODB_URI=...
JWT_SECRET=...
GOOGLE_AI_API_KEY=...
GOOGLE_AI_MODEL=gemini-2.5-flash
```

Optional rotation keys can be added as `GOOGLE_AI_API_KEY_2` through `GOOGLE_AI_API_KEY_6`.

After deployment, verify:

```text
GET https://YOUR-SERVER-DOMAIN/api/health
```

Then configure the frontend:

```env
VITE_API_URL=https://YOUR-SERVER-DOMAIN/api
```

MongoDB Atlas must allow connections from the deployment environment. The database helper caches the connection between warm serverless invocations and resets failed connection promises so later requests can retry.

## Error handling

Common response statuses:

| Status | Meaning |
|---:|---|
| `200` | Successful read, update, or action |
| `201` | User created |
| `400` | Invalid or missing request data |
| `401` | Missing, invalid, or expired authentication |
| `404` | User, job, resource, project, or roadmap not found |
| `500` | Database, AI-provider, configuration, or unexpected server error |

Most errors return:

```json
{
  "message": "Human-readable error",
  "error": "Additional detail when available"
}
```

Do not expose raw internal error detail in hardened production environments.

## Security notes

Implemented controls:

- bcrypt password hashing
- JWT verification middleware
- Protected profile, recommendation, and AI routes
- Environment-based secrets
- Mongoose schema validation
- Password exclusion from profile responses

Production hardening still recommended:

- Restrict CORS to known frontend origins; the current configuration permits all origins
- Add request rate limiting, especially for auth and AI endpoints
- Add Helmet and a content security policy
- Validate and sanitize every endpoint consistently
- Remove verbose production logging
- Add token revocation or shorter-lived access tokens with refresh tokens
- Add abuse protection for the public demo account
- Add audit logging and explicit data-retention policies

## Project structure

```text
├── config/
│   └── db.js                    # Cached MongoDB connection
├── controllers/
│   ├── aiController.js          # Roadmaps, chat, summaries, improvements
│   ├── authController.js        # Registration, login, demo provisioning
│   ├── jobController.js         # Job listing and analysis
│   ├── profileController.js     # Profile and CV operations
│   └── resourceController.js    # Learning-resource operations
├── middleware/
│   └── auth.js                  # JWT protection
├── models/
│   ├── Job.js
│   ├── LearningResource.js
│   └── User.js
├── routes/
│   ├── ai.js
│   ├── auth.js
│   ├── jobs.js
│   ├── profile.js
│   └── resources.js
├── seeds/
│   ├── seedData.js
│   └── additionalJobs.js
├── services/
│   ├── aiService.js             # Gemini prompts and key rotation
│   └── matchingService.js       # Jobs and learning recommendations
├── index.js                     # Express app and local entry point
├── package.json
└── vercel.json
```

## Known limitations

- No administrator role or admin-only endpoints
- No automated test suite or coverage reporting
- No OpenAPI/Swagger document yet
- No email verification, password reset, or account deletion flow
- No API rate limiting
- Broad CORS configuration
- Shared public demo account
- AI output quality and availability depend on Gemini
- Some seed application links are placeholders

## Troubleshooting

### `MONGODB_URI environment variable is not set`

Add a valid MongoDB connection string to `.env` or the Vercel project environment.

### MongoDB connection timeout

Verify Atlas network access, credentials, hostname, and database-user permissions. The URI must begin with `mongodb://` or `mongodb+srv://`.

### `JWT_SECRET environment variable is not set`

Add a strong `JWT_SECRET`, restart the server, and log in again to obtain a newly signed token.

### AI requests fail

Check that at least one Gemini key exists, the configured model is available, and the account has quota. Run:

```bash
npm run test-keys
```

### Frontend cannot reach the server

Set the client variable to the complete API base URL:

```env
VITE_API_URL=http://localhost:5001/api
```

### Protected route returns `401`

Confirm the request includes `Authorization: Bearer TOKEN`, the token has not expired, and it was signed with the current `JWT_SECRET`.

## License

No license file is currently included. Unless a license is added, the repository remains under the copyright rights of its owner and should not be assumed to be open for unrestricted reuse.
