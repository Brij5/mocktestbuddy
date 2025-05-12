/Users/brijesh/Desktop/AI/exam-buddy/exam-buddy/
├── .git/                 # Git repository metadata
├── .gitignore            # Specifies intentionally untracked files
├── client/               # Frontend application (Setup pending/incomplete)
│   ├── package.json      # (Potentially conflicting, from failed CRA attempt)
│   ├── public/           # (Potentially conflicting)
│   └── src/              # (Potentially conflicting)
├── server/               # Backend application
│   ├── config/           # For configuration files (e.g., DB connection)
│   ├── controllers/      # Request handling logic
│   ├── middleware/       # Custom middleware (e.g., auth checks)
│   ├── models/           # Mongoose schemas/models
│   ├── routes/           # API route definitions
│   ├── index.js          # Main server entry point
│   └── package.json      # Backend dependencies and scripts
│   └── package-lock.json # Locked dependency versions
├── node_modules/         # Server dependencies (Gitignored)
├── DEVELOPMENT_LOG.md
├── PROJECT_REQUIREMENTS.md
└── README.md

## Project Overview
Exam Buddy is a comprehensive mock test platform that allows multiple users to take multiple mock tests simultaneously for various exams and subjects. The platform provides features for tracking progress, searching exams, and managing mock tests.

## Core Features

### 1. User Management
- User registration (with email verification) and secure login (password hashing)
- Enforce password complexity requirements (minimum length, character types).
- Role-based access control (Admin/User) - Clearly defined permissions for each role.
- User profile management (name, profile picture, password change).
- Persistent user sessions (e.g., using JWT refresh tokens or session management).
- Progress tracking dashboard summarizing recent activity and performance highlights.
- (Optional) Achievement system/gamification for engagement.
- (Optional) User feedback mechanism.

### 2. Exam Management
- **Exam Types**: Support diverse exam categories:
  - Civil Services (e.g., UPSC CSE Prelims, State PSC Prelims)
  - University Entrance (e.g., CUET-UG, CUET-PG)
  - Government Recruitment (e.g., SSC CGL Tier 1, Banking Prelims - IBPS/SBI)
  - Professional Courses (e.g., NEET, JEE)
- **Exam Structure**: Define exam structure with multiple papers/sections:
  - Example (UPSC Prelims): Paper 1 (GS), Paper 2 (CSAT)
  - Example (Banking Prelims): Section 1 (English), Section 2 (Quant), Section 3 (Reasoning)
- **Exam Details**: Store key details for each exam/paper:
  - Syllabus / Subject Outline reference (link or document).
  - Subjects Covered (e.g., History, Geography, Polity, Quant, Reasoning, English, Domain Specific)
  - Total Marks (e.g., 200 marks)
  - Number of Questions (e.g., 100 questions, 80 questions)
  - Duration (e.g., 120 minutes, 60 minutes)
  - Marking Scheme (e.g., +2/-0.66 for UPSC GS, +1/-0.25 for Banking)
  - Negative Marking (Yes/No, specific fraction like 1/3rd, 1/4th)
  - Sectional Timings (Yes/No, duration per section for Banking)
  - Qualifying Papers (Yes/No, e.g., CSAT)
  - Language Options (e.g., English/Hindi)
  - Versioning support (to track changes in exam patterns over time).
  - Ability for Admins to clone/duplicate existing exam structures.

### 3. Mock Test Management
- **Mock Test Types**: Create various mock test types:
  - Full-Length Mocks (simulating the entire exam pattern)
  - Sectional Mocks (focusing on specific sections/papers like Quant, GS Paper 1)
  - Subject-wise Mocks (focusing on specific subjects like Polity, Modern History)
  - Topic-wise Mocks (drilling down to specific topics within subjects)
  - Previous Year Question Papers (PYQPs) as mocks
- **Test Configuration**: Configure mock tests based on real exam patterns:
  - Adhere to Number of Questions, Marks, Duration, Negative Marking of the target exam.
  - Option to enable/disable sectional timings.
  - Difficulty level settings (Easy, Medium, Hard, Mixed).
