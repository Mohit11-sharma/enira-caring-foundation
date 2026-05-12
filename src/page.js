import AboutSection from "@/components/home/AboutSection";
import HomeCarousel from "@/components/home/HomeCarousel";
import HomeFeatures from "@/components/home/HomeFeatures";
import ReliefCarousel from "@/components/home/ReliefCarousel";
import VolunteerGiftSection from "@/components/home/VolunteerGiftSection";


export default function Home() {
  return (
   <div>
    <HomeCarousel />
    <HomeFeatures />
    <AboutSection />
    <ReliefCarousel/>
    <VolunteerGiftSection/>
   </div>
  );
}
