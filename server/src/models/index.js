import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 1. User
export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  avatarUrl: { type: DataTypes.STRING, defaultValue: '' },
  isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
  lastLoginAt: { type: DataTypes.DATE },
  referralCode: { type: DataTypes.STRING, unique: true }, // used by 'partner' role users
}, { timestamps: true });

// 2. Role
export const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { 
    type: DataTypes.ENUM(
      'super_admin',
      'admin',
      'counsellor',
      'college_rep',
      'faculty',
      'accounts',
      'student',
      'parent',
      'partner'
    ),
    unique: true,
    allowNull: false
  },
  displayName: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
}, { timestamps: false });

// 3. UserRole (Maps user -> role + optional tenant_id for college-scoped roles)
export const UserRole = sequelize.define('UserRole', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  tenantId: { type: DataTypes.INTEGER, allowNull: true }, // College ID for tenant isolation
}, { timestamps: true });

// 4. College
export const College = sequelize.define('College', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  shortName: { type: DataTypes.STRING },
  establishedYear: { type: DataTypes.INTEGER },
  universityType: { type: DataTypes.STRING, defaultValue: 'Private' },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, defaultValue: 'India' },
  address: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  logoUrl: { type: DataTypes.STRING },
  bannerUrl: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  nirfRanking: { type: DataTypes.INTEGER },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: true },
  overview: { type: DataTypes.TEXT },
  admissionProcess: { type: DataTypes.TEXT },
  highestPackage: { type: DataTypes.STRING },
  averagePackage: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
}, { 
  timestamps: true,
  indexes: [
    { fields: ['city'] },
    { fields: ['state'] },
    { fields: ['isFeatured'] },
    { fields: ['status'] }
  ]
});

// 5. ApprovalBody
export const ApprovalBody = sequelize.define('ApprovalBody', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING },
}, { timestamps: false });

// 6. CollegeApproval
export const CollegeApproval = sequelize.define('CollegeApproval', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  grade: { type: DataTypes.STRING },
  validTill: { type: DataTypes.STRING },
}, { timestamps: false });

// 7. Category
export const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  isPopular: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: false });

// 8. Course
export const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING },
  level: { type: DataTypes.ENUM('UG', 'PG', 'Diploma', 'Certificate', 'PhD'), defaultValue: 'UG' },
  durationMonths: { type: DataTypes.INTEGER, defaultValue: 36 },
  overview: { type: DataTypes.TEXT },
  eligibility: { type: DataTypes.STRING },
  iconName: { type: DataTypes.STRING },
  isPopular: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

// 9. Specialization
export const Specialization = sequelize.define('Specialization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

// 10. CollegeCourse (Mapping of College <-> Course + Fees/Seats/Duration)
export const CollegeCourse = sequelize.define('CollegeCourse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalFee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  feePerYear: { type: DataTypes.DECIMAL(10, 2) },
  seats: { type: DataTypes.INTEGER, defaultValue: 60 },
  duration: { type: DataTypes.STRING, defaultValue: '4 Years' },
  mode: { type: DataTypes.ENUM('Full Time', 'Distance', 'Online', 'Part Time'), defaultValue: 'Full Time' },
  eligibility: { type: DataTypes.STRING },
  averagePackage: { type: DataTypes.STRING },
  highestPackage: { type: DataTypes.STRING },
}, { 
  timestamps: true,
  indexes: [
    { fields: ['collegeId'] },
    { fields: ['courseId'] }
  ]
});

// 11. Lead
export const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  source: { type: DataTypes.STRING, defaultValue: 'Homepage Enquiry' },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'In Counselling', 'Converted', 'Dropped'),
    defaultValue: 'New'
  },
  notes: { type: DataTypes.TEXT },
  partnerReferralCode: { type: DataTypes.STRING }, // ties a lead back to a referring Partner user
}, { 
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['phone'] }
  ]
});

// 12. LeadActivity
export const LeadActivity = sequelize.define('LeadActivity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.ENUM('Call', 'Email', 'SMS', 'WhatsApp', 'Note', 'StatusChange'), defaultValue: 'Call' },
  remarks: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: true });

// 13. Student (Scoped to College & User)
export const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  enrollmentNumber: { type: DataTypes.STRING, unique: true },
  rollNumber: { type: DataTypes.STRING },
  currentSemester: { type: DataTypes.INTEGER, defaultValue: 1 },
  admissionDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM('Active', 'Suspended', 'Graduated'), defaultValue: 'Active' },
}, { 
  timestamps: true,
  indexes: [
    { fields: ['collegeId'] },
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
});

