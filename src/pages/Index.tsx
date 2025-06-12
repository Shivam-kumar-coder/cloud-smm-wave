
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      <HeroSection />
      <ServicesSection />
    </div>
  );
};

export default Index;
