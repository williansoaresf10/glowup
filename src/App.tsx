import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './lib/store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScanPage from './pages/ScanPage';

function App() {
  const { scanStatus } = useAppStore();
  const [showScanner, setShowScanner] = useState(false);

  // Determine whether to show scanner or home page
  useEffect(() => {
    if (scanStatus !== 'idle' || window.location.hash === '#scan') {
      setShowScanner(true);
    }
  }, [scanStatus]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {showScanner ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ScanPage />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Home />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;