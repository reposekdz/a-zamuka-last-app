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
  className?: string;
  onClick?: () => void;
}> = ({ icon, label, className = '', onClick }) => (
  <button onClick={onClick} className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 text-center text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${className}`}>
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);


const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const userName = "Umutoni";
  const totalBalance = 225000;
  const totalLoan = 100000;
  const loanPaid = 25000;
  const loanProgress = (loanPaid / totalLoan) * 100;


  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-rw-blue via-rw-green to-rw-yellow text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
        <p className="text-lg font-light">Murakaza neza, {userName}</p>
        <p className="text-sm font-light opacity-80 mt-2">Amafaranga yawe yose</p>
        <p className="text-4xl lg:text-5xl font-extrabold tracking-tight mt-1">{totalBalance.toLocaleString('fr-FR')} RWF</p>
      </Card>
      
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Ibikorwa byihuse</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickActionButton icon={<ArrowUpRightIcon className="w-7 h-7" />} label="Bika" className="bg-rw-green" />
            <QuickActionButton icon={<BanknotesIcon className="w-7 h-7" />} label="Saba Inguzanyo" className="bg-rw-blue" />
            <QuickActionButton icon={<PaperAirplaneIcon className="w-7 h-7" />} label="Ohereza" className="bg-rw-yellow text-slate-800" />
            <QuickActionButton icon={<ArrowDownLeftIcon className="w-7 h-7" />} label="Bikuza" className="bg-slate-700" />
        </div>
      </div>

      <div className="space-y-4">
        <Card onClick={() => setActivePage(Page.Saving)} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="bg-rw-green/10 p-3 rounded-full"><PiggyBankIcon className="w-6 h-6 text-rw-green"/></div>
                <div>
                    <h3 className="font-bold text-slate-800">Ubwizigame</h3>
                    <p className="text-slate-500 font-medium">150,000 RWF</p>
                </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-slate-400" />
        </Card>
        <Card onClick={() => setActivePage(Page.Loan)} className="flex flex-col">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                    <div className="bg-rw-blue/10 p-3 rounded-full"><LoanIcon className="w-6 h-6 text-rw-blue"/></div>
                    <div>
                        <h3 className="font-bold text-slate-800">Inguzanyo</h3>
                        <p className="text-slate-500 font-medium">75,000 RWF Asigaye</p>
                    </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </div>
             <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Yishyuwe</span>
                    <span>{loanProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-rw-blue h-1.5 rounded-full" style={{width: `${loanProgress}%`}}></div></div>
            </div>
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