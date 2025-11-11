import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      className={cn(
        'glass rounded-2xl p-6 shadow-lg',
        hover && 'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
