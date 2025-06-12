
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Briefcase, TrendingUp, Star } from "lucide-react";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: settings } = useAdminSettings();

  const stats = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      value: settings?.happy_customers?.toLocaleString() || "10,000+",
      label: "Happy Customers"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      value: settings?.orders_completed?.toLocaleString() || "50,000+",
      label: "Orders Completed"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      value: settings?.total_services?.toLocaleString() || "500+",
      label: "Total Services"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      value: `${settings?.success_rate || 99.9}%`,
      label: "Success Rate"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      platform: "Instagram Influencer",
      rating: 5,
      comment: "SMM Kings helped me grow my Instagram from 1k to 100k followers! Amazing service and real engagement."
    },
    {
      name: "Mike Chen",
      platform: "YouTube Creator",
      rating: 5,
      comment: "Best SMM panel I've used. Fast delivery and excellent customer support. Highly recommended!"
    },
    {
      name: "Emma Davis",
      platform: "TikTok Content Creator",
      rating: 5,
      comment: "Great prices and quality service. My TikTok videos started getting more views immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the growing community of content creators, businesses, and influencers 
              who trust SMM Kings for their social media growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real testimonials from real customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-0">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.platform}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Boost Your Social Media?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start growing your social media presence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                Get Started Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">SMM Kings</h3>
              <p className="text-gray-400 max-w-md">
                Your trusted partner for social media marketing services. 
                Grow your presence across all major platforms with our premium services.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SMM Kings. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
