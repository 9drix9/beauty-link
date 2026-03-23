import type { Metadata } from "next";
import { RoleSelector } from "./role-selector";

export const metadata: Metadata = {
  title: "Get Started | BeautyLink",
  description: "Sign up for BeautyLink as a customer or beauty professional.",
};

export default function GetStartedPage() {
  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <RoleSelector />
    </div>
  );
}
