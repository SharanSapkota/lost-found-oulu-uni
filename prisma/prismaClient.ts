import "dotenv/config";

import {PrismaClient} from '../src/generated/prisma/client'
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const DATABASE_URL = process.env.DATABASE_URL

 const prisma = new PrismaClient({
  adapter,
});

export default prisma;