# Exam Buddy

Exam Buddy is a comprehensive mock test platform designed to help users prepare effectively for various exams. It allows users to take mock tests, track their progress, and manage exam content.

## ✨ Core Features

### User Management
- Secure user registration and login (JWT-based)
- Role-based access control (Admin/User)
- User profile management
- Detailed progress tracking (test history, scores, performance analysis)
- (Planned) Achievement system

### Exam & Mock Test Management
- Support for diverse exam types (Civil Services, University Entrance, Govt Recruitment, etc.)
- Definition of complex exam structures (multiple papers, sections)
- Detailed configuration for exams (subjects, marks, duration, negative marking, languages)
- Creation of various mock test types (Full-Length, Sectional, Subject-wise, Topic-wise, PYQPs)
- Realistic test-taking interface (timer, navigation, review marking)
- Question bank with multiple question types (MCQs, Assertion-Reasoning, Matching, etc.)
- Detailed question attributes (subject, topic, difficulty, tags, explanations, media)

### Admin Capabilities
- User management console
- Exam and question bank administration
- Mock test configuration and scheduling
- Platform analytics overview

## 💻 Tech Stack

- **Mobile Client:** React Native (with Expo)
- **Web Client:** React (with Vite), Material-UI (or similar UI library), Redux (or Zustand/Context API for state management)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Docker, Docker Compose, Nginx (as reverse proxy in production)

## 🏗️ Project Structure Overview

*(Note: The root directory contains the Expo/React Native mobile app setup, including its `package.json`. The `client/` directory contains the separate web application, and `server/` contains the backend API.)*

- **`client/`**: Contains the React/Vite web frontend application.
- **`server/`**: Contains the Node.js/Express backend application.
- **`docker/`**: Contains configurations, especially for Nginx in production (`docker/nginx/`).
- **`docs/`**: Contains project documentation (`PROJECT_REQUIREMENTS.md`, etc.).
- **`docker-compose.dev.yml`**: Docker Compose configuration for the development environment.
- **`docker-compose.prod.yml`**: Docker Compose configuration for the production environment.
- **`client/Dockerfile`**: Builds the production frontend image (served via Nginx).
- **`server/Dockerfile`**: Builds the production backend image.

### Detailed Structure

```
exam-buddy/
├── client/                 # Frontend React/Vite application
│   ├── public/             # Static assets (served directly)
│   ├── src/                # Frontend source code
│   │   ├── assets/         # Images, fonts, etc. bundled by Vite
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context providers (if used)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layout components
│   │   ├── pages/          # Page-level components/views
│   │   ├── services/       # API communication logic
│   │   ├── store/          # State management (Redux, Zustand, etc.)
│   │   ├── styles/         # Global styles, themes
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── Dockerfile          # Builds the production Nginx image
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files (db, env vars)
│   ├── controllers/        # Route handler logic (connects routes and services)
│   ├── middleware/         # Express middleware (auth, error handling, validation)
│   ├── models/             # Mongoose data models/schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic layer (interacts with models)
│   ├── utils/              # Utility functions (logger, helpers)
│   ├── validations/        # Request validation schemas/rules
│   ├── tests/              # Backend tests
│   ├── scripts/            # Utility & automation scripts (seeding, etc.)
│   ├── .env.example        # Example environment variables file
│   ├── Dockerfile          # Builds the production backend image
│   ├── package.json        # Backend dependencies & scripts
│   └── start.js            # Application startup script (DB connection, server listen)
│   └── app.js              # Core Express application setup
│
├── docker/                 # Docker support files (e.g., Nginx config)
│   └── nginx/
│       └── nginx.conf
│       └── conf.d/
│       └── ssl/
│
├── docs/                   # Project documentation
│   └── PROJECT_REQUIREMENTS.md
│   └── DEVELOPMENT_LOG.md
│
├── .git/                   # Git repository data
├── .github/                # GitHub Actions, issue templates, etc.
├── assets/                 # Root assets (e.g., for Expo mobile app)
├── .gitignore              # Files ignored by Git
├── .dockerignore           # Files ignored by Docker build context
├── docker-compose.dev.yml  # Development Docker Compose setup
├── docker-compose.prod.yml # Production Docker Compose setup
├── eas.json                # Expo Application Services config
├── package.json            # Root/Mobile App package file & workspace commands
├── package-lock.json       # Root lock file
├── CHANGELOG.md            # Project change history
└── README.md               # This file
```

