import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, User, IndianRupee, CheckCircle } from 'lucide-react';

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

interface NotificationsModalProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onClearAll
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Notifications
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onClearAll}
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-muted/50 p-4 rounded-lg border"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {notification.type === 'newBooking' ? (
                                <User className="w-4 h-4 text-blue-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              <span className="font-medium">
                                {notification.type === 'newBooking'
                                  ? `${notification.userName} booked`
                                  : 'Booking Approved'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">{notification.roomName}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(notification.checkIn).toLocaleDateString()} - {new Date(notification.checkOut).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" />
                                <span>{notification.totalPrice}</span>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default NotificationsModal;