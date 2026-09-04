import Navbar from "@/components/home/Navbar";
import FeaturesSection from "@/components/home/FeaturesSection";
import DemoCTA from "@/components/home/DemoCTA";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Features & Capabilities | AI Witness",
  description: "Explore AI Witness capabilities: multi-camera correlation, temporal reasoning, AI incident reconstruction, and evidence timelines.",
};

export default function FeaturesPage() {
  return (
    <main className="bg-[#05080E] text-white min-h-screen selection:bg-cyan-500/30 selection:text-cyan-100 pt-20">
      <Navbar />
      <FeaturesSection />
      <DemoCTA />
      <Footer />
    </main>
  );
}
