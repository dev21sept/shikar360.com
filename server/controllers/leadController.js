import { Lead, LeadActivity, User, Course, College } from '../models/index.js';

export const createLead = async (req, res) => {
  try {
    const { fullName, email, phone, city, state, preferredCourseId, preferredCollegeId, source, notes, partnerReferralCode } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: 'Full name and phone are required' });
    }

    const lead = await Lead.create({
      fullName,
      email,
      phone,
      city,
      state,
      preferredCourseId,
      preferredCollegeId,
      source: source || 'Website Enquiry',
      notes,
      partnerReferralCode: partnerReferralCode || null
    });

    // Create initial activity log
    await LeadActivity.create({
      leadId: lead.id,
      type: 'Note',
      remarks: `Lead created from source: ${source || 'Website Enquiry'}`
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Our education counsellor will contact you shortly.',
      lead
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit enquiry', error: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { status, counsellorId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (counsellorId) where.assignedCounsellorId = counsellorId;

    // If logged in as counsellor, show only assigned leads or unassigned leads
    if (req.user && req.user.role === 'counsellor') {
      where.assignedCounsellorId = req.user.id;
    }

    const leads = await Lead.findAll({
      where,
      include: [
        { model: User, as: 'counsellor', attributes: ['id', 'fullName', 'email', 'phone'] },
        { model: Course, as: 'preferredCourse', attributes: ['id', 'name', 'code'] },
        { model: College, as: 'preferredCollege', attributes: ['id', 'name', 'city'] },
        { model: LeadActivity, as: 'activities', limit: 5, order: [['createdAt', 'DESC']] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch leads', error: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await LeadActivity.create({
      leadId: lead.id,
      counsellorId: req.user?.id || null,
      type: 'StatusChange',
      remarks: `Status changed from ${oldStatus} to ${status}. ${remarks || ''}`
    });

    return res.json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update lead', error: error.message });
  }
};

export const addLeadActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, remarks } = req.body;
    const activity = await LeadActivity.create({
      leadId: id,
      counsellorId: req.user?.id || null,
      type,
      remarks
    });
    return res.status(201).json({ success: true, activity });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to log activity', error: error.message });
  }
};
