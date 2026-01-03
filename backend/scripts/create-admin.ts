import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'admin@vietnhatky.com';
    const password = 'admin123'; // Change this after first login!
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists:', email);
      console.log('Use this email to login with password:', password);
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        isActive: true,
      },
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('⚠️  IMPORTANT: Change password after first login!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
