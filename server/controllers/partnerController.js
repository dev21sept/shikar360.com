import { Lead, User } from '../models/index.js';

const COMMISSION_PER_CONVERSION = 10000; // flat demo commission per converted referral, in INR

export const getPartnerStats = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user?.referralCode) {
      return res.json({
        success: true,
        referralCode: null,
        referredCount: 0,
        convertedCount: 0,
        commissionEarned: 0,
        leads: []
      });
    }

    const leads = await Lead.findAll({
      where: { partnerReferralCode: user.referralCode },
      order: [['createdAt', 'DESC']]
    });

    const convertedCount = leads.filter((l) => l.status === 'Converted').length;

    return res.json({
      success: true,
      referralCode: user.referralCode,
      referredCount: leads.length,
      convertedCount,
      commissionEarned: convertedCount * COMMISSION_PER_CONVERSION,
      leads
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch partner stats', error: error.message });
  }
};
