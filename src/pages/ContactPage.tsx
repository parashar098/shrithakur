import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SectionTitle from '../components/common/SectionTitle';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: '123 Temple Road, Vrindavan, Mathura, UP 281121', color: 'text-amber-500' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210', color: 'text-green-500' },
  { icon: Mail, label: 'Email', value: 'info@shrithakurjihotel.com', href: 'mailto:info@shrithakurjihotel.com', color: 'text-blue-500' },
  { icon: Clock, label: 'Reception', value: '24/7 Front Desk', color: 'text-purple-500' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await supabase.from('contacts').insert({
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      subject: data.get('subject'),
      message: data.get('message'),
    });
    form.reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase">Get in Touch</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mt-3">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 text-center hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4`}>
                  <info.icon size={22} className={info.color} />
                </div>
                <h3 className="text-neutral-900 dark:text-white font-semibold text-sm mb-1">{info.label}</h3>
                {info.href ? (
                  <a href={info.href} className="text-neutral-500 dark:text-white/40 text-sm hover:text-amber-500 transition-colors">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-neutral-500 dark:text-white/40 text-sm">{info.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle subtitle="Write to Us" title="Send a Message" description="Have a question or need assistance? Fill out the form and we'll get back to you within 24 hours." />

              {submitted && (
                <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm">
                  Message sent successfully! We'll respond shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input name="name" required placeholder="Your Name" className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
                  <input name="email" type="email" required placeholder="Email Address" className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <input name="phone" placeholder="Phone Number" className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
                  <input name="subject" placeholder="Subject" className="px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
                <textarea name="message" rows={5} required placeholder="Your Message" className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none" />
                <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2">
                  <Send size={16} /> Send Message
                </button>
              </form>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-all"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <div className="rounded-2xl overflow-hidden h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.5!2d77.68!3d27.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM0JzQ4LjAiTiA3N8KwNDAnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  title="Hotel Location"
                />
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-white/5">
                <h3 className="text-neutral-900 dark:text-white font-bold mb-4">Frequently Asked Questions</h3>
                {[
                  { q: 'What are the check-in and check-out times?', a: 'Check-in: 12:00 PM, Check-out: 11:00 AM' },
                  { q: 'Is parking available?', a: 'Yes, free secure parking is available for all guests.' },
                  { q: 'Do you allow pets?', a: 'Unfortunately, pets are not allowed in the hotel premises.' },
                  { q: 'Is there a cancellation policy?', a: 'Free cancellation up to 24 hours before check-in.' },
                ].map((faq) => (
                  <details key={faq.q} className="group border-b border-neutral-200 dark:border-white/5 last:border-0">
                    <summary className="py-3 text-sm font-medium text-neutral-900 dark:text-white cursor-pointer hover:text-amber-500 transition-colors list-none flex items-center justify-between">
                      {faq.q}
                      <span className="text-neutral-400 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="pb-3 text-sm text-neutral-500 dark:text-white/40">{faq.a}</p>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
