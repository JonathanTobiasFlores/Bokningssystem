import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create time slots (no id provided, unique on startTime+endTime)
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
      where: { startTime_endTime: { startTime: slot.startTime, endTime: slot.endTime } },
      update: {},
      create: slot,
    })
  }

  // Create rooms (no id provided, unique on name)
  const rooms = [
    { name: 'Stora konferensrummet', capacity: 10 },
    { name: 'Lilla konferensrummet', capacity: 8 },
    { name: 'Mötesrum 1', capacity: 4 },
    { name: 'Mötesrum 2', capacity: 6 },
    { name: 'Styrelserummet', capacity: 12 },
    { name: 'Projekt Alfa', capacity: 5 },
    { name: 'Projekt Beta', capacity: 5 },
    { name: 'Kreativa hörnan', capacity: 4 },
    { name: 'Fokusrum 1', capacity: 1 },
    { name: 'Fokusrum 2', capacity: 1 },
    { name: 'Flex-rummet', capacity: 8 },
    { name: 'Event-ytan', capacity: 50 },
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