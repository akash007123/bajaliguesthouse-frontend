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
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000'); // Adjust URL as needed
      setSocket(newSocket);

      newSocket.on('newBooking', (notification: Notification) => {
        if (user.role === 'admin') {
          addNotification(notification);
        }
      });

      newSocket.on('bookingApproved', (notification: Notification) => {
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
    setNotifications(prev => [notification, ...prev]);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = notification.type === 'newBooking' ? 'New Booking Received' : 'Booking Approved';
      const body = notification.type === 'newBooking'
        ? `New booking from ${notification.userName} for ${notification.roomName}`
        : `Your booking for ${notification.roomName} has been approved`;

      const browserNotification = new Notification(title, {
        body,
        icon: '/logo.png', // Adjust icon path as needed
        tag: notification.id, // Prevent duplicate notifications
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
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