
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <HeroSection />
      <ServicesSection />
      
      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-xl border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  SMM Kings
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                The #1 SMM Panel for Instagram, YouTube, TikTok, Twitter and more. 
                Boost your social media presence with our premium services.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  📧
                </div>
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  📱
                </div>
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  💬
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Instagram</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">YouTube</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">TikTok</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Facebook</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Twitter</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Refund Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SMM Kings. All rights reserved. Built with ❤️ for social media growth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
