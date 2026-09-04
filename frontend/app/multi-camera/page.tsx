import Navbar from "@/components/home/Navbar";
import MultiCameraSection from "@/components/home/MultiCameraSection";
import DemoCTA from "@/components/home/DemoCTA";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Multi-Camera Sync | AI Witness",
  description: "Synchronize disparate surveillance camera feeds, map common physical coordinates, and eliminate blind spots with AI Witness.",
};

export default function MultiCameraPage() {
  return (
    <main className="bg-[#05080E] text-white min-h-screen selection:bg-cyan-500/30 selection:text-cyan-100 pt-20">
      <Navbar />
      <MultiCameraSection />
      <DemoCTA />
      <Footer />
    </main>
  );
}
