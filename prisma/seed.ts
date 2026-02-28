import bcrypt from "bcrypt";
import "dotenv/config";

import prisma from "../src/utils/prisma";

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.notification.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.item.deleteMany();
  await prisma.eventConfig.deleteMany();
  await prisma.userEvent.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleaned existing data");

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "super@oulufound.app",
      passwordHash: await bcrypt.hash("super123", 10),
      role: "SUPER_ADMIN",
    },
  });
  console.log("👑 Super admin created:", superAdmin.email);

  const ouluEvent = await prisma.event.create({
    data: {
      name: "University of Oulu",
      type: "UNIVERSITY",
      description: "Official lost and found for University of Oulu campus",
      slug: "oulu-uni-2025",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      config: {
        create: {
          requirePhoto: true,
          itemExpiryDays: null,
          notifyOnClaim: true,
          primaryColor: "#00529B",
        },
      },
    },
    include: { config: true },
  });

  console.log("📅 Event created:", ouluEvent.name);

  const ouluAdmin = await prisma.user.create({
    data: {
      name: "Mikael Virtanen",
      email: "admin@oulu.fi",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      events: { create: { eventId: ouluEvent.id } },
    },
  });
  console.log("👤 Admin created:", ouluAdmin.email);

  const backpack = await prisma.item.create({
    data: {
      name: "Blue Backpack",
      category: "OTHER",
      locationFound: "Library 2nd Floor",
      photoUrl: "https://placehold.co/400x300?text=Blue+Backpack",
      status: "UNCLAIMED",
      eventId: ouluEvent.id,
    },
  });
  console.log("📦 Item created:", backpack.name);

  const claim1 = await prisma.claim.create({
    data: {
      claimerName: "Aleksi Mäkinen",
      claimerContact: "aleksi@oulu.fi",
      ownershipProof: "Has a red keychain on the front zip and a laptop sleeve inside",
      status: "PENDING",
      itemId: backpack.id,
    },
  });
  console.log("📋 Claim created:", claim1.claimerName);

  await prisma.notification.create({
    data: {
      type: "CLAIM_SUBMITTED",
      recipient: claim1.claimerContact,
      message: `Your claim for "${backpack.name}" has been submitted and is under review.`,
      status: "SENT",
      sentAt: new Date(),
      claimId: claim1.id,
    },
  });
  console.log("🔔 Notification created for claim");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });