import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, Heart, Crown, Sparkles, Users, Palette, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';
import SectionTitle from '../components/common/SectionTitle';
import BookingModal from '../components/common/BookingModal';

const eventIcons: Record<string, typeof PartyPopper> = {
  birthday: PartyPopper,
  ring_ceremony: Heart,
  wedding: Crown,
  anniversary: Heart,
  corporate: Sparkles,
};

const eventColors: Record<string, string> = {
  birthday: 'from-pink-500 to-rose-500',
  ring_ceremony: 'from-amber-500 to-yellow-500',
  wedding: 'from-amber-600 to-amber-400',
  anniversary: 'from-red-500 to-pink-500',
  corporate: 'from-blue-500 to-cyan-500',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeType, setActiveType] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from('events').select('*').eq('is_available', true);
      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  const filtered = activeType === 'all' ? events : events.filter((e) => e.type === activeType);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase">Celebrate With Us</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mt-3">Events & Celebrations</h1>
          </motion.div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-8 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'All Events' },
              { value: 'birthday', label: 'Birthday' },
              { value: 'ring_ceremony', label: 'Ring Ceremony' },
              { value: 'wedding', label: 'Wedding' },
              { value: 'anniversary', label: 'Anniversary' },
              { value: 'corporate', label: 'Corporate' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setActiveType(type.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeType === type.value
                    ? 'bg-amber-500 text-black'
                    : 'bg-white dark:bg-white/5 text-neutral-600 dark:text-white/60 border border-neutral-200 dark:border-white/10'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event, i) => {
              const Icon = eventIcons[event.type] || Sparkles;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${eventColors[event.type]} flex items-center justify-center text-white shadow-lg`}>
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">{event.name}</h3>
                      <p className="text-amber-400 text-sm font-semibold mt-1">{event.price_range}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-neutral-500 dark:text-white/40 text-sm line-clamp-3 mb-5">{event.description}</p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Palette size={14} className="text-amber-500" />
                          <span className="text-neutral-900 dark:text-white text-xs font-semibold uppercase tracking-wider">Decoration Themes</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {event.decoration_themes.map((theme) => (
                            <span key={theme} className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-white/40 text-[11px]">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <UtensilsCrossed size={14} className="text-amber-500" />
                          <span className="text-neutral-900 dark:text-white text-xs font-semibold uppercase tracking-wider">Catering</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {event.catering_options.slice(0, 3).map((opt) => (
                            <span key={opt} className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-white/40 text-[11px]">
                              {opt}
                            </span>
                          ))}
                          {event.catering_options.length > 3 && (
                            <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-white/40 text-[11px]">
                              +{event.catering_options.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-neutral-500 dark:text-white/40 text-sm">
                        <Users size={14} className="text-amber-500" />
                        Up to {event.max_guests} guests
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (user) {
                          setSelectedEvent(event);
                        } else {
                          window.location.href = '/login';
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
                    >
                      Book Event <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Custom Event"
            title="Plan Your Special Event"
            description="Can't find what you're looking for? Tell us about your event and we'll create a custom package."
            center
          />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              await supabase.from('contacts').insert({
                name: data.get('name'),
                email: data.get('email'),
                phone: data.get('phone'),
                subject: 'Event Inquiry',
                message: `Event Type: ${data.get('type')}\nDate: ${data.get('date')}\nGuests: ${data.get('guests')}\nBudget: ${data.get('budget')}\nDetails: ${data.get('details')}`,
              });
              form.reset();
            }}
            className="mt-10 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input name="name" required placeholder="Your Name" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
              <input name="email" type="email" required placeholder="Email" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input name="phone" placeholder="Phone" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
              <select name="type" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50">
                <option value="">Select Event Type</option>
                <option value="birthday">Birthday Party</option>
                <option value="ring_ceremony">Ring Ceremony</option>
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
                <option value="corporate">Corporate Event</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <input name="date" type="date" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
              <input name="guests" type="number" placeholder="Guests" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
              <select name="budget" className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50">
                <option value="">Budget Range</option>
                <option value="low">Under ₹50,000</option>
                <option value="mid">₹50,000 - ₹2,00,000</option>
                <option value="high">₹2,00,000+</option>
              </select>
            </div>
            <textarea name="details" rows={4} placeholder="Tell us about your event..." className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none" />
            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all">
              Send Inquiry
            </button>
          </form>
        </div>
      </section>

      {selectedEvent && (
        <BookingModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          type="event"
          item={selectedEvent}
        />
      )}
    </div>
  );
}
