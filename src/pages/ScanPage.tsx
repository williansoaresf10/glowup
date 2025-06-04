import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import FaceScanner from '../components/scanner/FaceScanner';
import RecommendationsPanel from '../components/recommendations/RecommendationsPanel';
import { useAppStore } from '../lib/store';
import { requestCameraPermission } from '../lib/utils';
import { AlertCircle, Camera } from 'lucide-react';
import Button from '../components/ui/Button';

const ScanPage: React.FC = () => {
  const { scanStatus, setScanStatus, resetStore } = useAppStore();

  // Handle camera permission request
  useEffect(() => {
    if (scanStatus === 'requesting-permission') {
      const requestPermission = async () => {
        const hasPermission = await requestCameraPermission();
        
        if (hasPermission) {
          setScanStatus('preparing');
        } else {
          setScanStatus('permission-denied');
        }
      };
      
      requestPermission();
    }
  }, [scanStatus, setScanStatus]);

  // Reset scan
  const resetScan = () => {
    resetStore();
  };

  // Retry camera permission
  const retryPermission = () => {
    setScanStatus('requesting-permission');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Content for the scanning process */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Permission denied state */}
        {scanStatus === 'permission-denied' && (
          <div className="text-center p-8 glass-card">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
            <p className="mb-6">
              We need access to your camera to perform the facial analysis. Please allow camera access to continue.
            </p>
            <Button onClick={retryPermission} className="mx-auto" icon={<Camera className="w-5 h-5" />}>
              Grant Camera Access
            </Button>
          </div>
        )}

        {/* Scanning interface */}
        {['idle', 'preparing', 'scanning', 'processing'].includes(scanStatus) && (
          <FaceScanner />
        )}

        {/* Results interface */}
        {scanStatus === 'completed' && (
          <RecommendationsPanel />
        )}

        {/* Error state */}
        {scanStatus === 'error' && (
          <div className="text-center p-8 glass-card">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Something Went Wrong</h2>
            <p className="mb-6">
              We encountered an error during the facial analysis. Please try again.
            </p>
            <Button onClick={resetScan} className="mx-auto">
              Restart Analysis
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScanPage;