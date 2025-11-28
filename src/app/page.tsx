'use client';

import Navigation from '@/components/Navigation';
import HeroBanner from '@/components/HeroBanner';
import ExploreCategories from '@/components/ExploreCategories';
import ProfessionalsSection from '@/components/ProfessionalsSection';
import DealsOffers from '@/components/DealsOffers';
import ProjectShowcase from '@/components/ProjectShowcase';
import RequirementSection from '@/components/RequirementSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-16">
        <HeroBanner />
        <ProfessionalsSection />
        <ProjectShowcase />
        <ExploreCategories />
        <DealsOffers />
        <RequirementSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
