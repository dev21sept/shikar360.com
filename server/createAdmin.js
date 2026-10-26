import bcrypt from 'bcryptjs';
import sequelize from './config/database.js';
import { User, Role, UserRole } from './models/index.js';

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // Ensure tables exist
    await sequelize.sync();

    // Ensure roles exist
    const rolesList = [
      { name: 'super_admin', displayName: 'Super Administrator', description: 'Full access' },
      { name: 'admin', displayName: 'Admissions Administrator', description: 'Manages admissions' },
      { name: 'counsellor', displayName: 'Education Counsellor', description: 'Student counseling' },
      { name: 'college_rep', displayName: 'College Representative', description: 'College rep' },
      { name: 'faculty', displayName: 'Faculty Member', description: 'Faculty' },
      { name: 'accounts', displayName: 'Accounts', description: 'Accounts' },
      { name: 'student', displayName: 'Student', description: 'Student' },
      { name: 'parent', displayName: 'Parent', description: 'Parent' },
      { name: 'partner', displayName: 'Partner', description: 'Partner' },
    ];

    for (const r of rolesList) {
      await Role.findOrCreate({ where: { name: r.name }, defaults: r });
    }
    console.log('✅ Roles initialized.');

    const adminRole = await Role.findOne({ where: { name: 'super_admin' } });

    const email = process.argv[2] || 'admin@shikhar360.in';
    const password = process.argv[3] || 'admin123';
    const phone = process.argv[4] || '9999900001';
    const username = 'shikhar360';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        fullName: 'Super Administrator',
        username,
        email,
        phone,
        passwordHash,
        status: 'active',
        isPhoneVerified: true
      }
    });

    if (!created) {
      user.passwordHash = passwordHash;
      user.status = 'active';
      user.isPhoneVerified = true;
      if (!user.username) user.username = username;
      await user.save();
      console.log(`🔄 Admin user [${email}] updated with new password.`);
    } else {
      console.log(`✅ Admin user [${email}] created successfully.`);
    }

    // Assign super_admin role
    await UserRole.findOrCreate({
      where: { userId: user.id, roleId: adminRole.id },
      defaults: { userId: user.id, roleId: adminRole.id, tenantId: null }
    });

    console.log('==============================================');
    console.log('🎉 ADMIN CREDENTIALS READY:');
    console.log(`👉 Email:    ${email}`);
    console.log(`👉 Username: ${username}`);
    console.log(`👉 Phone:    ${phone}`);
    console.log(`👉 Password: ${password}`);
    console.log('👉 Role:     super_admin');
    console.log('==============================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
