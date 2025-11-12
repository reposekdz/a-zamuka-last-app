import React, { useState } from 'react';
import { Transaction } from '../types';
import Card from './Card';
import { ArrowUpRightIcon, ArrowDownLeftIcon, CheckCircleIcon, SpinnerIcon, ExclamationTriangleIcon, TrophyIcon, PlusIcon, LockClosedIcon, ClockIcon } from './Icons';

// --- NEW DATA STRUCTURES ---
interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  lockedUntil?: string; // ISO Date string e.g., "2025-12-31"
}

interface ScheduledWithdrawal {
    id: number;
    amount: number;
    date: string; // ISO Date string
}

type ModalState = 'idle' | 'confirming' | 'processing' | 'success';
type SavingsTab = 'general' | 'goals' | 'schedule';
type DepositContext = { type: 'general' } | { type: 'goal', goalId: number, goalName: string };


const mockTransactions: Transaction[] = [
  { id: 1, type: 'deposit', description: 'Kuzigama kw\'ukwezi', amount: 50000, date: '1 Kanama, 2024' },
  { id: 2, type: 'deposit', description: 'Ubwizigame bw\'intego', amount: 25000, date: '28 Nyakanga, 2024' },
  { id: 3, type: 'withdrawal', description: 'Kugura ibikoresho', amount: -20000, date: '15 Kamena, 2024' },
];

const mockGoals: SavingsGoal[] = [
    { id: 1, name: 'Kugura moto', targetAmount: 1500000, currentAmount: 450000, lockedUntil: '2025-12-31' },
    { id: 2, name: 'Amafaranga y\'ishuri', targetAmount: 800000, currentAmount: 600000 },
];

const PENALTY_RATE = 0.02; // 2% penalty for early withdrawal

// --- MODAL COMPONENTS ---
const AddGoalModal: React.FC<{
    onClose: () => void;
    onAddGoal: (name: string, targetAmount: number, lockedUntil?: string) => void;
}> = ({ onClose, onAddGoal }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [lockedUntil, setLockedUntil] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const amount = Number(targetAmount);
        if (!name.trim() || isNaN(amount) || amount <= 0) {
            setError('Uzuza imyanya yose neza.');
            return;
        }
        onAddGoal(name, amount, lockedUntil || undefined);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Ongeraho Intego Nshya</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="goal-name" className="block text-sm font-medium text-slate-700">Izina ry'intego</label>
                        <input type="text" id="goal-name" value={name} onChange={e => setName(e.target.value)} placeholder="Urugero: Kugura telefone" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="goal-target" className="block text-sm font-medium text-slate-700">Intego (RWF)</label>
                        <input type="number" id="goal-target" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0 RWF" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="goal-lock" className="block text-sm font-medium text-slate-700">Funga kugeza (Ntago itegetswe)</label>
                        <input type="date" id="goal-lock" value={lockedUntil} onChange={e => setLockedUntil(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" min={new Date().toISOString().split("T")[0]}/>
                    </div>
                    {error && <p className="text-xs text-red-600 flex items-center"><ExclamationTriangleIcon className="w-4 h-4 mr-1"/>{error}</p>}
                </div>
                <div className="mt-6 space-y-2">
                    <button onClick={handleSubmit} className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">Ongeraho Intego</button>
                    <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg">Subika</button>
                </div>
            </div>
        </div>
    );
};

const DepositModal: React.FC<{
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
  modalState: ModalState;
  context: DepositContext | null;
}> = ({ amount, onClose, onConfirm, modalState, context }) => {
  const goalName = context?.type === 'goal' ? context.goalName : '';
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
        {modalState === 'confirming' && (
          <>
            <h3 className="text-lg font-bold text-slate-800">Emeza Kubitsa</h3>
            <p className="text-slate-600 my-4">Ugiye kubitsa <span className="font-bold">{amount.toLocaleString('fr-FR')} RWF</span> {goalName ? `mu ntego yawe "${goalName}"` : 'kuri konti yawe rusange'}. Kanda 'Emeza' maze urebe kuri telefone yawe.</p>
            <div className="space-y-2">
              <button onClick={onConfirm} className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">Emeza</button>
              <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg">Subika</button>
            </div>
          </>
        )}
        {modalState === 'processing' && (
          <>
            <SpinnerIcon className="w-12 h-12 text-rw-blue animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 mt-4">Gutegereza ubwishyu...</h3>
          </>
        )}
        {modalState === 'success' && (
          <>
            <CheckCircleIcon className="w-16 h-16 text-rw-green mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 mt-4">Byakunze!</h3>
            <p className="text-slate-600 my-2">Wabikije {amount.toLocaleString('fr-FR')} RWF neza.</p>
            <button onClick={onClose} className="w-full bg-rw-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4">OK</button>
          </>
        )}
      </div>
    </div>
  );
};

