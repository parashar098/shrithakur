import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Users, Wifi, Tv, Wind, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Room } from '../types';
import StarRating from '../components/common/StarRating';
import BookingModal from '../components/common/BookingModal';

const categories = [
  { value: 'all', label: 'All Rooms' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'premium', label: 'Premium' },
  { value: 'family_suite', label: 'Family Suite' },
  { value: 'couple', label: 'Couple' },
  { value: 'luxury_suite', label: 'Luxury Suite' },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filtered, setFiltered] = useState<Room[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from('rooms').select('*').order('price_per_night');
      if (data) {
        setRooms(data);
        setFiltered(data);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    let result = rooms;
    if (category !== 'all') {
      result = result.filter((r) => r.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [category, search, rooms]);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Rooms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase">Accommodation</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mt-3">Our Rooms</h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2.5 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-white/60"
            >
              <SlidersHorizontal size={18} />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-white/60 hover:bg-neutral-200 dark:hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setCategory(cat.value); setShowFilters(false); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        category === cat.value
                          ? 'bg-amber-500 text-black'
                          : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-white/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Room Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-neutral-500 dark:text-white/40 text-sm">{filtered.length} rooms found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-amber-500 text-black text-xs font-bold">
                    ₹{room.price_per_night.toLocaleString()}/night
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg">{room.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={room.rating} size={12} />
                      <span className="text-white/60 text-xs">{room.rating}</span>
                    </div>
                  </div>
                  {!room.availability && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-lg">Sold Out</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-neutral-500 dark:text-white/40 text-sm line-clamp-2 mb-4">{room.description}</p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    {room.ac && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/40">
                        <Wind size={14} className="text-amber-500" /> AC
                      </div>
                    )}
                    {room.wifi && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/40">
                        <Wifi size={14} className="text-amber-500" /> WiFi
                      </div>
                    )}
                    {room.tv && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/40">
                        <Tv size={14} className="text-amber-500" /> TV
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-white/40">
                      <Users size={14} className="text-amber-500" /> {room.capacity} Guests
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-white/40 text-[10px]">
                        {a}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-white/40 text-[10px]">
                        +{room.amenities.length - 4} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (user) {
                        setSelectedRoom(room);
                      } else {
                        window.location.href = '/login';
                      }
                    }}
                    disabled={!room.availability}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
                  >
                    Book Room <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">No rooms found matching your criteria.</p>
              <button
                onClick={() => { setCategory('all'); setSearch(''); }}
                className="mt-4 text-amber-500 font-semibold text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedRoom && (
        <BookingModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          type="room"
          item={selectedRoom}
        />
      )}
    </div>
  );
}
