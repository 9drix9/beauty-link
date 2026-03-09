import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.adminAction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.service.deleteMany();
  await prisma.professionalProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@beautylink.com",
      role: "ADMIN",
    },
  });

  // Create client users
  const client1 = await prisma.user.create({
    data: {
      name: "Emily Chen",
      email: "emily@example.com",
      role: "CLIENT",
      phone: "3105551001",
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: "Jordan Williams",
      email: "jordan@example.com",
      role: "CLIENT",
      phone: "3105551002",
    },
  });

  // Create professionals with profiles
  const pro1User = await prisma.user.create({
    data: {
      name: "Sarah Mitchell",
      email: "sarah@example.com",
      role: "PROFESSIONAL",
      phone: "3105552001",
    },
  });

  const pro1 = await prisma.professionalProfile.create({
    data: {
      userId: pro1User.id,
      bio: "Licensed cosmetologist with 8 years of experience specializing in color, balayage, and precision cuts.",
      instagramUrl: "https://instagram.com/sarahcuts",
      yearsExperience: 8,
      licenseType: "Cosmetology",
      licenseNumber: "CO-12345",
      licenseState: "CA",
      verificationStatus: "APPROVED",
      businessType: "SALON",
      ratingAverage: 4.8,
      ratingCount: 24,
    },
  });

  const pro2User = await prisma.user.create({
    data: {
      name: "Lisa Kim",
      email: "lisa@example.com",
      role: "PROFESSIONAL",
      phone: "3105552002",
    },
  });

  const pro2 = await prisma.professionalProfile.create({
    data: {
      userId: pro2User.id,
      bio: "Nail artist and licensed manicurist. Known for gel art and clean natural sets.",
      instagramUrl: "https://instagram.com/lisanails",
      yearsExperience: 5,
      licenseType: "Manicurist",
      licenseNumber: "MN-67890",
      licenseState: "CA",
      verificationStatus: "APPROVED",
      businessType: "SUITE",
      ratingAverage: 4.9,
      ratingCount: 42,
    },
  });

  const pro3User = await prisma.user.create({
    data: {
      name: "Mia Rodriguez",
      email: "mia@example.com",
      role: "PROFESSIONAL",
      phone: "3105552003",
    },
  });

  const pro3 = await prisma.professionalProfile.create({
    data: {
      userId: pro3User.id,
      bio: "Lash extension specialist. Classic, hybrid, and volume sets.",
      yearsExperience: 4,
      licenseType: "Esthetician",
      licenseNumber: "ES-11111",
      licenseState: "CA",
      verificationStatus: "APPROVED",
      businessType: "HOME",
      ratingAverage: 4.7,
      ratingCount: 18,
    },
  });

  // Create services
  const svc1 = await prisma.service.create({
    data: {
      professionalProfileId: pro1.id,
      name: "Balayage Highlights",
      category: "HAIR",
      description: "Full balayage highlight service including toner and blowout.",
      basePrice: 18000,
      durationMinutes: 120,
    },
  });

  const svc2 = await prisma.service.create({
    data: {
      professionalProfileId: pro1.id,
      name: "Silk Press & Trim",
      category: "HAIR",
      description: "Silk press blowout with optional trim.",
      basePrice: 9500,
      durationMinutes: 90,
    },
  });

  const svc3 = await prisma.service.create({
    data: {
      professionalProfileId: pro2.id,
      name: "Gel Manicure",
      category: "NAILS",
      description: "Classic gel manicure with your choice of color.",
      basePrice: 5500,
      durationMinutes: 45,
    },
  });

  const svc4 = await prisma.service.create({
    data: {
      professionalProfileId: pro3.id,
      name: "Classic Lash Extensions",
      category: "LASHES",
      description: "Full set of classic lash extensions for a natural, elegant look.",
      basePrice: 15000,
      durationMinutes: 90,
    },
  });

  // Create open appointments
  const now = new Date();

  const appointments = [
    {
      professionalProfileId: pro1.id,
      serviceId: svc1.id,
      originalPrice: 18000,
      discountedPrice: 12600,
      startAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 4 * 60 * 60 * 1000),
      launchZone: "UCLA / Westwood",
      locationAddress: "Westwood Blvd, Los Angeles, CA",
      latitude: 34.0625,
      longitude: -118.4472,
      status: "OPEN" as const,
    },
    {
      professionalProfileId: pro1.id,
      serviceId: svc2.id,
      originalPrice: 9500,
      discountedPrice: 6500,
      startAt: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 7.5 * 60 * 60 * 1000),
      launchZone: "UCLA / Westwood",
      locationAddress: "Westwood Blvd, Los Angeles, CA",
      latitude: 34.0625,
      longitude: -118.4472,
      status: "OPEN" as const,
    },
    {
      professionalProfileId: pro2.id,
      serviceId: svc3.id,
      originalPrice: 5500,
      discountedPrice: 3500,
      startAt: new Date(now.getTime() + 5 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      launchZone: "LMU / Westchester",
      locationAddress: "Lincoln Blvd, Westchester, CA",
      latitude: 33.9617,
      longitude: -118.4189,
      status: "OPEN" as const,
    },
    {
      professionalProfileId: pro3.id,
      serviceId: svc4.id,
      originalPrice: 15000,
      discountedPrice: 10000,
      startAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      endAt: new Date(now.getTime() + 25.5 * 60 * 60 * 1000),
      launchZone: "UCLA / Westwood",
      locationAddress: "Wilshire Blvd, Los Angeles, CA",
      latitude: 34.0597,
      longitude: -118.4440,
      status: "OPEN" as const,
    },
  ];

  for (const apt of appointments) {
    await prisma.appointment.create({ data: apt });
  }

  console.log("Seed complete!");
  console.log(`  Admin: ${admin.email}`);
  console.log(`  Clients: ${client1.email}, ${client2.email}`);
  console.log(`  Professionals: ${pro1User.email}, ${pro2User.email}, ${pro3User.email}`);
  console.log(`  Appointments: ${appointments.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
