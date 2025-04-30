import React, { ReactNode, useState, useEffect } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { currentCity } = useCity();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-300 
    ${isScrolled 
      ? `${theme === 'light' ? 'bg-white/90 shadow-md' : 'bg-gray-900/90 shadow-md shadow-gray-800/20'} backdrop-blur-md` 
      : `${theme === 'light' ? 'bg-transparent' : 'bg-transparent'}`
    }
  `;

  return (
    <>
      <header className={headerClasses}>
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CITYPULSE
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stay in Sync with Your City
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="#weather" className="hover:text-blue-500 transition-colors flex items-center space-x-1">
                    <span>Weather</span>
                  </a>
                </li>
                <li>
                  <a href="#traffic" className="hover:text-blue-500 transition-colors flex items-center space-x-1">
                    <span>Traffic</span>
                  </a>
                </li>
                <li>
                  <a href="#events" className="hover:text-blue-500 transition-colors flex items-center space-x-1">
                    <span>Events</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div className="flex items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30">
              <MapPin size={16} className="text-blue-500 mr-1.5" />
              <span className="font-medium text-sm">{currentCity.name}</span>
            </div>
            {children}
          </div>
          
          <button 
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className={`fixed inset-y-0 right-0 w-64 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-lg transform transition-transform duration-300 ease-in-out`}>
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <a 
                    href="#weather" 
                    className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Weather
                  </a>
                </li>
                <li>
                  <a 
                    href="#traffic" 
                    className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Traffic
                  </a>
                </li>
                <li>
                  <a 
                    href="#events" 
                    className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Events
                  </a>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <MapPin size={18} className="text-blue-500 mr-2" />
                <span className="font-medium">{currentCity.name}</span>
              </div>
              <div>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;