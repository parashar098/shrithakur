import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, IndianRupee, Check, X, BedDouble, PartyPopper, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Booking, Room, Event as EventType } from '../types';

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [contacts, setContacts] = useState<{ id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string }[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [bookingsRes, roomsRes, eventsRes, contactsRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('rooms').select('*').order('price_per_night'),
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(20),
      ]);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (roomsRes.data) setRooms(roomsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
    };
    fetchData();
  }, [isAdmin]);

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status as Booking['status'] } : b)));
  };

  const toggleRoomAvailability = async (id: string, availability: boolean) => {
    await supabase.from('rooms').update({ availability: !availability }).eq('id', id);
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, availability: !availability } : r)));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">You don't have admin access.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-amber-400' },
    { label: 'Active Rooms', value: rooms.filter((r) => r.availability).length, icon: BedDouble, color: 'text-green-400' },
    { label: 'Events', value: events.length, icon: PartyPopper, color: 'text-blue-400' },
    { label: 'Revenue', value: `₹${bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.total_amount, 0).toLocaleString()}`, icon: IndianRupee, color: 'text-amber-400' },
  ];

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'events', label: 'Events', icon: PartyPopper },
    { id: 'contacts', label: 'Messages', icon: Mail },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    confirmed: 'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400',
    completed: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-white text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5"
            >
              <stat.icon size={20} className={stat.color + ' mb-3'} />
              <div className="text-white font-bold text-2xl">{stat.value}</div>
              <div className="text-white/40 text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                      <span className="text-white/30 text-xs capitalize">{booking.booking_type}</span>
                    </div>
                    <div className="text-white text-sm font-medium">{booking.guest_name}</div>
                    <div className="text-white/40 text-xs">{booking.guest_email} | {booking.guest_phone}</div>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-white/30">
                      {booking.booking_type === 'room' ? (
                        <span>{booking.check_in} to {booking.check_out}</span>
                      ) : (
                        <span>Event: {booking.event_date}</span>
                      )}
                      <span>{booking.guests} guests</span>
                      <span>₹{booking.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">{room.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${room.availability ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {room.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="text-white/40 text-xs mb-3 capitalize">{room.category.replace('_', ' ')}</div>
                <div className="text-amber-400 font-bold text-lg mb-3">₹{room.price_per_night.toLocaleString()}<span className="text-white/30 text-xs font-normal">/night</span></div>
                <button
                  onClick={() => toggleRoomAvailability(room.id, room.availability)}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
                    room.availability
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {room.availability ? 'Mark Unavailable' : 'Mark Available'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white font-semibold text-sm mb-2">{event.name}</h3>
                <div className="text-white/40 text-xs mb-2 capitalize">{event.type.replace('_', ' ')}</div>
                <div className="text-amber-400 text-sm font-semibold mb-2">{event.price_range}</div>
                <div className="text-white/30 text-xs">Max {event.max_guests} guests</div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{contact.name}</div>
                    <div className="text-white/40 text-xs">{contact.email}</div>
                    {contact.subject && <div className="text-amber-400 text-xs mt-1">{contact.subject}</div>}
                    <p className="text-white/50 text-sm mt-2">{contact.message}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${contact.is_read ? 'text-white/30' : 'text-amber-400 bg-amber-400/10'}`}>
                    {contact.is_read ? 'Read' : 'New'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
