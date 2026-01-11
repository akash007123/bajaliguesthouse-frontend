export interface Room {
  id: string;
  name: string;
  type: 'Deluxe' | 'Executive' | 'Presidential' | 'Standard';
  price: number;
  discountPrice?: number;
  description: string;
  shortDescription: string;
  amenities: string[];
  images: string[];
  isAC: boolean;
  capacity: number;
  bedType: string;
  size: number; // in sq ft
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'New' | 'Pending' | 'Approved' | 'Cancelled';
  createdAt: string;
  specialRequests?: string;
}

export interface HotelInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
}