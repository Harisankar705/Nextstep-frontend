import { motion } from 'framer-motion';
import { Ghost, Home } from 'lucide-react';

export const PageNotFound=()=> {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Ghost className="w-24 h-24 mx-auto text-purple-500" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          404
        </motion.h1>
        
        <motion.p
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400 mb-8"
        >
          Oops! The page you're looking for has vanished into the digital void.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            Return Home
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <p className="text-gray-400">
                Lost? Don't worry, our ghost friend will guide you back home.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
