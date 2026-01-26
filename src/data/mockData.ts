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
    name: 'Mahakal Deluxe Room',
    type: 'Deluxe',
    price: 2500,
    discountPrice: 2200,
    description: 'Experience traditional Indian hospitality in our Mahakal Deluxe Room, featuring comfortable furnishings and modern amenities. Located near the famous Mahakaleshwar Temple, this room offers a perfect blend of cultural heritage and contemporary comfort for your spiritual journey in Ujjain.',
    shortDescription: 'Comfortable room with traditional Indian decor and modern amenities',
    amenities: ['Temple View', 'Queen Bed', 'Free WiFi', 'Hot Water', 'Room Service', 'TV', 'Tea/Coffee Maker', 'Safe'],
    images: [roomDeluxe],
    isAC: true,
    capacity: 2,
    bedType: 'Queen',
    size: 350,
    available: true
  },
  {
    id: '2',
    name: 'Ram Ghat Suite',
    type: 'Executive',
    price: 3500,
    discountPrice: 3200,
    description: 'Our Ram Ghat Suite offers serene views of the sacred Shipra River and Ram Ghat. This spacious suite features traditional Indian architecture with modern comforts, perfect for families and groups seeking an authentic Ujjain experience with river views and cultural ambiance.',
    shortDescription: 'Spacious suite with river views and traditional architecture',
    amenities: ['River View', 'King Bed', 'Living Area', 'Free WiFi', 'Hot Water', 'Room Service', 'TV', 'Tea/Coffee Maker', 'Balcony', 'Safe'],
    images: [roomExecutive],
    isAC: true,
    capacity: 3,
    bedType: 'King',
    size: 550,
    available: true
  },
  {
    id: '3',
    name: 'Presidential Heritage Suite',
    type: 'Presidential',
    price: 5500,
    description: 'The ultimate in Ujjain hospitality, our Presidential Heritage Suite combines traditional Indian royal architecture with modern luxury. Featuring panoramic views of the city, a private terrace for evening prayers, and personalized cultural experiences, this suite offers an unparalleled heritage experience.',
    shortDescription: 'Luxury suite with heritage architecture and city views',
    amenities: ['City View', 'King Bed', 'Living Room', 'Dining Area', 'Private Terrace', 'Cultural Guide', 'Free WiFi', 'Hot Water', 'Room Service', 'TV', 'Tea/Coffee Maker', 'Safe'],
    images: [roomPresidential],
    isAC: true,
    capacity: 4,
    bedType: 'King',
    size: 800,
    available: true
  },
  {
    id: '4',
    name: 'Garden View Room',
    type: 'Standard',
    price: 1800,
    description: 'Our Garden View Room offers comfortable accommodations overlooking our traditional Indian garden. Perfect for budget-conscious travelers seeking authentic local experiences, this room provides all essential amenities while maintaining the warm hospitality of a traditional Indian homestay.',
    shortDescription: 'Comfortable room with garden views and essential amenities',
    amenities: ['Garden View', 'Double Bed', 'Free WiFi', 'Hot Water', 'TV', 'Tea/Coffee Maker', 'Safe'],
    images: [roomDeluxe],
    isAC: true,
    capacity: 2,
    bedType: 'Double',
    size: 280,
    available: true
  },
  {
    id: '5',
    name: 'Family Suite',
    type: 'Deluxe',
    price: 4200,
    discountPrice: 3800,
    description: 'Designed for families and groups, our Family Suite offers interconnected rooms with traditional Indian decor. Located in the cultural heart of Ujjain, this suite provides ample space for family gatherings and includes arrangements for local sightseeing and temple visits.',
    shortDescription: 'Spacious family accommodation with interconnected rooms',
    amenities: ['Family Setup', 'Multiple Beds', 'Interconnected Rooms', 'Free WiFi', 'Hot Water', 'Room Service', 'TV', 'Tea/Coffee Maker', 'Family Dining', 'Safe'],
    images: [roomExecutive],
    isAC: true,
    capacity: 4,
    bedType: 'Multiple',
    size: 650,
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
  name: 'Shri Balaji',
  subname: 'Home Stay',
  tagline: 'Your Home Away from Home in Ujjain',
  description: 'Welcome to Shri Balaji Home Stay, nestled in the heart of Ujjain, Madhya Pradesh. Experience authentic Indian hospitality in our comfortable homestay, where traditional warmth meets modern amenities. Discover the spiritual essence of Ujjain while enjoying personalized care and local experiences.',
  address: 'D9/20, MIG, Kshipra Vihar, Ujjain, Madhya Pradesh, 456010.',
  phone: '+91 9202963722, +91 7489222202',
  email: 'sshri.balajihomestay@gmail.com',
  checkInTime: '12:00 PM',
  checkOutTime: '11:00 AM',
  amenities: [
    'Traditional Indian Meals',
    'Local Sightseeing Tours',
    'Temple Visit Arrangements',
    'Cultural Experiences',
    'Airport/Station Pickup',
    'WiFi Connectivity',
    '24-Hour Hot Water',
    'Room Service',
    'Laundry Service',
    'Cultural Performances'
  ]
};
