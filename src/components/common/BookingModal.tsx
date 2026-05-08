import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Room, Event } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'room' | 'event';
  item: Room | Event;
}

export default function BookingModal({ isOpen, onClose, type, item }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    eventDate: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const room = type === 'room' ? (item as Room) : null;
  const event = type === 'event' ? (item as Event) : null;

  const totalAmount = () => {
    if (type === 'room' && form.checkIn && form.checkOut) {
      const days = Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000));
      return room!.price_per_night * days;
    }
    return 0;
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    const booking: Record<string, unknown> = {
      user_id: user.id,
      booking_type: type,
      guests: form.guests,
      special_requests: form.specialRequests,
      guest_name: form.name,
      guest_email: form.email,
      guest_phone: form.phone,
      total_amount: totalAmount(),
    };
    if (type === 'room') {
      booking.room_id = room!.id;
      booking.check_in = form.checkIn;
      booking.check_out = form.checkOut;
    } else {
      booking.event_id = event!.id;
      booking.event_date = form.eventDate;
    }
    await supabase.from('bookings').insert(booking);
    setSubmitting(false);
    setSuccess(true);
  };

  const reset = () => {
    setStep(1);
    setForm({ checkIn: '', checkOut: '', eventDate: '', guests: 1, name: '', email: '', phone: '', specialRequests: '' });
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={reset}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-400" size={32} />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-white/50 text-sm mb-6">Your booking has been submitted. We will confirm it shortly.</p>
                <button onClick={reset} className="px-6 py-2.5 rounded-full bg-amber-500 text-black font-semibold text-sm">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                  <h3 className="text-white font-bold text-lg">
                    Book {type === 'room' ? room?.name : event?.name}
                  </h3>
                  <button onClick={reset} className="p-1 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {step === 1 && (
                    <>
                      {type === 'room' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Check-in</label>
                            <div className="relative">
                              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                              <input
                                type="date"
                                value={form.checkIn}
                                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Check-out</label>
                            <div className="relative">
                              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                              <input
                                type="date"
                                value={form.checkOut}
                                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Event Date</label>
                          <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                            <input
                              type="date"
                              value={form.eventDate}
                              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Number of Guests</label>
                        <div className="relative">
                          <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                          <input
                            type="number"
                            min={1}
                            max={type === 'room' ? room?.capacity : event?.max_guests}
                            value={form.guests}
                            onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                          />
                        </div>
                      </div>

                      {type === 'room' && form.checkIn && form.checkOut && (
                        <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/50">Rate per night</span>
                            <span className="text-white font-medium">₹{room?.price_per_night.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-white/50">Total</span>
                            <span className="text-amber-400 font-bold text-lg">₹{totalAmount().toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setStep(2)}
                        disabled={type === 'room' ? !form.checkIn || !form.checkOut : !form.eventDate}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Continue
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Special Requests</label>
                        <textarea
                          value={form.specialRequests}
                          onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none"
                          placeholder="Any special requests..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 font-medium text-sm hover:bg-white/5 transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={submitting || !form.name || !form.email || !form.phone}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold disabled:opacity-40 transition-all"
                        >
                          {submitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