const PenaltyModal: React.FC<{
    goal: SavingsGoal;
    withdrawalAmount: number;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ goal, withdrawalAmount, onClose, onConfirm }) => {
    const penaltyAmount = withdrawalAmount * PENALTY_RATE;
    const netAmount = withdrawalAmount - penaltyAmount;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800 mt-4">Uburira bw'Igihano</h3>
                <p className="text-slate-600 my-4">Intego yawe <span className="font-bold">"{goal.name}"</span> ifite igihano ku kubikuza mbere y'igihe.</p>
                <div className="text-left bg-slate-100 p-3 rounded-lg space-y-1 text-sm">
                    <p>Amafaranga ubikuza: <span className="font-semibold float-right">{withdrawalAmount.toLocaleString('fr-FR')} RWF</span></p>
                    <p className="text-red-600">Igihano (2%): <span className="font-semibold float-right">-{penaltyAmount.toLocaleString('fr-FR')} RWF</span></p>
                    <hr className="my-1 border-slate-300"/>
                    <p>Uzakira: <span className="font-bold text-lg float-right">{netAmount.toLocaleString('fr-FR')} RWF</span></p>
                </div>
                <div className="mt-6 space-y-2">
                    <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Komeza n'Igihano</button>
                    <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg">Subika</button>
                </div>
            </div>
        </div>
    );
};


