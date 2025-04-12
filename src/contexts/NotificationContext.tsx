
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getAllEvents } from '@/services/mockData';
import { Event } from '@/types/Event';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  eventId?: string;
  type: 'reminder' | 'system' | 'event';
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Generate event reminder notifications
  useEffect(() => {
    if (user) {
      // Get all upcoming events
      const events = getAllEvents();
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        
        return eventDate > now && eventDate <= threeDaysFromNow;
      });
      
      // Generate reminder notifications for upcoming events
      const eventNotifications: Notification[] = upcomingEvents.map(event => ({
        id: `event-reminder-${event.id}`,
        title: 'Event Reminder',
        message: `${event.title} is happening soon on ${new Date(event.date).toLocaleDateString()}`,
        date: new Date(),
        read: false,
        eventId: event.id,
        type: 'reminder'
      }));
      
      // Check for user registrations
      const checkRegistrations = async () => {
        try {
          const { data: registrations, error } = await supabase
            .from('event_registrations')
            .select('event_id')
            .eq('user_id', user.id);
            
          if (error) {
            console.error("Error fetching user registrations:", error);
            return;
          }
          
          // Create registration notifications
          if (registrations && registrations.length > 0) {
            const registeredEventIds = registrations.map(reg => reg.event_id);
            const registeredEvents = events.filter(event => 
              registeredEventIds.includes(event.id)
            );
            
            const registrationNotifications: Notification[] = registeredEvents.map(event => ({
              id: `registration-${event.id}`,
              title: 'Registration Confirmation',
              message: `You are registered for ${event.title} on ${new Date(event.date).toLocaleDateString()}`,
              date: new Date(),
              read: false,
              eventId: event.id,
              type: 'event'
            }));
            
            // Add welcome notification for new users
            const welcomeNotification: Notification = {
              id: 'welcome',
              title: 'Welcome to CampusConnect',
              message: 'Thanks for joining our platform. Start exploring campus events!',
              date: new Date(),
              read: false,
              type: 'system'
            };
            
            setNotifications([welcomeNotification, ...registrationNotifications, ...eventNotifications]);
          } else {
            // If no registrations, just use event reminders and welcome message
            const welcomeNotification: Notification = {
              id: 'welcome',
              title: 'Welcome to CampusConnect',
              message: 'Thanks for joining our platform. Start exploring campus events!',
              date: new Date(),
              read: false,
              type: 'system'
            };
            
            setNotifications([welcomeNotification, ...eventNotifications]);
          }
        } catch (err) {
          console.error("Error in notification system:", err);
          
          // Fallback to just using event reminders
          const welcomeNotification: Notification = {
            id: 'welcome',
            title: 'Welcome to CampusConnect',
            message: 'Thanks for joining our platform. Start exploring campus events!',
            date: new Date(),
            read: false,
            type: 'system'
          };
          
          setNotifications([welcomeNotification, ...eventNotifications]);
        }
      };
      
      checkRegistrations();
    } else {
      setNotifications([]);
    }
  }, [user]);
  
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
