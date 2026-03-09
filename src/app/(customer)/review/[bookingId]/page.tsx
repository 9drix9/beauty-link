import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";

import { db } from "@/lib/db";
import { ReviewForm } from "./review-form";

export const metadata: Metadata = {
  title: "Leave a Review",
};

interface ReviewPageProps {
  params: { bookingId: string };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const booking = await db.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      professional: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      review: {
        select: { id: true },
      },
    },
  });

  if (!booking || booking.customerId !== user.id) {
    notFound();
  }

  if (booking.status !== "COMPLETED") {
    notFound();
  }

  if (booking.review) {
    redirect(`/my-bookings/${booking.id}`);
  }

  const professionalName = `${booking.professional.user.firstName} ${booking.professional.user.lastName.charAt(0)}.`;

  const serializedBooking = {
    id: booking.id,
    serviceName: booking.serviceName,
    professionalName,
    appointmentDate: booking.appointmentDate.toISOString(),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <ReviewForm booking={serializedBooking} />
    </div>
  );
}
