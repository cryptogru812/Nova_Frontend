/* eslint-disable no-console */
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.AccountCreateInput[] = [
  {
    userName: 'Takuma',
    email: 'wongaiden812@gmail.com',
    registerType: 'manual',
    wallets: {
      create: [
        {
          walletAddress: 'sei14x4c4hxtwfq9r0dhzc8ktefvx7d665uadc8atz',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.account.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })