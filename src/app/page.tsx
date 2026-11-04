import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedStudios } from "@/components/home/FeaturedStudios";
import { CategorySection } from "@/components/home/CategorySection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HostGuarantee } from "@/components/home/HostGuarantee";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategorySection />
      <HowItWorks />
      <HostGuarantee />
      <CtaBanner />
    </>
  );
}
