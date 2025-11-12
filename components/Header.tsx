import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, BellIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, CheckCircleIcon, BanknotesIcon } from './Icons';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
      { id: 1, icon: <CheckCircleIcon className="w-5 h-5 text-rw-green"/>, text: "Wabikije 50,000 RWF neza.", time: "5 min ishize" },
      { id: 2, icon: <BanknotesIcon className="w-5 h-5 text-rw-blue"/>, text: "Igihe cyo kwishyura inguzanyo cyawe cyegereje.", time: "amasaha 2 ashize" },
  ];

  return (
    <header className="bg-gradient-to-r from-rw-blue to-sky-700 text-white shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SunIcon className="w-8 h-8 text-rw-yellow" />
          <h1 className="text-2xl font-bold tracking-wider">Zamuka</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <div ref={notificationsRef} className="relative">
                <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative text-white hover:text-rw-yellow transition-colors p-2 rounded-full hover:bg-white/10"
                >
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-rw-blue"></span>
                </button>
                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl text-slate-800 border border-slate-200 origin-top-right transition-all duration-300 ease-in-out transform opacity-100 scale-100 animate-fade-in-up">
                       <div className="p-3 border-b border-slate-200">
                           <h4 className="font-semibold">Ibimenyetso</h4>
                       </div>
                       <ul className="py-2 max-h-80 overflow-y-auto">
                           {notifications.map(n => (
                               <li key={n.id} className="flex items-start space-x-3 px-3 py-2.5 hover:bg-slate-50">
                                   <div className="flex-shrink-0 mt-0.5">{n.icon}</div>
                                   <div>
                                       <p className="text-sm">{n.text}</p>
                                       <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                                   </div>
                               </li>
                           ))}
                       </ul>
                        <div className="p-2 border-t border-slate-200">
                            <button className="w-full text-center text-sm font-semibold text-rw-blue hover:bg-rw-blue/10 py-1.5 rounded-md">Reba byose</button>
                        </div>
                    </div>
                )}
            </div>
            
            <div ref={profileRef} className="relative">
                 <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
                    <img 
                        src="https://picsum.photos/id/1011/100/100" 
                        alt="User Avatar" 
                        className="w-9 h-9 rounded-full object-cover border-2 border-white/80 hover:border-white transition"
                    />
                 </button>
                 {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 origin-top-right transition-all duration-300 ease-in-out transform opacity-100 scale-100 animate-fade-in-up">
                        <div className="px-4 py-3 border-b border-slate-200">
                            <p className="text-sm font-semibold text-slate-800">Umutoni Keza</p>
                            <p className="text-xs text-slate-500 truncate">umutoni.keza@example.com</p>
                        </div>
                        <ul className="py-2">
                            <li><a href="#" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><Cog6ToothIcon className="w-5 h-5 mr-3 text-slate-500"/>Igenamiterere</a></li>
                            <li><button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-slate-500"/>Sohoka</button></li>
                        </ul>
                    </div>
                 )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;