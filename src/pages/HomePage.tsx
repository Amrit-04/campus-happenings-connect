
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, ArrowRight, UsersRound, BookOpen } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import AnnouncementCard from '@/components/AnnouncementCard';
import { getAllAnnouncements } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const announcements = getAllAnnouncements();
  
  return (
    <Layout>
      {/* Hero section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10 relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 logo-gradient animate-fade">
            Campus Connect
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-foreground/90 animate-fade">
            Your gateway to campus events, clubs, and opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-gradient animate-fade"
              onClick={() => navigate('/events')}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-foreground hover:text-secondary animate-fade"
              onClick={() => user ? navigate('/dashboard') : navigate('/login')}
            >
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-card">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">Discover Events</h2>
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-foreground/80">
                  Find and join campus events that match your interests and schedule.
                </p>
              </CardContent>
            </Card>
            
            <Card className="space-card">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">Connect with Peers</h2>
                <UsersRound className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-foreground/80">
                  Meet like-minded students and build your campus network.
                </p>
              </CardContent>
            </Card>
            
            <Card className="space-card">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">Grow Your Skills</h2>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-foreground/80">
                  Participate in workshops and activities that enhance your education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements section */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Announcements
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.length > 0 ? (
              announcements.map(announcement => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8 col-span-3">
                No announcements at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
