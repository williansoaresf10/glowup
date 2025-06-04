import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Results } from '@mediapipe/face_mesh';
import { useAppStore } from '../../lib/store';
import { initFaceDetection, drawFaceMesh } from '../../lib/faceAnalysis/faceDetection';
import { FacialFeatures } from '../../types';
import { generateRecommendations } from '../../lib/recommendations/makeupRecommendations';
import { ScannerOverlay } from './ScannerOverlay';
import { Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

const FaceScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Preparing scanner...');
  const [faceDetected, setFaceDetected] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const { 
    scanStatus, 
    setScanStatus,
    setFacialFeatures,
    setRecommendations
  } = useAppStore();

  // Reset scanner state when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize scanner when status changes to 'preparing'
  useEffect(() => {
    if (scanStatus === 'preparing' && !isInitialized) {
      initializeScanner();
    }
  }, [scanStatus, isInitialized]);

  // Simulate scan progress
  useEffect(() => {
    if (scanStatus === 'scanning') {
      let timer: NodeJS.Timeout;
      let progress = 0;
      
      const simulateProgress = () => {
        progress += 1;
        
        // Update messages based on progress
        if (progress === 20) {
          setScanMessage('Analisando o formato do rosto...');
        } else if (progress === 40) {
          setScanMessage('Detectando pontos faciais...');
        } else if (progress === 60) {
          setScanMessage('Medindo proporções faciais...');
        } else if (progress === 80) {
          setScanMessage('Preparando recomendações...');
        }
        
        setScanProgress(progress);
        
        if (progress >= 100) {
          clearInterval(timer);
          setScanMessage('Análise completa!');
          
          // Complete scan after a short delay
          setTimeout(() => {
            setScanStatus('processing');
            
            // Process results and move to completed state
            setTimeout(() => {
              setScanStatus('completed');
            }, 1000);
          }, 500);
        }
      };
      
      timer = setInterval(simulateProgress, 100);
      return () => clearInterval(timer);
    }
  }, [scanStatus, setScanStatus]);

  // Initialize scanner and set up face detection
  const initializeScanner = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      // Set up camera stream with selected facing mode
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => resolve();
        }
      });
      
      if (videoRef.current) {
        videoRef.current.play();
      }
      
      // Initialize face detection
      const { startDetection, stopDetection } = initFaceDetection(
        videoRef.current,
        canvasRef.current,
        handleResults,
        handleFeaturesDetected
      );
      
      startDetection();
      setIsInitialized(true);
      setScanStatus('scanning');
      
      // Return cleanup function
      return () => {
        stopDetection();
        
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    } catch (error) {
      console.error('Error initializing scanner:', error);
      setScanStatus('error');
    }
  };

  // Handle face mesh results
  const handleResults = (results: Results) => {
    if (!canvasRef.current) return;
    
    // Draw face mesh on canvas
    drawFaceMesh(results, canvasRef.current);
    
    // Check if a face is detected
    const isFaceDetected = results.multiFaceLandmarks.length > 0;
    setFaceDetected(isFaceDetected);
    
    if (!isFaceDetected && scanStatus === 'scanning') {
      setScanMessage('Posicione seu rosto no quadro...');
    }
  };

  // Handle facial features detection
  const handleFeaturesDetected = (features: FacialFeatures) => {
    // Set facial features in store
    setFacialFeatures(features);
    
    // Generate recommendations based on features
    const recommendations = generateRecommendations(features);
    setRecommendations(recommendations);
  };

  // Switch camera between front and back
  const switchCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Stop current stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Reinitialize with new facing mode
    setIsInitialized(false);
    setTimeout(initializeScanner, 300);
  };

  // Start scanning process
  const startScan = () => {
    setScanStatus('preparing');
  };

  // Retry scan after error
  const retryScan = () => {
    setIsInitialized(false);
    setScanStatus('idle');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Status messages and controls */}
      <div className="mb-4 text-center">
        {scanStatus === 'idle' && (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-lg text-slate-300">
              Pronto para analisar seu rosto e receber recomendações personalizadas de maquiagem
            </p>
            <Button 
              onClick={startScan} 
              className="w-full max-w-sm"
              icon={<Camera className="w-5 h-5" />}
            >
              Iniciar escaneamento facial
            </Button>
          </div>
        )}
        
        {scanStatus === 'error' && (
          <div className="text-center p-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <h3 className="text-xl font-medium mb-2">Erro no escaneamento</h3>
            <p className="text-slate-300 mb-4">
              Não foi possível acessar sua câmera ou concluir o escaneamento. Verifique as permissões da câmera e tente novamente.
            </p>
            <Button onClick={retryScan} className="mx-auto">
              Tentar novamente
            </Button>
          </div>
        )}
        
        {['preparing', 'scanning', 'processing'].includes(scanStatus) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h3 className="text-xl font-medium mb-2 gradient-text">
              {scanStatus === 'processing' ? 'Processando resultados' : 'Análise facial em andamento'}
            </h3>
            <p className="text-slate-300">{scanMessage}</p>
            
            {scanStatus === 'scanning' && (
              <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                  style={{ width: `${scanProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
            
            {scanStatus === 'processing' && (
              <div className="flex justify-center mt-4">
                <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </motion.div>
        )}
        
        {scanStatus === 'completed' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <h3 className="text-xl font-medium mb-1 gradient-text">Análise completa!</h3>
            <p className="text-slate-300">
              Criamos recomendações personalizadas de maquiagem com base nas características únicas do seu rosto.
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Scanner interface */}
      {['preparing', 'scanning'].includes(scanStatus) && (
        <div className="scanner-container">
          {/* Video element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Canvas for drawing face mesh */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover z-10 mix-blend-screen"
          />
          
          {/* Scanner animation overlay */}
          <ScannerOverlay isScanning={scanStatus === 'scanning'} faceDetected={faceDetected} />
          
          {/* Camera controls */}
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={switchCamera}
              className="bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceScanner;