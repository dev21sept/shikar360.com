import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shikhar360_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getHomepageStats = async () => {
  try {
    const res = await api.get('/stats');
    return res.data;
  } catch (err) {
    return {
      success: true,
      stats: {
        colleges: '2,500+',
        universities: '1,200+',
        courses: '50,000+',
        studentsAssisted: '10 Lakh+',
        enquiriesThisMonth: '25,000+',
        expertCounsellors: '500+',
        yearsOfExperience: '15+'
      }
    };
  }
};

export const getColleges = async (params = {}) => {
  try {
    const res = await api.get('/colleges', { params });
    return res.data;
  } catch (err) {
    return { success: false, colleges: [] };
  }
};

export const getCollegeBySlug = async (slug) => {
  try {
    const res = await api.get(`/colleges/${slug}`);
    return res.data;
  } catch (err) {
    return { success: false, college: null };
  }
};

export const compareColleges = async (ids) => {
  try {
    const res = await api.get(`/compare?ids=${ids}`);
    return res.data;
  } catch (err) {
    return { success: false, colleges: [] };
  }
};

export const getCourses = async (params = {}) => {
  try {
    const res = await api.get('/courses', { params });
    return res.data;
  } catch (err) {
    return { success: false, courses: [] };
  }
};

export const getCourseBySlug = async (slug) => {
  try {
    const res = await api.get(`/courses/${slug}`);
    return res.data;
  } catch (err) {
    return { success: false, course: null };
  }
};

