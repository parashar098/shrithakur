import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20room%20booking"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:bg-green-400 transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
    >
      <MessageCircle size={26} />
    </motion.a>
  );
}
