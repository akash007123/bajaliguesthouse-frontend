import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking } from '@/types';
import { Calendar, User, Building, Download, Receipt, MapPin, Phone, Mail } from 'lucide-react';
import { formatDate } from '../../utils/common';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!booking) return null;

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      toast.info('Generating invoice...');

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.save(`invoice-${booking.id}.pdf`);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating invoice');
    }
  };

  const nights = Math.floor((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Invoice - Booking #{booking.id}
          </DialogTitle>
        </DialogHeader>

        <div ref={invoiceRef} className="space-y-6 py-1 bg-white">
          {/* Hotel Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold">Hotel Booking Invoice</h2>
            <p className="text-muted-foreground">Thank you for choosing our hotel</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Invoice To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{booking.userName}</p>
                <p className="text-sm text-muted-foreground">{booking.userEmail}</p>
                {booking.userMobile && (
                  <p className="text-sm text-muted-foreground">{booking.userMobile}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Invoice Details:</h3>
              <div className="space-y-1">
                <p className="text-sm">Invoice #: INV-{booking.id}</p>
                <p className="text-sm">Date: {formatDate(new Date().toISOString())}</p>
                <div className="text-sm">Status: <Badge variant="secondary">{booking.status}</Badge></div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Booking Details
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Room:</span>
                <span>{booking.roomName} {booking.roomType && `(${booking.roomType})`}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-in:</span>
                <span>{formatDate(booking.checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-out:</span>
                <span>{formatDate(booking.checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Guests:</span>
                <span>{booking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Nights:</span>
                <span>{nights}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Room Rate × {nights} nights</span>
                <span>₹{booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Amount</span>
                <span>₹{booking.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Special Requests</h3>
                <p className="text-sm bg-muted p-3 rounded-md">{booking.specialRequests}</p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>Thank you for your business!</p>
            <p>For any questions, please contact our support team.</p>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;