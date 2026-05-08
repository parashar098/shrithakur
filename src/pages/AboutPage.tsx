import { motion } from 'framer-motion';
import { Award, Users, Shield, Heart, Star, Coffee, Wifi, Car, Tv, Dumbbell, Waves, UtensilsCrossed } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';

const facilities = [
  { icon: Wifi, label: 'Free WiFi', desc: 'High-speed internet throughout' },
  { icon: UtensilsCrossed, label: 'Restaurant', desc: 'Multi-cuisine dining' },
  { icon: Waves, label: 'Swimming Pool', desc: 'Temperature controlled pool' },
  { icon: Dumbbell, label: 'Gym', desc: 'Fully equipped fitness center' },
  { icon: Car, label: 'Parking', desc: 'Free secure parking' },
  { icon: Coffee, label: 'Cafe', desc: '24/7 coffee lounge' },
  { icon: Tv, label: 'Entertainment', desc: 'Smart TV in every room' },
  { icon: Shield, label: 'Security', desc: '24/7 CCTV surveillance' },
];

const values = [
  { icon: Heart, title: 'Hospitality', desc: 'We treat every guest as family, with warmth and genuine care that reflects the spirit of Vrindavan.' },
  { icon: Shield, title: 'Integrity', desc: 'We uphold the highest standards of honesty and transparency in all our dealings.' },
  { icon: Star, title: 'Excellence', desc: 'We strive for perfection in every detail, from room service to event management.' },
  { icon: Users, title: 'Community', desc: 'We are deeply rooted in the local community and support cultural preservation.' },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-neutral-950">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="About"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase">Our Story</span>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mt-3">About Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle
                subtitle="Our Legacy"
                title="A Divine Journey of Hospitality"
                description="Founded in 2003, Shri Thakur Ji Hotel was born from a vision to create a sanctuary where pilgrims and travelers could find comfort and peace in the holy city of Vrindavan. What started as a small guesthouse has grown into a premier luxury hotel, yet our core values remain unchanged — devotion to service, respect for tradition, and a commitment to making every guest feel at home."
              />
              <p className="text-neutral-500 dark:text-white/50 text-sm mt-6 leading-relaxed">
                Over two decades, we have hosted thousands of devotees, families, and travelers from around the world. Our team of 100+ dedicated staff members works tirelessly to ensure every stay is memorable. From the aroma of freshly prepared prasadam to the serene views of the Yamuna, every moment at Shri Thakur Ji is designed to uplift your spirit.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="rounded-2xl h-64 object-cover w-full" />
              <img src="https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="rounded-2xl h-64 object-cover w-full mt-8" />
              <img src="https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="rounded-2xl h-64 object-cover w-full" />
              <img src="https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="rounded-2xl h-64 object-cover w-full mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-black">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-black/70 leading-relaxed">
                To provide an exceptional hospitality experience that combines the spiritual essence of Vrindavan with world-class luxury, ensuring every guest departs with cherished memories and a desire to return.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-10 rounded-2xl bg-neutral-900 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/60 leading-relaxed">
                To be the most revered hotel in Vrindavan, setting the standard for spiritual hospitality while embracing sustainable practices and modern innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Our Values" title="What We Stand For" center />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-amber-500" size={24} />
                </div>
                <h3 className="text-neutral-900 dark:text-white font-bold mb-2">{v.title}</h3>
                <p className="text-neutral-500 dark:text-white/40 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Facilities" title="Hotel Amenities" description="Everything you need for a comfortable and luxurious stay." center />
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 text-center hover:border-amber-400/20 transition-all group"
              >
                <f.icon size={24} className="text-amber-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-neutral-900 dark:text-white font-semibold text-sm mb-1">{f.label}</h3>
                <p className="text-neutral-400 text-xs">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle subtitle="Recognition" title="Awards & Achievements" light center />
          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              { year: '2023', title: 'Best Heritage Hotel', org: 'UP Tourism Awards' },
              { year: '2022', title: 'Excellence in Hospitality', org: 'Indian Hotel Awards' },
              { year: '2021', title: 'Top Rated Hotel', org: 'TripAdvisor' },
            ].map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/5"
              >
                <Award className="text-amber-400 mx-auto mb-4" size={32} />
                <div className="text-amber-400 text-sm font-semibold mb-2">{award.year}</div>
                <h3 className="text-white font-bold mb-1">{award.title}</h3>
                <p className="text-white/40 text-sm">{award.org}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
