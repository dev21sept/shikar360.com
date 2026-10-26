import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import BarChart from '../components/charts/BarChart';
import SegmentedBar from '../components/charts/SegmentedBar';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import { 
  Users, 
  Building2, 
  BookOpen, 
  PhoneCall, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  Calendar, 
  GraduationCap, 
  FileCheck, 
  TrendingUp, 
  DollarSign, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight,
  Plus,
  RefreshCw,
  LogOut,
  Award,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getLeads,
  updateLeadStatus,
  getAttendanceSummary,
  getStudentResults,
  getStudentLedger,
  payFee,
  getAccountsSummary,
  getColleges,
  getCourses,
  createCollege,
  updateCollege,
  deleteCollege,
  createCourse,
  updateCourse,
  deleteCourse,
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getPartnerStats,
  getMyMockAttempts,
  getMyCareerAssessments,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle
} from '../services/api';

const emptyCollegeForm = { name: '', city: '', state: '', universityType: 'Private', establishedYear: '', overview: '', logoUrl: '', bannerUrl: '' };
const emptyCourseForm = { name: '', code: '', level: 'UG', iconName: 'BookOpen' };
const emptyExamForm = { name: '', shortName: '', conductingBody: '', stream: 'Engineering', level: 'UG', status: 'Upcoming' };
const emptyScholarshipForm = { name: '', provider: '', category: 'Merit-based', benefitAmount: '', status: 'Open' };
const emptyArticleForm = { title: '', excerpt: '', content: '', category: 'Admission News', status: 'Published' };

const DashboardPage = () => {
  const { role: routeRole } = useParams();
  const { user, switchRoleDemo, logout } = useAuth();
  const navigate = useNavigate();

  // Active role can come from logged-in user or route parameter
  const activeRole = routeRole || user?.role || 'student';

  // Active section in the left sidebar (admin/super_admin roles)
  const [activeSection, setActiveSection] = useState('overview');

  // Leads state for counsellor / admin
  const [leads, setLeads] = useState([]);
  const [leadLoading, setLeadLoading] = useState(false);

  // Attendance & Academic state for student / parent / faculty
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  
  // Fee state for student / parent / accounts
  const [ledger, setLedger] = useState(null);
  const [accountsMetrics, setAccountsMetrics] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Colleges & Courses for admin / superadmin / college rep
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  // Admin CRUD modal state
  const [collegeModalOpen, setCollegeModalOpen] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState(null);
  const [collegeForm, setCollegeForm] = useState(emptyCollegeForm);
  const [collegeSaving, setCollegeSaving] = useState(false);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseSaving, setCourseSaving] = useState(false);

  const [exams, setExams] = useState([]);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [examForm, setExamForm] = useState(emptyExamForm);
  const [examSaving, setExamSaving] = useState(false);

  const [scholarships, setScholarships] = useState([]);
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [editingScholarshipId, setEditingScholarshipId] = useState(null);
  const [scholarshipForm, setScholarshipForm] = useState(emptyScholarshipForm);
  const [scholarshipSaving, setScholarshipSaving] = useState(false);

  // Common Application tracking
  const [myApplications, setMyApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);

  const [partnerStats, setPartnerStats] = useState(null);
  const [myMockAttempts, setMyMockAttempts] = useState([]);
  const [myCareerAssessments, setMyCareerAssessments] = useState([]);

  const [articles, setArticles] = useState([]);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState(emptyArticleForm);
  const [articleSaving, setArticleSaving] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [activeRole]);

  const fetchDashboardData = async () => {
    if (['counsellor', 'admin', 'super_admin'].includes(activeRole)) {
      setLeadLoading(true);
      const res = await getLeads();
      if (res && res.success && res.leads) {
        setLeads(res.leads);
      }
      setLeadLoading(false);
    }

    if (['student', 'parent', 'faculty'].includes(activeRole)) {
      const attRes = await getAttendanceSummary(1);
      if (attRes && attRes.success) {
        setAttendance(attRes);
      }
      const resRes = await getStudentResults(1);
      if (resRes && resRes.success) {
        setResults(resRes.results || []);
      }
    }

    if (['student', 'parent'].includes(activeRole)) {
      const feeRes = await getStudentLedger(1);
      if (feeRes && feeRes.success && feeRes.ledger) {
        setLedger(feeRes.ledger);
      }
    }

    if (activeRole === 'student') {
      const appRes = await getMyApplications();
      if (appRes && appRes.success) {
        setMyApplications(appRes.applications || []);
      }
      const mockRes = await getMyMockAttempts();
      if (mockRes && mockRes.success) {
        setMyMockAttempts(mockRes.attempts || []);
      }
      const careerRes = await getMyCareerAssessments();
      if (careerRes && careerRes.success) {
        setMyCareerAssessments(careerRes.assessments || []);
      }
    }

    if (activeRole === 'partner') {
      const partnerRes = await getPartnerStats();
      if (partnerRes && partnerRes.success) {
        setPartnerStats(partnerRes);
      }
    }

    if (['counsellor', 'admin', 'super_admin', 'college_rep'].includes(activeRole)) {
      const allAppRes = await getAllApplications();
      if (allAppRes && allAppRes.success) {
        setAllApplications(allAppRes.applications || []);
      }
    }

    if (['accounts', 'super_admin'].includes(activeRole)) {
      const accRes = await getAccountsSummary();
      if (accRes && accRes.success) {
        setAccountsMetrics(accRes);
      }
    }

    if (['super_admin', 'college_rep', 'admin'].includes(activeRole)) {
      const colRes = await getColleges();
      if (colRes && colRes.success) {
        setColleges(colRes.colleges || []);
      }
    }

    if (['super_admin', 'admin'].includes(activeRole)) {
      const courseRes = await getCourses();
      if (courseRes && courseRes.success) {
        setCourses(courseRes.courses || []);
      }
      const examRes = await getExams();
      if (examRes && examRes.success) {
        setExams(examRes.exams || []);
      }
      const scholarshipRes = await getScholarships();
      if (scholarshipRes && scholarshipRes.success) {
        setScholarships(scholarshipRes.scholarships || []);
      }
      const articleRes = await getArticles();
      if (articleRes && articleRes.success) {
        setArticles(articleRes.articles || []);
      }
    }
  };

  // ============ Article CRUD handlers ============
  const openAddArticle = () => {
    setEditingArticleId(null);
    setArticleForm(emptyArticleForm);
    setArticleModalOpen(true);
  };

  const openEditArticle = (article) => {
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'Admission News',
      status: article.status || 'Published'
    });
    setArticleModalOpen(true);
  };

  const submitArticleForm = async (e) => {
    e.preventDefault();
    setArticleSaving(true);
    const res = editingArticleId
      ? await updateArticle(editingArticleId, articleForm)
      : await createArticle(articleForm);
    setArticleSaving(false);
    if (res.success) {
      setArticleModalOpen(false);
      fetchDashboardData();
    } else {
      alert(res.message || 'Failed to save article');
    }
  };

  const handleDeleteArticle = async (article) => {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    const res = await deleteArticle(article.id);
    if (res.success) {
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
    } else {
      alert(res.message || 'Failed to delete article');
    }
  };

  // ============ Exam CRUD handlers ============
  const openAddExam = () => {
    setEditingExamId(null);
    setExamForm(emptyExamForm);
    setExamModalOpen(true);
  };

  const openEditExam = (exam) => {
    setEditingExamId(exam.id);
    setExamForm({
      name: exam.name || '',
      shortName: exam.shortName || '',
      conductingBody: exam.conductingBody || '',
      stream: exam.stream || 'Engineering',
      level: exam.level || 'UG',
      status: exam.status || 'Upcoming'
    });
    setExamModalOpen(true);
  };

  const submitExamForm = async (e) => {
    e.preventDefault();
    setExamSaving(true);
    const res = editingExamId
      ? await updateExam(editingExamId, examForm)
      : await createExam(examForm);
    setExamSaving(false);
    if (res.success) {
      setExamModalOpen(false);
      fetchDashboardData();
    } else {
      alert(res.message || 'Failed to save exam');
    }
  };

  const handleDeleteExam = async (exam) => {
    if (!window.confirm(`Delete "${exam.name}"? This cannot be undone.`)) return;
    const res = await deleteExam(exam.id);
    if (res.success) {
      setExams((prev) => prev.filter((e) => e.id !== exam.id));
    } else {
      alert(res.message || 'Failed to delete exam');
    }
  };

  // ============ Scholarship CRUD handlers ============
  const openAddScholarship = () => {
    setEditingScholarshipId(null);
    setScholarshipForm(emptyScholarshipForm);
    setScholarshipModalOpen(true);
  };

  const openEditScholarship = (scholarship) => {
    setEditingScholarshipId(scholarship.id);
    setScholarshipForm({
      name: scholarship.name || '',
      provider: scholarship.provider || '',
      category: scholarship.category || 'Merit-based',
      benefitAmount: scholarship.benefitAmount || '',
      status: scholarship.status || 'Open'
    });
    setScholarshipModalOpen(true);
  };

  const submitScholarshipForm = async (e) => {
    e.preventDefault();
    setScholarshipSaving(true);
    const res = editingScholarshipId
      ? await updateScholarship(editingScholarshipId, scholarshipForm)
      : await createScholarship(scholarshipForm);
    setScholarshipSaving(false);
    if (res.success) {
      setScholarshipModalOpen(false);
      fetchDashboardData();
    } else {
      alert(res.message || 'Failed to save scholarship');
    }
  };

  const handleDeleteScholarship = async (scholarship) => {
    if (!window.confirm(`Delete "${scholarship.name}"? This cannot be undone.`)) return;
    const res = await deleteScholarship(scholarship.id);
    if (res.success) {
      setScholarships((prev) => prev.filter((s) => s.id !== scholarship.id));
    } else {
      alert(res.message || 'Failed to delete scholarship');
    }
  };

  const handleApplicationStatusChange = async (applicationId, newStatus) => {
    const res = await updateApplicationStatus(applicationId, newStatus);
    if (res.success) {
      setAllApplications((prev) => prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a)));
    } else {
      alert(res.message || 'Failed to update application');
    }
  };

  // ============ College CRUD handlers ============
  const openAddCollege = () => {
    setEditingCollegeId(null);
    setCollegeForm(emptyCollegeForm);
    setCollegeModalOpen(true);
  };

  const openEditCollege = (college) => {
    setEditingCollegeId(college.id);
    setCollegeForm({
      name: college.name || '',
      city: college.city || '',
      state: college.state || '',
      universityType: college.universityType || 'Private',
      establishedYear: college.establishedYear || '',
      overview: college.overview || '',
      logoUrl: college.logoUrl || '',
      bannerUrl: college.bannerUrl || ''
    });
    setCollegeModalOpen(true);
  };

  const submitCollegeForm = async (e) => {
    e.preventDefault();
    setCollegeSaving(true);
    const payload = { ...collegeForm, establishedYear: collegeForm.establishedYear ? Number(collegeForm.establishedYear) : null };
    const res = editingCollegeId
      ? await updateCollege(editingCollegeId, payload)
      : await createCollege(payload);
    setCollegeSaving(false);
    if (res.success) {
      setCollegeModalOpen(false);
      fetchDashboardData();
    } else {
      alert(res.message || 'Failed to save college');
    }
  };

  const handleDeleteCollege = async (college) => {
    if (!window.confirm(`Delete "${college.name}"? This cannot be undone.`)) return;
    const res = await deleteCollege(college.id);
    if (res.success) {
      setColleges((prev) => prev.filter((c) => c.id !== college.id));
    } else {
      alert(res.message || 'Failed to delete college');
    }
  };

  // ============ Course CRUD handlers ============
  const openAddCourse = () => {
    setEditingCourseId(null);
    setCourseForm(emptyCourseForm);
    setCourseModalOpen(true);
  };

  const openEditCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      name: course.name || '',
      code: course.code || '',
      level: course.level || 'UG',
      iconName: course.iconName || 'BookOpen'
    });
    setCourseModalOpen(true);
  };

  const submitCourseForm = async (e) => {
    e.preventDefault();
    setCourseSaving(true);
    const res = editingCourseId
      ? await updateCourse(editingCourseId, courseForm)
      : await createCourse(courseForm);
    setCourseSaving(false);
    if (res.success) {
      setCourseModalOpen(false);
      fetchDashboardData();
    } else {
      alert(res.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    const res = await deleteCourse(course.id);
    if (res.success) {
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } else {
      alert(res.message || 'Failed to delete course');
    }
  };

  const handleLeadStatusChange = async (leadId, newStatus) => {
    const res = await updateLeadStatus(leadId, newStatus, 'Status updated from CRM portal');
    if (res.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    }
  };

  const handlePayFeeInstallment = async () => {
    if (!ledger) return;
    setPaying(true);
    const amountToPay = Math.min(50000, Number(ledger.balanceDue || 0));
    const res = await payFee(ledger.id, amountToPay, 'UPI - Razorpay Gateway');
    setPaying(false);
    if (res.success) {
      setPaySuccess(true);
      setLedger(res.updatedLedger);
      setTimeout(() => setPaySuccess(false), 4000);
    }
  };

  // ============ Chart data (computed from live state, no mock numbers) ============
  const applicationStatusChartData = ['Submitted', 'Under Review', 'Document Verification', 'Interview Scheduled', 'Accepted', 'Rejected', 'Enrolled']
    .map((status) => ({ label: status.replace(' ', '\n'), value: allApplications.filter((a) => a.status === status).length }))
    .filter((d) => d.value > 0);

  const collegeTypeChartData = Object.entries(
    colleges.reduce((acc, c) => {
      const type = c.universityType || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  ).map(([label, value]) => ({ label, value }));

  const courseLevelChartData = Object.entries(
    courses.reduce((acc, c) => {
      const level = c.level || 'Other';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {})
  ).map(([label, value]) => ({ label, value }));

  const pageTitles = {
    overview: 'Overview',
    colleges: 'Colleges',
    courses: 'Courses',
    exams: 'Entrance Exams',
    scholarships: 'Scholarships',
    articles: 'Articles / News',
    applications: 'Applications',
  };
  const isAdminLike = ['admin', 'super_admin'].includes(activeRole);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex font-sans">
      <AdminSidebar activeRole={activeRole} activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0 ml-16">
        <AdminTopbar
          title={isAdminLike ? (pageTitles[activeSection] || 'Dashboard') : `${activeRole.replace('_', ' ')} Portal`}
          subtitle={`Logged in as ${user?.fullName || 'User'}`}
        />

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* ================= 1. COUNSELLOR / CRM VIEW ================= */}
        {activeRole === 'counsellor' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Lead Pipeline &amp; Counselling CRM</h2>
                <p className="text-xs text-slate-500">Manage admissions pipeline, update lead stages and log student discussions.</p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-700 hover:bg-gray-50 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Leads</span>
              </button>
            </div>

            {/* Pipeline Stage Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['New', 'Contacted', 'In Counselling', 'Converted', 'Dropped'].map((stage, i) => {
                const count = leads.filter(l => l.status === stage).length;
                return (
                  <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stage}</div>
                    <div className="text-xl font-black text-slate-900 mt-1">{count}</div>
                  </div>
                );
              })}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-bold text-xs text-slate-700">
                Active Student Enquiries ({leads.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-slate-500 border-b border-gray-100 font-bold">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Course / College</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-slate-900">
                          {l.fullName}
                          <div className="text-[10px] text-slate-400 font-normal">{l.city || 'Indore'}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-700">
                          +91 {l.phone}
                          <div className="text-[10px] text-slate-400 font-sans">{l.email}</div>
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="font-semibold">{l.preferredCourse?.name || 'B.Tech / MBA'}</span>
                          <div className="text-[10px] text-slate-400">{l.preferredCollege?.name || 'Amity University'}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            l.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' :
                            l.status === 'In Counselling' ? 'bg-blue-100 text-blue-800' :
                            l.status === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                            l.status === 'Dropped' ? 'bg-rose-100 text-rose-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={l.status}
                            onChange={(e) => handleLeadStatusChange(l.id, e.target.value)}
                            className="p-1.5 rounded border border-gray-200 bg-white text-xs font-semibold focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Counselling">In Counselling</option>
                            <option value="Converted">Converted</option>
                            <option value="Dropped">Dropped</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Application Tracking */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-bold text-xs text-slate-700">
                College Applications ({allApplications.length})
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-slate-500 border-b border-gray-100 font-bold">
                      <th className="p-3">Applicant</th>
                      <th className="p-3">College / Course</th>
                      <th className="p-3">App #</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-slate-900">
                          {app.applicant?.fullName}
                          <div className="text-[10px] text-slate-400 font-normal">{app.applicant?.email}</div>
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="font-semibold">{app.college?.name}</span>
                          <div className="text-[10px] text-slate-400">{app.course?.name || 'General Enquiry'}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{app.applicationNumber}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === 'Accepted' || app.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={app.status}
                            onChange={(e) => handleApplicationStatusChange(app.id, e.target.value)}
                            className="p-1.5 rounded border border-gray-200 bg-white text-xs font-semibold focus:outline-none"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Document Verification">Document Verification</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Enrolled">Enrolled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {allApplications.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">No applications submitted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. STUDENT PORTAL ================= */}
        {activeRole === 'student' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Student Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Priya Sharma"
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Priya Sharma</h2>
                  <p className="text-xs text-slate-500">
                    B.Tech Computer Science (Semester 4) • Amity University, Noida
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Enrollment: AMITY-2024-CSE-042 | Roll No: 42
                  </p>
                </div>
              </div>

              {/* Attendance percentage indicator */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#1a56db] text-white flex items-center justify-center font-black text-sm">
                  {attendance?.stats?.percentage || 94}%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Overall Attendance</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Good Standing (&gt;75%)</div>
                </div>
              </div>
            </div>

            {/* At-Risk Alert if attendance < 75% */}
            {attendance?.stats?.isAtRisk && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="font-semibold">{attendance.stats.alert}</span>
              </div>
            )}

            {/* Academics & Fees Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Fee Ledger & Payment Widget */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#1a56db]" />
                    <span>Fee Ledger &amp; Installments</span>
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ledger?.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ledger?.status || 'Partial'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-[10px] text-slate-400">Total Fee</div>
                    <div className="text-sm font-bold text-slate-900">₹{Number(ledger?.totalAmount || 245000).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <div className="text-[10px] text-emerald-600">Paid Amount</div>
                    <div className="text-sm font-bold text-emerald-700">₹{Number(ledger?.paidAmount || 122500).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <div className="text-[10px] text-rose-600">Balance Due</div>
                    <div className="text-sm font-bold text-rose-700">₹{Number(ledger?.balanceDue || 122500).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {paySuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Payment completed! Receipt generated: AMITY-RCPT-2026-902</span>
                  </div>
                )}

                {Number(ledger?.balanceDue || 0) > 0 && (
                  <button
                    onClick={handlePayFeeInstallment}
                    disabled={paying}
                    className="w-full py-3 bg-[#1a56db] hover:bg-[#1545b3] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                  >
                    <span>{paying ? 'Connecting Gateway...' : 'Pay Next Installment (Razorpay / UPI)'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Exam Results */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Published Exam Results</span>
                  </h3>
                  <span className="text-xs text-blue-600 font-semibold">Semester 4</span>
                </div>

                <div className="space-y-3">
                  {(results.length > 0 ? results : [
                    { Exam: { title: 'Midterm Examination 2026', subject: { name: 'Data Structures & Algorithms' }, maxMarks: 100 }, marksObtained: 88, grade: 'A' },
                    { Exam: { title: 'Midterm Examination 2026', subject: { name: 'Database Management Systems' }, maxMarks: 100 }, marksObtained: 92, grade: 'A+' },
                  ]).map((res, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{res.Exam?.subject?.name || 'Subject'}</div>
                        <div className="text-[10px] text-slate-400">{res.Exam?.title}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">{res.marksObtained} / {res.Exam?.maxMarks || 100}</div>
                        <div className="text-[10px] font-bold text-emerald-600">Grade: {res.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* My Common Applications */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#1a56db]" />
                <span>My Applications ({myApplications.length})</span>
              </h3>
              {myApplications.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No applications yet. Visit a college page and click "Apply for Admission" to get started.
                </p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myApplications.map((app) => (
                    <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{app.college?.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {app.course?.name || 'General Enquiry'} • App# {app.applicationNumber}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'Accepted' || app.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        app.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mock Test Attempts & Career Compass */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">My Mock Test Attempts</h3>
                  <Link to="/mock-tests" className="text-[11px] font-semibold text-[#1a56db] hover:underline">Take a Test</Link>
                </div>
                {myMockAttempts.length === 0 ? (
                  <p className="text-xs text-slate-400">No attempts yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {myMockAttempts.slice(0, 5).map((a) => (
                      <div key={a.id} className="py-2.5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">{a.test?.title}</span>
                        <span className="text-xs font-bold text-[#1a56db]">{a.score} pts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Career Compass Results</h3>
                  <Link to="/career-compass" className="text-[11px] font-semibold text-[#1a56db] hover:underline">Take Assessment</Link>
                </div>
                {myCareerAssessments.length === 0 ? (
                  <p className="text-xs text-slate-400">No assessments yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {myCareerAssessments.slice(0, 3).map((a) => (
                      <div key={a.id} className="py-2.5">
                        <span className="text-xs font-bold text-purple-700">{a.info?.title || a.topCategory}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. PARENT PORTAL ================= */}
        {activeRole === 'parent' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Parent / Guardian Portal (Read-Only)</h2>
              <p className="text-xs text-slate-500 mb-4">
                Linked Child: <strong>Priya Sharma</strong> (AMITY-2024-CSE-042) • Relationship: Father
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-800 font-medium">Child Attendance</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">94%</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Above mandatory 75% mark</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-800 font-medium">Academic Standing</div>
                  <div className="text-2xl font-black text-blue-700 mt-1">Grade A</div>
                  <div className="text-[11px] text-blue-600 mt-1">CGPA: 8.9 / 10</div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-xs text-amber-800 font-medium">Upcoming Fee Due</div>
                  <div className="text-2xl font-black text-amber-700 mt-1">₹1,22,500</div>
                  <div className="text-[11px] text-amber-600 mt-1">Due by: 15 Nov 2026</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. COLLEGE REP (TENANT ISOLATED) ================= */}
        {activeRole === 'college_rep' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Amity University Representative Portal</h2>
                <p className="text-xs text-slate-500">
                  <span className="inline-flex items-center text-emerald-600 font-semibold mr-2">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Tenant Isolated: Amity University (ID: 6)
                  </span>
                  Manage your institution's profile, courses, faculty, and applicant verifications.
                </p>
              </div>
              <button
                onClick={() => alert('New Course Offering Modal')}
                className="px-4 py-2 bg-[#1a56db] text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-xs"
              >
                + Add Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                <div className="text-[11px] text-slate-400 font-semibold">Active Applications</div>
                <div className="text-2xl font-black text-slate-900 mt-1">142</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                <div className="text-[11px] text-slate-400 font-semibold">Enrolled Students</div>
                <div className="text-2xl font-black text-blue-600 mt-1">1,250</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                <div className="text-[11px] text-slate-400 font-semibold">Total Courses</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">24</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                <div className="text-[11px] text-slate-400 font-semibold">Fee Collection Rate</div>
                <div className="text-2xl font-black text-purple-600 mt-1">88%</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. FACULTY PORTAL ================= */}
        {activeRole === 'faculty' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Faculty Session &amp; Attendance Portal</h2>
              <p className="text-xs text-slate-500 mb-4">
                Assigned Subject: CS-401 Data Structures &amp; Algorithms (Batch: B.Tech CSE 2024-2028)
              </p>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-6">
                <h4 className="text-xs font-bold text-blue-900 mb-2">Mark Attendance for Today's Lecture</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="p-2 rounded border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    defaultValue="Graph Algorithms & Dijkstra"
                    placeholder="Topic Covered"
                    className="p-2 rounded border border-gray-200 text-xs bg-white flex-1 min-w-[200px]"
                  />
                  <button
                    onClick={() => alert('Attendance session marked successfully for all 42 batch students!')}
                    className="px-4 py-2 bg-[#1a56db] text-white rounded text-xs font-bold hover:bg-blue-700"
                  >
                    Submit Attendance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. ACCOUNTS PORTAL ================= */}
        {activeRole === 'accounts' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Accounts &amp; Fee Management</h2>
              <p className="text-xs text-slate-500 mb-6">Track institution fee collections, payment receipts and outstanding dues.</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <div className="text-[11px] text-slate-400 font-semibold">Total Receivable</div>
                  <div className="text-xl font-black text-slate-900 mt-1">₹4.85 Crore</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-semibold">Total Collected</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">₹3.92 Crore</div>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="text-[11px] text-rose-800 font-semibold">Outstanding Dues</div>
                  <div className="text-xl font-black text-rose-700 mt-1">₹93.5 Lakh</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-[11px] text-blue-800 font-semibold">Recovery Rate</div>
                  <div className="text-xl font-black text-blue-700 mt-1">80.8%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. PARTNER PORTAL ================= */}
        {activeRole === 'partner' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Franchise &amp; Partner Commission Dashboard</h2>
              <p className="text-xs text-slate-500 mb-6">
                Your Referral Code: <strong className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{partnerStats?.referralCode || '—'}</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
                  <div className="text-[11px] text-slate-400 font-semibold">Referred Students</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{partnerStats?.referredCount ?? 0}</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-semibold">Confirmed Admissions</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{partnerStats?.convertedCount ?? 0}</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-[11px] text-amber-800 font-semibold">Earned Commission</div>
                  <div className="text-2xl font-black text-amber-700 mt-1">₹{Number(partnerStats?.commissionEarned ?? 0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-bold text-xs text-slate-700">
                Referred Leads ({partnerStats?.leads?.length || 0})
              </div>
              <div className="divide-y divide-gray-100">
                {(partnerStats?.leads || []).length === 0 && (
                  <p className="text-xs text-slate-400 p-4">No referrals yet. Share your referral code to get started.</p>
                )}
                {(partnerStats?.leads || []).map((l) => (
                  <div key={l.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">{l.fullName}</span>
                      <span className="text-[11px] text-slate-400 ml-2">{l.city}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      l.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 8 & 9. ADMIN & SUPER ADMIN ================= */}
        {['admin', 'super_admin'].includes(activeRole) && (
          <div className="space-y-6 animate-fadeIn">

            {/* ---- OVERVIEW ---- */}
            {activeSection === 'overview' && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">System Overview</h2>
                  <p className="text-xs text-slate-500">Live snapshot of institutions, course catalog, and admissions pipeline.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="text-[11px] text-slate-400 font-semibold">Colleges</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{colleges.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="text-[11px] text-slate-400 font-semibold">Courses</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{courses.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="text-[11px] text-slate-400 font-semibold">Applications</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{allApplications.length}</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <div className="text-[11px] text-slate-400 font-semibold">Exams + Scholarships</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{exams.length + scholarships.length}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <BarChart
                      title="Applications by Status"
                      data={applicationStatusChartData}
                    />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                    <SegmentedBar title="Colleges by Type" data={collegeTypeChartData} />
                    <SegmentedBar title="Courses by Level" data={courseLevelChartData} />
                  </div>
                </div>
              </>
            )}

            {/* ---- COLLEGES ---- */}
            {activeSection === 'colleges' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Managed Institutions ({colleges.length})</h3>
                  <button
                    onClick={openAddCollege}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a56db] text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Onboard College</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {colleges.length === 0 && (
                    <p className="text-xs text-slate-400 py-3">No colleges yet. Click "Onboard College" to add one.</p>
                  )}
                  {colleges.map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {c.logoUrl ? (
                          <img src={c.logoUrl} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-800 text-xs">{c.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2">({c.city}, {c.state})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono">{c.universityType}</span>
                        <button
                          onClick={() => openEditCollege(c)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCollege(c)}
                          className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- COURSES ---- */}
            {activeSection === 'courses' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Course Catalog ({courses.length})</h3>
                  <button
                    onClick={openAddCourse}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Course</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {courses.length === 0 && (
                    <p className="text-xs text-slate-400 py-3">No courses yet. Click "Add Course" to add one.</p>
                  )}
                  {courses.map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-xs">{c.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({c.code})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono">{c.level}</span>
                        <button
                          onClick={() => openEditCourse(c)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c)}
                          className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- EXAMS ---- */}
            {activeSection === 'exams' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Entrance Exams ({exams.length})</h3>
                  <button
                    onClick={openAddExam}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Exam</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {exams.length === 0 && (
                    <p className="text-xs text-slate-400 py-3">No exams yet. Click "Add Exam" to add one.</p>
                  )}
                  {exams.map((e) => (
                    <div key={e.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-xs">{e.shortName || e.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({e.stream})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono">{e.status}</span>
                        <button
                          onClick={() => openEditExam(e)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExam(e)}
                          className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- SCHOLARSHIPS ---- */}
            {activeSection === 'scholarships' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Scholarships ({scholarships.length})</h3>
                  <button
                    onClick={openAddScholarship}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Scholarship</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {scholarships.length === 0 && (
                    <p className="text-xs text-slate-400 py-3">No scholarships yet. Click "Add Scholarship" to add one.</p>
                  )}
                  {scholarships.map((s) => (
                    <div key={s.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-xs">{s.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({s.provider})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono">{s.status}</span>
                        <button
                          onClick={() => openEditScholarship(s)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteScholarship(s)}
                          className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- ARTICLES ---- */}
            {activeSection === 'articles' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Articles / News ({articles.length})</h3>
                  <button
                    onClick={openAddArticle}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Article</span>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {articles.length === 0 && (
                    <p className="text-xs text-slate-400 py-3">No articles yet. Click "Add Article" to add one.</p>
                  )}
                  {articles.map((a) => (
                    <div key={a.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-xs">{a.title}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({a.category})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono">{a.status}</span>
                        <button
                          onClick={() => openEditArticle(a)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(a)}
                          className="flex items-center gap-1 text-xs text-rose-600 hover:underline font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- APPLICATIONS ---- */}
            {activeSection === 'applications' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">College Applications ({allApplications.length})</h3>
                <div className="divide-y divide-gray-100">
                  {allApplications.length === 0 && (
                    <p className="text-xs text-slate-400 py-3">No applications submitted yet.</p>
                  )}
                  {allApplications.map((app) => (
                    <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-800 text-xs">{app.applicant?.fullName}</span>
                        <span className="text-[11px] text-slate-400 ml-2">→ {app.college?.name} ({app.applicationNumber})</span>
                      </div>
                      <select
                        value={app.status}
                        onChange={(e) => handleApplicationStatusChange(app.id, e.target.value)}
                        className="p-1.5 rounded border border-gray-200 bg-white text-xs font-semibold focus:outline-none"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Document Verification">Document Verification</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Enrolled">Enrolled</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <CounsellingModal />
      <AuthModal />
      <CityModal />

      {/* College Add/Edit Modal */}
      {collegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setCollegeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingCollegeId ? 'Edit College' : 'Onboard New College'}
            </h3>
            <form onSubmit={submitCollegeForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College Name</label>
                <input
                  type="text"
                  required
                  value={collegeForm.name}
                  onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={collegeForm.city}
                    onChange={(e) => setCollegeForm({ ...collegeForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={collegeForm.state}
                    onChange={(e) => setCollegeForm({ ...collegeForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={collegeForm.universityType}
                    onChange={(e) => setCollegeForm({ ...collegeForm, universityType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Private">Private</option>
                    <option value="Deemed">Deemed</option>
                    <option value="Autonomous">Autonomous</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Established Year</label>
                  <input
                    type="number"
                    value={collegeForm.establishedYear}
                    onChange={(e) => setCollegeForm({ ...collegeForm, establishedYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo Image URL</label>
                <input
                  type="text"
                  value={collegeForm.logoUrl}
                  onChange={(e) => setCollegeForm({ ...collegeForm, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
                {collegeForm.logoUrl && (
                  <img src={collegeForm.logoUrl} alt="Logo preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200 mt-2" />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={collegeForm.bannerUrl}
                  onChange={(e) => setCollegeForm({ ...collegeForm, bannerUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Overview</label>
                <textarea
                  rows={3}
                  value={collegeForm.overview}
                  onChange={(e) => setCollegeForm({ ...collegeForm, overview: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={collegeSaving}
                className="w-full py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                {collegeSaving ? 'Saving...' : (editingCollegeId ? 'Save Changes' : 'Create College')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Course Add/Edit Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setCourseModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingCourseId ? 'Edit Course' : 'Add New Course'}
            </h3>
            <form onSubmit={submitCourseForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                    <option value="Diploma">Diploma</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={courseSaving}
                className="w-full py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                {courseSaving ? 'Saving...' : (editingCourseId ? 'Save Changes' : 'Create Course')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Exam Add/Edit Modal */}
      {examModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setExamModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingExamId ? 'Edit Exam' : 'Add New Exam'}
            </h3>
            <form onSubmit={submitExamForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Name</label>
                  <input
                    type="text"
                    value={examForm.shortName}
                    onChange={(e) => setExamForm({ ...examForm, shortName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Conducting Body</label>
                  <input
                    type="text"
                    value={examForm.conductingBody}
                    onChange={(e) => setExamForm({ ...examForm, conductingBody: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stream</label>
                  <select
                    value={examForm.stream}
                    onChange={(e) => setExamForm({ ...examForm, stream: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="Management">Management</option>
                    <option value="Law">Law</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
                  <select
                    value={examForm.level}
                    onChange={(e) => setExamForm({ ...examForm, level: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={examForm.status}
                    onChange={(e) => setExamForm({ ...examForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={examSaving}
                className="w-full py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                {examSaving ? 'Saving...' : (editingExamId ? 'Save Changes' : 'Create Exam')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scholarship Add/Edit Modal */}
      {scholarshipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setScholarshipModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingScholarshipId ? 'Edit Scholarship' : 'Add New Scholarship'}
            </h3>
            <form onSubmit={submitScholarshipForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship Name</label>
                <input
                  type="text"
                  required
                  value={scholarshipForm.name}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provider</label>
                  <input
                    type="text"
                    value={scholarshipForm.provider}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, provider: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Benefit Amount</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹50,000 / year"
                    value={scholarshipForm.benefitAmount}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, benefitAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={scholarshipForm.category}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Merit-based">Merit-based</option>
                    <option value="Need-based">Need-based</option>
                    <option value="Merit-cum-Means">Merit-cum-Means</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={scholarshipForm.status}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={scholarshipSaving}
                className="w-full py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                {scholarshipSaving ? 'Saving...' : (editingScholarshipId ? 'Save Changes' : 'Create Scholarship')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Article Add/Edit Modal */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setArticleModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingArticleId ? 'Edit Article' : 'Add New Article'}
            </h3>
            <form onSubmit={submitArticleForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt</label>
                <input
                  type="text"
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  placeholder="Short summary shown in the listing"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content</label>
                <textarea
                  rows={6}
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Admission News">Admission News</option>
                    <option value="Guidance">Guidance</option>
                    <option value="Exam Guide">Exam Guide</option>
                    <option value="Scholarships">Scholarships</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={articleForm.status}
                    onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={articleSaving}
                className="w-full py-2.5 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                {articleSaving ? 'Saving...' : (editingArticleId ? 'Save Changes' : 'Publish Article')}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DashboardPage;