// 14. ParentLink
export const ParentLink = sequelize.define('ParentLink', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  relationship: { type: DataTypes.ENUM('Father', 'Mother', 'Guardian'), defaultValue: 'Father' },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

// 15. Batch
export const Batch = sequelize.define('Batch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  startYear: { type: DataTypes.INTEGER, allowNull: false },
  endYear: { type: DataTypes.INTEGER, allowNull: false },
  currentSemester: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { timestamps: false });

// 16. Subject
export const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.INTEGER, defaultValue: 1 },
  credits: { type: DataTypes.INTEGER, defaultValue: 4 },
}, { timestamps: false });

// 17. AttendanceSession
export const AttendanceSession = sequelize.define('AttendanceSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sessionDate: { type: DataTypes.DATEONLY, allowNull: false },
  sessionTime: { type: DataTypes.STRING, defaultValue: '09:00 AM' },
  topic: { type: DataTypes.STRING },
}, { timestamps: true });

// 18. AttendanceRecord
export const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'), defaultValue: 'Present' },
  remarks: { type: DataTypes.STRING },
}, { timestamps: false });

// 19. Exam
export const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  examType: { type: DataTypes.ENUM('Midterm', 'Final', 'Internal', 'Practical'), defaultValue: 'Midterm' },
  examDate: { type: DataTypes.DATEONLY },
  maxMarks: { type: DataTypes.FLOAT, defaultValue: 100 },
  passingMarks: { type: DataTypes.FLOAT, defaultValue: 40 },
  status: { type: DataTypes.ENUM('Draft', 'Submitted', 'Approved', 'Published'), defaultValue: 'Draft' },
}, { timestamps: true });

// 20. ExamResult
export const ExamResult = sequelize.define('ExamResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  marksObtained: { type: DataTypes.FLOAT, allowNull: false },
  grade: { type: DataTypes.STRING },
  remarks: { type: DataTypes.STRING },
}, { timestamps: true });

// 21. FeeTemplate
export const FeeTemplate = sequelize.define('FeeTemplate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  installmentsCount: { type: DataTypes.INTEGER, defaultValue: 2 },
}, { timestamps: false });

// 22. StudentFeeLedger
export const StudentFeeLedger = sequelize.define('StudentFeeLedger', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paidAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  balanceDue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  dueDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM('Paid', 'Partial', 'Unpaid', 'Overdue'), defaultValue: 'Unpaid' },
}, { timestamps: true });

// 23. Payment
export const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  transactionId: { type: DataTypes.STRING, unique: true },
  paymentGateway: { type: DataTypes.STRING, defaultValue: 'Razorpay' },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMethod: { type: DataTypes.STRING, defaultValue: 'UPI' },
  status: { type: DataTypes.ENUM('Success', 'Pending', 'Failed'), defaultValue: 'Success' },
  receiptNumber: { type: DataTypes.STRING },
}, { timestamps: true });

// 24. Application
export const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  applicationNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Submitted', 'Under Review', 'Document Verification', 'Interview Scheduled', 'Accepted', 'Rejected', 'Enrolled'),
    defaultValue: 'Submitted'
  },
  remarks: { type: DataTypes.TEXT },
}, { timestamps: true });

// 25. Review
export const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentName: { type: DataTypes.STRING, allowNull: false },
  universityName: { type: DataTypes.STRING },
  courseName: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT, allowNull: false },
  avatarUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Approved' },
}, { timestamps: true });

// 26. Notification
export const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'system' },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  link: { type: DataTypes.STRING },
}, { timestamps: true });

// 27. EntranceExam (Public exam directory: JEE, NEET, CAT, etc — distinct from the
// internal academic Exam model used by the college faculty/student portal)
export const EntranceExam = sequelize.define('EntranceExam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  shortName: { type: DataTypes.STRING },
  conductingBody: { type: DataTypes.STRING },
  stream: { type: DataTypes.STRING, defaultValue: 'Engineering' },
  level: { type: DataTypes.ENUM('UG', 'PG', 'Diploma', 'PhD'), defaultValue: 'UG' },
  examDate: { type: DataTypes.DATEONLY },
  applicationStartDate: { type: DataTypes.DATEONLY },
  applicationEndDate: { type: DataTypes.DATEONLY },
  resultDate: { type: DataTypes.DATEONLY },
  overview: { type: DataTypes.TEXT },
  eligibility: { type: DataTypes.TEXT },
  examPattern: { type: DataTypes.TEXT },
  syllabus: { type: DataTypes.TEXT },
  officialWebsite: { type: DataTypes.STRING },
  logoUrl: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Completed'), defaultValue: 'Upcoming' },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true, indexes: [{ fields: ['stream'] }, { fields: ['status'] }] });

// 28. Scholarship
export const Scholarship = sequelize.define('Scholarship', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  provider: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, defaultValue: 'Merit-based' },
  benefitAmount: { type: DataTypes.STRING },
  applicationDeadline: { type: DataTypes.DATEONLY },
  eligibility: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  applyLink: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('Open', 'Closed', 'Upcoming'), defaultValue: 'Open' },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

