import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../lib/store';
import { OccasionSelector } from './OccasionSelector';
import { RecommendationCard } from './RecommendationCard';
import Button from '../ui/Button';
import { RefreshCw } from 'lucide-react';

const RecommendationsPanel: React.FC = () => {
  const { recommendations, selectedOccasion, setSelectedOccasion, resetStore } = useAppStore();
  
  if (!recommendations) return null;
  
  // Find selected recommendation or default to first one
  const selectedRec = recommendations.find(rec => rec.occasion === selectedOccasion) || recommendations[0];
  
  // Start new scan
  const startNewScan = () => {
    resetStore();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="gradient-text text-3xl font-bold mb-2">Seu Perfil de Maquiagem Personalizado</h2>
        <p className="text-slate-300 max-w-xl mx-auto">
          Com base nas características únicas do seu rosto, criamos recomendações de maquiagem personalizadas
          para diferentes ocasiões.
        </p>
      </div>
      
      {/* Occasion selector */}
      <OccasionSelector 
        recommendations={recommendations}
        selectedOccasion={selectedOccasion || recommendations[0].occasion} 
        onSelect={setSelectedOccasion}
      />
      
      {/* Selected occasion details */}
      <motion.div
        key={selectedRec.occasion}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-8"
      >
        <div className="glass-card mb-6">
          <h3 className="text-2xl font-bold mb-2">{selectedRec.title}</h3>
          <p className="text-slate-300">{selectedRec.description}</p>
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {selectedRec.products.map((product, index) => (
            <RecommendationCard 
              key={`${selectedRec.occasion}-${product.productType}`}
              product={product}
              index={index}
            />
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={startNewScan}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Start New Scan
          </Button>
          
          <Button variant="secondary">
            Save Recommendations
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationsPanel;