
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Plus, 
  Users, 
  CalendarDays,
  ListChecks,
  Bell
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getAllEvents, 
  registrations, 
  announcements 
} from '@/services/mockData';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const events = getAllEvents();
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);
  
  if (!user || !isAdmin()) {
    return null;
  }
  
  // Calculate dashboard stats
  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    event => new Date(event.date) > new Date()
  ).length;
  const totalRegistrations = registrations.length;
  const totalAnnouncements = announcements.length;
  
  // Get upcoming events
  const nextEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/events/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/announcements/new')}
            >
              <Bell className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events created in the system
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled for the future
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">
                Student registrations across all events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnnouncements}</div>
              <p className="text-xs text-muted-foreground">
                Active announcements
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              <Calendar className="mr-2 h-4 w-4" />
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="manage">
              <ListChecks className="mr-2 h-4 w-4" />
              Manage Content
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Next Events</CardTitle>
                <CardDescription>
                  Your upcoming events that require attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nextEvents.length > 0 ? (
                  <div className="space-y-4">
                    {nextEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.location}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming events.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Events Management</CardTitle>
                  <CardDescription>
                    Create, edit and manage campus events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Manage all aspects of your campus events including registrations, locations, and categories.</p>
                  <Button 
                    className="w-full mt-2"
                    onClick={() => navigate('/admin/events')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Events
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>
                    Create and manage campus announcements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Publish important announcements for students to keep everyone informed about campus news.</p>
                  <Button 
                    className="w-full mt-2"
                    onClick={() => navigate('/admin/announcements')}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Manage Announcements
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
