import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, MapPin, Phone, ArrowRight, Sparkles, Crown, Heart, PartyPopper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Room, Event, Review, GalleryImage } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import StarRating from '../components/common/StarRating';

const heroSlides = [
  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

const nearbyPlaces = [
  { name: 'Banke Bihari Temple', distance: '2 km', icon: '🛕' },
  { name: 'Prem Mandir', distance: '3 km', icon: '🏛️' },
  { name: 'ISCKON Temple', distance: '4 km', icon: '🛕' },
  { name: 'Yamuna River', distance: '5 km', icon: '🌊' },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [roomsRes, eventsRes, reviewsRes, galleryRes] = await Promise.all([
        supabase.from('rooms').select('*').eq('availability', true).limit(3),
        supabase.from('events').select('*').eq('is_available', true).limit(3),
        supabase.from('reviews').select('*, profiles(full_name, avatar_url)').order('created_at', { ascending: false }).limit(6),
        supabase.from('gallery').select('*').eq('is_featured', true).limit(6),
      ]);
      setRooms(roomsRes.data || []);
      setEvents(eventsRes.data || []);
      setReviews(reviewsRes.data || []);
      setGallery(galleryRes.data || []);
    };
    fetchData();
  }, []);

  const categoryIcons: Record<string, string> = {
    deluxe: '✦',
    premium: '◆',
    family_suite: '⌂',
    couple: '♥',
    luxury_suite: '♛',
  };

  const eventIcons: Record<string, typeof PartyPopper> = {
    birthday: PartyPopper,
    ring_ceremony: Heart,
    wedding: Crown,
    anniversary: Heart,
    corporate: Sparkles,
  };

  return (
    <div className="bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
              Welcome to Luxury
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Shri Thakur Ji
              <span className="block text-amber-400">Hotel & Resort</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Where divine hospitality meets modern luxury. Experience the spiritual essence of Vrindavan with world-class comfort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/rooms"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm tracking-wider uppercase shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2"
              >
                Book a Room <ArrowRight size={16} />
              </Link>
              <Link
                to="/events"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-sm tracking-wider uppercase hover:bg-white/5 hover:border-white/30 transition-all"
              >
                Plan an Event
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle
                subtitle="Our Story"
                title="A Legacy of Divine Hospitality"
                description="Nestled in the holy city of Vrindavan, Shri Thakur Ji Hotel has been a sanctuary of comfort and devotion for over two decades. Our hotel blends traditional Indian hospitality with modern luxury, creating an experience that nourishes both body and soul."
              />
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { num: '20+', label: 'Years of Service' },
                  { num: '5000+', label: 'Happy Guests' },
                  { num: '50+', label: 'Rooms & Suites' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-amber-500">{stat.num}</div>
                    <div className="text-neutral-500 dark:text-white/40 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-amber-600 dark:text-amber-400 font-semibold text-sm hover:gap-3 transition-all"
              >
                Learn More <ChevronRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Hotel Interior"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-xl">
                <div className="text-3xl font-bold">4.9</div>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className="fill-black" />
                  ))}
                </div>
                <div className="text-xs font-medium opacity-70">Guest Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Accommodation"
            title="Luxury Rooms & Suites"
            description="Each room is thoughtfully designed to provide the perfect blend of comfort and elegance."
            center
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 dark:border-white/5"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-semibold">
                    {categoryIcons[room.category]} {room.category.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
                    ₹{room.price_per_night.toLocaleString()}/night
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{room.name}</h3>
                  <p className="text-neutral-500 dark:text-white/40 text-sm line-clamp-2 mb-4">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <StarRating rating={room.rating} />
                    <Link
                      to="/rooms"
                      className="text-amber-600 dark:text-amber-400 text-sm font-semibold hover:gap-2 flex items-center gap-1 transition-all"
                    >
                      View <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:gap-3 transition-all"
            >
              View All Rooms <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Celebrate With Us"
            title="Events & Celebrations"
            description="From intimate birthday parties to grand weddings, we create moments that last forever."
            light
            center
          />
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {events.map((event, i) => {
              const Icon = eventIcons[event.type] || Sparkles;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/20 hover:bg-white/10 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-6 group-hover:bg-amber-400/20 transition-all">
                    <Icon className="text-amber-400" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{event.name}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="text-amber-400 text-sm font-semibold mb-4">{event.price_range}</div>
                  <Link
                    to="/events"
                    className="text-amber-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Book Now <ChevronRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Gallery"
            title="A Glimpse of Luxury"
            description="Explore the beauty and elegance of Shri Thakur Ji Hotel."
            center
          />
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                  i === 0 ? 'md:col-span-2 md:row-span-2 h-64 md:h-full' : 'h-48 md:h-56'
                }`}
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white font-semibold text-sm">{img.title}</span>
                    <span className="block text-white/60 text-xs capitalize">{img.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-semibold text-sm hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Testimonials"
            title="What Our Guests Say"
            description="Real experiences from our valued guests."
            center
          />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.length > 0 ? reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 shadow-sm"
              >
                <StarRating rating={review.rating} />
                <p className="text-neutral-600 dark:text-white/60 text-sm mt-4 mb-6 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm">
                    {(review.profiles?.full_name || 'G')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-neutral-900 dark:text-white font-semibold text-sm">{review.profiles?.full_name || 'Guest'}</div>
                    <div className="text-neutral-400 text-xs">Verified Guest</div>
                  </div>
                </div>
              </motion.div>
            )) : (
              [1, 2, 3].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 shadow-sm"
                >
                  <StarRating rating={5} />
                  <p className="text-neutral-600 dark:text-white/60 text-sm mt-4 mb-6 leading-relaxed">
                    "Absolutely wonderful experience! The staff was incredibly hospitable and the rooms were spotless. The location near the temples is perfect."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-sm">
                      {['R', 'A', 'P'][i]}
                    </div>
                    <div>
                      <div className="text-neutral-900 dark:text-white font-semibold text-sm">{['Rajesh Kumar', 'Anita Sharma', 'Priya Patel'][i]}</div>
                      <div className="text-neutral-400 text-xs">Verified Guest</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Nearby Places */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Explore"
            title="Nearby Attractions"
            description="Discover the spiritual and cultural landmarks near our hotel."
            center
          />
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            {nearbyPlaces.map((place, i) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 text-center hover:border-amber-400/20 transition-all group"
              >
                <div className="text-4xl mb-3">{place.icon}</div>
                <h3 className="text-neutral-900 dark:text-white font-semibold text-sm mb-1">{place.name}</h3>
                <span className="text-amber-500 text-xs font-medium">{place.distance}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">Ready to Experience Luxury?</h2>
          <p className="text-black/70 text-lg mb-10 max-w-2xl mx-auto">
            Book your stay at Shri Thakur Ji Hotel and create memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/rooms"
              className="px-8 py-4 rounded-full bg-black text-amber-400 font-bold text-sm tracking-wider uppercase shadow-2xl hover:bg-neutral-900 transition-all"
            >
              Book Your Room
            </Link>
            <a
              href="tel:+919876543210"
              className="px-8 py-4 rounded-full border-2 border-black/20 text-black font-bold text-sm tracking-wider uppercase hover:bg-black/10 transition-all flex items-center gap-2"
            >
              <Phone size={16} /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <MapPin className="text-amber-500 mb-4" size={28} />
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Find Us</h3>
              <p className="text-neutral-500 dark:text-white/50 text-sm mb-6">
                123 Temple Road, Vrindavan, Mathura, Uttar Pradesh 281121, India
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-neutral-600 dark:text-white/50">
                  <Phone size={14} className="text-amber-500" />
                  +91 98765 43210
                </div>
                <div className="flex items-center gap-3 text-neutral-600 dark:text-white/50">
                  <MapPin size={14} className="text-amber-500" />
                  2 km from Banke Bihari Temple
                </div>
              </div>
            </div>
            <div className="h-72 lg:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.5!2d77.68!3d27.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM0JzQ4LjAiTiA3N8KwNDAnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