const Saving: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState(150000);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activeTab, setActiveTab] = useState<SavingsTab>('goals');
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositModalState, setDepositModalState] = useState<ModalState>('idle');
  const [depositContext, setDepositContext] = useState<DepositContext | null>(null);
  
  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  // --- NEW FEATURES STATE ---
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(mockGoals);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [scheduledWithdrawals, setScheduledWithdrawals] = useState<ScheduledWithdrawal[]>([]);
  const [scheduleAmount, setScheduleAmount] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  // State for penalty modal
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyContext, setPenaltyContext] = useState<{goal: SavingsGoal, amount: number} | null>(null);

  const totalSavings = currentBalance + savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(depositAmount) > 0) {
      setDepositContext({ type: 'general' });
      setDepositModalState('confirming');
      setShowDepositModal(true);
    }
  };

  const handleDepositToGoal = (goal: SavingsGoal) => {
    const amountStr = prompt(`Andika umubare ushaka kubitsa kuri "${goal.name}":`, '');
    const amount = Number(amountStr);
    if(amount > 0) {
        setDepositAmount(String(amount));
        setDepositContext({ type: 'goal', goalId: goal.id, goalName: goal.name });
        setDepositModalState('confirming');
        setShowDepositModal(true);
    }
  };

  const handleConfirmDeposit = () => {
    setDepositModalState('processing');
    setTimeout(() => {
      const amount = Number(depositAmount);
      let description = 'Kubitsa kuri Mobile Money';

      if(depositContext?.type === 'goal') {
        description = `Kubitsa mu ntego "${depositContext.goalName}"`;
        setSavingsGoals(prev => prev.map(g => 
            g.id === depositContext.goalId ? {...g, currentAmount: g.currentAmount + amount} : g
        ));
      } else {
        setCurrentBalance(prev => prev + amount);
      }

      const newTransaction: Transaction = {
        id: Math.random(),
        type: 'deposit',
        description,
        amount: amount,
        date: new Date().toLocaleDateString('fr-CA')
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setDepositModalState('success');
    }, 2500);
  };

  const handleCloseModal = () => {
      setShowDepositModal(false);
      setDepositAmount('');
      setDepositContext(null);
      setTimeout(() => setDepositModalState('idle'), 300);
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(''); setWithdrawSuccess('');
    const amount = Number(withdrawAmount);
    if (amount <= 0 || isNaN(amount)) {
        setWithdrawError('Shyiramo umubare usobanutse.'); return;
    }
    if (amount > currentBalance) {
        setWithdrawError('Amafaranga ari kuri konti yawe ntahagije.'); return;
    }
    setCurrentBalance(prev => prev - amount);
    const newTransaction: Transaction = {
        id: Math.random(), type: 'withdrawal', description: 'Kubikuza kuri Mobile Money', amount: -amount, date: new Date().toLocaleDateString('fr-CA')
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setWithdrawSuccess(`Wabikuje ${amount.toLocaleString('fr-FR')} RWF neza.`);
    setWithdrawAmount('');
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setScheduleError('');
      const amount = Number(scheduleAmount);
      if (amount <= 0 || isNaN(amount) || !scheduleDate) {
          setScheduleError('Uzuza imyanya yose neza.'); return;
      }
      if (new Date(scheduleDate) <= new Date()){
          setScheduleError('Itariki igomba kuba iri imbere.'); return;
      }
      if (amount > totalSavings) { // Check against total savings
          setScheduleError('Amafaranga yose hamwe ntabwo ahagije.'); return;
      }
      const newSchedule: ScheduledWithdrawal = { id: Math.random(), amount, date: scheduleDate };
      setScheduledWithdrawals(prev => [...prev, newSchedule]);
      setScheduleAmount(''); setScheduleDate('');
  };

  const handleWithdrawFromGoal = (goal: SavingsGoal) => {
    const amountStr = prompt(`Andika umubare ushaka kubikuza kuri "${goal.name}":`, '');
    const amount = Number(amountStr);

    if (amount <= 0 || isNaN(amount) || amount > goal.currentAmount) {
        alert("Shyiramo umubare usobanutse kandi udahwanye n'ari mu ntego."); return;
    }
    processGoalWithdrawal(goal.id, amount);
  };

  const processGoalWithdrawal = (goalId: number, amount: number, penalty: number = 0) => {
    setSavingsGoals(prevGoals => prevGoals.map(g => 
        g.id === goalId ? {...g, currentAmount: g.currentAmount - amount} : g
    ));
    const netAmount = amount - penalty;
    
    // Add withdrawn amount back to general balance
    setCurrentBalance(prev => prev + netAmount);

    const newTransaction: Transaction = {
        id: Math.random(), type: 'withdrawal', description: `Kubikuza mu ntego "${savingsGoals.find(g=>g.id===goalId)?.name}"`, amount: -amount, date: new Date().toLocaleDateString('fr-CA')
    };
     const depositToGeneralTransaction: Transaction = {
        id: Math.random(), type: 'deposit', description: 'Kwimurira kuri konti rusange', amount: netAmount, date: new Date().toLocaleDateString('fr-CA')
    };
    
    setTransactions(prev => [newTransaction, depositToGeneralTransaction, ...prev]);
    setShowPenaltyModal(false);
    setPenaltyContext(null);
  }

  const handleAddGoal = (name: string, targetAmount: number, lockedUntil?: string) => {
    const newGoal: SavingsGoal = {
        id: Math.random(),
        name,
        targetAmount,
        currentAmount: 0,
        lockedUntil,
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    setShowAddGoalModal(false);
  };

  return (
    <div className="space-y-6">
      <Card className="text-center bg-rw-green text-white">
        <p className="text-lg font-semibold opacity-80">Ubwizigame bwawe bwose</p>
        <p className="text-4xl font-bold tracking-tight mt-1">{totalSavings.toLocaleString('fr-FR')} RWF</p>
      </Card>
      
      <Card>
        <div className="flex border-b border-slate-200 mb-4">
            <button onClick={() => setActiveTab('goals')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'goals' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}>Intego z'Ubwizigame</button>
            <button onClick={() => setActiveTab('general')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'general' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}>Rusange</button>
            <button onClick={() => setActiveTab('schedule')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'schedule' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}>Gena Ububikure</button>
        </div>

        {activeTab === 'general' && (
             <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Bika Amafaranga</h3>
                    <form className="space-y-4" onSubmit={handleDepositSubmit}>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Umubare</label>
                            <input type="number" id="amount" placeholder="0 RWF" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" required/>
                        </div>
                        <button type="submit" className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2"><ArrowUpRightIcon className="w-5 h-5"/><span>Bika</span></button>
                    </form>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Bikuza Amafaranga</h3>
                    <form className="space-y-4" onSubmit={handleWithdrawSubmit}>
                        <div>
                            <label htmlFor="withdraw-amount" className="block text-sm font-medium text-slate-700">Umubare</label>
                            <input type="number" id="withdraw-amount" placeholder="0 RWF" value={withdrawAmount} onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(''); setWithdrawSuccess(''); }} className={`mt-1 block w-full px-3 py-2 bg-white border ${withdrawError ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm`} required/>
                            {withdrawError && <p className="mt-1 text-xs text-red-600 flex items-center"><ExclamationTriangleIcon className="w-4 h-4 mr-1" />{withdrawError}</p>}
                        </div>
                        <button type="submit" className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2"><ArrowDownLeftIcon className="w-5 h-5"/><span>Bikuza</span></button>
                        {withdrawSuccess && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-lg flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2" />{withdrawSuccess}</p>}
                    </form>
                </div>
            </div>
        )}
        
        {activeTab === 'goals' && (
            <div className="animate-fade-in-up space-y-4">
                <button onClick={() => setShowAddGoalModal(true)} className="w-full bg-rw-blue/10 text-rw-blue font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-rw-blue/20"><PlusIcon className="w-5 h-5"/><span>Ongeraho Intego Nshya</span></button>
                {savingsGoals.map(goal => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    const isLocked = goal.lockedUntil && new Date(goal.lockedUntil) > new Date();
                    return (
                        <Card key={goal.id} className="border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-bold text-slate-800">{goal.name}</h4>
                                        {isLocked && <LockClosedIcon className="w-4 h-4 text-slate-500" title={`Ifunze kugeza ${new Date(goal.lockedUntil!).toLocaleDateString('fr-CA')}`}/>}
                                    </div>
                                    <p className="text-sm text-slate-500">Intego: {goal.targetAmount.toLocaleString('fr-FR')} RWF</p>
                                </div>
                                <p className="font-bold text-rw-blue">{goal.currentAmount.toLocaleString('fr-FR')} RWF</p>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-rw-green h-2.5 rounded-full" style={{width: `${progress}%`}}></div></div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                  className={`flex-1 text-sm font-semibold py-1.5 px-3 rounded-md flex items-center justify-center space-x-1.5 ${isLocked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                  onClick={() => !isLocked && handleWithdrawFromGoal(goal)}
                                  disabled={isLocked}
                                  title={isLocked ? `Iyi ntego ifunze kugeza ${new Date(goal.lockedUntil!).toLocaleDateString('fr-CA')}` : 'Bikuza kuri iyi ntego'}
                                >
                                    {isLocked && <LockClosedIcon className="w-4 h-4"/>}
                                    <span>Bikuza</span>
                                </button>
                                <button onClick={() => handleDepositToGoal(goal)} className="flex-1 text-sm bg-rw-green text-white font-semibold py-1.5 px-3 rounded-md hover:bg-green-700">Bitsa</button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        )}

        {activeTab === 'schedule' && (
            <div className="animate-fade-in-up">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Gena igihe cyo kubikuza</h3>
                 <form className="space-y-4 p-4 border rounded-lg bg-slate-50" onSubmit={handleScheduleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="schedule-amount" className="block text-sm font-medium text-slate-700">Umubare</label>
                             <input type="number" id="schedule-amount" placeholder="0 RWF" value={scheduleAmount} onChange={e => setScheduleAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="schedule-date" className="block text-sm font-medium text-slate-700">Itariki</label>
                            <input type="date" id="schedule-date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" min={new Date().toISOString().split("T")[0]}/>
                        </div>
                    </div>
                    {scheduleError && <p className="text-xs text-red-600"><ExclamationTriangleIcon className="w-4 h-4 inline mr-1"/>{scheduleError}</p>}
                    <button type="submit" className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">Emeza Gahunda</button>
                </form>
                <div className="mt-6">
                    <h4 className="font-bold text-slate-700 mb-2">Ububikure buteganijwe</h4>
                    {scheduledWithdrawals.length > 0 ? (
                        <ul className="space-y-2">
                        {scheduledWithdrawals.map(sw => (
                             <li key={sw.id} className="flex justify-between items-center p-3 bg-slate-100 rounded-md">
                                <div>
                                    <p className="font-bold text-slate-800">{sw.amount.toLocaleString('fr-FR')} RWF</p>
                                    <p className="text-sm text-slate-500 flex items-center"><ClockIcon className="w-4 h-4 mr-1"/>{new Date(sw.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <button className="text-xs text-red-600 font-semibold" onClick={() => setScheduledWithdrawals(prev => prev.filter(item => item.id !== sw.id))}>Kura</button>
                            </li>
                        ))}
                        </ul>
                    ) : <p className="text-center text-slate-500 py-4">Nta bubikure buteganijwe.</p>}
                </div>
            </div>
        )}

      </Card>
      
      {showAddGoalModal && <AddGoalModal onClose={() => setShowAddGoalModal(false)} onAddGoal={handleAddGoal} />}
      {showDepositModal && <DepositModal amount={Number(depositAmount)} modalState={depositModalState} onClose={handleCloseModal} onConfirm={handleConfirmDeposit} context={depositContext}/>}
      {showPenaltyModal && penaltyContext && (
        <PenaltyModal 
            goal={penaltyContext.goal} 
            withdrawalAmount={penaltyContext.amount}
            onClose={() => setShowPenaltyModal(false)}
            onConfirm={() => processGoalWithdrawal(penaltyContext.goal.id, penaltyContext.amount, penaltyContext.amount * PENALTY_RATE)}
        />
      )}

      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Amateka y'Ihererekanya</h3>
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-slate-700">{tx.description}</p>
                <p className="text-sm text-slate-500">{new Date(tx.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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

export default Saving;