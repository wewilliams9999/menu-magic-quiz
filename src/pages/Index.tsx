
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuizContainer from '@/components/QuizContainer';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOGY4ZjgiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48cGF0aCBkPSJNMTIgMTJoNnY2aC02di02em02IDZoNnY2aC02di02em0tNiA2aDZ2NmgtNnYtNnptNiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 dark:opacity-10"></div>

      {/* Header */}
      <header className="w-full py-6 px-4 backdrop-blur-sm border-b border-nashville-100 dark:border-nashville-800">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold">Nash<span className="text-nashville-accent">Menus</span></span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 container mx-auto flex items-center justify-center">
        <QuizContainer />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-nashville-100 dark:border-nashville-800">
        <div className="container mx-auto">
          <div className="text-center text-sm text-nashville-500">
            <p>© {new Date().getFullYear()} NashMenus. Find your perfect Nashville dining experience.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
