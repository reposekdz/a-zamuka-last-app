import React, { useState, useEffect } from 'react';
import Card from './Card';
import { TrashIcon, PlusIcon, TrophyIcon, CheckCircleIcon, ExclamationTriangleIcon } from './Icons';

// Interface for the loan comparison feature
interface LoanOption {
    id: number;
    amount: string;
    apr: string;
    term: string; // in months
    // Calculated values
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
}

interface PaymentHistoryItem {
    id: number;
    description: string;
    date: string;
    amount: number;
}

const initialPaymentHistory: PaymentHistoryItem[] = [
    { id: 1, description: 'Kwishyura ukwezi', date: '1 Nzeri, 2024', amount: -15000 },
    { id: 2, description: 'Kwishyura ukwezi', date: '1 Kanama, 2024', amount: -10000 },
    { id: 3, description: 'Wahawe inguzanyo', date: '15 Nyakanga, 2024', amount: 100000 },
];


const Loan: React.FC = () => {
    const [loanBalance, setLoanBalance] = useState(75000);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(initialPaymentHistory);
    const nextPayment = 10000;
    const nextPaymentDate = '1 Ukwakira, 2024';

    // State for making payments
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState('');

    // State for the loan application calculator
    const [loanAmount, setLoanAmount] = useState('');
    const [repaymentPeriod, setRepaymentPeriod] = useState('');
    const [apr, setApr] = useState('10'); // APR is editable via its input field
    const [schedule, setSchedule] = useState<{ installment: number; date: string; amount: number; }[]>([]);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
    const [totalInterest, setTotalInterest] = useState<number | null>(null);

    // --- State for the loan comparison feature ---
    const [comparisonLoans, setComparisonLoans] = useState<LoanOption[]>([
        { id: 1, amount: '1000000', apr: '10', term: '24', monthlyPayment: 0, totalInterest: 0, totalPaid: 0 },
        { id: 2, amount: '1000000', apr: '12', term: '36', monthlyPayment: 0, totalInterest: 0, totalPaid: 0 },
    ]);
    const [nextId, setNextId] = useState(3);
    const [bestOptionId, setBestOptionId] = useState<number | null>(null);

    const formatDate = (date: Date): string => {
        const months = ["Mutarama", "Gashyantare", "Werurwe", "Mata", "Gicurasi", "Kamena", "Nyakanga", "Kanama", "Nzeri", "Ukwakira", "Ugushyingo", "Ukuboza"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const handleMakePayment = (amountToPayStr: string | number) => {
        const amountToPay = Number(amountToPayStr);
        setPaymentError('');
        setPaymentSuccess('');
        
        if (isNaN(amountToPay) || amountToPay <= 0) {
            setPaymentError('Shyiramo umubare usobanutse.');
            return;
        }
        if (amountToPay > loanBalance) {
            setPaymentError('Amafaranga ugiye kwishyura arenze umwenda usigaye.');
            return;
        }

        setLoanBalance(prev => prev - amountToPay);
        const newPayment: PaymentHistoryItem = {
            id: Math.random(),
            description: "Kwishyura Inguzanyo",
            date: new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' an',','),
            amount: -amountToPay
        };
        setPaymentHistory(prev => [newPayment, ...prev]);
        setPaymentSuccess(`Wishyuye ${amountToPay.toLocaleString('fr-FR')} RWF neza.`);
        setPaymentAmount('');
    };

    // Effect for the loan application calculator - Real-time calculation
    useEffect(() => {
        const amount = parseFloat(loanAmount);
        const periodInMonths = parseInt(repaymentPeriod, 10);
        const annualRate = parseFloat(apr) / 100;

        if (amount > 0 && periodInMonths > 0 && annualRate >= 0) {
            const monthlyRate = annualRate / 12;
            let calculatedMonthlyPayment;

            if (monthlyRate > 0) {
                 calculatedMonthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, periodInMonths)) / (Math.pow(1 + monthlyRate, periodInMonths) - 1);
            } else {
                // For 0% interest
                calculatedMonthlyPayment = amount / periodInMonths;
            }
           
            setMonthlyPayment(calculatedMonthlyPayment);

            const totalPaid = calculatedMonthlyPayment * periodInMonths;
            const calculatedTotalInterest = totalPaid - amount;
            setTotalInterest(calculatedTotalInterest);

            const newSchedule = [];
            let currentDate = new Date();
            for (let i = 1; i <= periodInMonths; i++) {
                const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
                newSchedule.push({
                    installment: i,
                    date: formatDate(nextDate),
                    amount: calculatedMonthlyPayment,
                });
            }
            setSchedule(newSchedule);
        } else {
            setSchedule([]);
            setMonthlyPayment(null);
            setTotalInterest(null);
        }
    }, [loanAmount, repaymentPeriod, apr]);

    // Effect for the loan comparison calculator - Refactored dependency array
    useEffect(() => {
        let bestId: number | null = null;
        let minTotalPaid = Infinity;

        const updatedLoans = comparisonLoans.map(loan => {
            const P = parseFloat(loan.amount);
            const n = parseInt(loan.term, 10);
            const annualRate = parseFloat(loan.apr) / 100;
            
            if (P > 0 && n > 0 && annualRate >= 0) {
                const i = annualRate / 12;
                let M;
                if (i > 0) {
                    M = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
                } else {
                    M = P / n;
                }
                const totalPaid = M * n;
                const totalInterest = totalPaid - P;

                if (totalPaid < minTotalPaid) {
                    minTotalPaid = totalPaid;
                    bestId = loan.id;
                }

                return { ...loan, monthlyPayment: M, totalInterest, totalPaid };
            }
            return { ...loan, monthlyPayment: 0, totalInterest: 0, totalPaid: 0 };
        });

        setComparisonLoans(updatedLoans);
        setBestOptionId(bestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comparisonLoans]);


    const handleComparisonChange = (id: number, field: keyof LoanOption, value: string) => {
        setComparisonLoans(prevLoans =>
            prevLoans.map(loan =>
                loan.id === id ? { ...loan, [field]: value } : loan
            )
        );
    };

    const handleAddLoanOption = () => {
        setComparisonLoans(prev => [...prev, { id: nextId, amount: '', apr: '', term: '', monthlyPayment: 0, totalInterest: 0, totalPaid: 0 }]);
        setNextId(prev => prev + 1);
    };

    const handleRemoveLoanOption = (id: number) => {
        setComparisonLoans(prev => prev.filter(loan => loan.id !== id));
    };
  
    return (
      <div className="space-y-6">
        <Card className="text-center bg-rw-blue text-white">
          <p className="text-lg font-semibold opacity-80">Umwenda usigaye</p>
          <p className="text-4xl font-bold tracking-tight mt-1">{loanBalance.toLocaleString('fr-FR')} RWF</p>
          {loanBalance > 0 && <p className="text-sm mt-2 opacity-90">Ukwishyura gutaha: {nextPayment.toLocaleString('fr-FR')} RWF kuri {nextPaymentDate}</p>}
        </Card>
        
        {loanBalance > 0 && (
             <Card>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Kwishyura Inguzanyo</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="payment-amount" className="block text-sm font-medium text-slate-700">Umubare w'ubwishyu</label>
                        <input
                            type="number"
                            id="payment-amount"
                            placeholder="Andika umubare hano"
                            value={paymentAmount}
                            onChange={(e) => {
                                setPaymentAmount(e.target.value);
                                setPaymentError('');
                                setPaymentSuccess('');
                            }}
                            className={`mt-1 block w-full px-3 py-2 bg-white border ${paymentError ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm`}
                        />
                        {paymentError && <p className="mt-1 text-xs text-red-600 flex items-center space-x-1"><ExclamationTriangleIcon className="w-4 h-4" /><span>{paymentError}</span></p>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={() => handleMakePayment(nextPayment)} className="flex-1 text-center bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                            Ishyura {nextPayment.toLocaleString('fr-FR')} RWF
                        </button>
                        <button onClick={() => handleMakePayment(loanBalance)} className="flex-1 text-center bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                            Ishyura Umwenda Wose
                        </button>
                    </div>

                    <button
                        onClick={() => handleMakePayment(paymentAmount)}
                        disabled={!paymentAmount || Number(paymentAmount) <= 0}
                        className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Emeza Ubwishyu
                    </button>
                    {paymentSuccess && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-lg flex items-center space-x-2"><CheckCircleIcon className="w-5 h-5" /><span>{paymentSuccess}</span></p>}
                </div>
            </Card>
        )}

        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Kubara Inguzanyo</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="loan-amount" className="block text-sm font-medium text-slate-700">Umubare usaba (RWF)</label>
              <input
                type="number"
                id="loan-amount"
                placeholder="1,000,000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
              />
            </div>

            <div>
                <label htmlFor="apr" className="block text-sm font-medium text-slate-700">Inyungu ku mwaka (%)</label>
                <input
                    type="number"
                    id="apr"
                    placeholder="10"
                    value={apr}
                    onChange={(e) => setApr(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="repayment-period" className="block text-sm font-medium text-slate-700">Igihe cyo kwishyura (Amezi)</label>
                <select
                    id="repayment-period"
                    value={repaymentPeriod}
                    onChange={(e) => setRepaymentPeriod(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue sm:text-sm"
                >
                    <option value="">Hitamo igihe</option>
                    <option value="3">Amezi 3</option>
                    <option value="6">Amezi 6</option>
                    <option value="12">Umwaka 1 (Amezi 12)</option>
                    <option value="18">Amezi 18</option>
                    <option value="24">Imyaka 2 (Amezi 24)</option>
                    <option value="36">Imyaka 3 (Amezi 36)</option>
                    <option value="48">Imyaka 4 (Amezi 48)</option>
                    <option value="60">Imyaka 5 (Amezi 60)</option>
                </select>
            </div>
            <button
              type="submit"
              className="w-full bg-rw-blue hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Saba Inguzanyo
            </button>
          </form>
        </Card>

        {monthlyPayment !== null && totalInterest !== null && (
            <Card className="animate-fade-in-up">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Ibyavuye mu ibara</h3>
                <div className="bg-slate-100 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4 text-center">
                     <div>
                        <p className="text-slate-600 text-sm">Ubwishyu bw'ukwezi</p>
                        <p className="text-xl md:text-2xl font-bold text-rw-blue">{Math.ceil(monthlyPayment).toLocaleString('fr-FR')} RWF</p>
                    </div>
                     <div>
                        <p className="text-slate-600 text-sm">Inyungu yose</p>
                        <p className="text-xl md:text-2xl font-bold text-slate-800">{Math.ceil(totalInterest).toLocaleString('fr-FR')} RWF</p>
                    </div>
                </div>
                {schedule.length > 0 && (
                    <>
                    <h4 className="text-md font-bold text-slate-700 mb-2 mt-4">Gahunda yo Kwishyura</h4>
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {schedule.map((item) => (
                            <li key={item.installment} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold">
                                        {item.installment}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700">Ukwishyura #{item.installment}</p>
                                        <p className="text-sm text-slate-500">{item.date}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-slate-800">
                                    {Math.ceil(item.amount).toLocaleString('fr-FR')} RWF
                                </p>
                            </li>
                        ))}
                    </ul>
                    </>
                )}
            </Card>
        )}
  
        <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Gereranya Inguzanyo</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                {comparisonLoans.map((loan, index) => (
                    <Card key={loan.id} className={`flex flex-col space-y-3 relative border-2 ${bestOptionId === loan.id ? 'border-rw-green' : 'border-transparent'}`}>
                        {bestOptionId === loan.id && (
                            <div className="absolute top-2 right-2 bg-rw-green text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                                <TrophyIcon className="w-3 h-3" />
                                <span>Ihendutse</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-700">Inguzanyo #{index + 1}</h4>
                            {comparisonLoans.length > 1 && (
                                <button onClick={() => handleRemoveLoanOption(loan.id)} className="text-slate-400 hover:text-red-500">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">Umubare w'amafaranga (RWF)</label>
                            <input type="number" value={loan.amount} onChange={e => handleComparisonChange(loan.id, 'amount', e.target.value)} className="mt-1 block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue" placeholder="1,000,000"/>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">Inyungu ku mwaka (%)</label>
                            <input type="number" value={loan.apr} onChange={e => handleComparisonChange(loan.id, 'apr', e.target.value)} className="mt-1 block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue" placeholder="10"/>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">Igihe cyo kwishyura (Amezi)</label>
                            <input type="number" value={loan.term} onChange={e => handleComparisonChange(loan.id, 'term', e.target.value)} className="mt-1 block w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-rw-blue focus:border-rw-blue" placeholder="24"/>
                        </div>
                        <div className="pt-3 border-t border-slate-200 mt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Ukwishyura kw'ukwezi</span>
                                <span className="font-bold text-rw-blue">{Math.ceil(loan.monthlyPayment).toLocaleString('fr-FR')} RWF</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Inyungu yose</span>
                                <span className="font-semibold text-slate-700">{Math.ceil(loan.totalInterest).toLocaleString('fr-FR')} RWF</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Yose hamwe</span>
                                <span className="font-bold text-slate-800">{Math.ceil(loan.totalPaid).toLocaleString('fr-FR')} RWF</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <button onClick={handleAddLoanOption} className="w-full bg-rw-blue/10 text-rw-blue font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-rw-blue/20 transition-colors">
                <PlusIcon className="w-5 h-5"/>
                <span>Ongeraho indi nguzanyo</span>
            </button>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Amateka y'ubwishyu</h3>
          <ul className="space-y-3">
              {paymentHistory.map(tx => (
                <li key={tx.id} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0">
                    <div>
                        <p className="font-semibold text-slate-700">{tx.description}</p>
                        <p className="text-sm text-slate-500">{tx.date}</p>
                    </div>
                    <p className={`font-bold ${tx.amount > 0 ? 'text-rw-green' : 'text-slate-700'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')} RWF
                    </p>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    );
  };

export default Loan;