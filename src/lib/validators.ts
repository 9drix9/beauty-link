import { z } from "zod";
import { ServiceCategory } from "@prisma/client";

export const createListingSchema = z
  .object({
    serviceCategory: z.nativeEnum(ServiceCategory),
    subCategory: z.string().optional(),
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(1000),
    originalPriceCents: z.number().int().min(1000).max(999900),
    discountedPriceCents: z.number().int().min(100),
    durationMinutes: z.number().int().min(15).max(480),
    appointmentDate: z.string(),
    appointmentTime: z.string(),
    maxClients: z.number().int().min(1).max(3).default(1),
    whatsIncluded: z.array(z.string()).max(5).optional(),
    addressLine1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    zipCode: z.string().regex(/^\d{5}$/),
  })
  .refine(
    (data) => data.discountedPriceCents <= data.originalPriceCents * 0.90,
    {
      message:
        "BeautyLink listings must be discounted at least 10% from your normal price.",
      path: ["discountedPriceCents"],
    }
  )
  .refine(
    (data) => {
      const apptDate = new Date(data.appointmentDate + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return apptDate >= today;
    },
    {
      message: "Appointment date must be today or in the future.",
      path: ["appointmentDate"],
    }
  );

export const createBookingSchema = z.object({
  listingId: z.string().cuid(),
  paymentIntentId: z.string().optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(500),
  photos: z.array(z.string().url()).max(3).optional(),
});

export const proApplicationSchema = z.object({
  businessName: z.string().min(2).max(100),
  bio: z.string().min(50).max(500),
  serviceCategories: z.array(z.string()).min(1),
  yearsExperience: z.string(),
  workSetting: z.string(),
  licenseType: z.string().optional().or(z.literal("")),
  licenseNumber: z.string().optional().or(z.literal("")),
  licenseState: z.string().max(2).optional().or(z.literal("")),
  instagramUrl: z.string().optional().or(z.literal("")),
  websiteUrl: z.string().optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20).max(2000),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProApplicationInput = z.infer<typeof proApplicationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
