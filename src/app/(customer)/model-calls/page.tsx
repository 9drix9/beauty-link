import { Metadata } from "next";
import { DemoModelCalls } from "./demo-model-calls";

export const metadata: Metadata = {
  title: "Model Calls | BeautyLink",
  description:
    "Browse free beauty services from students and trainees. Get complimentary haircuts, lash sets, nails, and more from beauty professionals in training.",
};

export default function ModelCallsPage() {
  return <DemoModelCalls />;
}
