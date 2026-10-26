import { Application, College, Course, User } from '../models/index.js';
import { notifyUser } from './notificationController.js';

const generateApplicationNumber = () => {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(100 + Math.random() * 900);
  return `SHK${ts}${rand}`;
};

export const createApplication = async (req, res) => {
  try {
    const { collegeId, courseId, remarks } = req.body;
    if (!collegeId) {
      return res.status(400).json({ success: false, message: 'College is required' });
    }
    const college = await College.findByPk(collegeId);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const application = await Application.create({
      applicationNumber: generateApplicationNumber(),
      studentUserId: req.user.id,
      collegeId,
      courseId: courseId || null,
      remarks,
      status: 'Submitted'
    });

    return res.status(201).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { studentUserId: req.user.id },
      include: [
        { model: College, as: 'college', attributes: ['id', 'name', 'slug', 'city', 'logoUrl'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'level'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const where = {};
    // College reps only see applications for their own tenant college
    if (req.user.role === 'college_rep' && req.user.tenantId) {
      where.collegeId = req.user.tenantId;
    }
    const applications = await Application.findAll({
      where,
      include: [
        { model: College, as: 'college', attributes: ['id', 'name', 'slug', 'city'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'level'] },
        { model: User, as: 'applicant', attributes: ['id', 'fullName', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const application = await Application.findByPk(id, { include: [{ model: College, as: 'college' }] });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (req.user.role === 'college_rep' && Number(req.user.tenantId) !== Number(application.collegeId)) {
      return res.status(403).json({ success: false, message: 'You can only manage applications for your own college' });
    }
    await application.update({ status, remarks: remarks ?? application.remarks });

    await notifyUser(application.studentUserId, {
      title: 'Application Status Updated',
      message: `Your application (${application.applicationNumber}) to ${application.college?.name || 'the college'} is now "${status}".`,
      type: 'application',
      link: '/dashboard/student'
    });

    return res.json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update application', error: error.message });
  }
};
