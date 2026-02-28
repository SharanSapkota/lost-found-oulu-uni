// src/prismaClient.ts
import { PrismaClient } from '@prisma/client'

const DATABASE_URL = process.env.DATABASE_URL

export const prisma = new PrismaClient({
  adapter: 'postgresql',
  connectionString: DATABASE_URL,
})