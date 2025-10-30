import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // ===== Create Test Auth User =====
  const testUserPassword = await bcrypt.hash('TestPass123', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: testUserPassword,
      role: 'USER',
    },
  })

  console.log('✅ Created test auth user:', testUser.email)

  // ===== Create Demo User with Resume =====
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@resumetailor.com' },
    update: {},
    create: {
      email: 'demo@resumetailor.com',
      name: 'John Doe',
      password: await bcrypt.hash('DemoPass123', 10),
      role: 'USER',
    },
  })

  console.log('✅ Created demo user:', demoUser.email)

  // Create sample resume data
  const resumeData = {
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
    },
    summary:
      'Experienced software engineer with 5+ years of full-stack development expertise. Passionate about building scalable applications and mentoring junior developers.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        dates: 'Jan 2021 – Present',
        location: 'Remote',
        bullets: [
          'Developed scalable backend APIs using Node.js and PostgreSQL, serving 1M+ daily active users',
          'Reduced API response times by 40% through caching and query optimization',
          'Led migration from monolith to microservices architecture',
          'Mentored 3 junior engineers and conducted code reviews',
        ],
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        dates: 'Jun 2019 – Dec 2020',
        location: 'San Francisco, CA',
        bullets: [
          'Built React components for dashboard with 50K+ monthly users',
          'Implemented authentication and authorization using JWT',
          'Collaborated with design team to improve user experience',
          'Reduced bug count by 30% through comprehensive testing',
        ],
      },
    ],
    education: [
      {
        school: 'Massachusetts Institute of Technology',
        degree: 'B.S. in Computer Science',
        dates: '2015 – 2019',
      },
    ],
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'Docker',
      'Git',
    ],
  }

  const resume = await prisma.resume.upsert({
    where: { id: 'sample-resume-1' },
    update: {},
    create: {
      id: 'sample-resume-1',
      userId: demoUser.id,
      data: JSON.stringify(resumeData),
      template: 'classic',
    },
  })

  console.log('✅ Created resume for demo user')

  // Create sample job description
  const jobDescription = await prisma.jobDescription.upsert({
    where: { id: 'sample-jd-1' },
    update: {},
    create: {
      id: 'sample-jd-1',
      companyName: 'Stripe',
      roleTitle: 'Senior Software Engineer',
      employerWebsite: 'https://stripe.com',
      description: `
Stripe is looking for a Senior Software Engineer to join our Platform team.

Requirements:
- 5+ years of software engineering experience
- Strong expertise in backend development (Node.js, Python, or Go)
- Experience with distributed systems and microservices
- Proficiency in PostgreSQL or similar databases
- Track record of mentoring junior engineers

Responsibilities:
- Design and build scalable APIs for Stripe's payment platform
- Optimize performance and reliability of existing services
- Collaborate with product managers and designers
- Mentor team members and contribute to engineering culture

Nice to have:
- Experience with React and TypeScript
- Knowledge of AWS or GCP
- Open source contributions
      `,
    },
  })

  console.log('✅ Created sample job description')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📝 Test Accounts:')
  console.log('   Auth test: test@example.com / TestPass123')
  console.log('   Demo user: demo@resumetailor.com / DemoPass123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
