import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Removed useSelector import, assuming ProtectedRoute handles it
import { Box } from '@mui/material'; // Keep Box for potential layout use within routes

// Common Components
import ProtectedRoute from '../components/common/ProtectedRoute'; // Changed to default import
import NavigationMenu from '../components/common/NavigationMenu'; // Import NavigationMenu
import AuthLayout from '../layouts/AuthLayout'; // Conceptual: To be created

// Page Components (ensure all needed pages are imported)
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx"; // Assuming path correction
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx"; // Assuming path correction
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
// import NotFoundPage from '../pages/NotFoundPage'; // Path updated - Commented out as file not found
import VerifyEmailPage from "../pages/auth/VerifyEmailPage.jsx"; // Assuming path correction
import SplashScreen from "../pages/SplashScreen"; // Added
import DashboardPage from "../pages/DashboardPage";
import AdminDashboardPage from "../pages/admin/AdminDashboard.jsx"; // Corrected path and filename
import CategoryManagementPage from "../pages/admin/CategoryManagementPage.jsx"; // Import CategoryManagementPage
import ExamManagerDashboard from '../pages/exam-manager/ExamManagerDashboard.jsx'; // Import ExamManagerDashboard
import ExamInstructionsPage from '../pages/tests/ExamInstructionsPage.jsx'; // Corrected import for ExamInstructionsPage
import Logout from '../components/auth/Logout'; // Added Logout import

// Placeholder imports for new student pages - create these files later
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import ExamDetailsPage from '../pages/exams/ExamDetailsPage.jsx'; // Changed import
import MockTestList from '../pages/student/MockTestList.jsx';
import AllExamsPage from '../pages/student/AllExamsPage.jsx'; // Corrected path
import ExamsByCategoryPage from '../pages/exams/ExamsByCategoryPage.jsx'; // Path updated
import StudentProgressPage from '../pages/student/StudentProgressPage.jsx'; // Corrected path
import ProfilePage from '../pages/ProfilePage'; // Path updated (assuming it's in /pages directly)
import SettingsPage from '../pages/SettingsPage'; // Path updated
import ExamListPage from '../pages/exams/ExamListPage.jsx'; // Added import for ExamListPage
import TestAttemptPage from '../pages/tests/TestAttemptPage.jsx'; // Added new import
import TestResultPage from '../pages/tests/TestResultPage.jsx'; // Added new import
import MockTestScreen from '../pages/tests/MockTestScreenPage.jsx'; // Updated import for MockTestScreen

// Removed local ProtectedRoute definition

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Routes without specific layout (e.g., Splash) */}
      <Route path="/" element={<SplashScreen />} />

      {/* Public routes with Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        {/* Add forgot/reset password routes here? */}
      </Route>

      {/* Logout Route - can be here or within a protected section if preferred */}
      {/* Since it navigates away immediately, its position relative to layouts is less critical */}
      <Route path="/logout" element={<Logout />} />

      {/* Protected routes with NavigationMenu Layout */}
      <Route element={<ProtectedRoute><NavigationMenu /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/exam/:examId/instructions" element={<ExamInstructionsPage />} />
        <Route path="/mock-test/:examId" element={<MockTestScreen />} /> {/* Route to take a test */}
        
        {/* Student specific routes */}
        <Route path="/exams" element={<AllExamsPage />} />
        <Route path="/exams/category/:categoryId" element={<ExamsByCategoryPage />} />
        <Route path="/exams/:examId/details" element={<ExamDetailsPage />} /> {/* New route for ExamDetailsPage */}
        <Route path="/results/:attemptId" element={<TestResultPage />} />
        <Route path="/progress" element={<StudentProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Add other user routes here: /test/:id, /results/:id etc. */}
        {/* === New Student Routes === */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/exam/:examId/mock-tests" element={<MockTestList />} />
        <Route path="/student/mock-test/:testId/attempt" element={<TestAttemptPage />} />
        <Route path="/student/test-result/:testId" element={<TestResultPage />} />
      </Route>
      
      {/* Admin routes with NavigationMenu Layout (or dedicated AdminLayout) */}
      <Route element={<ProtectedRoute adminRequired><NavigationMenu /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/categories" element={<CategoryManagementPage />} />
        {/* Add other admin routes here: /admin/users, /admin/exams, etc. */}
      </Route>

      {/* Exam Manager routes with NavigationMenu Layout */}
      <Route element={<ProtectedRoute examManagerRequired><NavigationMenu /></ProtectedRoute>}>
        <Route path="/exam-manager/dashboard" element={<ExamManagerDashboard />} />
        <Route path="/exam-manager/exams" element={<ExamListPage />} /> {/* Added route for ExamListPage */}
        {/* Add other exam manager routes here: /exam-manager/create-exam etc. */}
      </Route>

      {/* Catch all / 404 Route */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} /> // Or redirect to a 404 page

    </Routes>
  );
};

export default RoutesComponent;
