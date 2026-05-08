export interface Room {
  id: string;
  name: string;
  category: 'deluxe' | 'premium' | 'family_suite' | 'couple' | 'luxury_suite';
  description: string;
  price_per_night: number;
  ac: boolean;
  wifi: boolean;
  tv: boolean;
  capacity: number;
  availability: boolean;
  rating: number;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  type: 'birthday' | 'ring_ceremony' | 'wedding' | 'anniversary' | 'corporate';
  description: string;
  price_range: string;
  decoration_themes: string[];
  catering_options: string[];
  max_guests: number;
  images: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: 'room' | 'event';
  room_id: string | null;
  event_id: string | null;
  check_in: string | null;
  check_out: string | null;
  event_date: string | null;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  special_requests: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  room_id: string | null;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string };
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'interior' | 'exterior' | 'rooms' | 'events' | 'dining' | 'pool' | 'garden';
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}
