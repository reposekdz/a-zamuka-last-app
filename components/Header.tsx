import React from 'react';
import { SunIcon, BellIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-rw-blue text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SunIcon className="w-8 h-8 text-rw-yellow" />
          <h1 className="text-2xl font-bold tracking-wider">Zamuka</h1>
        </div>
        <div className="flex items-center space-x-4">
            <button className="relative text-white hover:text-rw-yellow transition-colors">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-rw-blue"></span>
            </button>
            <img 
                src="https://picsum.photos/id/1011/100/100" 
                alt="User Avatar" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
        </div>
      </div>
    </header>
  );
};

export default Header;