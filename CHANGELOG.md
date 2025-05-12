# Changelog

All notable changes to the Exam Buddy project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project initialization with basic structure
- Authentication system with JWT
- User model and authentication controllers
- Error handling middleware
- Input validation middleware
- Configuration management
- Database connection utility
- Server startup script
- API documentation setup
- Stub implementations for `getAllUsers`, `getUserById`, `updateUser`, and `deleteUser` in `server/controllers/admin/adminController.js` to facilitate admin route functionality.

### Changed
- Updated project dependencies
- Improved error handling in authentication flow
- Enhanced validation middleware
- Refactored configuration management
- Standardized Docker setup using Node 20-alpine in multi-stage builds for client (Nginx) and server.
- Consolidated Docker Compose configuration into `docker-compose.dev.yml` and `docker-compose.prod.yml`.
- Updated `README.md` to accurately reflect Docker usage, ports, Node version, and project structure.
  Consolidated and enhanced `README.md` with more detailed feature descriptions, tech stack, environment variable guidance, refined setup instructions, and example client/server structure diagrams.
- Moved `PROJECT_REQUIREMENTS.md` and `DEVELOPMENT_LOG.md` into `docs/` directory.
- Updated `.gitignore` to ignore `.bak*` and `.windsurfrules` files.
- Updated `.dockerignore` for more effective build context minimization.
- Cleaned up and separated dependencies between root (mobile), `server/`, and `client/` `package.json` files.
- Relocated core server app file (`server.js` -> `server/app.js`) and utility scripts (root `scripts/` -> `server/scripts/`).
- Refined `PROJECT_REQUIREMENTS.md` with details on user management, test interface, progress tracking, admin features, security, performance, DB schema, and technical stack based on real-world considerations.
- Updated `DEVELOPMENT_LOG.md` to reflect current status, outline development strategy, define refined phases, highlight considerations, and set immediate priorities.
- Updated `docs/architecture/overview.md` to align with current structure.
- Added placeholder `docs/CONTRIBUTING.md` and `docs/DEPLOYMENT.md`.
- Recommended OpenAPI/Swagger for API documentation in `docs/DEVELOPMENT_LOG.md`.
- Cleaned up `docker/` directory, removing potentially redundant files/folders.
- Added a Documentation section to `README.md` linking to files within `docs/`.
- Added Frontend Implementation Plan section to `docs/DEVELOPMENT_LOG.md`.
- Refactored frontend routing: Centralized routes in `routes/index.jsx`, simplified `App.jsx`, created placeholder layout components.
- Refactored RegisterPage to use Material UI components.
- Improved server startup stability by systematically debugging module import sequence.

### Fixed
- Fixed environment variable loading
- Resolved circular dependencies
- Fixed JWT token verification
- Fixed error handling in async routes
- Input validation edge cases
- Database connection issues
- Resolved server startup crashes caused by missing methods in `adminController` and incorrect named import for `logger` in `server/controllers/admin/adminController.js`.
- **Server Startup:** Resolved a critical bug preventing the backend server from starting. The issue was traced to an incorrect configuration destructuring in `server/index.js` where `serverConfig` was `undefined` due to a mismatch in how `server/config/config.js` exported its server-related settings. The `config.js` was updated to export a dedicated `server` object, and `server/index.js` was confirmed to correctly destructure it, enabling successful CORS middleware initialization and subsequent server startup.

### Removed
- Deleted redundant root `Dockerfile`.
- Deleted redundant `compose.yaml.bak`.
- Deleted redundant `Dockerfile.bak` files within `client/` and `server/`.
- (Attempted to delete various `.bak` files and old backup directory `exam-buddy-backup-20250505231849`, requires manual removal if still present).
- Deleted unused `database.rules.json`.
- Deleted potentially redundant `docker/docker-compose.yml`.
- Attempted deletion of other root files (`.env*`, `.DS_Store`, `.windsurfrules`) - may require manual cleanup.

## [0.1.0] - 2025-05-05
### Added
- Initial project setup
- Basic Express server configuration
- MongoDB connection setup
- Basic folder structure
- Git repository initialization

### Changed
- Updated README with project information
- Configured ESLint and Prettier
- Set up development environment

## [0.2.0] - 2025-05-05
### Added
- User authentication system
  - Register new users
  - Login with email/password
  - JWT token generation
  - Protected routes
  - Password reset flow
  - Email verification
- Error handling middleware
- Input validation
- API documentation
- Test environment setup

### Changed
- Improved project structure
- Updated dependencies
- Enhanced security configurations

### Fixed
- Environment variable loading issues
- Database connection problems
- API response formatting

## [0.3.0] - 2025-05-05
### Added
- Exam management system
  - Create and manage exams
  - Add/remove questions
  - Set time limits
  - Configure passing scores
- Question bank
  - CRUD operations for questions
  - Categorization
  - Difficulty levels
- User progress tracking
  - Exam history
  - Performance analytics
  - Score tracking

### Changed
- Improved API structure
- Enhanced error messages
- Optimized database queries

### Fixed
- Authentication token handling
- Input validation edge cases
- Database connection issues

[Unreleased]: https://github.com/brij5/exam-buddy/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/brij5/exam-buddy/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/brij5/exam-buddy/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/brij5/exam-buddy/releases/tag/v0.1.0
