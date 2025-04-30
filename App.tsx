import React from 'react';
import { Sun, Moon } from 'lucide-react';
import Header from './components/Header';
import CitySelector from './components/CitySelector';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { CityProvider } from './context/CityContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gray-50 text-gray-900' 
        : 'bg-gray-900 text-white'
    }`}>
      <Header>
        <button 
          onClick={toggleTheme} 
          className={`p-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              : 'hover:bg-gray-800 text-gray-400 hover:text-white'
          }`}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </Header>
      <main className="container mx-auto px-4 py-8">
        <CitySelector />
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CityProvider>
        <AppContent />
      </CityProvider>
    </ThemeProvider>
  );
}

export default App;