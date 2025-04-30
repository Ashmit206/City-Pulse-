import React from 'react';
import { Heart, Github as GitHub, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className={`mt-16 py-8 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold flex items-center">
              CityPulse
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time city information at your fingertips
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="GitHub">
              <GitHub size={20} />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-sm hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="text-sm hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="text-sm hover:text-blue-500 transition-colors">Cookies</a>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span>&copy; {year} CityPulse. Made with</span>
            <Heart size={14} className="mx-1 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;