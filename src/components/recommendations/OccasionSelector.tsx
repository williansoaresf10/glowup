import React from 'react';
import { motion } from 'framer-motion';
import { OccasionRecommendations, OccasionType } from '../../types';
import { 
  Briefcase, 
  Calendar, 
  Camera, 
  Heart, 
  Moon, 
  ShoppingBag 
} from 'lucide-react';

interface OccasionSelectorProps {
  recommendations: OccasionRecommendations[];
  selectedOccasion: string;
  onSelect: (occasion: string) => void;
}

// Occasion icon mapping
const occasionIcons = {
  everyday: <Calendar className="w-5 h-5" />,
  evening: <Moon className="w-5 h-5" />,
  corporate: <Briefcase className="w-5 h-5" />,
  casual: <ShoppingBag className="w-5 h-5" />,
  romantic: <Heart className="w-5 h-5" />,
  photoshoot: <Camera className="w-5 h-5" />
};

// Occasion display names
const occasionNames = {
  everyday: 'Dia a dia',
  evening: 'Noite',
  corporate: 'Trabalho',
  casual: 'Casual',
  romantic: 'Romântico',
  photoshoot: 'Ensaio fotográfico'
};

export const OccasionSelector: React.FC<OccasionSelectorProps> = ({ 
  recommendations, 
  selectedOccasion, 
  onSelect 
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 md:gap-3 min-w-max mx-auto justify-center">
        {recommendations.map((rec) => (
          <OccasionButton
            key={rec.occasion}
            occasion={rec.occasion as OccasionType}
            isSelected={rec.occasion === selectedOccasion}
            onClick={() => onSelect(rec.occasion)}
          />
        ))}
      </div>
    </div>
  );
};

interface OccasionButtonProps {
  occasion: OccasionType;
  isSelected: boolean;
  onClick: () => void;
}

const OccasionButton: React.FC<OccasionButtonProps> = ({ 
  occasion, 
  isSelected, 
  onClick 
}) => {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center py-3 px-4 rounded-xl
        transition-all duration-300 ease-in-out
        ${isSelected 
          ? 'bg-gradient-to-br from-pink-500/90 to-violet-600/90 text-white' 
          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'}
      `}
    >
      <div className="flex items-center justify-center mb-1.5">
        {occasionIcons[occasion]}
      </div>
      <span className="text-sm font-medium">{occasionNames[occasion]}</span>
      
      {isSelected && (
        <motion.div
          layoutId="occasionHighlight"
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};