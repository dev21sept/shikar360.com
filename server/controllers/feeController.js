import { StudentFeeLedger, Payment, Student, User, FeeTemplate, College } from '../models/index.js';

export const getStudentLedger = async (req, res) => {
  try {
    let studentId = req.query.studentId;

    if (!studentId && req.user.role === 'student') {
      const student = await Student.findOne({ where: { userId: req.user.id } });
      if (student) studentId = student.id;
    }

    if (!studentId && req.user.role === 'parent') {
      const student = await Student.findOne();
      if (student) studentId = student.id;
    }

    const ledger = await StudentFeeLedger.findOne({
      where: studentId ? { studentId } : {},
      include: [
        { model: FeeTemplate, as: 'template' },
        { model: Payment, as: 'payments' },
        { 
          model: Student, 
          as: 'student', 
          include: [
            { model: User, as: 'user', attributes: ['fullName', 'email', 'phone'] },
            { model: College, as: 'college', attributes: ['name', 'logoUrl'] }
          ]
        }
      ]
    });

    return res.json({ success: true, ledger });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching fee ledger', error: error.message });
  }
};

export const payFee = async (req, res) => {
  try {
    const { ledgerId, amount, paymentMethod = 'UPI' } = req.body;
    const ledger = await StudentFeeLedger.findByPk(ledgerId);
    if (!ledger) {
      return res.status(404).json({ success: false, message: 'Fee ledger not found' });
    }

    const payAmount = parseFloat(amount);
    const txnId = 'PAY_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const receiptNum = 'RCPT-' + Math.floor(100000 + Math.random() * 900000);

    const payment = await Payment.create({
      studentId: ledger.studentId,
      ledgerId: ledger.id,
      transactionId: txnId,
      paymentGateway: 'Razorpay / UPI Gateway',
      amount: payAmount,
      paymentMethod,
      status: 'Success',
      receiptNumber: receiptNum
    });

    const newPaid = parseFloat(ledger.paidAmount || 0) + payAmount;
    const newBalance = Math.max(0, parseFloat(ledger.totalAmount) - newPaid);

    ledger.paidAmount = newPaid;
    ledger.balanceDue = newBalance;
    ledger.status = newBalance === 0 ? 'Paid' : 'Partial';
    await ledger.save();

    return res.json({
      success: true,
      message: 'Payment completed successfully!',
      payment,
      updatedLedger: ledger
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Payment processing failed', error: error.message });
  }
};

export const getAccountsSummary = async (req, res) => {
  try {
    const ledgers = await StudentFeeLedger.findAll({
      include: [
        { 
          model: Student, 
          as: 'student', 
          include: [
            { model: User, as: 'user', attributes: ['fullName', 'phone', 'email'] },
            { model: College, as: 'college', attributes: ['id', 'name'] }
          ]
        },
        { model: Payment, as: 'payments' }
      ]
    });

    let totalReceivable = 0;
    let totalCollected = 0;
    let totalDues = 0;

    ledgers.forEach(l => {
      totalReceivable += parseFloat(l.totalAmount || 0);
      totalCollected += parseFloat(l.paidAmount || 0);
      totalDues += parseFloat(l.balanceDue || 0);
    });

    return res.json({
      success: true,
      metrics: {
        totalReceivable,
        totalCollected,
        totalDues,
        collectionRate: totalReceivable > 0 ? Math.round((totalCollected / totalReceivable) * 100) : 0
      },
      ledgers
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
