
import Gallary from "./components/gallary";
import ScrollFlipCard from "./components/ScrollFlipCard";
import Timeline from "./components/Timeline";
import Tracks from "./components/Tracks";
import Mentors from "./components/Mentors";

export default function Home() {
  return (
    <>
      <h1 className="text-white">Binary 2k26</h1>
      <ScrollFlipCard />
      {/* <section className="h-screen bg-black flex items-center justify-center z-100">
        <AboutSection />
      </section> */}
      <Timeline />
      <section className="h-screen bg-white flex items-center justify-center">
        <h2 className="text-5xl font-bold">
          Fully Transitioned Section
        </h2>
      </section>
      <Tracks />
      <Mentors />

      <Timeline />

      <Gallary />
    </>
  );
}
