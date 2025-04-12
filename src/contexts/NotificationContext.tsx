
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getAllEvents } from '@/services/mockData';
import { Event } from '@/types/Event';

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
      const events = getAllEvents();
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        
        return eventDate > now && eventDate <= threeDaysFromNow;
      });
      
      const eventNotifications: Notification[] = upcomingEvents.map(event => ({
        id: `event-reminder-${event.id}`,
        title: 'Event Reminder',
        message: `${event.title} is happening soon on ${new Date(event.date).toLocaleDateString()}`,
        date: new Date(),
        read: false,
        eventId: event.id,
        type: 'reminder'
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
      
      setNotifications([welcomeNotification, ...eventNotifications]);
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
