import React from 'react';
import { Twitter, Youtube, Github, Search } from 'lucide-react';
import type { View } from '../types/index';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const Logos: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => (
  <button
    onClick={() => onNavigate('home')}
    className="flex items-center gap-4 text-sm text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rio-primary rounded-md"
  >
    <div className="flex items-center gap-2 font-bold text-slate-800">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="4" fill="#002B7F" />
      </svg>
      PREFEITURA RIO
    </div>
    <span className="text-slate-300">|</span>
    <span>IplanRio</span>
  </button>
);

const SocialIcons = () => (
  <div className="flex items-center gap-4">
    <a
      href="https://x.com/IplanRio_rj"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-rio-primary"
      aria-label="Twitter"
    >
      <Twitter size={20} />
    </a>

    <a
      href="https://www.youtube.com/@iplanrio-empresamunicipald5095"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-rio-primary"
      aria-label="YouTube"
    >
      <Youtube size={20} />
    </a>
    <a
      href="https://github.com/prefeitura-rio"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-500 hover:text-rio-primary"
      aria-label="GitHub"
    >
      <Github size={20} />
    </a>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const navLinks: { name: string; view: View }[] = [
    { name: 'Home', view: 'home' },
    { name: 'Chat', view: 'chat' },
    { name: 'Open Source', view: 'opensource' },
    { name: 'Research', view: 'research' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logos onNavigate={onNavigate} />
          <SocialIcons />
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <li key={link.view}>
                    <button
                      onClick={() => onNavigate(link.view)}
                      className={`text-sm font-medium transition-colors duration-200 ${
                        currentView === link.view
                          ? 'text-rio-primary'
                          : 'text-prose hover:text-rio-primary'
                      }`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">
                Busca
              </label>
              <input
                id="search-input"
                type="search"
                placeholder="Busca"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm placeholder:text-slate-400 focus:border-rio-primary focus:outline-none focus:ring-1 focus:ring-rio-primary sm:w-56"
              />
              <Search
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