#### Example Client (`client/src/`) Structure
```
src/
├── assets/             # Static assets like images, fonts
│   ├── images/
│   └── fonts/
├── components/         # Reusable UI components (dumb components)
│   ├── common/           # General purpose components (Button, Modal, etc.)
│   ├── layout/           # Layout components (Navbar, Footer, Sidebar)
│   └── features/         # Components specific to a feature (e.g., ExamCard)
├── contexts/           # React Context API providers
├── hooks/              # Custom React hooks (e.g., useAuth, useApi)
├── layouts/            # Page layout wrappers (e.g., MainLayout, AuthLayout)
├── pages/              # Top-level page components (routed components)
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── ExamDetailsPage.jsx
│   └── AdminDashboardPage.jsx
├── services/           # API interaction layer (e.g., authService.js)
├── store/              # Global state management (e.g., Redux, Zustand)
│   ├── slices/         # State slices/reducers
│   ├── index.js        # Store configuration
│   └── hooks.js        # Typed hooks for state access
├── styles/             # Global styles, themes, CSS modules base
├── types/              # TypeScript type definitions (if using TS)
├── utils/              # Utility functions (formatters, validators)
├── App.jsx             # Root component setting up routes, providers
└── main.jsx            # Application entry point (renders App)
```

#### Example Server (`server/`) Structure
```
server/
├── config/             # Configuration (env vars, database)
│   ├── config.js
│   └── db.js
├── controllers/        # Request handlers (receive req, call service, send res)
│   ├── authController.js
│   └── examController.js
├── middleware/         # Express middleware functions
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/             # Mongoose schemas and models
│   ├── User.js
│   └── Exam.js
├── routes/             # API route definitions (maps URL paths to controllers)
│   ├── index.js        # Main router combining feature routes
│   ├── authRoutes.js
│   └── examRoutes.js
├── scripts/            # Utility/automation scripts
│   ├── seeder.js
│   └── testConnection.js
├── services/           # Business logic layer
│   ├── authService.js
│   └── examService.js
├── tests/              # Automated tests (unit, integration)
├── utils/              # Helper utilities (logger, apiFeatures, email)
│   ├── logger.js
│   └── email.js
├── validations/        # Request validation schemas (e.g., using express-validator)
│   └── authValidation.js
├── .env.example        # Example environment variables
├── app.js              # Express app configuration (middleware, routes)
├── Dockerfile          # Server Docker build instructions
├── package.json        # Server dependencies
└── start.js            # Server startup (connects DB, starts listening)
```

## 🛠️ Prerequisites

- Node.js (v20+ recommended, used in Dockerfiles)
- npm (v9+)
- Docker & Docker Compose

## 🚀 Getting Started with Docker (Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/exam-buddy.git
cd exam-buddy
```

### 2. Set up Environment Variables

The backend server requires environment variables. Copy the example file and configure it:

```bash
# Navigate to the server directory if you haven't already
# cd server
cp .env.example .env
# Edit server/.env with your specific settings (see Environment Variables section below)
```
*(Ensure `server/.env.example` exists and lists required variables like `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`)*

*(Note: The client application might load configuration from environment variables defined directly in the compose files or during its build process, e.g., `VITE_API_URL`)*

### 3. Run Development Environment

This uses `docker-compose.dev.yml` which includes hot-reloading for both client and server.

```bash
docker compose -f docker-compose.dev.yml up --build -d
```
*(`-d` runs containers in detached mode)*

- **Frontend:** Access at [http://localhost:3000](http://localhost:3000)
- **Backend API:** Available at [http://localhost:5000](http://localhost:5000)
- **MongoDB:** Connects internally via Docker network (`mongodb://mongo:27017/exam-buddy-dev`)

### 4. Run Production Environment

This uses `docker-compose.prod.yml`, building production-ready images and running behind an Nginx reverse proxy.

```bash
# Ensure required environment variables like JWT_SECRET are set in your shell
# export JWT_SECRET="your_production_jwt_secret_here"

docker compose -f docker-compose.prod.yml up --build -d
```

- **Application (via Nginx):** Access at [http://localhost:80](http://localhost:80) (or https://localhost:443 if SSL is configured in Nginx)
- **MongoDB:** Connects internally (`mongodb://mongo:27017/exam-buddy-prod`)

## ⚙️ Environment Variables

Key environment variables required by the **server** (set in `server/.env`):

- `NODE_ENV`: Set to `development` or `production`.
- `PORT`: The port the backend server listens on (e.g., `5000`).
- `MONGODB_URI`: Connection string for your MongoDB database (e.g., `mongodb://mongo:27017/exam-buddy-dev` for Docker dev).
- `JWT_SECRET`: A strong, secret string for signing JWT tokens.
- `JWT_EXPIRES_IN`: Token expiration time (e.g., `30d`).
- `CLIENT_URL`: The base URL of the frontend application (used for CORS, redirects, etc., e.g., `http://localhost:3000` for dev).
- `EMAIL_SERVICE`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`: (Optional) For email functionalities like password reset.

*(Refer to `server/config/config.js` for potentially more variables and defaults)*

*(Note: Client applications might require their own environment variables, e.g., `VITE_API_URL` for the web client set in `client/.env` or via Docker Compose, or variables configured via `app.config.js`/`app.json` for the mobile client.)*

## 🐳 Other Docker Commands

- **Stop Containers:** (Use the correct `-f` flag)
  ```bash
  docker compose -f docker-compose.dev.yml down
  # or
  docker compose -f docker-compose.prod.yml down
  ```

- **View Logs:**
  ```bash
  docker compose -f docker-compose.dev.yml logs -f
  # or specific service logs:
  docker compose -f docker-compose.prod.yml logs -f backend
  ```

- **Access Shell in Container:**
  ```bash
  docker compose -f docker-compose.dev.yml exec backend /bin/sh
  ```

## 💻 Manual Setup (Without Docker)

*(Requires separate manual setup of Node.js, npm, and MongoDB)*

1.  Install dependencies in both `client/` and `server/` directories:
    ```bash
    npm install --prefix server
    npm install --prefix client
    ```
2.  Set up `server/.env` as described in the "Getting Started" section. Ensure `MONGODB_URI` points to your manually running MongoDB instance.
3.  Start the backend (from root directory):
    ```bash
    npm run dev --prefix server
    ```
4.  Start the frontend (from root directory, in a new terminal):
    ```bash
    npm run dev --prefix client
    ```
- Access frontend at `http://localhost:3000` (or the port specified by Vite).
- Backend API at `http://localhost:5000`.

## 🧪 Running Tests

*(Ensure test setup is configured correctly in `client/` and `server/`)*

```bash
# Run backend tests
npm test --prefix server

# Run backend tests with coverage
npm run test:coverage --prefix server

# Run frontend tests
npm test --prefix client
```

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5. Push to the branch (`git push origin feature/YourAmazingFeature`).
6. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details (if available).

## 📚 Documentation

Further documentation can be found in the `docs/` directory:

*   **Project Requirements:** `docs/PROJECT_REQUIREMENTS.md`
*   **Development Log & Strategy:** `docs/DEVELOPMENT_LOG.md`
*   **Architecture Overview:** `docs/architecture/overview.md`
*   **API Documentation:** *(Placeholder/To Be Generated)* `docs/api/README.md`
*   **Contributing Guidelines:** *(Placeholder)* `docs/CONTRIBUTING.md`
*   **Deployment Guide:** *(Placeholder)* `docs/DEPLOYMENT.md`

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Material-UI](https://mui.com/)
