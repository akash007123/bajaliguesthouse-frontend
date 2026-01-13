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
  roomType?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'New' | 'Pending' | 'Approved' | 'Cancelled' | 'Completed';
  createdAt: string;
  specialRequests?: string;
  reviewed?: boolean;
  rating?: number;
  feedback?: string;
  reviewApproved?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  profilePic?: string;
  bankPassbook?: string;
  documents: { name: string; file: string }[];
  bankDetails?: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    branch: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  roomName: string;
  userName: string;
  userEmail: string;
  rating: number;
  feedback: string;
  reviewApproved: boolean;
  createdAt: string;
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