- **Test Interface**: Provide a realistic and accessible test-taking interface:
  - Clear display of Timer (overall and sectional if applicable) with visual cues for low time.
  - Accessible Question navigation panel showing status (Answered, Not Answered, Marked for Review, Answered & Marked for Review) allowing direct navigation.
  - Clear options for marking questions for review (distinct from final answer submission).
  - Explicit indication of negative marking rules on the interface.
  - Ability to switch between available languages during the test.
  - Auto-save progress periodically to prevent data loss.
  - Option to pause and resume tests (if applicable based on exam rules).
  - Review screen before final submission summarizing attempt status.
- **Test Generation**: Generate tests from the question bank based on criteria (subject, topic, difficulty, type). Option for randomization.
- **Test Results**: Provide immediate feedback post-submission:
  - Score, Rank (if applicable), Percentile (if applicable).
  - Detailed analysis: Time spent per question/section, accuracy per subject/topic/difficulty.
  - Solution review: Ability to view correct answers, explanations, and submitted answers.

### 4. Question Management
- **Question Types**: Support diverse question formats found in target exams:
  - Standard MCQs (Single Correct Option)
  - Multiple Correct Options MCQs (Common in engineering entrances)
  - Assertion-Reasoning Type
  - Matching List Type
  - Statement-Based Questions (e.g., 'Which of the above statements is/are correct?')
  - Reading Comprehension based MCQs
  - Data Interpretation based MCQs
  - (Future) Numerical Answer Type (NAT)
  - (Future) Fill in the Blanks
  - Consider support for diagram-based or code-based questions if relevant to target exams.
- **Question Attributes**: Store detailed attributes for each question:
  - Associated Exam(s)
  - Subject (e.g., Polity, Quantitative Aptitude)
  - Topic (e.g., Fundamental Rights, Percentages)
  - Difficulty Level (Easy, Medium, Hard)
  - Tags (e.g., #PYQP_2022, #CurrentAffairs_Jan2025)
  - Language (e.g., English, Hindi)
  - Correct Answer(s)
  - Explanation/Solution
  - Media Support (Images for DI/Geometry, Passages for RC)
  - Negative Marks applicable (override test default if needed)
  - Question status (Draft, Needs Review, Approved, Archived).
  - Version history for edits to questions/options/explanations.

### 5. Progress Tracking
- Detailed test attempt history (scores, time taken, date).
- Visual score trends over time (line charts).
- Strengths and weaknesses analysis based on accuracy and time taken per Subject, Topic, and Difficulty Level.
- Time management analysis (average time per question vs. ideal time, section-wise time distribution).
- Subject-wise and Topic-wise performance breakdown (accuracy, attempts).
- Comparison features (e.g., comparing performance against average scores or top percentile scores for a test - anonymized).

### 6. Search and Filter
- Global search bar (exams, tests, potentially questions).
- Filter exams by type, category, or specific attributes.
- Filter mock tests by subject, topic, type (Full, Sectional), difficulty level, status (attempted/not attempted), date range, or tags.
- Sort results by relevance, date, difficulty, popularity.
- Saved searches or favorite tests functionality.

### 7. Admin Management
- Centralized Admin Dashboard with key metrics (user signups, test attempts, popular exams).
- User management (view list, search, view details, change roles, suspend/activate accounts).
- Exam management (CRUD operations, manage structures, categories).
- Question bank management (CRUD, bulk import/export, review/approval workflow).
- Mock Test scheduling and configuration.
- Performance analytics overview (platform-wide trends).
- Content moderation tools (e.g., flagging/reviewing user-generated content if applicable in future).
- System configuration settings (if needed).

## Technical Requirements

### Frontend
- React (JavaScript) - Consider using TypeScript for better maintainability.
- Modern UI library (e.g., Material-UI, Chakra UI, Mantine) for UI components and theming.
- React Router for navigation.
- State management library (e.g., Redux Toolkit, Zustand, Context API) chosen based on complexity.
- Axios or Fetch API for API calls, with centralized request/response handling.
- Form handling library (e.g., React Hook Form).
- Toast notifications for user feedback.
- Clear loading states and skeleton loaders for better UX.

### Backend
- Node.js with Express.js (or potentially NestJS for more structure).
- MongoDB with Mongoose ODM.
- JWT for authentication (consider refresh token strategy).
- Multer for handling file uploads.
- Cloudinary (or similar like AWS S3) for cloud media storage.
- Winston (or similar) for structured logging.
- Job queue (e.g., BullMQ, Agenda) for background tasks (like sending emails).

## Database Schema

### Users Collection
- _id
- name
- email (unique, indexed)
- password (hashed)
- role (user/admin, default: user)
- profile_picture_url
- is_verified (Boolean, default: false)
- verification_token
- verification_token_expiry
- password_reset_token
- password_reset_token_expiry
- last_login_at
- failed_login_attempts (Number, default: 0)
- created_at (timestamp)
- updated_at (timestamp)

### Exams Collection
- _id
- name (indexed)
- type (indexed)
- description
- papers: [ 
    { 
      paper_name: String, (e.g., 'General Studies Paper 1', 'CSAT', 'Quantitative Aptitude')
      subjects: [String],
      total_marks: Number, (e.g., 200)
      num_questions: Number, (e.g., 100)
      duration_minutes: Number, (e.g., 120)
      marking_scheme: { correct: Number, incorrect: Number }, (e.g., { correct: 2, incorrect: -0.66 })
      has_negative_marking: Boolean,
      is_qualifying: Boolean, (default: false)
      language_options: [String] (e.g., ['English', 'Hindi'])
    }
  ]
- overall_duration_minutes
- has_sectional_timing
- version (Number, default: 1)
- created_by (reference to Users collection, admin role)
- updated_by (reference to Users collection, admin role)
- created_at (timestamp)
- updated_at (timestamp)

### Tests Collection (Mock Tests)
- _id
- exam_id (reference to exams collection, indexed)
- name (indexed)
- type (indexed)
- description
- associated_paper_name
- associated_subject (indexed)
- question_ids: [ObjectId] // Reference to Questions Collection
- num_questions: Number,
- duration_minutes: Number,
- total_marks: Number,
- marking_scheme: { correct: Number, incorrect: Number },
- has_negative_marking: Boolean,
- difficulty_level: String, (indexed)
- status: String (Draft, Published, Archived), indexed
- created_by (reference to Users collection, admin role)
- updated_by (reference to Users collection, admin role)
- created_at (timestamp)
- updated_at (timestamp)

### Questions Collection
- _id
- associated_exams: [ObjectId], (indexed)
- question_text: String,
- question_type: String, (indexed)
- options: [ { text: String, is_correct: Boolean } ],
- correct_answer_text: String,
- explanation: String,
- subject: String, (indexed)
- topic: String, (indexed)
- difficulty_level: String, (indexed)
- tags: [String], (indexed)
- language: String, (indexed)
- media_urls: [String],
- marks_override: { correct: Number, incorrect: Number },
- status: String (Draft, Needs Review, Approved, Archived), indexed
- version (Number, default: 1)
- created_by (reference to Users collection, admin role)
- updated_by (reference to Users collection, admin role)
- created_at (timestamp)
- updated_at (timestamp)

### UserProgress Collection (Consider renaming to TestAttempts)
- _id
- user_id (reference to users collection, indexed)
- test_id (reference to tests collection, indexed)
- exam_id (reference to exams collection, indexed for easier filtering)
- score
- total_marks_possible
- accuracy (percentage)
- percentile (calculated, optional)
- time_taken_seconds
- status (Started, In Progress, Completed, Abandoned)
- started_at (timestamp)
- completed_at (timestamp)
- answers: [ { question_id: ObjectId, selected_option_index: Number/Array, time_taken: Number, status: String (Correct, Incorrect, Skipped) } ] // Detailed answer log
// Remove subject_performance, difficulty_performance - Calculate on demand or store aggregated elsewhere if needed

*(Note: Ensure appropriate database indexes are created for fields used in queries/filters/sorting for performance)*

## Non-Functional Requirements (NFRs)

### Scalability
- Initial Target: Support up to 100 concurrent active test-takers.
- Design database schema and queries for efficient scaling.
- Infrastructure should allow for horizontal scaling of backend instances.

### Availability
- Target Uptime: 99.9% for production environment (excluding scheduled maintenance).
- Implement health checks for backend services.
- Consider database replica sets for high availability.

### Maintainability
- Adhere to consistent coding standards (ESLint/Prettier configured).
- Implement structured logging (e.g., using Winston) for easier debugging.
- Code should be well-commented where necessary (complex logic).
- Aim for modular design in both frontend and backend.

### Usability & Accessibility
- Provide an intuitive and consistent user interface across web and mobile.
- Target WCAG 2.1 Level AA compliance for accessibility where feasible.
- Ensure responsiveness across common device sizes.

## Security Requirements
- Secure authentication (JWT with refresh tokens, secure password hashing & storage).
- Role-based access control enforced at API level.
- Data encryption (HTTPS enforced for all communication, sensitive data encrypted at rest if necessary).
- Secure file handling (validate uploads, store securely, e.g., S3/Cloudinary).
- API Rate limiting implemented to prevent abuse.
- Input validation on all user inputs (backend and frontend).
- Protection against common web vulnerabilities (OWASP Top 10): XSS (output encoding, content security policy), NoSQL Injection (use ORM/ODM properly), CSRF (if using cookies/sessions), etc.
- Regular security audits and dependency vulnerability scanning.
- Security headers (Helmet.js or equivalent configuration).

## Performance Requirements
- Fast loading times (e.g., Target LCP < 2.5s, TTI < 5s).
- Smooth navigation and UI interactions (minimal jank).
- Efficient data handling (database indexing, query optimization, pagination).
- Support for concurrent test taking (target X users simultaneously - define X).
- Real-time score updates and immediate feedback post-test.
- Scalable architecture capable of handling growth.
- Implement API response caching where appropriate.

## Future Enhancements
1. Adaptive learning system
2. AI-powered question recommendations
3. Social features (leaderboards, discussions)
4. Offline study mode
5. Detailed analytics
6. Mobile app integration
7. Email notifications
8. Certificate generation

## Development Phases

### Phase 1: Core Authentication
- User registration/login
- Role-based access control
- Basic UI setup
- Profile management

### Phase 2: Exam and Test Management
- Exam creation and management
- Test creation and management
- Question bank implementation
- Basic search functionality

### Phase 3: User Dashboard
- Progress tracking
- Test history
- Performance analytics
- Subject-wise analysis

### Phase 4: Admin Dashboard
- User management
- Exam management
- Question bank management
- Analytics dashboard

### Phase 5: Enhancements
- Advanced search features
- Social features
- Offline capabilities
- Mobile app integration

### Phase 6: Optimization
- Performance optimization
- Scalability improvements
- Security enhancements
- Bug fixes

## API Endpoints

### Auth API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile
- POST /api/auth/logout

### Exams API
- GET /api/exams
- POST /api/exams
- GET /api/exams/:id
- PUT /api/exams/:id
- DELETE /api/exams/:id

### Tests API
- GET /api/tests
- POST /api/tests
- GET /api/tests/:id
- PUT /api/tests/:id
- DELETE /api/tests/:id

### Questions API
- GET /api/questions
- POST /api/questions
- GET /api/questions/:id
- PUT /api/questions/:id
- DELETE /api/questions/:id

### User Progress API
- GET /api/user/progress
- POST /api/user/progress
- GET /api/user/progress/:id
- PUT /api/user/progress/:id
- DELETE /api/user/progress/:id

### Admin API
- GET /api/admin/users
- GET /api/admin/exams
- GET /api/admin/tests
- GET /api/admin/analytics
- POST /api/admin/content

## Error Handling
- Input validation errors
- Authentication errors
- Database errors
- API errors
- Network errors
- Timeout errors

## Testing Requirements
- Unit tests for components
- Integration tests for API
- E2E tests for main flows
- Performance testing
- Security testing

## Documentation Requirements
- API documentation
- User guides
- Developer documentation
- Setup instructions

## Detailed Specifications & Planning

This section provides granular details, dummy data, and refined flows to guide development.

### Dummy Personas & Roles

*   **Student User (Regular User):**
    *   **Name:** Priya Sharma
    *   **Email:** `priya.sharma.student@example.com`
    *   **Password:** (Hashed) `hashed_password_1`
    *   **Target Exams:** UPSC CSE Prelims, State PSC (UPPSC)
    *   **Profile Picture:** `default_avatar.png`
    *   **Joined Date:** 2025-04-15
    *   **Subscription Tier:** Free Tier
    *   **DB Fields:** `isVerified` (Boolean, default: false), `verificationToken` (String, nullable), `verificationTokenExpiry` (Date, nullable), `lastLogin` (Date, nullable), `failedLoginAttempts` (Number, default: 0), `preferredLanguage` (String, default: 'English'), `phoneNumber` (String, nullable)
*   **Student User (Regular User):**
    *   **Name:** Rahul Verma
    *   **Email:** `rahul.verma.student@example.com`
    *   **Password:** (Hashed) `hashed_password_2`
    *   **Target Exams:** SSC CGL, Banking (IBPS PO)
    *   **Profile Picture:** `avatar_rahul.png`
    *   **Joined Date:** 2025-05-01
    *   **Subscription Tier:** Free Tier
*   **Student User (CUET Aspirant):**
    *   **Name:** Sameer Khan
    *   **Email:** `sameer.khan.student@example.com`
    *   **Password:** (Hashed) `hashed_password_3`
    *   **Target Exams:** CUET-UG (Science: Physics, Chemistry, Maths, English)
    *   **Profile Picture:** `avatar_sameer.png`
    *   **Joined Date:** 2025-05-03
    *   **Phone Number:** +91 9876543211
    *   **Preferred Language:** English
    *   **Subscription Tier:** Free Tier
*   **Admin User (Super Admin):**
    *   **Name:** Admin User
    *   **Email:** `admin@exambuddy.com`
    *   **Password:** (Hashed) `hashed_admin_password`
    *   **Role:** `SuperAdmin` (Manages users, exams, tests, questions, settings)
*   **Admin User (Exam Manager):**
    *   **Name:** Anjali Gupta
    *   **Email:** `anjali.gupta.manager@example.com`
    *   **Password:** (Hashed) `hashed_manager_password`
    *   **Role:** `ExamManager` (Manages assigned exam categories: e.g., Civil Services, University Entrance)

### Dummy Exam Categories

*   **Category Name:** Civil Services
    *   **Description:** Exams for central and state civil services.
    *   **Exams within:** UPSC CSE, State PSCs (UPPSC, BPSC, etc.)
    *   **Managed By:** `anjali.gupta.manager@example.com`
*   **Category Name:** SSC (Staff Selection Commission)
    *   **Description:** Exams for Group B and C government posts.
    *   **Exams within:** SSC CGL, SSC CHSL, SSC MTS
    *   **Managed By:** `admin@exambuddy.com`
*   **Category Name:** Banking
    *   **Description:** Exams for Public Sector Banks.
    *   **Exams within:** IBPS PO, IBPS Clerk, SBI PO, SBI Clerk
    *   **Managed By:** `admin@exambuddy.com`

Admin features for bulk import/export of questions (e.g., via Excel/CSV).
Admin review and approval workflow for new/edited questions.