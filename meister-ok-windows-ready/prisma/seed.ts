import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main(){ const email=process.env.ADMIN_EMAIL||"admin@meister-ok.local"; const password=process.env.ADMIN_PASSWORD||"change-me-now"; await db.admin.upsert({where:{email},update:{passwordHash:await bcrypt.hash(password,12)},create:{email,passwordHash:await bcrypt.hash(password,12)}}); await db.siteSettings.upsert({where:{id:1},update:{},create:{id:1}}); }
main().finally(()=>db.$disconnect());
