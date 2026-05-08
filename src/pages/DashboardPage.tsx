import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, IndianRupee, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'room' | 'event'>('all');

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setBookings(data);
    };
    fetchBookings();
  }, [user]);

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.booking_type === activeTab);

  const cancelBooking = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Please sign in to view your dashboard.</p>
          <Link to="/login" className="px-6 py-2.5 rounded-full bg-amber-500 text-black font-semibold text-sm">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-400/10 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-2xl">
              {(profile?.full_name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-white/40 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8">
            {[
              { label: 'Total Bookings', value: bookings.length, icon: Calendar },
              { label: 'Active', value: bookings.filter((b) => b.status === 'confirmed').length, icon: Clock },
              { label: 'Total Spent', value: `₹${bookings.reduce((s, b) => s + (b.status !== 'cancelled' ? b.total_amount : 0), 0).toLocaleString()}`, icon: IndianRupee },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={20} className="text-amber-400 mx-auto mb-2" />
                <div className="text-white font-bold text-xl">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'room', 'event'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Bookings' : `${tab} Bookings`}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filtered.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                    <span className="text-white/30 text-xs capitalize">{booking.booking_type} Booking</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {booking.booking_type === 'room' ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <Calendar size={14} className="text-amber-400" />
                          Check-in: {booking.check_in}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <Calendar size={14} className="text-amber-400" />
                          Check-out: {booking.check_out}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Calendar size={14} className="text-amber-400" />
                        Event Date: {booking.event_date}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <User size={14} className="text-amber-400" />
                      {booking.guests} Guests
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <IndianRupee size={14} className="text-amber-400" />
                      ₹{booking.total_amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg mb-4">No bookings found.</p>
              <Link to="/rooms" className="text-amber-400 font-semibold text-sm">
                Book a Room
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
