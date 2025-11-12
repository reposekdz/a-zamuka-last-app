
import React from 'react';
import { Page } from '../types';
import { HomeIcon, PiggyBankIcon, LoanIcon, UsersIcon } from './Icons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  label: Page;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-rw-blue';
  const inactiveClasses = 'text-slate-500 hover:text-rw-blue';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/4 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { label: Page.Dashboard, icon: <HomeIcon className="w-6 h-6" /> },
    { label: Page.Saving, icon: <PiggyBankIcon className="w-6 h-6" /> },
    { label: Page.Loan, icon: <LoanIcon className="w-6 h-6" /> },
    { label: Page.Ikimina, icon: <UsersIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] h-16 flex justify-around items-center z-10 border-t border-slate-200">
      {navItems.map((item) => (
        <NavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          isActive={currentPage === item.label}
          onClick={() => setCurrentPage(item.label)}
        />
      ))}
    </nav>
  );
};

export default BottomNav;
