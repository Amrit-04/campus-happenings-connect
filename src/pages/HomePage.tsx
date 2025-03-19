
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Bell, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import EventCard from '@/components/EventCard';
import AnnouncementCard from '@/components/AnnouncementCard';
import { 
  getFeaturedEvents, 
  getCurrentEvents, 
  getUpcomingEvents, 
  getAllAnnouncements 
} from '@/services/mockData';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('featured');
  
  const featuredEvents = getFeaturedEvents();
  const currentEvents = getCurrentEvents();
  const upcomingEvents = getUpcomingEvents().slice(0, 3); // Show only 3 upcoming events
  const announcements = getAllAnnouncements();
  
  return (
    <Layout>
      {/* Hero section */}
      <section className="py-10 mb-6 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CampusConnect</h1>
          <p className="text-xl max-w-2xl mx-auto mb-6">
            Stay connected with all the events happening around your campus
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="font-semibold text-primary-foreground border-white hover:bg-white hover:text-primary"
            onClick={() => navigate('/events')}
          >
            Browse All Events
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events section (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Campus Events
            </h2>
            <Button variant="ghost" onClick={() => navigate('/events')}>
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="current">Happening Now</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            
            <TabsContent value="featured" className="mt-4">
              {featuredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No featured events at the moment.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="current" className="mt-4">
              {currentEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No events happening right now.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming events at the moment.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Announcements section (1/3 width on large screens) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Announcements
            </h2>
          </div>
          
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map(announcement => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
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
