import { getPsychologists } from "@/app/lib/actions/psychologists";
import { HeroSection } from "@/app/components/landing/HeroSection";

import { ServicesAccordion } from "@/app/components/landing/ServicesAccordion";
import { FeaturedSpecialists } from "@/app/components/landing/FeaturedSpecialists";
import { CTASection } from "@/app/components/landing/CTASection";
import { WhyChooseUs } from "@/app/components/landing/WhyChooseUs";
import { MenAsAllies } from "@/app/components/landing/MenAsAllies";
import { TextTestimonials } from "@/app/components/landing/TextTestimonials";
import { HowItWorks } from "@/app/components/landing/HowItWorks";

// Using the landing footer here if we want to override the default one, 
// BUT the default layout likely already has a footer.
// If we want to replace the global footer, we should update layout.tsx or the Footer component there.
// For now, I will NOT include the Footer here to avoid duplication, 
// and instead I will update the global footer component separately to match the theme.

export default async function Home() {
  // Fetch data for the specialists section
  const psychologists = await getPsychologists();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesAccordion limit={6} />
      <FeaturedSpecialists psychologists={psychologists} />



      <WhyChooseUs />
      <MenAsAllies />
      <CTASection />
      <TextTestimonials />

      {/* <HowItWorks /> */}
    </div>
  );
}
