import Navbar from "@/components/home/Navbar";
import CityExperience from "@/components/home/CityExperience";

export const metadata = {
  title: "AI Witness — Multi-Camera Incident Intelligence",
  description:
    "Understand what happened. Automatically. AI-powered multi-camera incident reconstruction platform.",
};

export default function HomePage() {
  return (
    <main className="bg-[#04070D] text-white min-h-screen selection:bg-cyan-500/30 selection:text-cyan-100">
      <Navbar />
      {/* Full-screen 3D city hero with interactive 6-stage incident reconstruction */}
      <CityExperience />
    </main>
  );
}
