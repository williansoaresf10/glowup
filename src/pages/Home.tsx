import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Cog, Heart, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAppStore } from '../lib/store';

const Home: React.FC = () => {
  const { setScanStatus } = useAppStore();
  
  const startScan = () => {
    setScanStatus('requesting-permission');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <Sparkles className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Descubra A Sua Make Perfeita</span>
        </h1>
        
        <p className="text-xl text-slate-300 mb-8">
        Usando tecnologia avançada de mapeamento facial 3D para criar recomendações de maquiagem personalizadas adaptadas às suas características únicas.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mb-12"
        >
          <Button 
            onClick={startScan} 
            size="lg"
            className="px-8 py-4 text-lg shadow-xl" 
            icon={<Camera className="w-5 h-5" />}
          >
            Iniciar Scan Facial
          </Button>
        </motion.div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon={<Camera className="h-8 w-8 text-pink-400" />}
            title="Análise Facial 3D"
            description="A inteligência artificial avançada escaneia a estrutura do seu rosto para compreender suas características únicas."
          />
          
          <FeatureCard 
            icon={<Cog className="h-8 w-8 text-violet-400" />}
            title="Recomendações Inteligentes"
            description="Obtenha técnicas de maquiagem personalizadas com base no formato do seu rosto e características."
          />
          
          <FeatureCard 
            icon={<Heart className="h-8 w-8 text-pink-400" />}
            title="Occasion-Specific"
            description="Diferentes recomendações de maquiagem para diferentes ocasiões e ambientes..."
          />
        </div>
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card text-center"
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      <p className="text-sm">{description}</p>
    </motion.div>
  );
};

export default Home;
