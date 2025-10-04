import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // roles
  const [userRole, organizerRole] = await Promise.all([
    prisma.role.upsert({
      where: { code: "user" },
      update: {},
      create: { code: "user", name: "User" },
    }),
    prisma.role.upsert({
      where: { code: "organizer" },
      update: {},
      create: { code: "organizer", name: "Organizer" },
    }),
  ]);

  // purchase statuses
  const [createdStatus, paidStatus, canceledStatus, refundedStatus] =
    await Promise.all([
      prisma.purchaseStatus.upsert({
        where: { code: "created" },
        update: {},
        create: { code: "created", name: "Created" },
      }),
      prisma.purchaseStatus.upsert({
        where: { code: "paid" },
        update: {},
        create: { code: "paid", name: "Paid" },
      }),
      prisma.purchaseStatus.upsert({
        where: { code: "canceled" },
        update: {},
        create: { code: "canceled", name: "Canceled" },
      }),
      prisma.purchaseStatus.upsert({
        where: { code: "refunded" },
        update: {},
        create: { code: "refunded", name: "Refunded" },
      }),
    ]);

  // dictionaries
  const [musicCat, sportCat] = await Promise.all([
    prisma.eventCategory.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Music",
        slug: "music",
      },
    }),
    prisma.eventCategory.upsert({
      where: { id: "00000000-0000-0000-0000-000000000002" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000002",
        name: "Sport",
        slug: "sport",
      },
    }),
  ]);

  const [moscow, spb] = await Promise.all([
    prisma.city.upsert({
      where: { id: "00000000-0000-0000-0000-000000000011" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000011",
        name: "Moscow",
        slug: "moscow",
      },
    }),
    prisma.city.upsert({
      where: { id: "00000000-0000-0000-0000-000000000012" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000012",
        name: "Saint Petersburg",
        slug: "saint-petersburg",
      },
    }),
  ]);

  const [red, blue] = await Promise.all([
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000021" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000021",
        name: "Red",
        color: "#FF3B30",
        textColor: "#FFFFFF",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000022" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000022",
        name: "Blue",
        color: "#007AFF",
        textColor: "#FFFFFF",
      },
    }),
  ]);

  // org + users
  const org = await prisma.organization.upsert({
    where: { id: "00000000-0000-0000-0000-000000000101" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000101",
      name: "Demo Org",
      description: "Test organizer",
      telephone: "+79990000000",
      socialUrl: "https://t.me/demo",
      inn: "7700000000",
      ogrn: "1207700000000",
      kpp: "770001001",
      licence: "LIC-DEMO-001",
    },
  });

  const passwordHash = await bcrypt.hash("password", 10);

  const [alice, bob] = await Promise.all([
    prisma.user.upsert({
      where: { telephone: "+70000000001" },
      update: {},
      create: {
        firstName: "Alice",
        lastName: "Doe",
        telephone: "+70000000001",
        password: passwordHash,
        roleId: userRole.id,
      },
    }),
    prisma.user.upsert({
      where: { telephone: "+70000000002" },
      update: {},
      create: {
        firstName: "Bob",
        lastName: "Smith",
        telephone: "+70000000002",
        password: passwordHash,
        roleId: organizerRole.id,
        organizationId: org.id,
      },
    }),
  ]);

  // Events
  const event1 = await prisma.event.upsert({
    where: { id: "00000000-0000-0000-0000-000000000201" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000201",
      organizationId: org.id,
      name: "Demo Concert",
      description: "Great music night",
      categoryId: musicCat.id,
      cityId: moscow.id,
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startTime: "19:00",
      location: "Main Hall",
      maxQuantity: 200,
      price: 1000.0,
      colorId: red.id,
    },
  });

  // Review
  await prisma.review.upsert({
    where: { eventId_authorId: { eventId: event1.id, authorId: alice.id } },
    update: { text: "Nice!", rating: 5 },
    create: {
      eventId: event1.id,
      authorId: alice.id,
      text: "Nice!",
      rating: 5,
    },
  });

  // Purchase
  await prisma.purchase.create({
    data: {
      eventId: event1.id,
      userId: alice.id,
      firstName: "Alice",
      lastName: "Doe",
      price: 1000.0,
      serviceTax: 50.0,
      statusId: paidStatus.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