// 29. Question (Q&A Community)
export const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT },
  tags: { type: DataTypes.STRING },
  viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('Published', 'Pending', 'Removed'), defaultValue: 'Published' },
}, { timestamps: true });

// 30. Answer
export const Answer = sequelize.define('Answer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  body: { type: DataTypes.TEXT, allowNull: false },
  helpfulCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isExpertAnswer: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

// 31b. Article (Content CMS)
export const Article = sequelize.define('Article', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  excerpt: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Admission News' },
  coverImageUrl: { type: DataTypes.STRING },
  authorName: { type: DataTypes.STRING, defaultValue: 'Shikhar360 Editorial' },
  status: { type: DataTypes.ENUM('Draft', 'Published'), defaultValue: 'Published' },
  publishedAt: { type: DataTypes.DATE },
}, { timestamps: true, indexes: [{ fields: ['category'] }, { fields: ['status'] }] });

// 32. MockTest
export const MockTest = sequelize.define('MockTest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  durationMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
  negativeMarking: { type: DataTypes.FLOAT, defaultValue: 0.25 },
  marksPerQuestion: { type: DataTypes.FLOAT, defaultValue: 4 },
  status: { type: DataTypes.ENUM('Draft', 'Active', 'Archived'), defaultValue: 'Active' },
}, { timestamps: true });

// 33. MockQuestion
export const MockQuestion = sequelize.define('MockQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false },
  options: { type: DataTypes.TEXT, allowNull: false }, // JSON-stringified array of option strings
  correctIndex: { type: DataTypes.INTEGER, allowNull: false },
  explanation: { type: DataTypes.TEXT },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: false });

// 34. MockAttempt
export const MockAttempt = sequelize.define('MockAttempt', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  answers: { type: DataTypes.TEXT }, // JSON-stringified { questionId: selectedIndex }
  score: { type: DataTypes.FLOAT },
  correctCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrongCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  unattemptedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  startedAt: { type: DataTypes.DATE },
  submittedAt: { type: DataTypes.DATE },
}, { timestamps: true });

// 35. CareerAssessment (Career Compass)
export const CareerAssessment = sequelize.define('CareerAssessment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  answers: { type: DataTypes.TEXT }, // JSON-stringified answers
  topCategory: { type: DataTypes.STRING },
  scores: { type: DataTypes.TEXT }, // JSON-stringified { category: score }
  recommendation: { type: DataTypes.TEXT },
}, { timestamps: true });

// 31. Cutoff (College Predictor dataset: historical closing ranks per exam/college/course)
export const Cutoff = sequelize.define('Cutoff', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  year: { type: DataTypes.INTEGER, allowNull: false },
  round: { type: DataTypes.INTEGER, defaultValue: 1 },
  category: { type: DataTypes.ENUM('General', 'OBC', 'SC', 'ST', 'EWS'), defaultValue: 'General' },
  openingRank: { type: DataTypes.INTEGER },
  closingRank: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true, indexes: [{ fields: ['entranceExamId'] }, { fields: ['collegeId'] }] });

// ================= RELATIONSHIPS =================

// Users & Roles
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });
UserRole.belongsTo(User, { foreignKey: 'userId' });
UserRole.belongsTo(Role, { foreignKey: 'roleId' });

// Colleges & Approvals
College.belongsToMany(ApprovalBody, { through: CollegeApproval, foreignKey: 'collegeId' });
ApprovalBody.belongsToMany(College, { through: CollegeApproval, foreignKey: 'approvalBodyId' });
CollegeApproval.belongsTo(College, { foreignKey: 'collegeId' });
CollegeApproval.belongsTo(ApprovalBody, { foreignKey: 'approvalBodyId' });
College.hasMany(CollegeApproval, { foreignKey: 'collegeId', as: 'approvals' });

// Courses & Categories
Category.hasMany(Course, { foreignKey: 'categoryId', as: 'courses' });
Course.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Course.hasMany(Specialization, { foreignKey: 'courseId', as: 'specializations' });
Specialization.belongsTo(Course, { foreignKey: 'courseId' });

// CollegeCourses
College.hasMany(CollegeCourse, { foreignKey: 'collegeId', as: 'collegeCourses' });
CollegeCourse.belongsTo(College, { foreignKey: 'collegeId', as: 'college' });

Course.hasMany(CollegeCourse, { foreignKey: 'courseId', as: 'collegeOfferings' });
CollegeCourse.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Leads
Lead.belongsTo(User, { foreignKey: 'assignedCounsellorId', as: 'counsellor' });
Lead.belongsTo(Course, { foreignKey: 'preferredCourseId', as: 'preferredCourse' });
Lead.belongsTo(College, { foreignKey: 'preferredCollegeId', as: 'preferredCollege' });
Lead.hasMany(LeadActivity, { foreignKey: 'leadId', as: 'activities' });
LeadActivity.belongsTo(Lead, { foreignKey: 'leadId' });
LeadActivity.belongsTo(User, { foreignKey: 'counsellorId', as: 'counsellor' });

// Students
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Student.belongsTo(College, { foreignKey: 'collegeId', as: 'college' });
Student.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Student.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });

// ParentLinks
ParentLink.belongsTo(User, { foreignKey: 'parentUserId', as: 'parent' });
ParentLink.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Batches & Subjects
Batch.belongsTo(College, { foreignKey: 'collegeId' });
Batch.belongsTo(Course, { foreignKey: 'courseId' });
Batch.hasMany(Student, { foreignKey: 'batchId' });

Subject.belongsTo(Course, { foreignKey: 'courseId' });
Subject.belongsTo(User, { foreignKey: 'facultyUserId', as: 'faculty' });

// Attendance
AttendanceSession.belongsTo(College, { foreignKey: 'collegeId' });
AttendanceSession.belongsTo(Batch, { foreignKey: 'batchId' });
AttendanceSession.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
AttendanceSession.belongsTo(User, { foreignKey: 'facultyUserId', as: 'faculty' });
AttendanceSession.hasMany(AttendanceRecord, { foreignKey: 'attendanceSessionId', as: 'records' });
AttendanceRecord.belongsTo(AttendanceSession, { foreignKey: 'attendanceSessionId' });
AttendanceRecord.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Exams
Exam.belongsTo(College, { foreignKey: 'collegeId' });
Exam.belongsTo(Batch, { foreignKey: 'batchId' });
Exam.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Exam.hasMany(ExamResult, { foreignKey: 'examId', as: 'results' });
ExamResult.belongsTo(Exam, { foreignKey: 'examId' });
ExamResult.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Fees & Payments
FeeTemplate.belongsTo(College, { foreignKey: 'collegeId' });
FeeTemplate.belongsTo(Course, { foreignKey: 'courseId' });

StudentFeeLedger.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
StudentFeeLedger.belongsTo(FeeTemplate, { foreignKey: 'feeTemplateId', as: 'template' });
StudentFeeLedger.hasMany(Payment, { foreignKey: 'ledgerId', as: 'payments' });

Payment.belongsTo(Student, { foreignKey: 'studentId' });
Payment.belongsTo(StudentFeeLedger, { foreignKey: 'ledgerId' });

// Applications
Application.belongsTo(User, { foreignKey: 'studentUserId', as: 'applicant' });
Application.belongsTo(College, { foreignKey: 'collegeId', as: 'college' });
Application.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Reviews
Review.belongsTo(College, { foreignKey: 'collegeId', as: 'college' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Notifications
Notification.belongsTo(User, { foreignKey: 'userId' });

// Q&A Community
Question.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });
Answer.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// College Predictor
Cutoff.belongsTo(EntranceExam, { foreignKey: 'entranceExamId', as: 'exam' });
Cutoff.belongsTo(College, { foreignKey: 'collegeId', as: 'college' });
Cutoff.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
EntranceExam.hasMany(Cutoff, { foreignKey: 'entranceExamId', as: 'cutoffs' });

// Mock Tests
MockTest.hasMany(MockQuestion, { foreignKey: 'mockTestId', as: 'questions' });
MockQuestion.belongsTo(MockTest, { foreignKey: 'mockTestId' });
MockTest.hasMany(MockAttempt, { foreignKey: 'mockTestId', as: 'attempts' });
MockAttempt.belongsTo(MockTest, { foreignKey: 'mockTestId', as: 'test' });
MockAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Career Compass
CareerAssessment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Articles (CMS)
// (no FK relationships needed beyond authorName string for now)

export default {
  sequelize,
  User,
  Role,
  UserRole,
  College,
  ApprovalBody,
  CollegeApproval,
  Category,
  Course,
  Specialization,
  CollegeCourse,
  Lead,
  LeadActivity,
  Student,
  ParentLink,
  Batch,
  Subject,
  AttendanceSession,
  AttendanceRecord,
  Exam,
  ExamResult,
  FeeTemplate,
  StudentFeeLedger,
  Payment,
  Application,
  Review,
  Notification,
  EntranceExam,
  Scholarship,
  Question,
  Answer,
  Cutoff,
  Article,
  MockTest,
  MockQuestion,
  MockAttempt,
  CareerAssessment
};
