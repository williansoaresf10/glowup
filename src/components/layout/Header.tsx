import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-7 w-7 text-pink-500" />
            <h1 className="text-2xl md:text-3xl font-bold gradient-text tracking-tight">GlowUP Beautiful</h1>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
