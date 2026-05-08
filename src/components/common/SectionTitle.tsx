import { motion } from 'framer-motion';

interface Props {
  subtitle: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionTitle({ subtitle, title, description, light, center }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={center ? 'text-center' : ''}
    >
      <span className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase">
        {subtitle}
      </span>
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 ${light ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/60' : 'text-neutral-600 dark:text-white/60'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
