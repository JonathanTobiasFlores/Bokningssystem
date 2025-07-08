import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create time slots
  const timeSlots = [
    { startTime: '08:00', endTime: '09:00' },
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '12:00', endTime: '13:00' },
    { startTime: '13:00', endTime: '14:00' },
    { startTime: '14:00', endTime: '15:00' },
    { startTime: '15:00', endTime: '16:00' },
    { startTime: '16:00', endTime: '17:00' },
  ]

  for (const slot of timeSlots) {
    await prisma.timeSlot.upsert({
      where: { startTime_endTime: slot },
      update: {},
      create: slot,
    })
  }

  // Create rooms
  const rooms = [
    { name: 'Conference Room A', capacity: 10 },
    { name: 'Conference Room B', capacity: 8 },
    { name: 'Meeting Room 1', capacity: 4 },
    { name: 'Meeting Room 2', capacity: 6 },
    { name: 'Board Room', capacity: 12 },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 