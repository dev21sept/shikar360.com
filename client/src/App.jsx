import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import ComparePage from './pages/ComparePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import StudyAbroadPage from './pages/StudyAbroadPage';
import WishlistPage from './pages/WishlistPage';
import DashboardPage from './pages/DashboardPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import QnAPage from './pages/QnAPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import PredictorPage from './pages/PredictorPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CareerCompassPage from './pages/CareerCompassPage';
import MockTestsPage from './pages/MockTestsPage';
import MockTestAttemptPage from './pages/MockTestAttemptPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/colleges/:slug" element={<CollegeDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/study-abroad" element={<StudyAbroadPage type="general" />} />
          <Route path="/study-abroad/:country" element={<StudyAbroadPage type="general" />} />
          <Route path="/mbbs-abroad" element={<StudyAbroadPage type="mbbs" />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:slug" element={<ExamDetailPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/qna" element={<QnAPage />} />
          <Route path="/qna/:id" element={<QuestionDetailPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/career-compass" element={<CareerCompassPage />} />
          <Route path="/mock-tests" element={<MockTestsPage />} />
          <Route path="/mock-tests/:id" element={<MockTestAttemptPage />} />
          
          {/* Multi-role Dashboards */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/student" replace />} />
          <Route path="/dashboard/:role" element={<DashboardPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
