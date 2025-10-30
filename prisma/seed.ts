import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  })

  if (existingUser) {
    console.log('Test user already exists!')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash('TestPass123', 10)

  // Create test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'USER',
    },
  })

  console.log('Test user created successfully!')
  console.log('Email: test@example.com')
  console.log('Password: TestPass123')
  console.log('User ID:', user.id)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
