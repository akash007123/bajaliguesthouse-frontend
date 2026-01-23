import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types';
import { User, Mail, Phone, MessageSquare, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ViewContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({ contact, isOpen, onClose, onStatusUpdate }) => {
  if (!contact) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: 'destructive',
      read: 'default',
      replied: 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-1">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{contact.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </p>
              </div>
              {contact.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {getStatusBadge(contact.status)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Message Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <p className="text-sm font-medium">{contact.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(contact.createdAt), 'PPP p')}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {contact.status === 'unread' && (
              <Button
                onClick={() => onStatusUpdate(contact._id, 'read')}
                variant="default"
              >
                Mark as Read
              </Button>
            )}
            {contact.status === 'read' && (
              <Button
                onClick={() => onStatusUpdate(contact._id, 'replied')}
                variant="default"
              >
                Mark as Replied
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContactModal;