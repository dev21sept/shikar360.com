import express from 'express';
import { requestOtp, verifyOtpAndLogin, passwordLogin, getMe } from '../controllers/authController.js';
import { getColleges, getCollegeBySlug, compareColleges, createCollege, updateCollege, deleteCollege } from '../controllers/collegeController.js';
import { getCategories, getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { createLead, getLeads, updateLeadStatus, addLeadActivity } from '../controllers/leadController.js';
import { getHomepageStats, getTestimonials } from '../controllers/statsController.js';
import { getAttendanceSummary, markAttendance, getStudentResults } from '../controllers/academicController.js';
import { getStudentLedger, payFee, getAccountsSummary } from '../controllers/feeController.js';
import { getExams, getExamBySlug, createExam, updateExam, deleteExam } from '../controllers/examController.js';
import { getScholarships, getScholarshipBySlug, createScholarship, updateScholarship, deleteScholarship } from '../controllers/scholarshipController.js';
import { getQuestions, getQuestionById, createQuestion, addAnswer, deleteQuestion } from '../controllers/qnaController.js';
import { createReview, deleteReview } from '../controllers/reviewController.js';
import { predictColleges, createCutoff, deleteCutoff } from '../controllers/predictorController.js';
import { createApplication, getMyApplications, getAllApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notificationController.js';
import { getMockTests, getMockTestForAttempt, submitMockAttempt, getMyAttempts, createMockTest, deleteMockTest } from '../controllers/mockTestController.js';
import { getCareerQuestions, submitCareerAssessment, getMyCareerAssessments } from '../controllers/careerController.js';
import { getPartnerStats } from '../controllers/partnerController.js';
import { authenticateToken, authorizeRoles, tenantIsolation } from '../middleware/auth.js';

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.get('/stats', getHomepageStats);
router.get('/testimonials', getTestimonials);

router.get('/colleges', getColleges);
router.get('/colleges/:slug', getCollegeBySlug);
router.get('/compare', compareColleges);

router.get('/categories', getCategories);
router.get('/courses', getCourses);
router.get('/courses/:slug', getCourseBySlug);

router.post('/leads', createLead);

router.get('/exams', getExams);
router.get('/exams/:slug', getExamBySlug);

router.get('/scholarships', getScholarships);
router.get('/scholarships/:slug', getScholarshipBySlug);

router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionById);

router.get('/predictor/:examSlug', predictColleges);

router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);

router.get('/mock-tests', getMockTests);
router.get('/mock-tests/:id/attempt', getMockTestForAttempt);

router.get('/career/questions', getCareerQuestions);

// Auth
router.post('/auth/otp/request', requestOtp);
router.post('/auth/otp/verify', verifyOtpAndLogin);
router.post('/auth/login', passwordLogin);

// ================= PROTECTED ROUTES =================
router.get('/auth/me', authenticateToken, getMe);

// Leads & CRM
router.get('/leads', authenticateToken, authorizeRoles('counsellor', 'admin', 'super_admin'), getLeads);
router.patch('/leads/:id/status', authenticateToken, authorizeRoles('counsellor', 'admin', 'super_admin'), updateLeadStatus);
router.post('/leads/:id/activity', authenticateToken, authorizeRoles('counsellor', 'admin', 'super_admin'), addLeadActivity);

// Colleges Management (Admin / Super Admin / Tenant-isolated College Rep)
router.post('/colleges', authenticateToken, authorizeRoles('admin', 'super_admin'), createCollege);
router.put('/colleges/:id', authenticateToken, authorizeRoles('admin', 'super_admin', 'college_rep'), tenantIsolation, updateCollege);
router.delete('/colleges/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteCollege);

// Courses Management (Admin / Super Admin)
router.post('/courses', authenticateToken, authorizeRoles('admin', 'super_admin'), createCourse);
router.put('/courses/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), updateCourse);
router.delete('/courses/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteCourse);

// Academics & Attendance
router.get('/academic/attendance', authenticateToken, getAttendanceSummary);
router.post('/academic/attendance', authenticateToken, authorizeRoles('faculty', 'admin', 'super_admin'), markAttendance);
router.get('/academic/results', authenticateToken, getStudentResults);

// Fees & Payments
router.get('/fees/ledger', authenticateToken, getStudentLedger);
router.post('/fees/pay', authenticateToken, payFee);
router.get('/fees/summary', authenticateToken, authorizeRoles('accounts', 'admin', 'super_admin'), getAccountsSummary);

// Entrance Exams Management (Admin / Super Admin)
router.post('/exams', authenticateToken, authorizeRoles('admin', 'super_admin'), createExam);
router.put('/exams/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), updateExam);
router.delete('/exams/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteExam);

// Scholarships Management (Admin / Super Admin)
router.post('/scholarships', authenticateToken, authorizeRoles('admin', 'super_admin'), createScholarship);
router.put('/scholarships/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), updateScholarship);
router.delete('/scholarships/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteScholarship);

// Q&A Community
router.post('/questions', authenticateToken, createQuestion);
router.post('/questions/:id/answers', authenticateToken, addAnswer);
router.delete('/questions/:id', authenticateToken, authorizeRoles('moderator', 'admin', 'super_admin'), deleteQuestion);

// College Reviews
router.post('/reviews', authenticateToken, createReview);
router.delete('/reviews/:id', authenticateToken, authorizeRoles('moderator', 'admin', 'super_admin'), deleteReview);

// Predictor Cutoff Data Management (Admin / Super Admin)
router.post('/cutoffs', authenticateToken, authorizeRoles('admin', 'super_admin'), createCutoff);
router.delete('/cutoffs/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteCutoff);

// Common Application
router.post('/applications', authenticateToken, createApplication);
router.get('/applications/me', authenticateToken, getMyApplications);
router.get('/applications', authenticateToken, authorizeRoles('admin', 'super_admin', 'college_rep', 'counsellor'), getAllApplications);
router.patch('/applications/:id/status', authenticateToken, authorizeRoles('admin', 'super_admin', 'college_rep', 'counsellor'), updateApplicationStatus);

// Articles / CMS Management (Admin / Super Admin)
router.post('/articles', authenticateToken, authorizeRoles('admin', 'super_admin'), createArticle);
router.put('/articles/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), updateArticle);
router.delete('/articles/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteArticle);

// Notifications
router.get('/notifications', authenticateToken, getMyNotifications);
router.patch('/notifications/:id/read', authenticateToken, markNotificationRead);
router.patch('/notifications/read-all', authenticateToken, markAllNotificationsRead);

// Mock Tests
router.post('/mock-tests/:id/submit', authenticateToken, submitMockAttempt);
router.get('/mock-tests/me/attempts', authenticateToken, getMyAttempts);
router.post('/mock-tests', authenticateToken, authorizeRoles('admin', 'super_admin'), createMockTest);
router.delete('/mock-tests/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), deleteMockTest);

// Career Compass
router.post('/career/assess', submitCareerAssessment);
router.get('/career/me', authenticateToken, getMyCareerAssessments);

// Partner Portal
router.get('/partner/stats', authenticateToken, authorizeRoles('partner'), getPartnerStats);

export default router;
