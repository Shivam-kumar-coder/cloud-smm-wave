
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Heart, Users, Eye, MessageSquare } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Instagram className="w-8 h-8" />,
      title: 'Instagram Services',
      description: 'Boost your Instagram presence with real followers, likes, and engagement.',
      features: ['Followers', 'Likes', 'Comments', 'Views'],
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      icon: <Youtube className="w-8 h-8" />,
      title: 'YouTube Services',
      description: 'Grow your YouTube channel with subscribers, views, and watch time.',
      features: ['Subscribers', 'Views', 'Likes', 'Comments'],
      gradient: 'from-red-500 to-pink-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'TikTok Services',
      description: 'Viral TikTok growth with followers, likes, and video views.',
      features: ['Followers', 'Likes', 'Views', 'Shares'],
      gradient: 'from-purple-500 to-cyan-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Facebook Services',
      description: 'Enhance your Facebook reach with page likes and post engagement.',
      features: ['Page Likes', 'Post Likes', 'Comments', 'Shares'],
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Twitter Services',
      description: 'Build your Twitter following with real followers and engagement.',
      features: ['Followers', 'Likes', 'Retweets', 'Comments'],
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Premium Services',
      description: 'Exclusive high-quality services for maximum growth and engagement.',
      features: ['Premium Quality', 'Fast Delivery', 'Lifetime Refill', '24/7 Support'],
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our wide range of social media marketing services designed to boost your online presence across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="glass-card border-0 hover:scale-105 transition-transform duration-300 group">
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full gradient-primary hover:scale-105 transition-transform duration-200">
                  View Services
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
