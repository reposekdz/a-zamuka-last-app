import React, { useState, useMemo } from 'react';
import Card from './Card';
import { Transaction } from '../types';
import { LoanIcon, SpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon, BanknotesIcon, ClockIcon, ArrowRightIcon } from './Icons';

// Data Structures
interface ActiveLoan {
    id: number;
    principal: number;
    amountPaid: number;
    interestRate: number; // annual %
    term: number; // months
    startDate: string; // ISO Date string
    nextPaymentDue: string;
    nextPaymentAmount: number;
}

const mockActiveLoan: ActiveLoan | null = {
    id: 1,
    principal: 500000,
    amountPaid: 75000,
    interestRate: 12,
    term: 12,
    startDate: '2024-06-01',
    nextPaymentDue: '1 Nzeri, 2024',
    nextPaymentAmount: 44424,
};

const mockLoanPayments: Transaction[] = [
    { id: 1, type: 'payment', description: 'Kwishyura inguzanyo (Nyakanga)', amount: -44424, date: '1 Kanama, 2024' },
    { id: 2, type: 'payment', description: 'Kwishyura inguzanyo (Kamena)', amount: -44424, date: '1 Nyakanga, 2024' },
];

type ModalState = 'idle' | 'confirming' | 'processing' | 'success';
type LoanTab = 'current' | 'apply';

