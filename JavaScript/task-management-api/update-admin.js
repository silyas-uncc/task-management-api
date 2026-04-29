const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    // Check current admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!admin) {
      console.log('Admin user not found!');
      return;
    }
    
    console.log('Current admin user:', admin.email);
    console.log('Current role:', admin.role);
    
    if (admin.role !== 'ADMIN') {
      const updated = await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: { role: 'ADMIN' }
      });
      console.log('Updated admin role to:', updated.role);
    } else {
      console.log('Admin role is already ADMIN');
    }
    
    // Show all users and their roles
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true
      }
    });
    
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`  ${user.email}: ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();