import ScrollFlipCard from "./components/ScrollFlipCard";
import AboutSection from "./components/AboutSection";

export default function Home() {
  return (
    <>
      <h1 className="text-white">Binary 2k26</h1>

      <ScrollFlipCard />      

      <section className="h-screen bg-black flex items-center justify-center z-100">
        <AboutSection />
      </section>
    </>
  );
}
