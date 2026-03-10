import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/seed
 * Creates demo professional profiles and listings for display purposes.
 * Protected by CRON_SECRET to prevent unauthorized use.
 * Safe to run multiple times — skips if demo data exists.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if demo data already exists
  const existing = await db.user.findFirst({
    where: { email: "demo-hair-pro@beautylink.dev" },
  });
  if (existing) {
    return NextResponse.json({ message: "Demo data already exists" });
  }

  const now = new Date();

  // Create demo users + professional profiles
  // Mixed license statuses, realistic LA neighborhoods, varied ratings
  const demoUsers = [
    {
      email: "demo-hair-pro@beautylink.dev",
      firstName: "Maria",
      lastName: "Santos",
      clerkId: "demo_clerk_hair_001",
      profilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop&crop=face",
      profile: {
        displayName: "Hair by Maria",
        bio: "Celebrity-trained stylist specializing in balayage, color correction, and precision cuts. 8+ years of experience in West LA salons. Previously at Sally Hershberger and Nine Zero One.",
        servicesOffered: ["HAIR"],
        specialties: ["Balayage", "Color Correction", "Precision Cuts", "Bridal Hair"],
        yearsExperience: "FIVE_TO_TEN" as const,
        workSetting: "SALON_EMPLOYEE" as const,
        licenseStatus: "LICENSE_VERIFIED" as const,
        licenseType: "Cosmetology",
        licenseState: "CA",
        city: "Westwood",
        state: "CA",
        avgRating: 4.9,
        totalReviews: 47,
        totalBookings: 132,
        isFeatured: true,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80&auto=format&fit=crop",
        ],
      },
    },
    {
      email: "demo-nails-pro@beautylink.dev",
      firstName: "Jessica",
      lastName: "Kim",
      clerkId: "demo_clerk_nails_001",
      profilePhotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face",
      profile: {
        displayName: "Nails by Jess",
        bio: "Award-winning nail artist specializing in gel extensions, nail art, and natural nail care. Known for intricate designs and long-lasting results. Featured in Nails Magazine 2025.",
        servicesOffered: ["NAILS"],
        specialties: ["Gel-X Extensions", "Nail Art", "Russian Manicure", "Chrome Nails"],
        yearsExperience: "THREE_TO_FIVE" as const,
        workSetting: "SALON_SUITE" as const,
        licenseStatus: "LICENSE_VERIFIED" as const,
        licenseType: "Nail Technician",
        licenseState: "CA",
        city: "Santa Monica",
        state: "CA",
        avgRating: 4.8,
        totalReviews: 89,
        totalBookings: 215,
        isFeatured: true,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&q=80&auto=format&fit=crop",
        ],
      },
    },
    {
      email: "demo-lashes-pro@beautylink.dev",
      firstName: "Aaliyah",
      lastName: "Johnson",
      clerkId: "demo_clerk_lashes_001",
      profilePhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&auto=format&fit=crop&crop=face",
      profile: {
        displayName: "Lashes by Aaliyah",
        bio: "Certified lash extension specialist. Classic, hybrid, and volume sets. Obsessed with creating the perfect lash look for every eye shape. Trained at Lash Inc Academy.",
        servicesOffered: ["LASHES"],
        specialties: ["Volume Lashes", "Hybrid Sets", "Lash Lifts", "Mega Volume"],
        yearsExperience: "THREE_TO_FIVE" as const,
        workSetting: "SALON_EMPLOYEE" as const,
        licenseStatus: "LICENSE_DECLARED" as const,
        licenseType: "Esthetician",
        licenseState: "CA",
        city: "Westwood",
        state: "CA",
        avgRating: 4.9,
        totalReviews: 34,
        totalBookings: 98,
        isFeatured: false,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1674049406467-824ea37c7184?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=600&q=80&auto=format&fit=crop",
        ],
      },
    },
    {
      email: "demo-makeup-pro@beautylink.dev",
      firstName: "Sofia",
      lastName: "Rivera",
      clerkId: "demo_clerk_makeup_001",
      profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop&crop=face",
      profile: {
        displayName: "Glam by Sofia",
        bio: "Freelance makeup artist for weddings, events, and editorial. Trained at the Makeup Designory in Burbank. Fluent in English and Spanish. I travel to you!",
        servicesOffered: ["MAKEUP"],
        specialties: ["Bridal Makeup", "Editorial", "Airbrush", "Latin Glam"],
        yearsExperience: "FIVE_TO_TEN" as const,
        workSetting: "MOBILE" as const,
        licenseStatus: "LICENSE_VERIFIED" as const,
        licenseType: "Cosmetology",
        licenseState: "CA",
        city: "Beverly Hills",
        state: "CA",
        avgRating: 4.7,
        totalReviews: 62,
        totalBookings: 178,
        isFeatured: false,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1765871903225-f1a9b549e47f?w=600&q=80&auto=format&fit=crop",
        ],
      },
    },
    {
      email: "demo-skincare-pro@beautylink.dev",
      firstName: "Priya",
      lastName: "Patel",
      clerkId: "demo_clerk_skin_001",
      profilePhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop&crop=face",
      profile: {
        displayName: "Glow Skincare Studio",
        bio: "Licensed esthetician specializing in hydrafacials, chemical peels, and acne treatments. Clean beauty advocate using organic, cruelty-free products only.",
        servicesOffered: ["SKINCARE"],
        specialties: ["HydraFacial", "Chemical Peels", "Acne Treatment", "Anti-Aging"],
        yearsExperience: "THREE_TO_FIVE" as const,
        workSetting: "SALON_SUITE" as const,
        licenseStatus: "LICENSE_VERIFIED" as const,
        licenseType: "Esthetician",
        licenseState: "CA",
        city: "Culver City",
        state: "CA",
        avgRating: 4.9,
        totalReviews: 55,
        totalBookings: 143,
        isFeatured: true,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
        ],
      },
    },
    {
      email: "demo-brows-pro@beautylink.dev",
      firstName: "Taylor",
      lastName: "Chen",
      clerkId: "demo_clerk_brows_001",
      profilePhotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop&crop=face",
      profile: {
        displayName: "Brow Studio by Taylor",
        bio: "Brow specialist: microblading, lamination, tinting, and shaping. I believe every face deserves the perfect frame. 500+ brow transformations and counting.",
        servicesOffered: ["BROWS"],
        specialties: ["Microblading", "Brow Lamination", "Brow Tinting", "Brow Shaping"],
        yearsExperience: "THREE_TO_FIVE" as const,
        workSetting: "SALON_EMPLOYEE" as const,
        licenseStatus: "NOT_PROVIDED" as const,
        city: "West Hollywood",
        state: "CA",
        avgRating: 4.6,
        totalReviews: 23,
        totalBookings: 67,
        isFeatured: false,
        portfolioPhotos: [
          "https://images.unsplash.com/photo-1595550912256-b24059bb08e8?w=600&q=80&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1613829782925-2062b413d760?w=600&q=80&auto=format&fit=crop",
        ],
      },
    },
  ];

  // Dates for listings — spread over the next 7 days
  function futureDate(daysFromNow: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const listings = [
    {
      userIndex: 0,
      serviceName: "Balayage & Blowout",
      serviceCategory: "HAIR",
      description: "Signature hand-painted balayage with toner and blowout finish. Perfect for a natural sun-kissed look. Includes consultation.",
      whatsIncluded: ["Color consultation", "Balayage application", "Toner", "Blowout styling"],
      appointmentDate: futureDate(1),
      appointmentTime: "14:00",
      durationMinutes: 120,
      originalPrice: 28000,
      discountedPrice: 18500,
      locationAddress: "1234 Westwood Blvd, Los Angeles, CA 90024",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop",
      viewCount: 45,
      maxClients: 1,
    },
    {
      userIndex: 0,
      serviceName: "Haircut & Style",
      serviceCategory: "HAIR",
      description: "Precision cut, wash, and blowout. Includes styling with professional products.",
      whatsIncluded: ["Wash", "Precision cut", "Blowout", "Style finish"],
      appointmentDate: futureDate(2),
      appointmentTime: "10:00",
      durationMinutes: 60,
      originalPrice: 9500,
      discountedPrice: 6500,
      locationAddress: "1234 Westwood Blvd, Los Angeles, CA 90024",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80&auto=format&fit=crop",
      viewCount: 28,
      maxClients: 1,
    },
    {
      userIndex: 1,
      serviceName: "Full Set Gel Extensions",
      serviceCategory: "NAILS",
      description: "Full set gel-x extensions with your choice of color or design. Medium length included — long tips available for a small upgrade.",
      whatsIncluded: ["Nail prep", "Gel-x extensions", "Shape & file", "Color or design of choice"],
      appointmentDate: futureDate(1),
      appointmentTime: "11:00",
      durationMinutes: 90,
      originalPrice: 8500,
      discountedPrice: 5500,
      locationAddress: "401 Santa Monica Blvd, Santa Monica, CA 90401",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80&auto=format&fit=crop",
      viewCount: 67,
      maxClients: 2,
    },
    {
      userIndex: 1,
      serviceName: "Gel Manicure",
      serviceCategory: "NAILS",
      description: "Classic gel manicure with cuticle care and your choice of gel color. Lasts 2-3 weeks chip-free.",
      whatsIncluded: ["Cuticle care", "Nail shaping", "Gel polish application", "Hand massage"],
      appointmentDate: futureDate(3),
      appointmentTime: "15:00",
      durationMinutes: 45,
      originalPrice: 4500,
      discountedPrice: 3200,
      locationAddress: "401 Santa Monica Blvd, Santa Monica, CA 90401",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80&auto=format&fit=crop",
      viewCount: 33,
      maxClients: 1,
    },
    {
      userIndex: 2,
      serviceName: "Classic Lash Full Set",
      serviceCategory: "LASHES",
      description: "Natural-looking classic lash extensions. One extension per natural lash for a mascara-free everyday look. Lasts 3-4 weeks with proper care.",
      whatsIncluded: ["Lash consultation", "Under-eye pads", "Classic full set application", "Aftercare kit"],
      appointmentDate: futureDate(2),
      appointmentTime: "13:00",
      durationMinutes: 120,
      originalPrice: 15000,
      discountedPrice: 9900,
      locationAddress: "1000 Glendon Ave, Westwood, CA 90024",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1674049406467-824ea37c7184?w=800&q=80&auto=format&fit=crop",
      viewCount: 52,
      maxClients: 1,
    },
    {
      userIndex: 2,
      serviceName: "Lash Lift & Tint",
      serviceCategory: "LASHES",
      description: "Semi-permanent lash lift with custom tint. Curls and darkens your natural lashes for 6-8 weeks. No extensions needed.",
      whatsIncluded: ["Lash cleanse", "Silicone shield application", "Lift & set", "Custom tint"],
      appointmentDate: futureDate(5),
      appointmentTime: "10:30",
      durationMinutes: 60,
      originalPrice: 9500,
      discountedPrice: 6500,
      locationAddress: "1000 Glendon Ave, Westwood, CA 90024",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=800&q=80&auto=format&fit=crop",
      viewCount: 19,
      maxClients: 1,
    },
    {
      userIndex: 3,
      serviceName: "Full Glam Makeup",
      serviceCategory: "MAKEUP",
      description: "Full glam application perfect for events, parties, or photoshoots. Includes false lashes and setting spray for all-day wear.",
      whatsIncluded: ["Skin prep", "Full face application", "False lash application", "Setting spray"],
      appointmentDate: futureDate(4),
      appointmentTime: "09:00",
      durationMinutes: 75,
      originalPrice: 12000,
      discountedPrice: 8500,
      locationAddress: "Mobile — I come to you (West LA area)",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80&auto=format&fit=crop",
      viewCount: 39,
      maxClients: 1,
    },
    {
      userIndex: 3,
      serviceName: "Natural Everyday Makeup",
      serviceCategory: "MAKEUP",
      description: "Soft, natural makeup look for everyday wear, work events, or casual occasions. Enhances your features without looking overdone.",
      whatsIncluded: ["Skin prep & primer", "Natural face application", "Brow fill", "Lip color"],
      appointmentDate: futureDate(1),
      appointmentTime: "11:30",
      durationMinutes: 45,
      originalPrice: 7500,
      discountedPrice: 5000,
      locationAddress: "Mobile — I come to you (West LA area)",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80&auto=format&fit=crop",
      viewCount: 24,
      maxClients: 1,
    },
    {
      userIndex: 4,
      serviceName: "Hydrafacial Treatment",
      serviceCategory: "SKINCARE",
      description: "Deep cleansing hydrafacial with extraction, hydration, and LED light therapy. Great for all skin types — leaves you glowing.",
      whatsIncluded: ["Skin analysis", "Deep cleanse & extraction", "Hydrafacial serum infusion", "LED light therapy"],
      appointmentDate: futureDate(1),
      appointmentTime: "16:00",
      durationMinutes: 60,
      originalPrice: 18000,
      discountedPrice: 12000,
      locationAddress: "5700 Hannum Ave, Culver City, CA 90230",
      launchZone: "LMU / Westchester",
      listingPhotoUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
      viewCount: 71,
      maxClients: 2,
    },
    {
      userIndex: 4,
      serviceName: "Express Facial",
      serviceCategory: "SKINCARE",
      description: "30-minute express facial perfect for a quick glow-up. Cleanse, exfoliate, mask, and moisturize. Ideal for lunch breaks.",
      whatsIncluded: ["Double cleanse", "Gentle exfoliation", "Hydrating mask", "SPF finish"],
      appointmentDate: futureDate(3),
      appointmentTime: "12:30",
      durationMinutes: 30,
      originalPrice: 7500,
      discountedPrice: 4500,
      locationAddress: "5700 Hannum Ave, Culver City, CA 90230",
      launchZone: "LMU / Westchester",
      listingPhotoUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop",
      viewCount: 36,
      maxClients: 1,
    },
    {
      userIndex: 5,
      serviceName: "Brow Lamination + Tint",
      serviceCategory: "BROWS",
      description: "Brow lamination with custom tint for fuller, defined brows that last 6-8 weeks. The 'brow lift' effect without any needles.",
      whatsIncluded: ["Brow mapping", "Lamination treatment", "Custom tint", "Brow serum finish"],
      appointmentDate: futureDate(3),
      appointmentTime: "12:00",
      durationMinutes: 45,
      originalPrice: 8500,
      discountedPrice: 5500,
      locationAddress: "8500 Melrose Ave, West Hollywood, CA 90069",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1595550912256-b24059bb08e8?w=800&q=80&auto=format&fit=crop",
      viewCount: 25,
      maxClients: 1,
    },
    {
      userIndex: 5,
      serviceName: "Brow Shape & Tint",
      serviceCategory: "BROWS",
      description: "Professional brow shaping with wax or threading, plus a custom tint to darken and define. Quick appointment, big difference.",
      whatsIncluded: ["Consultation", "Brow shaping (wax or thread)", "Custom tint application", "Soothing gel"],
      appointmentDate: futureDate(6),
      appointmentTime: "14:30",
      durationMinutes: 30,
      originalPrice: 4500,
      discountedPrice: 2800,
      locationAddress: "8500 Melrose Ave, West Hollywood, CA 90069",
      launchZone: "UCLA / Westwood",
      listingPhotoUrl: "https://images.unsplash.com/photo-1613829782925-2062b413d760?w=800&q=80&auto=format&fit=crop",
      viewCount: 14,
      maxClients: 1,
    },
  ];

  try {
    // Create users, profiles, and listings in a transaction
    await db.$transaction(async (tx) => {
      const profileIds: string[] = [];

      for (const demoUser of demoUsers) {
        const user = await tx.user.create({
          data: {
            clerkId: demoUser.clerkId,
            firstName: demoUser.firstName,
            lastName: demoUser.lastName,
            email: demoUser.email,
            profilePhotoUrl: demoUser.profilePhotoUrl,
            role: "PROFESSIONAL",
            isEmailVerified: true,
          },
        });

        const profile = await tx.professionalProfile.create({
          data: {
            userId: user.id,
            displayName: demoUser.profile.displayName,
            bio: demoUser.profile.bio,
            servicesOffered: demoUser.profile.servicesOffered,
            specialties: demoUser.profile.specialties,
            yearsExperience: demoUser.profile.yearsExperience,
            workSetting: demoUser.profile.workSetting,
            licenseStatus: demoUser.profile.licenseStatus,
            licenseType: demoUser.profile.licenseType,
            licenseState: demoUser.profile.licenseState,
            city: demoUser.profile.city,
            state: demoUser.profile.state,
            avgRating: demoUser.profile.avgRating,
            totalReviews: demoUser.profile.totalReviews,
            totalBookings: demoUser.profile.totalBookings,
            isFeatured: demoUser.profile.isFeatured,
            portfolioPhotos: demoUser.profile.portfolioPhotos,
            applicationStatus: "APPROVED",
            applicationSubmittedAt: now,
            approvedAt: now,
          },
        });

        profileIds.push(profile.id);
      }

      // Create listings
      for (const listing of listings) {
        await tx.appointmentListing.create({
          data: {
            professionalId: profileIds[listing.userIndex],
            serviceCategory: listing.serviceCategory as never,
            serviceName: listing.serviceName,
            description: listing.description,
            whatsIncluded: listing.whatsIncluded,
            appointmentDate: listing.appointmentDate,
            appointmentTime: listing.appointmentTime,
            durationMinutes: listing.durationMinutes,
            originalPrice: listing.originalPrice,
            discountedPrice: listing.discountedPrice,
            locationAddress: listing.locationAddress,
            launchZone: listing.launchZone,
            listingPhotoUrl: listing.listingPhotoUrl,
            viewCount: listing.viewCount,
            maxClients: listing.maxClients,
            status: "LIVE",
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: `Created ${demoUsers.length} demo professionals and ${listings.length} demo listings`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed demo data" },
      { status: 500 }
    );
  }
}
