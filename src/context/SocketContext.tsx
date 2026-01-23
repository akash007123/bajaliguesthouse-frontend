import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  userId?: string;
  userName?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  createdAt: string;
  type: 'newBooking' | 'bookingApproved';
}

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      }).catch((error) => {
        console.error('Error requesting notification permission:', error);
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Connecting to socket for user:', user);
      const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const newSocket = io(apiUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      newSocket.on('newBooking', (notification: Notification) => {
        console.log('Received newBooking event:', notification);
        if (user.role === 'admin') {
          addNotification(notification);
        }
      });

      newSocket.on('bookingApproved', (notification: Notification) => {
        console.log('Received bookingApproved event:', notification);
        if (user.role === 'user' && notification.userId === user.id) {
          addNotification(notification);
        }
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const addNotification = (notification: Notification) => {
    console.log('Adding notification:', notification);
    setNotifications(prev => [notification, ...prev]);

    // Show browser notification if permission granted
    console.log('Notification API available:', 'Notification' in window);
    console.log('Notification permission:', Notification.permission);

    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('Creating browser notification');
      const title = notification.type === 'newBooking' ? 'New Booking Received' : 'Booking Approved';
      const body = notification.type === 'newBooking'
        ? `New booking from ${notification.userName} for ${notification.roomName}`
        : `Your booking for ${notification.roomName} has been approved`;

      try {
        const browserNotification = new Notification(title, {
          body,
          icon: '/logo.png', // Adjust icon path as needed
          tag: notification.id, // Prevent duplicate notifications
        });

        console.log('Browser notification created:', browserNotification);

        // Auto-close after 5 seconds
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      } catch (error) {
        console.error('Error creating browser notification:', error);
      }
    } else {
      console.log('Browser notification not created - permission not granted or API not available');
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, addNotification, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};