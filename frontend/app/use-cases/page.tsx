import Navbar from "@/components/home/Navbar";
import UseCasesSection from "@/components/home/UseCasesSection";
import DemoCTA from "@/components/home/DemoCTA";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Real-World Use Cases | AI Witness",
  description: "AI Witness for Smart Cities, Campus Security, Industrial Safety, Transit Hubs, Transportation, and Facility Management.",
};

export default function UseCasesPage() {
  return (
    <main className="bg-[#05080E] text-white min-h-screen selection:bg-cyan-500/30 selection:text-cyan-100 pt-20">
      <Navbar />
      <UseCasesSection />
      <DemoCTA />
      <Footer />
    </main>
  );
}