const Loan: React.FC = () => {
    const [activeLoan, setActiveLoan] = useState<ActiveLoan | null>(mockActiveLoan);
    const [payments, setPayments] = useState<Transaction[]>(mockLoanPayments);
    const [activeTab, setActiveTab] = useState<LoanTab>(activeLoan ? 'current' : 'apply');

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentModalState, setPaymentModalState] = useState<ModalState>('idle');
    const [paymentAmount, setPaymentAmount] = useState('');

    // Loan Application State
    const [applyAmount, setApplyAmount] = useState(250000);
    const [applyTerm, setApplyTerm] = useState(12);
    const [applyPurpose, setApplyPurpose] = useState('');
    const [applicationStatus, setApplicationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    const amountRemaining = activeLoan ? activeLoan.principal + (activeLoan.principal * (activeLoan.interestRate/100) * (activeLoan.term/12)) - activeLoan.amountPaid : 0;
    const loanProgress = activeLoan ? (activeLoan.amountPaid / activeLoan.principal) * 100 : 0;

    const monthlyPaymentEstimate = useMemo(() => {
        const principal = applyAmount;
        const annualInterestRate = 0.12; // 12% APR
        const monthlyInterestRate = annualInterestRate / 12;
        const numberOfPayments = applyTerm;

        if (principal > 0 && monthlyInterestRate > 0) {
            const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
            const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
            return Math.ceil(principal * (numerator / denominator));
        }
        return 0;
    }, [applyAmount, applyTerm]);


    const handleMakePayment = () => {
        if (!activeLoan) return;
        const amountToPay = Number(paymentAmount) > 0 ? Number(paymentAmount) : activeLoan.nextPaymentAmount;
        setPaymentAmount(String(amountToPay));
        setPaymentModalState('confirming');
        setShowPaymentModal(true);
    };
    
    const handleConfirmPayment = () => {
        setPaymentModalState('processing');
        setTimeout(() => {
            const amount = Number(paymentAmount);
            setActiveLoan(prev => prev ? { ...prev, amountPaid: prev.amountPaid + amount } : null);
            const newPayment: Transaction = {
                id: Math.random(),
                type: 'payment',
                description: 'Kwishyura inguzanyo',
                amount: -amount,
                date: new Date().toLocaleDateString('fr-CA')
            };
            setPayments(prev => [newPayment, ...prev]);
            setPaymentModalState('success');
        }, 2500);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setPaymentAmount('');
        setTimeout(() => setPaymentModalState('idle'), 300);
    };
    
    const handleApplyForLoan = (e: React.FormEvent) => {
        e.preventDefault();
        setApplicationStatus('processing');
        setTimeout(() => {
            setApplicationStatus('success');
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <Card className="text-center bg-rw-blue text-white">
                <p className="text-lg font-semibold opacity-80">Inguzanyo isigaye</p>
                <p className="text-4xl font-bold tracking-tight mt-1">{activeLoan ? amountRemaining.toLocaleString('fr-FR') : '0'} RWF</p>
            </Card>

            <Card>
                <div className="flex border-b border-slate-200 mb-4">
                    <button onClick={() => setActiveTab('current')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'current' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}>Inguzanyo yawe</button>
                    <button onClick={() => setActiveTab('apply')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'apply' ? 'text-rw-blue border-b-2 border-rw-blue' : 'text-slate-500'}`}>Saba Inguzanyo</button>
                </div>
                
                {activeTab === 'current' && (
                    <div className="animate-fade-in-up">
                        {activeLoan ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Incshamake y'Inguzanyo</h3>
                                    <div className="mt-4 space-y-2 text-slate-700">
                                        <div className="flex justify-between"><span className="text-slate-500">Amafaranga yose:</span> <span className="font-semibold">{activeLoan.principal.toLocaleString('fr-FR')} RWF</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Ayo umaze kwishyura:</span> <span className="font-semibold">{activeLoan.amountPaid.toLocaleString('fr-FR')} RWF</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Ubwishyu bukurikira:</span> <span className="font-semibold">{activeLoan.nextPaymentAmount.toLocaleString('fr-FR')} RWF</span></div>
                                        <div className="flex justify-between"><span className="text-slate-500">Itariki ntarengwa:</span> <span className="font-semibold">{activeLoan.nextPaymentDue}</span></div>
                                    </div>
                                     <div className="mt-4">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Yishyuwe</span>
                                            <span>{loanProgress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-rw-blue h-2.5 rounded-full" style={{width: `${loanProgress}%`}}></div></div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-bold text-slate-800 text-lg mb-4">Kwishyura</h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder={`Ubwishyu busanzwe: ${activeLoan.nextPaymentAmount.toLocaleString('fr-FR')} RWF`}
                                            className="flex-grow block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                                        />
                                        <button onClick={handleMakePayment} className="w-full sm:w-auto bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                                            <BanknotesIcon className="w-5 h-5"/>
                                            <span>Ishyura Nonaha</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-4">Amateka y'Ubwishyu</h3>
                                    <ul className="space-y-3">
                                        {payments.map(p => (
                                            <li key={p.id} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                                                <div>
                                                    <p className="font-semibold text-slate-700">{p.description}</p>
                                                    <p className="text-sm text-slate-500">{new Date(p.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <p className="font-bold text-slate-700">{p.amount.toLocaleString('fr-FR')} RWF</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <LoanIcon className="w-12 h-12 text-slate-300 mx-auto" />
                                <h3 className="mt-2 text-lg font-medium text-slate-800">Nta nguzanyo ufite</h3>
                                <p className="mt-1 text-sm text-slate-500">Nta nguzanyo irangwa kuri konti yawe. Saba inguzanyo nshya uyu munsi.</p>
                                <button onClick={() => setActiveTab('apply')} className="mt-4 bg-rw-blue text-white font-bold py-2 px-4 rounded-lg">
                                    Saba Inguzanyo
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'apply' && (
                    <div className="animate-fade-in-up">
                         {applicationStatus === 'success' ? (
                             <div className="text-center py-10">
                                <CheckCircleIcon className="w-16 h-16 text-rw-green mx-auto" />
                                <h3 className="text-xl font-bold text-slate-800 mt-4">Ubusabe Bwakiriwe!</h3>
                                <p className="text-slate-600 my-2 max-w-md mx-auto">Ubusabe bwawe bw'inguzanyo bwoherejwe neza. Tuzakumenyesha igisubizo mu gihe cya vuba. Murakoze!</p>
                                <button onClick={() => setApplicationStatus('idle')} className="mt-4 text-sm font-semibold text-rw-blue hover:underline">Saba indi nguzanyo</button>
                            </div>
                         ) : (
                             <form onSubmit={handleApplyForLoan} className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 text-center">Form yo Gusaba Inguzanyo</h3>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="applyAmount" className="font-semibold text-slate-700">Umubare usaba</label>
                                        <span className="font-bold text-rw-blue text-lg">{applyAmount.toLocaleString('fr-FR')} RWF</span>
                                    </div>
                                    <input type="range" id="applyAmount" min="50000" max="5000000" step="10000" value={applyAmount} onChange={(e) => setApplyAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rw-blue" />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="applyTerm" className="font-semibold text-slate-700">Igihe cyo kwishyura</label>
                                        <span className="font-bold text-rw-blue text-lg">{applyTerm} Amezi</span>
                                    </div>
                                    <input type="range" id="applyTerm" min="3" max="60" step="1" value={applyTerm} onChange={(e) => setApplyTerm(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rw-blue" />
                                </div>
                                
                                <div>
                                    <label htmlFor="applyPurpose" className="block text-sm font-medium text-slate-700 mb-1">Impamvu y'inguzanyo</label>
                                    <input type="text" id="applyPurpose" placeholder="Urugero: Kwagura ubucuruzi" value={applyPurpose} onChange={(e) => setApplyPurpose(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm" required/>
                                </div>

                                <Card className="text-center bg-slate-50 border-dashed">
                                    <p className="text-slate-500">Ubwishyu bwawe bw'ukwezi (ikigereranyo)</p>
                                    <p className="text-3xl font-extrabold text-rw-blue my-2">{monthlyPaymentEstimate.toLocaleString('fr-FR')} RWF</p>
                                    <p className="text-xs text-slate-400">Inyungu y'urugero ni 12% ku mwaka.</p>
                                </Card>
                                
                                <button type="submit" disabled={applicationStatus === 'processing'} className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:bg-slate-400">
                                    {applicationStatus === 'processing' ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <ArrowRightIcon className="w-5 h-5"/>}
                                    <span>{applicationStatus === 'processing' ? 'Twohereje ubusabe...' : 'Ohereza Ubusabe'}</span>
                                </button>
                             </form>
                         )}
                    </div>
                )}
            </Card>

            {showPaymentModal && activeLoan && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-up">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
                        {paymentModalState === 'confirming' && (
                            <>
                                <h3 className="text-lg font-bold text-slate-800">Emeza Ubwishyu</h3>
                                <p className="text-slate-600 my-4">Ugiye kwishyura <span className="font-bold">{Number(paymentAmount).toLocaleString('fr-FR')} RWF</span> y'inguzanyo yawe. Kanda 'Emeza' maze urebe kuri telefone yawe.</p>
                                <div className="space-y-2">
                                    <button onClick={handleConfirmPayment} className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">Emeza</button>
                                    <button onClick={handleClosePaymentModal} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg">Subika</button>
                                </div>
                            </>
                        )}
                        {paymentModalState === 'processing' && (
                            <>
                                <SpinnerIcon className="w-12 h-12 text-rw-blue animate-spin mx-auto" />
                                <h3 className="text-lg font-bold text-slate-800 mt-4">Gutegereza ubwishyu...</h3>
                            </>
                        )}
                        {paymentModalState === 'success' && (
                            <>
                                <CheckCircleIcon className="w-16 h-16 text-rw-green mx-auto" />
                                <h3 className="text-lg font-bold text-slate-800 mt-4">Byakunze!</h3>
                                <p className="text-slate-600 my-2">Wishyuye {Number(paymentAmount).toLocaleString('fr-FR')} RWF neza.</p>
                                <button onClick={handleClosePaymentModal} className="w-full bg-rw-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4">OK</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Loan;
