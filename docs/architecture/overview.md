# Architecture Overview

## System Architecture

Exam Buddy follows a modular architecture separating frontend clients (Web and Mobile) from the backend API and database.

```mermaid
graph LR
    UserWeb[Web User (Browser)] --> ClientWeb(Client - React/Vite);
    UserMobile[Mobile User (Expo App)] --> ClientMobile(Client - React Native/Expo);
    
    ClientWeb --> Nginx(Nginx - Prod Only);
    Nginx --> Backend(Backend - Node/Express API);
    ClientMobile --> Backend;
    
    Backend --> Database[(Database - MongoDB)];
```
*(Note: In development, ClientWeb often connects directly to Backend)*

## Technology Stack

*(Based on current setup and refined requirements)*

### Mobile Client
- **Framework:** React Native (with Expo managed workflow)
- **UI Library:** TBD (e.g., React Native Paper)
- **Navigation:** React Navigation
- **State Management:** TBD

### Web Client
- **Framework**: React (with Vite bundler)
- **UI Library**: TBD (e.g., Material-UI, Mantine)
- **Routing**: React Router v6
- **State Management**: TBD
- **HTTP Client**: Axios or Fetch API

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (Access/Refresh Tokens)
- **API Documentation**: To Be Implemented (Recommend OpenAPI/Swagger)
- **File Storage**: Cloudinary / AWS S3 (via Multer)
- **Logging**: Winston

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose (`dev` and `prod` configurations)
- **Web Server (Prod):** Nginx
- **CI/CD**: TBD (e.g., GitHub Actions)
- **Monitoring**: TBD

## Directory Structure

*(Refer to the main project README.md for the canonical high-level and detailed example structures)*

<!-- Remove outdated specific structure diagrams below if they conflict with README -->

## Data Flow

*(High-level examples)*

1.  **Authentication Flow (Web/Mobile)**
    *   User submits credentials (email/password).
    *   Backend validates credentials, checks verification status.
    *   If valid, backend generates JWT Access and Refresh tokens.
    *   Tokens are sent back to the client.
    *   Client stores tokens securely (e.g., AsyncStorage for mobile, secure storage/memory for web).
    *   Subsequent API requests include the Access Token in the `Authorization: Bearer` header.
    *   Backend middleware validates the token on protected routes.
    *   Refresh token used to obtain new access tokens when expired.

2.  **Exam Taking Flow (Web/Mobile)**
    *   User selects a Mock Test.
    *   Client requests test details and associated questions from the Backend API.
    *   Backend retrieves test config and question data.
    *   Client renders the Test Interface.
    *   User submits answers periodically (auto-save) or at the end.
    *   Backend API receives answers, updates/creates the TestAttempt record.
    *   Upon final submission, Backend calculates score, accuracy, time, etc.
    *   Client requests and displays the results.

## Security Considerations

*(Refer to PROJECT_REQUIREMENTS.md for detailed requirements)*

- Enforce HTTPS.
- Secure JWT handling (short expiry for access tokens, secure storage/transport).
- Robust input validation (client/server).
- Protect against OWASP Top 10.
- Role-based access control at API level.
- Rate limiting.
- Security headers (Helmet).
- Regular dependency vulnerability scans.

## Performance Considerations

*(Refer to PROJECT_REQUIREMENTS.md for detailed requirements)*

- Database indexing on frequently queried fields.
- API response pagination.
- Efficient query design.
- Frontend code splitting / lazy loading.
- Caching strategies (API responses, static assets).
- Optimize image/media delivery (e.g., via Cloudinary).

## Architecture Decision Records (ADRs)

*(Consider adding ADRs here for significant architectural choices, e.g., choice of state management library, database selection justification, etc.)*

```
docs/architecture/
├── overview.md       # This file
└── adrs/             # Directory for ADR markdown files
    ├── 001-record-architecture-decisions.md
    └── ...
```
