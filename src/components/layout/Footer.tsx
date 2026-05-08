import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg">
                S
              </div>
              <div>
                <div className="text-amber-400 font-bold text-lg tracking-wide">SHRI THAKUR JI</div>
                <div className="text-amber-500/60 text-[10px] tracking-[0.3em] uppercase">Hotel & Resort</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Experience luxury and comfort at Shri Thakur Ji Hotel. Where tradition meets modern elegance, creating unforgettable moments.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-3">
              {[
                { to: '/rooms', label: 'Our Rooms' },
                { to: '/events', label: 'Events' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-white/50 text-sm hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-white/50 text-sm">123 Temple Road, Vrindavan, Mathura, UP 281121</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span className="text-white/50 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span className="text-white/50 text-sm">info@shrithakurjihotel.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <div className="text-white/50 text-sm">
                  <div>Check-in: 12:00 PM</div>
                  <div>Check-out: 11:00 AM</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Newsletter</h3>
            <p className="text-white/50 text-sm mb-4">Subscribe for exclusive offers and updates.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                if (email) {
                  await supabase.from('newsletter').insert({ email });
                  form.reset();
                }
              }}
              className="flex gap-2"
            >
              <input
                name="email"
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Shri Thakur Ji Hotel. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 text-sm hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/30 text-sm hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
