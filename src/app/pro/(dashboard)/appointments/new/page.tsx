import { requirePro } from "@/lib/auth";
import { CreateListingForm } from "./create-listing-form";

export const metadata = { title: "Create Listing" };

export default async function CreateListingPage() {
  await requirePro();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Listing
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Set up a discounted appointment to attract new clients on BeautyLink.
        </p>
      </div>
      <CreateListingForm />
    </div>
  );
}
