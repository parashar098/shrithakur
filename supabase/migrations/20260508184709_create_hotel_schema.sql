/*
  # Shri Thakur Ji Hotel - Complete Database Schema

  1. New Tables
    - `profiles` - User profiles linked to auth.users (id, full_name, phone, avatar_url, role)
    - `rooms` - Hotel room listings (name, category, price, capacity, amenities, images, availability, rating)
    - `events` - Event packages (name, type, description, price_range, decoration, catering, images)
    - `bookings` - Room and event bookings (user_id, type, room_id/event_id, check_in, check_out, guests, status, total_amount)
    - `reviews` - Customer reviews (user_id, rating, comment, room_id)
    - `gallery` - Gallery images (title, category, image_url, is_featured)
    - `contacts` - Contact form submissions (name, email, phone, subject, message)
    - `newsletter` - Newsletter subscriptions (email)

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read/update own data, admins can read all
    - Rooms/Events/Gallery: public read, admin write
    - Bookings: users read own, admin read all, users create own
    - Reviews: public read, authenticated create own, admin manage
    - Contacts/Newsletter: anyone insert, admin read
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('deluxe', 'premium', 'family_suite', 'couple', 'luxury_suite')),
  description text DEFAULT '',
  price_per_night numeric NOT NULL DEFAULT 0,
  ac boolean DEFAULT true,
  wifi boolean DEFAULT true,
  tv boolean DEFAULT true,
  capacity integer NOT NULL DEFAULT 2,
  availability boolean DEFAULT true,
  rating numeric DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  images text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('birthday', 'ring_ceremony', 'wedding', 'anniversary', 'corporate')),
  description text DEFAULT '',
  price_range text DEFAULT '',
  decoration_themes text[] DEFAULT '{}',
  catering_options text[] DEFAULT '{}',
  max_guests integer DEFAULT 100,
  images text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  booking_type text NOT NULL CHECK (booking_type IN ('room', 'event')),
  room_id uuid REFERENCES rooms(id),
  event_id uuid REFERENCES events(id),
  check_in date,
  check_out date,
  event_date date,
  guests integer DEFAULT 1,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount numeric DEFAULT 0,
  special_requests text DEFAULT '',
  guest_name text DEFAULT '',
  guest_email text DEFAULT '',
  guest_phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  room_id uuid REFERENCES rooms(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT '',
  category text NOT NULL CHECK (category IN ('interior', 'exterior', 'rooms', 'events', 'dining', 'pool', 'garden')),
  image_url text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Newsletter table
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Rooms policies (public read, admin write)
CREATE POLICY "Anyone can view rooms" ON rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert rooms" ON rooms FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update rooms" ON rooms FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete rooms" ON rooms FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Events policies (public read, admin write)
CREATE POLICY "Anyone can view events" ON events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert events" ON events FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update events" ON events FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete events" ON events FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all bookings" ON bookings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update any booking" ON bookings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete bookings" ON bookings FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Gallery policies (public read, admin write)
CREATE POLICY "Anyone can view gallery" ON gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update gallery" ON gallery FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete gallery" ON gallery FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contacts policies
CREATE POLICY "Anyone can submit contact" ON contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read contacts" ON contacts FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update contacts" ON contacts FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Newsletter policies
CREATE POLICY "Anyone can subscribe" ON newsletter FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON newsletter FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete subscribers" ON newsletter FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_rooms_category ON rooms(category);
CREATE INDEX IF NOT EXISTS idx_reviews_room_id ON reviews(room_id);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
