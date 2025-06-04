import React from 'react';
import { motion } from 'framer-motion';
import { MakeupRecommendation } from '../../types';

interface RecommendationCardProps {
  product: MakeupRecommendation;
  index: number;
}

// Product icon mapping
const productIcons: Record<string, string> = {
  foundation: '💧',
  concealer: '✨',
  blush: '🌸',
  bronzer: '🔶',
  eyeshadow: '👁️',
  eyeliner: '✏️',
  mascara: '💫',
  lipstick: '💄',
  highlighter: '⭐',
  contour: '🔲'
};

// Product display names with formatting
const productNames: Record<string, string> = {
  foundation: 'Base',
  concealer: 'Corretivo',
  blush: 'Blush',
  bronzer: 'Bronzer',
  eyeshadow: 'Sombra',
  eyeliner: 'Delineador',
  mascara: 'Máscara',
  lipstick: 'Batom',
  highlighter: 'Iluminador',
  contour: 'Contorno'
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  product, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 p-3 bg-slate-700/50 rounded-full">
          <span className="text-2xl" role="img" aria-label={product.productType}>
            {productIcons[product.productType] || '🎨'}
          </span>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-1 text-white">
            {productNames[product.productType]}
          </h4>
          <h5 className="text-sm text-pink-400 mb-2 font-medium">
            {product.technique}
          </h5>
          <p className="text-sm text-slate-300">
            {product.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};