import { AttendanceSession, AttendanceRecord, Student, User, Subject, Batch, Exam, ExamResult, College } from '../models/index.js';

export const getAttendanceSummary = async (req, res) => {
  try {
    let studentId = req.query.studentId;

    if (!studentId && req.user.role === 'student') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      if (student) studentId = student.id;
    }

    if (!studentId && req.user.role === 'parent') {
      // Find linked child
      const student = await Student.findOne();
      if (student) studentId = student.id;
    }

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required' });
    }

    const records = await AttendanceRecord.findAll({
      where: { studentId },
      include: [
        {
          model: AttendanceSession,
          include: [{ model: Subject, as: 'subject' }]
        }
      ]
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
    const isAtRisk = percentage < 75;

    return res.json({
      success: true,
      stats: {
        totalSessions: total,
        presentSessions: present,
        percentage,
        isAtRisk,
        alert: isAtRisk ? 'Warning: Attendance is below 75% minimum university threshold!' : null
      },
      records
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { batchId, subjectId, sessionDate, sessionTime, topic, records } = req.body;
    // records: [ { studentId: 1, status: 'Present'|'Absent' } ]

    const session = await AttendanceSession.create({
      collegeId: req.user.tenantId || 1,
      batchId,
      subjectId,
      facultyUserId: req.user.id,
      sessionDate: sessionDate || new Date().toISOString().split('T')[0],
      sessionTime: sessionTime || '10:00 AM',
      topic: topic || 'Regular Lecture'
    });

    if (records && records.length) {
      const formatted = records.map(r => ({
        attendanceSessionId: session.id,
        studentId: r.studentId,
        status: r.status || 'Present'
      }));
      await AttendanceRecord.bulkCreate(formatted);
    }

    return res.status(201).json({ success: true, message: 'Attendance recorded successfully', session });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error marking attendance', error: error.message });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    let studentId = req.query.studentId;

    if (!studentId && req.user.role === 'student') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      if (student) studentId = student.id;
    }

    const results = await ExamResult.findAll({
      where: studentId ? { studentId } : {},
      include: [
        {
          model: Exam,
          include: [{ model: Subject, as: 'subject' }]
        },
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user', attributes: ['fullName', 'email'] }]
        }
      ]
    });

    return res.json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching results', error: error.message });
  }
};
