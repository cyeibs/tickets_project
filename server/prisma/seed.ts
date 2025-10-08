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
  const [musicCat, sportCat, movieCat, theatreCat, educationCat] =
    await Promise.all([
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
      prisma.eventCategory.upsert({
        where: { id: "00000000-0000-0000-0000-000000000003" },
        update: {},
        create: {
          id: "00000000-0000-0000-0000-000000000003",
          name: "Movie",
          slug: "movie",
        },
      }),
      prisma.eventCategory.upsert({
        where: { id: "00000000-0000-0000-0000-000000000004" },
        update: {},
        create: {
          id: "00000000-0000-0000-0000-000000000004",
          name: "Theatre",
          slug: "theatre",
        },
      }),
      prisma.eventCategory.upsert({
        where: { id: "00000000-0000-0000-0000-000000000005" },
        update: {},
        create: {
          id: "00000000-0000-0000-0000-000000000005",
          name: "Education",
          slug: "education",
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

  // event statuses
  const [publishedEvtStatus, moderationEvtStatus, completedEvtStatus] =
    await Promise.all([
      prisma.eventStatus.upsert({
        where: { code: "published" },
        update: {},
        create: { code: "published", name: "Published" },
      }),
      prisma.eventStatus.upsert({
        where: { code: "moderation" },
        update: {},
        create: { code: "moderation", name: "On Moderation" },
      }),
      prisma.eventStatus.upsert({
        where: { code: "completed" },
        update: {},
        create: { code: "completed", name: "Completed" },
      }),
    ]);

  const [color1, color2] = await Promise.all([
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000021" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000021",
        name: "prime-accent-color",
        color: "#AFF940",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000022" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000022",
        name: "alt-accent-color",
        color: "#BBBAFF",
        textColor: "#212C3A",
      },
    }),
  ]);

  await Promise.all([
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000023" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000023",
        name: "light-pink",
        color: "#FFBABA",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000024" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000024",
        name: "dark-peach",
        color: "#FFD3BA",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000025" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000025",
        name: "gold",
        color: "#FFD700",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000026" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000026",
        name: "lemon-cream",
        color: "#FFFDBA",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000027" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000027",
        name: "light-green",
        color: "#C8FFBA",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000028" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000028",
        name: "pang",
        color: "#BAFFE9",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000029" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000029",
        name: "blue-blue-frost",
        color: "#BAF5FF",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000030" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000030",
        name: "bright-lilac",
        color: "#CFBAFF",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000031" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000031",
        name: "pink",
        color: "#F9BAFF",
        textColor: "#212C3A",
      },
    }),
    prisma.eventColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000032" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000032",
        name: "prime-dark-color",
        color: "#212C3A",
        textColor: "#FFFFFF",
      },
    }),
  ]);

  // story colors (mirror StoryCreatePage.tsx)
  await Promise.all([
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000041" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000041",
        name: "prime-accent-color",
        color: "#AFF940",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000042" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000042",
        name: "alt-accent-color",
        color: "#BBBAFF",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000043" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000043",
        name: "light-pink",
        color: "#FFBABA",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000044" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000044",
        name: "dark-peach",
        color: "#FFD3BA",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000045" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000045",
        name: "gold",
        color: "#FFD700",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000046" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000046",
        name: "lemon-cream",
        color: "#FFFDBA",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000047" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000047",
        name: "light-green",
        color: "#C8FFBA",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000048" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000048",
        name: "pang",
        color: "#BAFFE9",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000049" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000049",
        name: "blue-blue-frost",
        color: "#BAF5FF",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000050" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000050",
        name: "bright-lilac",
        color: "#CFBAFF",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000051" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000051",
        name: "pink",
        color: "#F9BAFF",
        textColor: "#212C3A",
      },
    }),
    prisma.storyColor.upsert({
      where: { id: "00000000-0000-0000-0000-000000000052" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000052",
        name: "prime-dark-color",
        color: "#212C3A",
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
      colorId: color1.id,
      statusId: publishedEvtStatus.id,
    },
  });

  // Past event (already finished)
  const event2 = await prisma.event.upsert({
    where: { id: "00000000-0000-0000-0000-000000000202" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000202",
      organizationId: org.id,
      name: "Past Chamber Music Night",
      description: "An intimate chamber performance",
      categoryId: musicCat.id,
      cityId: spb.id,
      eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      startTime: "18:00",
      location: "Small Hall",
      maxQuantity: 100,
      price: 800.0,
      colorId: color2.id,
      statusId: completedEvtStatus.id,
    },
  });

  // On moderation event
  await prisma.event.upsert({
    where: { id: "00000000-0000-0000-0000-000000000203" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000203",
      organizationId: org.id,
      name: "Jazz Evening",
      description: "Awaiting moderation",
      categoryId: musicCat.id,
      cityId: moscow.id,
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      startTime: "20:00",
      location: "Jazz Club",
      maxQuantity: 120,
      price: 1200.0,
      colorId: color1.id,
      statusId: moderationEvtStatus.id,
    },
  });

  // Draft example
  await prisma.eventDraft.upsert({
    where: { id: "00000000-0000-0000-0000-000000000301" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000301",
      organizationId: org.id,
      name: "Draft: New Year Party",
      description: "Not ready yet",
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

  // Past purchase for Alice (so that it appears in history)
  await prisma.purchase.create({
    data: {
      eventId: event2.id,
      userId: alice.id,
      firstName: "Alice",
      lastName: "Doe",
      price: 800.0,
      serviceTax: 40.0,
      statusId: paidStatus.id,
    },
  });

  // Subscriptions: Alice subscribes to Demo Org
  await prisma.subscription.upsert({
    where: {
      userId_organizationId: { userId: alice.id, organizationId: org.id },
    },
    update: {},
    create: { userId: alice.id, organizationId: org.id },
  });

  // Favorite: Alice likes Demo Concert
  await prisma.favorite.upsert({
    where: { userId_eventId: { userId: alice.id, eventId: event1.id } },
    update: {},
    create: { userId: alice.id, eventId: event1.id },
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
