import roomDeluxe from '@/assets/room-deluxe.jpg';
import roomExecutive from '@/assets/room-executive.jpg';
import roomPresidential from '@/assets/room-presidential.jpg';

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

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Deluxe Ocean View',
    type: 'Deluxe',
    price: 299,
    discountPrice: 249,
    description: 'Experience luxury in our Deluxe Ocean View room, featuring breathtaking panoramic views of the Mediterranean Sea. This elegantly appointed room combines contemporary design with classic comfort, offering a serene retreat after a day of exploration.',
    shortDescription: 'Stunning ocean views with modern luxury amenities',
    amenities: ['Ocean View', 'King Bed', 'Free WiFi', 'Mini Bar', 'Room Service', 'Smart TV', 'Coffee Maker', 'Safe'],
    images: [roomDeluxe],
    isAC: true,
    capacity: 2,
    bedType: 'King',
    size: 450,
    available: true
  },
  {
    id: '2',
    name: 'Executive Suite',
    type: 'Executive',
    price: 499,
    discountPrice: 449,
    description: 'Our Executive Suite offers the perfect blend of workspace and relaxation. Featuring a separate living area, premium amenities, and stunning city views, this suite is ideal for business travelers and couples seeking extra space and comfort.',
    shortDescription: 'Spacious suite with separate living area and city views',
    amenities: ['City View', 'King Bed', 'Living Room', 'Free WiFi', 'Mini Bar', 'Room Service', 'Smart TV', 'Work Desk', 'Bathtub', 'Safe'],
    images: [roomExecutive],
    isAC: true,
    capacity: 3,
    bedType: 'King',
    size: 750,
    available: true
  },
  {
    id: '3',
    name: 'Presidential Suite',
    type: 'Presidential',
    price: 999,
    description: 'The pinnacle of luxury, our Presidential Suite offers an unparalleled experience. With panoramic ocean views, a private terrace, marble bathroom with jacuzzi, and butler service, this suite represents the ultimate in refined living.',
    shortDescription: 'Ultimate luxury with private terrace and butler service',
    amenities: ['Panoramic View', 'Private Terrace', 'King Bed', 'Living Room', 'Dining Area', 'Jacuzzi', 'Butler Service', 'Free WiFi', 'Mini Bar', 'Room Service', 'Smart TV', 'Work Desk', 'Safe'],
    images: [roomPresidential],
    isAC: true,
    capacity: 4,
    bedType: 'King',
    size: 1200,
    available: true
  },
  {
    id: '4',
    name: 'Standard Garden Room',
    type: 'Standard',
    price: 149,
    description: 'Our Standard Garden Room offers comfortable accommodations with views of our beautifully landscaped gardens. Perfect for guests seeking value without compromising on quality, this room features all essential amenities for a pleasant stay.',
    shortDescription: 'Comfortable room with garden views',
    amenities: ['Garden View', 'Queen Bed', 'Free WiFi', 'Smart TV', 'Coffee Maker', 'Safe'],
    images: [roomDeluxe],
    isAC: true,
    capacity: 2,
    bedType: 'Queen',
    size: 320,
    available: true
  },
  {
    id: '5',
    name: 'Deluxe Pool Access',
    type: 'Deluxe',
    price: 349,
    discountPrice: 299,
    description: 'Step directly from your room into our stunning infinity pool. The Deluxe Pool Access room offers the ultimate in convenience for water lovers, with a private terrace and direct pool access.',
    shortDescription: 'Direct pool access from your private terrace',
    amenities: ['Pool Access', 'King Bed', 'Private Terrace', 'Free WiFi', 'Mini Bar', 'Room Service', 'Smart TV', 'Coffee Maker', 'Safe'],
    images: [roomExecutive],
    isAC: true,
    capacity: 2,
    bedType: 'King',
    size: 500,
    available: false
  }
];

export const bookings: Booking[] = [
  {
    id: 'BK001',
    roomId: '1',
    roomName: 'Deluxe Ocean View',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    checkIn: '2025-01-15',
    checkOut: '2025-01-18',
    guests: 2,
    totalPrice: 747,
    status: 'Approved',
    createdAt: '2025-01-10',
    specialRequests: 'Late check-in requested'
  },
  {
    id: 'BK002',
    roomId: '2',
    roomName: 'Executive Suite',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    checkIn: '2025-01-20',
    checkOut: '2025-01-23',
    guests: 2,
    totalPrice: 1347,
    status: 'Pending',
    createdAt: '2025-01-09'
  },
  {
    id: 'BK003',
    roomId: '3',
    roomName: 'Presidential Suite',
    userId: '3',
    userName: 'Michael Johnson',
    userEmail: 'michael@example.com',
    checkIn: '2025-01-25',
    checkOut: '2025-01-28',
    guests: 4,
    totalPrice: 2997,
    status: 'New',
    createdAt: '2025-01-08'
  },
  {
    id: 'BK004',
    roomId: '4',
    roomName: 'Standard Garden Room',
    userId: '4',
    userName: 'Emily Brown',
    userEmail: 'emily@example.com',
    checkIn: '2025-01-12',
    checkOut: '2025-01-14',
    guests: 1,
    totalPrice: 298,
    status: 'Cancelled',
    createdAt: '2025-01-05'
  },
  {
    id: 'BK005',
    roomId: '1',
    roomName: 'Deluxe Ocean View',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    checkIn: '2025-02-01',
    checkOut: '2025-02-05',
    guests: 2,
    totalPrice: 996,
    status: 'Pending',
    createdAt: '2025-01-10'
  }
];

export const hotelInfo = {
  name: 'Shri Balaji ',
  tagline: 'Where Luxury Meets Tranquility',
  description: 'Nestled along the pristine Mediterranean coastline, Shri Balaji  Resort offers an unparalleled escape into luxury and serenity. Our boutique hotel combines timeless elegance with modern comfort, creating unforgettable experiences for our distinguished guests.',
  address: '123 Coastal Drive, Mediterranean Bay, 12345',
  phone: '+1 (555) 123-4567',
  email: 'reservations@azurehaven.com',
  checkInTime: '3:00 PM',
  checkOutTime: '11:00 AM',
  amenities: [
    'Infinity Pool',
    'World-Class Spa',
    'Fine Dining Restaurant',
    'Private Beach Access',
    'Fitness Center',
    'Concierge Service',
    '24-Hour Room Service',
    'Valet Parking',
    'Business Center',
    'Event Spaces'
  ]
};
