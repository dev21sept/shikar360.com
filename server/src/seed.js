import bcrypt from 'bcryptjs';
import sequelize from './config/database.js';
import {
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
  Review,
  EntranceExam,
  Scholarship,
  Question,
  Answer,
  Cutoff,
  Article,
  MockTest,
  MockQuestion,
  CareerAssessment
} from './models/index.js';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // 1. Roles
    const rolesData = [
      { name: 'super_admin', displayName: 'Super Administrator', description: 'Full system control' },
      { name: 'admin', displayName: 'Content & System Admin', description: 'Manage colleges, courses, content & moderation' },
      { name: 'counsellor', displayName: 'Education Counsellor', description: 'Lead pipeline, call logging, targets' },
      { name: 'college_rep', displayName: 'College Representative', description: 'Manage own college profile, courses, fees' },
      { name: 'faculty', displayName: 'Faculty Member', description: 'Mark attendance, enter marks/grades' },
      { name: 'accounts', displayName: 'Accounts & Fee Staff', description: 'Fee collection, receipts, dues, refunds' },
      { name: 'student', displayName: 'Student', description: 'Applications, attendance, academics, fees' },
      { name: 'parent', displayName: 'Parent / Guardian', description: 'Read-only view of child attendance, fees & results' },
      { name: 'partner', displayName: 'Franchise Partner', description: 'Referral tracking, commission dashboard' },
    ];
    const createdRoles = await Role.bulkCreate(rolesData);
    const roleMap = {};
    createdRoles.forEach(r => { roleMap[r.name] = r.id; });

    // 2. Colleges
    const collegesData = [
      {
        slug: 'iit-bombay',
        name: 'IIT Bombay',
        shortName: 'IITB',
        establishedYear: 1958,
        universityType: 'Autonomous',
        city: 'Mumbai',
        state: 'Maharashtra',
        rating: 4.8,
        reviewCount: 1587,
        nirfRanking: 3,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
        overview: 'Indian Institute of Technology Bombay is an autonomous public engineering and research institution located in Powai, Mumbai.',
        averagePackage: '₹21.8 LPA',
        highestPackage: '₹1.68 CPA'
      },
      {
        slug: 'bits-pilani',
        name: 'BITS Pilani',
        shortName: 'BITS',
        establishedYear: 1964,
        universityType: 'Deemed',
        city: 'Pilani',
        state: 'Rajasthan',
        rating: 4.7,
        reviewCount: 1126,
        nirfRanking: 20,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
        overview: 'Birla Institute of Technology & Science, Pilani is a prestigious deemed university in India.',
        averagePackage: '₹18.5 LPA',
        highestPackage: '₹1.33 CPA'
      },
      {
        slug: 'vit-vellore',
        name: 'VIT Vellore',
        shortName: 'VIT',
        establishedYear: 1984,
        universityType: 'Deemed',
        city: 'Vellore',
        state: 'Tamil Nadu',
        rating: 4.6,
        reviewCount: 2093,
        nirfRanking: 11,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&auto=format&fit=crop&q=80',
        overview: 'Vellore Institute of Technology is a leading institution in South India with world-class infrastructure.',
        averagePackage: '₹9.2 LPA',
        highestPackage: '₹1.02 CPA'
      },
      {
        slug: 'srm-university',
        name: 'SRM University',
        shortName: 'SRM',
        establishedYear: 1985,
        universityType: 'Deemed',
        city: 'Chennai',
        state: 'Tamil Nadu',
        rating: 4.4,
        reviewCount: 2310,
        nirfRanking: 28,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&auto=format&fit=crop&q=80',
        overview: 'SRM Institute of Science and Technology is one of the top ranking universities in India.',
        averagePackage: '₹8.4 LPA',
        highestPackage: '₹1.10 CPA'
      },
      {
        slug: 'lpu',
        name: 'LPU',
        shortName: 'LPU',
        establishedYear: 2005,
        universityType: 'Private',
        city: 'Jalandhar',
        state: 'Punjab',
        rating: 4.3,
        reviewCount: 1845,
        nirfRanking: 38,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=120&auto=format&fit=crop&q=80',
        overview: 'Lovely Professional University is a private university situated in Chaheru, Phagwara, Punjab.',
        averagePackage: '₹7.5 LPA',
        highestPackage: '₹64 LPA'
      },
      {
        slug: 'amity-university',
        name: 'Amity University',
        shortName: 'Amity',
        establishedYear: 2005,
        universityType: 'Private',
        city: 'Noida',
        state: 'Uttar Pradesh',
        rating: 4.2,
        reviewCount: 512,
        nirfRanking: 35,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=120&auto=format&fit=crop&q=80',
        overview: 'Amity University Noida is a private research university established by an Act of the State Legislature of UP.',
        averagePackage: '₹7.2 LPA',
        highestPackage: '₹61.75 LPA'
      },
      {
        slug: 'manipal-university',
        name: 'Manipal University',
        shortName: 'MUJ',
        establishedYear: 2011,
        universityType: 'Private',
        city: 'Jaipur',
        state: 'Rajasthan',
        rating: 4.1,
        reviewCount: 436,
        nirfRanking: 64,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=120&auto=format&fit=crop&q=80',
        overview: 'Manipal University Jaipur is a renowned multidisciplinary private university in Rajasthan.',
        averagePackage: '₹8.5 LPA',
        highestPackage: '₹85 LPA'
      },
      {
        slug: 'chandigarh-university',
        name: 'Chandigarh University',
        shortName: 'CU',
        establishedYear: 2012,
        universityType: 'Private',
        city: 'Mohali',
        state: 'Punjab',
        rating: 4.0,
        reviewCount: 398,
        nirfRanking: 45,
        isFeatured: true,
        logoUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=120&auto=format&fit=crop&q=80',
        overview: 'Chandigarh University is NAAC A+ accredited university recognized for high placement track records.',
        averagePackage: '₹7.8 LPA',
        highestPackage: '₹54.75 LPA'
      }
    ];
    const createdColleges = await College.bulkCreate(collegesData);
    const collegeMap = {};
    createdColleges.forEach(c => { collegeMap[c.slug] = c.id; });

    // 3. Approval Bodies
    const approvalsData = [
      { code: 'UGC', name: 'University Grants Commission' },
      { code: 'AICTE', name: 'All India Council for Technical Education' },
      { code: 'NAAC', name: 'National Assessment and Accreditation Council' },
      { code: 'NBA', name: 'National Board of Accreditation' },
      { code: 'NIRF', name: 'National Institutional Ranking Framework' },
    ];
    const createdApprovals = await ApprovalBody.bulkCreate(approvalsData);

    // Map approvals to colleges
    for (const c of createdColleges) {
      await CollegeApproval.create({
        collegeId: c.id,
        approvalBodyId: createdApprovals[0].id,
        grade: 'UGC Recognized'
      });
      await CollegeApproval.create({
        collegeId: c.id,
        approvalBodyId: createdApprovals[2].id,
        grade: 'A+'
      });
    }

    // 4. Categories
    const categoriesData = [
      { slug: 'engineering', name: 'Engineering', icon: 'Cpu' },
      { slug: 'management', name: 'Management', icon: 'Briefcase' },
      { slug: 'medical', name: 'Medical', icon: 'Stethoscope' },
      { slug: 'law', name: 'Law', icon: 'Scale' },
      { slug: 'pharmacy', name: 'Pharmacy', icon: 'FlaskConical' },
      { slug: 'nursing', name: 'Nursing', icon: 'HeartPulse' },
      { slug: 'commerce', name: 'Commerce', icon: 'Calculator' },
      { slug: 'arts', name: 'Arts', icon: 'Palette' },
      { slug: 'science', name: 'Science', icon: 'Microscope' },
      { slug: 'distance-online', name: 'Distance & Online Education', icon: 'GraduationCap' },
      { slug: 'mbbs-abroad', name: 'MBBS Abroad', icon: 'Globe' },
      { slug: 'overseas-education', name: 'Overseas Education', icon: 'Plane' }
    ];
    const createdCategories = await Category.bulkCreate(categoriesData);
    const catMap = {};
    createdCategories.forEach(cat => { catMap[cat.slug] = cat.id; });

    // 5. Courses (Exact 3x5 Grid from Mockup)
    const coursesData = [
      { slug: 'mba', name: 'MBA', code: 'MBA', level: 'PG', iconName: 'Briefcase', categoryId: catMap['management'] },
      { slug: 'b-tech', name: 'B.Tech', code: 'BTECH', level: 'UG', iconName: 'Settings', categoryId: catMap['engineering'] },
      { slug: 'bba', name: 'BBA', code: 'BBA', level: 'UG', iconName: 'Users', categoryId: catMap['management'] },
      { slug: 'mba-distance', name: 'MBA (Distance)', code: 'DMBA', level: 'PG', iconName: 'GraduationCap', categoryId: catMap['distance-online'] },
      { slug: 'mca', name: 'MCA', code: 'MCA', level: 'PG', iconName: 'Code', categoryId: catMap['engineering'] },
      { slug: 'bca', name: 'BCA', code: 'BCA', level: 'UG', iconName: 'Monitor', categoryId: catMap['engineering'] },
      { slug: 'b-com', name: 'B.Com', code: 'BCOM', level: 'UG', iconName: 'FileText', categoryId: catMap['commerce'] },
      { slug: 'mbbs-abroad', name: 'MBBS Abroad', code: 'MBBS-A', level: 'UG', iconName: 'Stethoscope', categoryId: catMap['mbbs-abroad'] },
      { slug: 'b-pharm', name: 'B.Pharm', code: 'BPHARM', level: 'UG', iconName: 'FlaskConical', categoryId: catMap['pharmacy'] },
      { slug: 'llb', name: 'LLB', code: 'LLB', level: 'UG', iconName: 'Scale', categoryId: catMap['law'] },
      { slug: 'nursing', name: 'Nursing', code: 'BSCN', level: 'UG', iconName: 'HeartPulse', categoryId: catMap['nursing'] },
      { slug: 'b-sc', name: 'B.Sc', code: 'BSC', level: 'UG', iconName: 'Microscope', categoryId: catMap['science'] },
      { slug: 'm-com', name: 'M.Com', code: 'MCOM', level: 'PG', iconName: 'Coins', categoryId: catMap['commerce'] },
      { slug: 'ma', name: 'MA', code: 'MA', level: 'PG', iconName: 'BookOpen', categoryId: catMap['arts'] },
      { slug: 'more-courses', name: 'More Courses ···', code: 'MORE', level: 'UG', iconName: 'MoreHorizontal', categoryId: catMap['arts'] }
    ];
    const createdCourses = await Course.bulkCreate(coursesData);

    // 6. College Courses Mapping
    for (const c of createdColleges) {
      await CollegeCourse.create({
        collegeId: c.id,
        courseId: createdCourses[0].id, // MBA
        totalFee: 650000.00,
        feePerYear: 325000.00,
        duration: '2 Years',
        seats: 120,
        averagePackage: '₹8.5 LPA'
      });
      await CollegeCourse.create({
        collegeId: c.id,
        courseId: createdCourses[1].id, // B.Tech
        totalFee: 980000.00,
        feePerYear: 245000.00,
        duration: '4 Years',
        seats: 300,
        averagePackage: '₹9.2 LPA'
      });
    }

    // 7. Users for 9 roles
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Shikhar360@2026', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    const usersData = [
      { fullName: 'Super Admin', email: 'superadmin@shikhar360.in', phone: '9999900001', passwordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Admissions Admin', username: 'shikhar360', email: 'admin@shikhar360.in', phone: '9999900002', passwordHash: adminPasswordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Rajesh Sharma (Counsellor)', email: 'counsellor@shikhar360.in', phone: '9999900003', passwordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Amity University Rep', email: 'amity.rep@shikhar360.in', phone: '9999900004', passwordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Prof. Deepak Verma', email: 'faculty@shikhar360.in', phone: '9999900005', passwordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Sunil Mehta (Accounts)', email: 'accounts@shikhar360.in', phone: '9999900006', passwordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Priya Sharma (Student)', email: 'student@shikhar360.in', phone: '9999999999', passwordHash, status: 'active', isPhoneVerified: true }, // Master phone 9999999999
      { fullName: 'Mr. Ramesh Sharma (Parent)', email: 'parent@shikhar360.in', phone: '9999900008', passwordHash, status: 'active', isPhoneVerified: true },
      { fullName: 'Vikram Patel (Partner)', email: 'partner@shikhar360.in', phone: '9999900009', passwordHash, status: 'active', isPhoneVerified: true, referralCode: 'SHKPART-INDORE-09' },
    ];
    const createdUsers = await User.bulkCreate(usersData);

    // Map User Roles
    const userRoleAssignments = [
      { userId: createdUsers[0].id, roleId: roleMap['super_admin'], tenantId: null },
      { userId: createdUsers[1].id, roleId: roleMap['admin'], tenantId: null },
      { userId: createdUsers[2].id, roleId: roleMap['counsellor'], tenantId: null },
      { userId: createdUsers[3].id, roleId: roleMap['college_rep'], tenantId: collegeMap['amity-university'] }, // College Rep for Amity
      { userId: createdUsers[4].id, roleId: roleMap['faculty'], tenantId: collegeMap['amity-university'] },
      { userId: createdUsers[5].id, roleId: roleMap['accounts'], tenantId: collegeMap['amity-university'] },
      { userId: createdUsers[6].id, roleId: roleMap['student'], tenantId: collegeMap['amity-university'] },
      { userId: createdUsers[7].id, roleId: roleMap['parent'], tenantId: collegeMap['amity-university'] },
      { userId: createdUsers[8].id, roleId: roleMap['partner'], tenantId: null },
    ];
    await UserRole.bulkCreate(userRoleAssignments);

    // 8. Academic Student Record
    const amityId = collegeMap['amity-university'];
    const btechCourseId = createdCourses[1].id;

    const batch = await Batch.create({
      collegeId: amityId,
      courseId: btechCourseId,
      name: 'B.Tech CSE 2024-2028',
      startYear: 2024,
      endYear: 2028,
      currentSemester: 4
    });

    const studentRecord = await Student.create({
      userId: createdUsers[6].id, // Priya Sharma
      collegeId: amityId,
      courseId: btechCourseId,
      batchId: batch.id,
      enrollmentNumber: 'AMITY-2024-CSE-042',
      rollNumber: '42',
      currentSemester: 4,
      admissionDate: '2024-07-15',
      status: 'Active'
    });

    // Parent link
    await ParentLink.create({
      parentUserId: createdUsers[7].id,
      studentId: studentRecord.id,
      relationship: 'Father',
      isVerified: true
    });

    // Subject
    const subject = await Subject.create({
      courseId: btechCourseId,
      name: 'Data Structures & Algorithms',
      code: 'CS-401',
      semester: 4,
      credits: 4,
      facultyUserId: createdUsers[4].id
    });

    // Attendance sessions
    const session1 = await AttendanceSession.create({
      collegeId: amityId,
      batchId: batch.id,
      subjectId: subject.id,
      facultyUserId: createdUsers[4].id,
      sessionDate: '2026-10-10',
      sessionTime: '09:30 AM',
      topic: 'Binary Search Trees & AVL'
    });
    await AttendanceRecord.create({
      attendanceSessionId: session1.id,
      studentId: studentRecord.id,
      status: 'Present'
    });

    const session2 = await AttendanceSession.create({
      collegeId: amityId,
      batchId: batch.id,
      subjectId: subject.id,
      facultyUserId: createdUsers[4].id,
      sessionDate: '2026-10-12',
      sessionTime: '09:30 AM',
      topic: 'Graph Traversal - BFS & DFS'
    });
    await AttendanceRecord.create({
      attendanceSessionId: session2.id,
      studentId: studentRecord.id,
      status: 'Present'
    });

    // Exam & Result
    const exam = await Exam.create({
      collegeId: amityId,
      batchId: batch.id,
      subjectId: subject.id,
      title: 'Midterm Examination 2026',
      examType: 'Midterm',
      examDate: '2026-09-20',
      maxMarks: 100,
      passingMarks: 40,
      status: 'Published'
    });

    await ExamResult.create({
      examId: exam.id,
      studentId: studentRecord.id,
      marksObtained: 88,
      grade: 'A',
      remarks: 'Excellent problem solving ability'
    });

    // Fee Template & Ledger
    const feeTemplate = await FeeTemplate.create({
      collegeId: amityId,
      courseId: btechCourseId,
      title: 'Annual Tuition & Lab Fees (Year 2)',
      totalAmount: 245000.00,
      installmentsCount: 2
    });

    const ledger = await StudentFeeLedger.create({
      studentId: studentRecord.id,
      feeTemplateId: feeTemplate.id,
      totalAmount: 245000.00,
      paidAmount: 122500.00,
      balanceDue: 122500.00,
      dueDate: '2026-11-15',
      status: 'Partial'
    });

    await Payment.create({
      studentId: studentRecord.id,
      ledgerId: ledger.id,
      transactionId: 'TXN_UPI_9823482734',
      paymentGateway: 'Razorpay',
      amount: 122500.00,
      paymentMethod: 'UPI - Google Pay',
      status: 'Success',
      receiptNumber: 'AMITY-RCPT-2026-881'
    });

    // 9. Homepage Testimonial (Exact matching the photo!)
    await Review.create({
      studentName: 'Priya Sharma',
      universityName: 'Amity University, Noida',
      courseName: 'B.Tech Computer Science',
      rating: 5.0,
      title: 'Best Decision for My Career',
      content: 'Shikhar360 helped me compare the best universities and choose the right course. The information is detailed and updated.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Approved'
    });

    await Review.create({
      studentName: 'Rohan Mehta',
      universityName: 'BITS Pilani',
      courseName: 'M.Tech Microelectronics',
      rating: 5.0,
      title: 'Clear admission fee breakdown',
      content: 'The comparison tool showed exact placement statistics and hostel facilities that made choosing BITS Pilani completely seamless.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Approved'
    });

    await Review.create({
      studentName: 'Ananya Verma',
      universityName: 'VIT Vellore',
      courseName: 'B.Tech Information Technology',
      rating: 5.0,
      title: 'Superb counselling assistance',
      content: 'The counsellor walked me through VITEEE score cutoffs and guided my choice of specialization accurately.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'Approved'
    });

    // 10. Sample CRM Leads
    const sampleLead = await Lead.create({
      fullName: 'Aman Agarwal',
      email: 'aman.agarwal@gmail.com',
      phone: '9826012345',
      city: 'Indore',
      state: 'Madhya Pradesh',
      source: 'Compare Widget',
      status: 'In Counselling',
      assignedCounsellorId: createdUsers[2].id,
      preferredCollegeId: amityId,
      preferredCourseId: createdCourses[0].id,
      notes: 'Interested in MBA Marketing, budget around 6-8 Lakhs.'
    });

    await LeadActivity.create({
      leadId: sampleLead.id,
      counsellorId: createdUsers[2].id,
      type: 'Call',
      remarks: 'Spoke with candidate regarding MBA specialization and admission deadlines. Sent brochure.'
    });

    // Partner-referred leads (for Partner Portal demo stats)
    await Lead.bulkCreate([
      {
        fullName: 'Sneha Joshi',
        email: 'sneha.joshi@gmail.com',
        phone: '9826099001',
        city: 'Indore',
        state: 'Madhya Pradesh',
        source: 'Partner Referral',
        status: 'Converted',
        partnerReferralCode: 'SHKPART-INDORE-09',
        preferredCollegeId: amityId
      },
      {
        fullName: 'Karan Malviya',
        email: 'karan.malviya@gmail.com',
        phone: '9826099002',
        city: 'Indore',
        state: 'Madhya Pradesh',
        source: 'Partner Referral',
        status: 'In Counselling',
        partnerReferralCode: 'SHKPART-INDORE-09',
        preferredCollegeId: collegeMap['manipal-university']
      }
    ]);

    // 11. Entrance Exams Directory
    const createdExams = await EntranceExam.bulkCreate([
      {
        slug: 'jee-main',
        name: 'Joint Entrance Examination (Main)',
        shortName: 'JEE Main',
        conductingBody: 'National Testing Agency (NTA)',
        stream: 'Engineering',
        level: 'UG',
        examDate: '2027-01-24',
        applicationStartDate: '2026-11-01',
        applicationEndDate: '2026-11-30',
        resultDate: '2027-02-12',
        overview: 'JEE Main is the gateway exam for admission to NITs, IIITs and other centrally funded technical institutions, and a qualifier for JEE Advanced.',
        eligibility: 'Class 12 pass with Physics, Chemistry and Mathematics; no upper age limit.',
        examPattern: 'Computer-based test, 90 questions, 300 marks, 3 hours.',
        officialWebsite: 'https://jeemain.nta.nic.in',
        status: 'Upcoming',
        isFeatured: true
      },
      {
        slug: 'neet-ug',
        name: 'National Eligibility cum Entrance Test (UG)',
        shortName: 'NEET UG',
        conductingBody: 'National Testing Agency (NTA)',
        stream: 'Medical',
        level: 'UG',
        examDate: '2027-05-03',
        applicationStartDate: '2027-02-01',
        applicationEndDate: '2027-03-07',
        resultDate: '2027-06-14',
        overview: 'NEET UG is the single entrance exam for admission to MBBS, BDS and AYUSH courses across India.',
        eligibility: 'Class 12 pass with Physics, Chemistry, Biology/Biotechnology; minimum age 17 years.',
        examPattern: 'Pen-and-paper test, 200 questions (180 attempted), 720 marks, 3 hours 20 minutes.',
        officialWebsite: 'https://neet.nta.nic.in',
        status: 'Upcoming',
        isFeatured: true
      },
      {
        slug: 'cat',
        name: 'Common Admission Test',
        shortName: 'CAT',
        conductingBody: 'IIM (rotational convenor)',
        stream: 'Management',
        level: 'PG',
        examDate: '2026-11-29',
        applicationStartDate: '2026-08-01',
        applicationEndDate: '2026-09-18',
        resultDate: '2027-01-05',
        overview: 'CAT is the most widely accepted entrance exam for MBA admission into IIMs and 1,000+ B-schools.',
        eligibility: 'Bachelor\'s degree with minimum 50% marks (45% for reserved categories).',
        examPattern: 'Computer-based test, 3 sections (VARC, DILR, QA), 120 minutes.',
        officialWebsite: 'https://iimcat.ac.in',
        status: 'Completed',
        isFeatured: true
      },
      {
        slug: 'clat',
        name: 'Common Law Admission Test',
        shortName: 'CLAT',
        conductingBody: 'Consortium of National Law Universities',
        stream: 'Law',
        level: 'UG',
        examDate: '2026-12-07',
        applicationStartDate: '2026-07-01',
        applicationEndDate: '2026-11-15',
        resultDate: '2026-12-22',
        overview: 'CLAT is the gateway exam for admission to 5-year integrated law programmes at 24 National Law Universities.',
        eligibility: 'Class 12 pass with 45% marks (40% for reserved categories).',
        examPattern: 'Offline pen-and-paper test, 120 questions, 2 hours.',
        officialWebsite: 'https://consortiumofnlus.ac.in',
        status: 'Upcoming',
        isFeatured: false
      }
    ]);

    // 12. Scholarships
    await Scholarship.bulkCreate([
      {
        slug: 'national-merit-scholarship',
        name: 'National Merit cum Means Scholarship',
        provider: 'Ministry of Education, Govt. of India',
        category: 'Merit-cum-Means',
        benefitAmount: '₹12,000 / year',
        applicationDeadline: '2026-12-31',
        eligibility: 'Family income below ₹1.5 Lakh/year; minimum 80% marks in Class 10.',
        description: 'Financial assistance for economically weaker meritorious students pursuing Class 11-12 in government/aided schools.',
        applyLink: 'https://scholarships.gov.in',
        status: 'Open',
        isFeatured: true
      },
      {
        slug: 'shikhar360-merit-scholarship',
        name: 'Shikhar360 Merit Scholarship',
        provider: 'Shikhar360',
        category: 'Merit-based',
        benefitAmount: 'Up to 50% tuition fee waiver',
        applicationDeadline: '2026-11-30',
        eligibility: 'Minimum 85% in Class 12 boards, admission confirmed through Shikhar360 partner colleges.',
        description: 'Exclusive scholarship for top-performing students admitted through Shikhar360 to partner engineering and management colleges.',
        applyLink: '#',
        status: 'Open',
        isFeatured: true
      },
      {
        slug: 'aicte-pragati-scholarship',
        name: 'AICTE Pragati Scholarship for Girls',
        provider: 'AICTE',
        category: 'Need-based',
        benefitAmount: '₹50,000 / year',
        applicationDeadline: '2026-11-15',
        eligibility: 'Girl students in technical diploma/degree programmes with family income below ₹8 Lakh/year.',
        description: 'Scholarship supporting girl students pursuing technical education to arrest dropouts and improve enrollment ratio.',
        applyLink: 'https://www.aicte-pragati-saksham-gov.in',
        status: 'Open',
        isFeatured: false
      }
    ]);

    // 13. Q&A Community
    const q1 = await Question.create({
      title: 'What is a good JEE Main percentile for NIT Surathkal CSE?',
      body: 'I am expecting around 97 percentile in JEE Main. What are my chances of getting CSE at NIT Surathkal for home state quota?',
      tags: 'JEE Main, NIT, Counselling',
      userId: createdUsers[6].id
    });
    await Answer.create({
      questionId: q1.id,
      userId: createdUsers[2].id,
      body: 'For home state candidates, NIT Surathkal CSE closing percentile has historically been around 98.5+. At 97 percentile, Information Technology or ECE branches are more realistic — check the previous year JoSAA cutoff trends on our College Predictor tool.',
      isExpertAnswer: true,
      helpfulCount: 12
    });

    const q2 = await Question.create({
      title: 'Is BBA better than B.Com for an MBA career path?',
      body: 'I want to eventually do an MBA. Should I choose BBA or B.Com for my undergraduate degree?',
      tags: 'BBA, MBA, Career Guidance',
      userId: createdUsers[6].id
    });
    await Answer.create({
      questionId: q2.id,
      userId: createdUsers[2].id,
      body: 'Both are valid paths. BBA gives broader management exposure (marketing, HR, operations) which helps with CAT/MBA prep, while B.Com builds stronger finance/accounting fundamentals. If you are aiming for a Finance specialization in MBA, B.Com + CAT prep is a strong combination.',
      isExpertAnswer: true,
      helpfulCount: 8
    });

    // 14. Predictor Cutoff Data (JEE Main, B.Tech — illustrative demo ranks, not official)
    const jeeMainExam = createdExams.find((e) => e.slug === 'jee-main');
    const btechId = createdCourses[1].id;
    const cutoffRows = [
      { slug: 'iit-bombay', closingRank: 500 },
      { slug: 'bits-pilani', closingRank: 3000 },
      { slug: 'vit-vellore', closingRank: 8000 },
      { slug: 'srm-university', closingRank: 15000 },
      { slug: 'manipal-university', closingRank: 20000 },
      { slug: 'chandigarh-university', closingRank: 35000 },
      { slug: 'amity-university', closingRank: 50000 },
      { slug: 'lpu', closingRank: 60000 },
    ];
    await Cutoff.bulkCreate(
      cutoffRows.map((row) => ({
        entranceExamId: jeeMainExam.id,
        collegeId: collegeMap[row.slug],
        courseId: btechId,
        year: 2026,
        round: 1,
        category: 'General',
        openingRank: 1,
        closingRank: row.closingRank
      }))
    );

    // 15. Articles / News CMS
    await Article.bulkCreate([
      {
        slug: 'jee-main-2027-application-dates-announced',
        title: 'JEE Main 2027 Application Dates Announced — Here\'s What You Need to Know',
        excerpt: 'NTA has released the official schedule for JEE Main 2027. Applications open November 1, 2026.',
        content: 'The National Testing Agency (NTA) has announced that JEE Main 2027 registrations will open on November 1, 2026 and close on November 30, 2026. Candidates are advised to keep their scanned documents (photograph, signature, category certificate) ready before the portal opens.\n\nKey highlights:\n- Exam Date: January 24, 2027\n- Application Fee: ₹1000 (General), ₹500 (Reserved categories)\n- Mode: Computer Based Test (CBT)\n\nStudents preparing for JEE Main should focus on NCERT fundamentals and previous year papers in the final stretch. Use our College Predictor tool once results are declared to shortlist realistic college options based on your rank.',
        category: 'Admission News',
        coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
        authorName: 'Shikhar360 Editorial',
        status: 'Published',
        publishedAt: new Date('2026-10-15')
      },
      {
        slug: 'top-5-mistakes-students-make-choosing-college',
        title: 'Top 5 Mistakes Students Make While Choosing a College',
        excerpt: 'Avoid these common pitfalls when shortlisting colleges for admission.',
        content: '1. Chasing brand name over course fit — a lesser-known college with a strong placement record in your chosen field often beats a famous name with a weak department.\n\n2. Ignoring the fee-to-ROI ratio — always check average and highest package data, not just headline numbers.\n\n3. Not verifying UGC/AICTE/NAAC approvals — always confirm a college\'s approvals before applying.\n\n4. Overlooking location and cost of living — tier-1 city colleges often come with 2-3x higher living expenses.\n\n5. Skipping the comparison step — use a proper side-by-side comparison tool (like Shikhar360\'s Compare feature) before locking in your decision.',
        category: 'Guidance',
        coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
        authorName: 'Rajesh Sharma, Senior Counsellor',
        status: 'Published',
        publishedAt: new Date('2026-10-10')
      },
      {
        slug: 'neet-ug-2027-eligibility-criteria-explained',
        title: 'NEET UG 2027 Eligibility Criteria Explained',
        excerpt: 'Everything you need to know about age limit, qualifying subjects, and attempt limits for NEET UG 2027.',
        content: 'NEET UG is the single entrance exam for MBBS, BDS and AYUSH admissions across India. To be eligible:\n\n- Candidates must have passed Class 12 with Physics, Chemistry, Biology/Biotechnology and English as core subjects.\n- Minimum age: 17 years as of December 31 of the admission year.\n- There is currently no upper age limit or attempt cap per the latest NMC guidelines.\n\nReserved category candidates require a minimum of 40% aggregate in PCB, while general category candidates need 50%. Make sure your category certificate is updated before applying.',
        category: 'Exam Guide',
        coverImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
        authorName: 'Shikhar360 Editorial',
        status: 'Published',
        publishedAt: new Date('2026-10-05')
      }
    ]);

    // 16. Mock Test (sample General Aptitude test)
    const sampleMockTest = await MockTest.create({
      title: 'General Aptitude & Reasoning — Mock Test 1',
      description: 'A quick 5-question mock test covering basic quantitative aptitude and logical reasoning, similar to the format used in management and engineering entrance exams.',
      durationMinutes: 10,
      negativeMarking: 0.25,
      marksPerQuestion: 4,
      status: 'Active'
    });

    await MockQuestion.bulkCreate([
      {
        mockTestId: sampleMockTest.id,
        text: 'If a train travels 300 km in 5 hours, what is its average speed?',
        options: JSON.stringify(['50 km/h', '60 km/h', '65 km/h', '70 km/h']),
        correctIndex: 1,
        explanation: 'Speed = Distance / Time = 300 / 5 = 60 km/h.',
        order: 0
      },
      {
        mockTestId: sampleMockTest.id,
        text: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
        options: JSON.stringify(['36', '40', '42', '44']),
        correctIndex: 2,
        explanation: 'Differences are 4, 6, 8, 10, 12 → 30 + 12 = 42.',
        order: 1
      },
      {
        mockTestId: sampleMockTest.id,
        text: 'A shopkeeper marks an item 20% above cost price and gives a 10% discount. What is his profit percentage?',
        options: JSON.stringify(['8%', '10%', '12%', '15%']),
        correctIndex: 0,
        explanation: 'Let CP = 100. Marked price = 120. After 10% discount: 108. Profit = 8%.',
        order: 2
      },
      {
        mockTestId: sampleMockTest.id,
        text: 'Choose the word that is most nearly OPPOSITE in meaning to "Austere".',
        options: JSON.stringify(['Strict', 'Lavish', 'Simple', 'Harsh']),
        correctIndex: 1,
        explanation: '"Austere" means simple/strict; "Lavish" is its opposite.',
        order: 3
      },
      {
        mockTestId: sampleMockTest.id,
        text: 'If CODING is written as DPEJOH, how is FLOWER written in the same code?',
        options: JSON.stringify(['GMPXFS', 'GMPXFT', 'HMPXFS', 'GNPXFS']),
        correctIndex: 0,
        explanation: 'Each letter is shifted by +1: F→G, L→M, O→P, W→X, E→F, R→S = GMPXFS.',
        order: 4
      }
    ]);

    console.log('🎉 Database successfully seeded with all mock and production data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
