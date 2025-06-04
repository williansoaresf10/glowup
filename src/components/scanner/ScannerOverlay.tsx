import React from 'react';
import { motion } from 'framer-motion';

interface ScannerOverlayProps {
  isScanning: boolean;
  faceDetected: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isScanning, faceDetected }) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Fundo com grid do scanner */}
      <div className="scanner-grid" />

      {/* Contorno do rosto – aparece apenas quando o rosto não é detectado */}
      {!faceDetected && isScanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.svg
            width="180"
            height="240"
            viewBox="0 0 180 240"
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ellipse
              cx="90"
              cy="120"
              rx="70"
              ry="100"
              className="face-outline"
              strokeDasharray="8 4"
            />
          </motion.svg>
        </div>
      )}

      {/* Efeito de escaneamento */}
      {isScanning && (
        <motion.div 
          className="scan-animation"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: ["0%", "100%", "0%"], opacity: 1 }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* Marcadores de canto */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-pink-500 opacity-70" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-pink-500 opacity-70" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-pink-500 opacity-70" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-pink-500 opacity-70" />

      {/* Indicador de status */}
      <div className="absolute bottom-4 left-4">
        {isScanning && (
          <div className="flex items-center space-x-2 bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className={`h-2.5 w-2.5 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
            <span className="text-sm text-slate-200">
              {faceDetected ? 'Rosto detectado' : 'Posicione o rosto'}
            </span>
          </div>
        )}
      </div>

      {/* Sobreposição de gradiente radial */}
      <div className="scanner-overlay" />
    </div>
  );
};
