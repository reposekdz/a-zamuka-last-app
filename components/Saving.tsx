import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import Card from './Card';
import { ArrowUpRightIcon, ArrowDownLeftIcon, CheckCircleIcon, SpinnerIcon, ExclamationTriangleIcon, PhoneIcon } from './Icons';

const mockTransactions: Transaction[] = [
  { id: 1, type: 'deposit', description: 'Kuzigama kw\'ukwezi', amount: 50000, date: '1 Kanama, 2024' },
  { id: 2, type: 'deposit', description: 'Kuzigama kw\'ukwezi', amount: 50000, date: '1 Nyakanga, 2024' },
  { id: 3, type: 'withdrawal', description: 'Kugura ibikoresho', amount: -20000, date: '15 Kamena, 2024' },
  { id: 4, type: 'deposit', description: 'Kuzigama kw\'ukwezi', amount: 50000, date: '1 Kamena, 2024' },
];

type ModalState = 'idle' | 'confirming' | 'processing' | 'success';

const DepositModal: React.FC<{
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
  modalState: ModalState;
}> = ({ amount, onClose, onConfirm, modalState }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
        {modalState === 'confirming' && (
          <>
            <h3 className="text-lg font-bold text-slate-800">Emeza Ubwishyu</h3>
            <p className="text-slate-600 my-4">Ugiye kubitsa <span className="font-bold">{amount.toLocaleString('fr-FR')} RWF</span>. Kanda 'Emeza' maze urebe kuri telefone yawe kurangiza ubwishyu.</p>
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
            <p className="text-slate-600 my-2">Ohereje ubusabe bwo kwishyura kuri telefone yawe. Uzuza ijambobanga ryawe.</p>
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

const Saving: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState(150000);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositModalState, setDepositModalState] = useState<ModalState>('idle');

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  // Loan calculator state
  const [calcLoanAmount, setCalcLoanAmount] = useState('');
  const [calcApr, setCalcApr] = useState('10');
  const [calcRepaymentPeriod, setCalcRepaymentPeriod] = useState('');
  const [calcMonthlyPayment, setCalcMonthlyPayment] = useState<number | null>(null);
  const [calcTotalInterest, setCalcTotalInterest] = useState<number | null>(null);

  // Effect for the loan calculator
    useEffect(() => {
        const amount = parseFloat(calcLoanAmount);
        const periodInMonths = parseInt(calcRepaymentPeriod, 10);
        const annualRate = parseFloat(calcApr) / 100;

        if (amount > 0 && periodInMonths > 0 && annualRate >= 0) {
            const monthlyRate = annualRate / 12;
            let calculatedMonthlyPayment;

            if (monthlyRate > 0) {
                 calculatedMonthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, periodInMonths)) / (Math.pow(1 + monthlyRate, periodInMonths) - 1);
            } else {
                // For 0% interest
                calculatedMonthlyPayment = amount / periodInMonths;
            }
           
            setCalcMonthlyPayment(calculatedMonthlyPayment);

            const totalPaid = calculatedMonthlyPayment * periodInMonths;
            const calculatedTotalInterest = totalPaid - amount;
            setCalcTotalInterest(calculatedTotalInterest);
        } else {
            setCalcMonthlyPayment(null);
            setCalcTotalInterest(null);
        }
    }, [calcLoanAmount, calcApr, calcRepaymentPeriod]);


  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (amount > 0) {
      setDepositModalState('confirming');
      setShowDepositModal(true);
    }
  };

  const handleConfirmDeposit = () => {
    setDepositModalState('processing');
    setTimeout(() => {
      const amount = Number(depositAmount);
      setCurrentBalance(prev => prev + amount);
      const newTransaction: Transaction = {
        id: Math.random(),
        type: 'deposit',
        description: 'Kubitsa kuri Mobile Money',
        amount: amount,
        date: new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' an',',')
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setDepositModalState('success');
    }, 2500);
  };

  const handleCloseModal = () => {
      setShowDepositModal(false);
      setDepositAmount('');
      // A slight delay to allow the modal to fade out before resetting state
      setTimeout(() => setDepositModalState('idle'), 300);
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');
    const amount = Number(withdrawAmount);
    if (amount <= 0) {
        setWithdrawError('Shyiramo umubare usobanutse.');
        return;
    }
    if (amount > currentBalance) {
        setWithdrawError('Amafaranga ari kuri konti yawe ntahagije.');
        return;
    }
    
    // Simulate withdrawal process
    setCurrentBalance(prev => prev - amount);
    const newTransaction: Transaction = {
        id: Math.random(),
        type: 'withdrawal',
        description: 'Kubikuza kuri Mobile Money',
        amount: -amount,
        date: new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' an',',')
      };
    setTransactions(prev => [newTransaction, ...prev]);
    setWithdrawSuccess(`Wabikuje ${amount.toLocaleString('fr-FR')} RWF neza.`);
    setWithdrawAmount('');
  }

  return (
    <div className="space-y-6">
      <Card className="text-center bg-rw-green text-white">
        <p className="text-lg font-semibold opacity-80">Ubwizigame bwawe bwose</p>
        <p className="text-4xl font-bold tracking-tight mt-1">{currentBalance.toLocaleString('fr-FR')} RWF</p>
      </Card>
      
      <Card>
        <div className="flex border-b border-slate-200 mb-4">
            <button 
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'deposit' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}
            >
                Kubitsa
            </button>
            <button 
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'withdraw' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}
            >
                Kubikuza
            </button>
        </div>

        {activeTab === 'deposit' ? (
             <div className="animate-fade-in-up">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Bika Amafaranga</h3>
                <form className="space-y-4" onSubmit={handleDepositSubmit}>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Umubare</label>
                    <input
                    type="number"
                    id="amount"
                    placeholder="0 RWF"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                    required
                    />
                </div>
                <div>
                    <label htmlFor="payment-method" className="block text-sm font-medium text-slate-700">Uburyo bwo Kwishyura</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <PhoneIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <select id="payment-method" className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2">
                            <option>Mobile Money</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
                >
                    <ArrowUpRightIcon className="w-5 h-5"/>
                    <span>Komeza</span>
                </button>
                </form>
            </div>
        ) : (
            <div className="animate-fade-in-up">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Bikuza Amafaranga</h3>
                <form className="space-y-4" onSubmit={handleWithdrawSubmit}>
                <div>
                    <label htmlFor="withdraw-amount" className="block text-sm font-medium text-slate-700">Umubare</label>
                    <input
                    type="number"
                    id="withdraw-amount"
                    placeholder="0 RWF"
                    value={withdrawAmount}
                    onChange={(e) => {
                        setWithdrawAmount(e.target.value);
                        setWithdrawError('');
                        setWithdrawSuccess('');
                    }}
                    className={`mt-1 block w-full px-3 py-2 bg-white border ${withdrawError ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm`}
                    required
                    />
                     {withdrawError && <p className="mt-1 text-xs text-red-600 flex items-center space-x-1"><ExclamationTriangleIcon className="w-4 h-4" /><span>{withdrawError}</span></p>}
                </div>
                 <button
                    type="submit"
                    className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
                 >
                    <ArrowDownLeftIcon className="w-5 h-5"/>
                    <span>Bikuza</span>
                </button>
                 {withdrawSuccess && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-lg flex items-center space-x-2"><CheckCircleIcon className="w-5 h-5" /><span>{withdrawSuccess}</span></p>}
                </form>
            </div>
        )}
      </Card>

       {showDepositModal && (
        <DepositModal 
          amount={Number(depositAmount)}
          modalState={depositModalState}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDeposit}
        />
      )}

      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Amateka y'Ihererekanya</h3>
        <ul className="space-y-3">
          {transactions.map((tx) => (
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
      
      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Gerageza Inguzanyo</h3>
        <div className="space-y-4">
            <div>
                <label htmlFor="calc-loan-amount" className="block text-sm font-medium text-slate-700">Umubare w'inguzanyo (RWF)</label>
                <input
                    type="number"
                    id="calc-loan-amount"
                    placeholder="500,000"
                    value={calcLoanAmount}
                    onChange={(e) => setCalcLoanAmount(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="calc-apr" className="block text-sm font-medium text-slate-700">Inyungu ku mwaka (%)</label>
                <input
                    type="number"
                    id="calc-apr"
                    placeholder="10"
                    value={calcApr}
                    onChange={(e) => setCalcApr(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="calc-repayment-period" className="block text-sm font-medium text-slate-700">Igihe cyo kwishyura (Amezi)</label>
                <select
                    id="calc-repayment-period"
                    value={calcRepaymentPeriod}
                    onChange={(e) => setCalcRepaymentPeriod(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                >
                    <option value="">Hitamo igihe</option>
                    <option value="3">Amezi 3</option>
                    <option value="6">Amezi 6</option>
                    <option value="12">Umwaka 1 (Amezi 12)</option>
                    <option value="18">Amezi 18</option>
                    <option value="24">Imyaka 2 (Amezi 24)</option>
                    <option value="36">Imyaka 3 (Amezi 36)</option>
                </select>
            </div>
        </div>

        {calcMonthlyPayment !== null && calcTotalInterest !== null && (
            <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-md font-bold text-slate-700 mb-2">Ibyavuye mu ibara</h4>
                <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Ubwishyu bw'ukwezi</span>
                        <span className="font-bold text-rw-blue text-lg">{Math.ceil(calcMonthlyPayment).toLocaleString('fr-FR')} RWF</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Inyungu yose</span>
                        <span className="font-semibold text-slate-800">{Math.ceil(calcTotalInterest).toLocaleString('fr-FR')} RWF</span>
                    </div>
                </div>
            </div>
        )}
    </Card>

    </div>
  );
};

export default Saving;