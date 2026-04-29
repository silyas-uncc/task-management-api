const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  // Clear existing data
  await prisma.taskCategory.deleteMany();
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Cleared existing data');
  
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  // Create users WITH ROLES
  const john = await prisma.user.create({
    data: {
      username: 'john_doe',
      email: 'john@example.com',
      passwordHash: hashedPassword,
      role: 'USER',  // ADD THIS
    },
  });
  
  const jane = await prisma.user.create({
    data: {
      username: 'jane_smith',
      email: 'jane@example.com',
      passwordHash: hashedPassword,
      role: 'USER',  // ADD THIS
    },
  });
  
  const admin = await prisma.user.create({
    data: {
      username: 'admin_user',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',  // ADD THIS - CRITICAL
    },
  });
  
  console.log('Created users with roles:');
  console.log('  ' + john.username + ': ' + john.role);
  console.log('  ' + jane.username + ': ' + jane.role);
  console.log('  ' + admin.username + ': ' + admin.role);
  
  // Rest of your seed code remains the same...
  // Create projects for John
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      ownerId: john.id,
    },
  });
  
  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Build new mobile application',
      ownerId: john.id,
    },
  });
  
  // Create projects for Jane
  const project3 = await prisma.project.create({
    data: {
      name: 'Database Migration',
      description: 'Migrate legacy database to PostgreSQL',
      ownerId: jane.id,
    },
  });
  
  console.log('Created projects');
  
  // Create tasks
  await prisma.task.create({
    data: {
      title: 'Design homepage',
      description: 'Create Figma designs',
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-12-15'),
      projectId: project1.id,
      ownerId: john.id,
    },
  });
  
  await prisma.task.create({
    data: {
      title: 'Setup environment',
      description: 'Configure development environment',
      status: 'COMPLETED',
      dueDate: new Date('2024-11-30'),
      projectId: project2.id,
      ownerId: john.id,
    },
  });
  
  await prisma.task.create({
    data: {
      title: 'Create migration script',
      description: 'Write script to migrate data',
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-12-10'),
      projectId: project3.id,
      ownerId: jane.id,
    },
  });
  
  // Create categories
  await prisma.category.create({
    data: {
      name: 'Design',
      ownerId: john.id,
    },
  });
  
  await prisma.category.create({
    data: {
      name: 'Development',
      ownerId: john.id,
    },
  });
  
  await prisma.category.create({
    data: {
      name: 'Database',
      ownerId: jane.id,
    },
  });
  
  console.log('Created tasks and categories');
  
  console.log('\nDatabase seeding completed successfully');
  console.log('\nTest Credentials:');
  console.log('   john@example.com / Password123! (USER role)');
  console.log('   jane@example.com / Password123! (USER role)');
  console.log('   admin@example.com / Password123! (ADMIN role)');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });