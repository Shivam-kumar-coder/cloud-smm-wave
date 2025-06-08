
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';

const HeroSection = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Lightning Fast Delivery"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "24/7 Customer Support"
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "Premium Quality Services"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              SMM Kings
            </span>
            <br />
            <span className="text-foreground">Boost Your Social</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The #1 SMM Panel for Instagram, YouTube, TikTok, Twitter and more. 
            Get real engagement, followers, and views with our premium social media marketing services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary hover:scale-105 transition-transform duration-200 text-lg px-8 py-3">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover:bg-accent">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="text-primary">
                  {feature.icon}
                </div>
                <span className="text-sm md:text-base">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          {[
            { number: '50K+', label: 'Happy Customers' },
            { number: '1M+', label: 'Orders Completed' },
            { number: '99.9%', label: 'Uptime Guarantee' }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-200">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
