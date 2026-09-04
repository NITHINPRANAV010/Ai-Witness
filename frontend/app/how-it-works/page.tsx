import Navbar from "@/components/home/Navbar";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import DemoCTA from "@/components/home/DemoCTA";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "How It Works | AI Witness",
  description: "Understand how AI Witness converts raw surveillance footage into structured events, 3D tracking, and verifiable incident reconstructions.",
};

export default function HowItWorksPage() {
  return (
    <main className="bg-[#05080E] text-white min-h-screen selection:bg-cyan-500/30 selection:text-cyan-100 pt-20">
      <Navbar />
      <HowItWorksSection />
      <DemoCTA />
      <Footer />
    </main>
  );
}