export const createCollege = async (data) => {
  try {
    const res = await api.post('/colleges', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to create college' };
  }
};

export const updateCollege = async (id, data) => {
  try {
    const res = await api.put(`/colleges/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update college' };
  }
};

export const deleteCollege = async (id) => {
  try {
    const res = await api.delete(`/colleges/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to delete college' };
  }
};

export const createCourse = async (data) => {
  try {
    const res = await api.post('/courses', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to create course' };
  }
};

export const updateCourse = async (id, data) => {
  try {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update course' };
  }
};

export const deleteCourse = async (id) => {
  try {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to delete course' };
  }
};

// ============ Entrance Exams ============
export const getExams = async (params = {}) => {
  try {
    const res = await api.get('/exams', { params });
    return res.data;
  } catch (err) {
    return { success: false, exams: [] };
  }
};

export const getExamBySlug = async (slug) => {
  try {
    const res = await api.get(`/exams/${slug}`);
    return res.data;
  } catch (err) {
    return { success: false, exam: null };
  }
};

export const createExam = async (data) => {
  try {
    const res = await api.post('/exams', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to create exam' };
  }
};

export const updateExam = async (id, data) => {
  try {
    const res = await api.put(`/exams/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update exam' };
  }
};

export const deleteExam = async (id) => {
  try {
    const res = await api.delete(`/exams/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to delete exam' };
  }
};

// ============ Scholarships ============
export const getScholarships = async (params = {}) => {
  try {
    const res = await api.get('/scholarships', { params });
    return res.data;
  } catch (err) {
    return { success: false, scholarships: [] };
  }
};

export const getScholarshipBySlug = async (slug) => {
  try {
    const res = await api.get(`/scholarships/${slug}`);
    return res.data;
  } catch (err) {
    return { success: false, scholarship: null };
  }
};

export const createScholarship = async (data) => {
  try {
    const res = await api.post('/scholarships', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to create scholarship' };
  }
};

export const updateScholarship = async (id, data) => {
  try {
    const res = await api.put(`/scholarships/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update scholarship' };
  }
};

export const deleteScholarship = async (id) => {
  try {
    const res = await api.delete(`/scholarships/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to delete scholarship' };
  }
};

// ============ Q&A Community ============
export const getQuestions = async (params = {}) => {
  try {
    const res = await api.get('/questions', { params });
    return res.data;
  } catch (err) {
    return { success: false, questions: [] };
  }
};

export const getQuestionById = async (id) => {
  try {
    const res = await api.get(`/questions/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, question: null };
  }
};

export const postQuestion = async (data) => {
  try {
    const res = await api.post('/questions', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to post question' };
  }
};

export const postAnswer = async (questionId, body) => {
  try {
    const res = await api.post(`/questions/${questionId}/answers`, { body });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to post answer' };
  }
};

// ============ Articles / CMS ============
export const getArticles = async (params = {}) => {
  try {
    const res = await api.get('/articles', { params });
    return res.data;
  } catch (err) {
    return { success: false, articles: [] };
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const res = await api.get(`/articles/${slug}`);
    return res.data;
  } catch (err) {
    return { success: false, article: null };
  }
};

export const createArticle = async (data) => {
  try {
    const res = await api.post('/articles', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to create article' };
  }
};

export const updateArticle = async (id, data) => {
  try {
    const res = await api.put(`/articles/${id}`, data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update article' };
  }
};

export const deleteArticle = async (id) => {
  try {
    const res = await api.delete(`/articles/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to delete article' };
  }
};

// ============ Notifications ============
export const getMyNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    return res.data;
  } catch (err) {
    return { success: false, notifications: [], unreadCount: 0 };
  }
};

export const markNotificationRead = async (id) => {
  try {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

// ============ Mock Tests ============
export const getMockTests = async () => {
  try {
    const res = await api.get('/mock-tests');
    return res.data;
  } catch (err) {
    return { success: false, tests: [] };
  }
};

export const getMockTestForAttempt = async (id) => {
  try {
    const res = await api.get(`/mock-tests/${id}/attempt`);
    return res.data;
  } catch (err) {
    return { success: false, test: null };
  }
};

export const submitMockAttempt = async (id, answers, startedAt) => {
  try {
    const res = await api.post(`/mock-tests/${id}/submit`, { answers, startedAt });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to submit attempt' };
  }
};

export const getMyMockAttempts = async () => {
  try {
    const res = await api.get('/mock-tests/me/attempts');
    return res.data;
  } catch (err) {
    return { success: false, attempts: [] };
  }
};

// ============ Career Compass ============
export const getCareerQuestions = async () => {
  try {
    const res = await api.get('/career/questions');
    return res.data;
  } catch (err) {
    return { success: false, questions: [] };
  }
};

export const submitCareerAssessment = async (answers) => {
  try {
    const res = await api.post('/career/assess', { answers });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to process assessment' };
  }
};

export const getMyCareerAssessments = async () => {
  try {
    const res = await api.get('/career/me');
    return res.data;
  } catch (err) {
    return { success: false, assessments: [] };
  }
};

// ============ Partner Portal ============
export const getPartnerStats = async () => {
  try {
    const res = await api.get('/partner/stats');
    return res.data;
  } catch (err) {
    return { success: false, referredCount: 0, convertedCount: 0, commissionEarned: 0, leads: [] };
  }
};

// ============ College Predictor ============
export const predictColleges = async (examSlug, rank, category = 'General') => {
  try {
    const res = await api.get(`/predictor/${examSlug}`, { params: { rank, category } });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Prediction failed', results: [] };
  }
};

// ============ College Reviews ============
export const submitReview = async (data) => {
  try {
    const res = await api.post('/reviews', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to submit review' };
  }
};

// ============ Common Application ============
export const submitApplication = async (data) => {
  try {
    const res = await api.post('/applications', data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to submit application' };
  }
};

export const getMyApplications = async () => {
  try {
    const res = await api.get('/applications/me');
    return res.data;
  } catch (err) {
    return { success: false, applications: [] };
  }
};

export const getAllApplications = async () => {
  try {
    const res = await api.get('/applications');
    return res.data;
  } catch (err) {
    return { success: false, applications: [] };
  }
};

export const updateApplicationStatus = async (id, status, remarks) => {
  try {
    const res = await api.patch(`/applications/${id}/status`, { status, remarks });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to update application' };
  }
};

export const getTestimonials = async () => {
  try {
    const res = await api.get('/testimonials');
    return res.data;
  } catch (err) {
    return { success: false, testimonials: [] };
  }
};

export const submitLead = async (leadData) => {
  try {
    const res = await api.post('/leads', leadData);
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Failed to submit' };
  }
};

export const requestOtp = async (phone) => {
  try {
    const res = await api.post('/auth/otp/request', { phone });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Error sending OTP' };
  }
};

export const verifyOtpAndLogin = async (phone, otp, fullName, roleName) => {
  try {
    const res = await api.post('/auth/otp/verify', { phone, otp, fullName, roleName });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Verification failed' };
  }
};

export const passwordLogin = async (identifier, password) => {
  try {
    const res = await api.post('/auth/login', { identifier, password });
    return res.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || 'Login failed' };
  }
};

export const getMe = async () => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const getLeads = async (params = {}) => {
  try {
    const res = await api.get('/leads', { params });
    return res.data;
  } catch (err) {
    return { success: false, leads: [] };
  }
};

export const updateLeadStatus = async (id, status, remarks) => {
  try {
    const res = await api.patch(`/leads/${id}/status`, { status, remarks });
    return res.data;
  } catch (err) {
    return { success: false, message: 'Failed to update' };
  }
};

export const getAttendanceSummary = async (studentId) => {
  try {
    const res = await api.get('/academic/attendance', { params: { studentId } });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const getStudentResults = async (studentId) => {
  try {
    const res = await api.get('/academic/results', { params: { studentId } });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const getStudentLedger = async (studentId) => {
  try {
    const res = await api.get('/fees/ledger', { params: { studentId } });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const payFee = async (ledgerId, amount, paymentMethod) => {
  try {
    const res = await api.post('/fees/pay', { ledgerId, amount, paymentMethod });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const getAccountsSummary = async () => {
  try {
    const res = await api.get('/fees/summary');
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export default api;
