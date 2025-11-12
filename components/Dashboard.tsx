import React from 'react';
import Card from './Card';
import { Page, Transaction } from '../types';
import { ArrowUpRightIcon, ArrowDownLeftIcon, BanknotesIcon, PaperAirplaneIcon, ChevronRightIcon, PiggyBankIcon, LoanIcon, UsersIcon } from './Icons';

interface DashboardProps {
  setActivePage: (page: Page) => void;
}

const mockRecentTransactions: Transaction[] = [
  { id: 1, type: 'deposit', description: 'Kuzigama kw\'ukwezi', amount: 50000, date: '1 Kanama, 2024' },
  { id: 2, type: 'payment', description: 'Kwishyura inguzanyo', amount: -10000, date: '1 Kanama, 2024' },
  { id: 3, type: 'deposit', description: 'Umusanzu w\'ikimina', amount: 10000, date: '28 Nyakanga, 2024' },
  { id: 4, type: 'withdrawal', description: 'Kugura ibiribwa', amount: -25000, date: '25 Nyakanga, 2024' },
];

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center space-y-2 text-center text-slate-700 hover:text-rw-blue transition-colors">
    <div className="bg-slate-200 rounded-full p-4">
      {icon}
    </div>
    <span className="text-sm font-semibold">{label}</span>
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const userName = "Umutoni";
  const totalBalance = 225000;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-rw-blue to-sky-600 text-white shadow-lg">
        <p className="text-lg font-light">Murakaza neza, {userName}</p>
        <p className="text-sm font-light opacity-80 mt-2">Amafaranga yawe yose</p>
        <p className="text-4xl font-bold tracking-tight mt-1">{totalBalance.toLocaleString('fr-FR')} RWF</p>
      </Card>
      
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Ibikorwa byihuse</h2>
        <div className="grid grid-cols-4 gap-4">
            <QuickActionButton icon={<ArrowUpRightIcon className="w-6 h-6" />} label="Bika" />
            <QuickActionButton icon={<ArrowDownLeftIcon className="w-6 h-6" />} label="Bikuza" />
            <QuickActionButton icon={<BanknotesIcon className="w-6 h-6" />} label="Saba Inguzanyo" />
            <QuickActionButton icon={<PaperAirplaneIcon className="w-6 h-6" />} label="Ohereza" />
        </div>
      </div>

      <div className="space-y-4">
        <Card onClick={() => setActivePage(Page.Saving)} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="bg-rw-green/20 p-3 rounded-full"><PiggyBankIcon className="w-6 h-6 text-rw-green"/></div>
                <div>
                    <h3 className="font-bold text-slate-800">Ubwizigame</h3>
                    <p className="text-slate-500 font-medium">150,000 RWF</p>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-400" />
        </Card>
        <Card onClick={() => setActivePage(Page.Loan)} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="bg-rw-blue/20 p-3 rounded-full"><LoanIcon className="w-6 h-6 text-rw-blue"/></div>
                <div>
                    <h3 className="font-bold text-slate-800">Inguzanyo</h3>
                    <p className="text-slate-500 font-medium">75,000 RWF Asigaye</p>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-400" />
        </Card>
        <Card onClick={() => setActivePage(Page.Ikimina)} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                 <div className="bg-rw-yellow/20 p-3 rounded-full"><UsersIcon className="w-6 h-6 text-rw-yellow"/></div>
                <div>
                    <h3 className="font-bold text-slate-800">Ikimina</h3>
                    <p className="text-slate-500 font-medium">Amatsinda 2</p>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-400" />
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Ihererekanya rya Vuba</h3>
        <ul className="space-y-3">
          {mockRecentTransactions.map((tx) => (
            <li key={tx.id} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-slate-700">{tx.description}</p>
                <p className="text-sm text-slate-500">{tx.date}</p>
              </div>
              <p className={`font-bold ${tx.amount > 0 ? 'text-rw-green' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')} RWF
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
