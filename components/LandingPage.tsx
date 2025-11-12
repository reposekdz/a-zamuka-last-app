import React, { useState, useMemo } from 'react';
import { SunIcon, PiggyBankIcon, LoanIcon, UsersIcon, TrendingUpIcon, ShieldCheckIcon, ArrowRightIcon, UserPlusIcon, RocketLaunchIcon, CheckBadgeIcon } from './Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; iconBgClass: string; }> = ({ icon, title, description, iconBgClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBgClass} mb-4`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
    </div>
);

const StepCard: React.FC<{ icon: React.ReactNode; step: string; title: string; description: string }> = ({ icon, step, title, description }) => (
    <div className="text-center">
        <div className="relative flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-rw-blue/10 mb-4 border-4 border-white shadow-sm">
                {icon}
            </div>
            <div className="absolute top-0 right-0 -mt-2 -mr-2 flex items-center justify-center w-8 h-8 bg-rw-yellow text-rw-blue font-bold rounded-full border-2 border-white">
                {step}
            </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; avatar: string; name: string; role: string }> = ({ quote, avatar, name, role }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-slate-600 italic">"{quote}"</p>
        <div className="flex flex-col items-center mt-6">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover mb-2" />
            <p className="font-bold text-slate-800">{name}</p>
            <p className="text-sm text-rw-blue font-semibold">{role}</p>
        </div>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [loanAmount, setLoanAmount] = useState(500000);
    const [loanTerm, setLoanTerm] = useState(24); // in months

    const monthlyPayment = useMemo(() => {
        const principal = loanAmount;
        const annualInterestRate = 0.10; // 10% APR
        const monthlyInterestRate = annualInterestRate / 12;
        const numberOfPayments = loanTerm;

        if (principal > 0 && monthlyInterestRate > 0) {
            const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
            const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
            return Math.ceil(principal * (numerator / denominator));
        }
        if(principal > 0) {
            return Math.ceil(principal / numberOfPayments);
        }
        return 0;
    }, [loanAmount, loanTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        {/* Header */}
        <header className="py-4 px-6 md:px-12 absolute top-0 left-0 right-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                    <SunIcon className="w-8 h-8 text-rw-yellow" />
                    <h1 className="text-2xl font-bold tracking-wider text-white">Zamuka</h1>
                </div>
                <button 
                    onClick={onGetStarted}
                    className="hidden sm:inline-block bg-white/20 text-white font-semibold px-5 py-2 rounded-lg hover:bg-white/30 backdrop-blur-sm hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                >
                    Injira / Iyandikishe
                </button>
            </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center text-white">
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1603292421633-e069d82121e7?q=80&w=2070&auto=format&fit=crop" 
                    alt="Kigali Convention Centre" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <main className="relative container mx-auto px-6 md:px-12 py-16 sm:py-24 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    Uburyo bwawe bworoshye bwo kuzigama no gutera imbere.
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-white/80 mb-8">
                    Zamuka iguha imbaraga zo gucunga neza ubwizigame bwawe, gusaba inguzanyo byihuse, no kwitabira ibimina, byose mu buryo bw'ikoranabuhanga kandi bwizewe.
                </p>
                <button 
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-rw-blue to-sky-600 hover:shadow-xl text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg text-lg inline-flex items-center space-x-2 group"
                >
                    <span>Tangira None</span>
                    <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </main>
        </section>
        
        {/* How it Works Section */}
        <section className="py-20">
             <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-12">
                     <h3 className="text-3xl font-bold text-slate-800">Uko Bikora mu Ntambwe 3 Gusa</h3>
                     <p className="text-slate-500 mt-2">Gutangira urugendo rwawe na Zamuka biroroshye cyane.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Dashed line connecting steps - for larger screens */}
                    <div className="hidden md:block absolute top-10 left-0 w-full h-px">
                         <svg width="100%" height="100%"><line x1="0" y1="0" x2="100%" y2="0" strokeWidth="2" stroke="rgb(203 213 225)" strokeDasharray="8,8"></line></svg>
                    </div>
                    <StepCard 
                        icon={<UserPlusIcon className="w-10 h-10 text-rw-blue" />}
                        step="1"
                        title="Fungura Konti"
                        description="Iyandikishe mu munota umwe gusa. Turakenera amakuru y'ibanze kugirango tugutangirize."
                    />
                     <StepCard 
                        icon={<CheckBadgeIcon className="w-10 h-10 text-rw-blue" />}
                        step="2"
                        title="Hitamo Serivisi"
                        description="Hitamo serivisi ikunogeye: kuzigama, gusaba inguzanyo, cyangwa kujya mu ikimina."
                    />
                     <StepCard 
                        icon={<RocketLaunchIcon className="w-10 h-10 text-rw-blue" />}
                        step="3"
                        title="Gera ku Ntego"
                        description="Koresha Zamuka kugirango ugere ku ntego zawe z'imari vuba kandi mu buryo bwizewe."
                    />
                </div>
             </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-12">
                     <h3 className="text-3xl font-bold text-slate-800">Serivisi Zacu</h3>
                     <p className="text-slate-500 mt-2">Dufite byinshi byagufasha mu rugendo rwawe rw'iterambere.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<PiggyBankIcon className="w-6 h-6 text-rw-green" />}
                        iconBgClass="bg-rw-green/10"
                        title="Kuzigama"
                        description="Bika amafaranga yawe mu buryo bwizewe kandi ukurikirane uko ubwizigame bwawe bwiyongera umunsi ku wundi."
                    />
                    <FeatureCard 
                        icon={<LoanIcon className="w-6 h-6 text-rw-blue" />}
                        iconBgClass="bg-rw-blue/10"
                        title="Inguzanyo"
                        description="Saba inguzanyo ku nyungu ntoya kandi ubone igisubizo mu gihe gito kugira ngo ushyire mu bikorwa imishinga yawe."
                    />
                     <FeatureCard 
                        icon={<UsersIcon className="w-6 h-6 text-rw-yellow" />}
                        iconBgClass="bg-rw-yellow/10"
                        title="Ikimina"
                        description="Jya mu itsinda ry'ikimina cyangwa ushinge iryawe, maze mugere ku ntego zanyu mwishyize hamwe."
                    />
                </div>
            </div>
        </section>

        {/* Interactive Loan Calculator Section */}
        <section className="py-20 bg-rw-blue/5">
            <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h3 className="text-3xl font-bold text-slate-800">Bara inguzanyo yawe ako kanya</h3>
                    <p className="text-slate-600 mt-4 mb-8">Koresha iki gicurarangisho kugirango umenye uko ubwishyu bwawe bwa buri kwezi buba bungana. Gerageza uhindure umubare n'igihe cyo kwishyura.</p>
                    <div>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="loanAmount" className="font-semibold">Umubare w'inguzanyo</label>
                                <span className="font-bold text-rw-blue text-lg">{loanAmount.toLocaleString('fr-FR')} RWF</span>
                            </div>
                            <input
                                type="range"
                                id="loanAmount"
                                min="50000"
                                max="5000000"
                                step="10000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rw-blue"
                            />
                        </div>
                         <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="loanTerm" className="font-semibold">Igihe cyo kwishyura</label>
                                <span className="font-bold text-rw-blue text-lg">{loanTerm} Amezi</span>
                            </div>
                             <input
                                type="range"
                                id="loanTerm"
                                min="3"
                                max="60"
                                step="1"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rw-blue"
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <p className="text-slate-500">Ubwishyu bwawe bw'ukwezi (hafi)</p>
                    <p className="text-5xl font-extrabold text-rw-blue my-3">{monthlyPayment.toLocaleString('fr-FR')} RWF</p>
                    <p className="text-xs text-slate-400">Inyungu y'urugero ni 10% ku mwaka. Ibi ni ikigereranyo gusa.</p>
                     <button 
                        onClick={onGetStarted}
                        className="mt-6 bg-rw-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg"
                    >
                        Saba Inguzanyo Nonaha
                    </button>
                </div>
            </div>
        </section>

        {/* Why Choose Us Section */}
         <section className="py-20">
            <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
                <div>
                     <h3 className="text-3xl font-bold text-slate-800">Kuki Wahitamo Zamuka?</h3>
                     <p className="text-slate-600 mt-4 mb-6">Twiyemeje kuguha serivisi nziza z'imari zigendanye n'igihe tugezemo.</p>
                     <ul className="space-y-4">
                        <li className="flex items-start space-x-3">
                            <ShieldCheckIcon className="w-6 h-6 text-rw-green flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold">Umutekano wizewe</h4>
                                <p className="text-sm text-slate-500">Amafaranga yawe n'amakuru yawe byose bibitswe mu buryo bwizewe kandi butavogerwa.</p>
                            </div>
                        </li>
                         <li className="flex items-start space-x-3">
                            <TrendingUpIcon className="w-6 h-6 text-rw-green flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold">Iterambere Rihuse</h4>
                                <p className="text-sm text-slate-500">Ikoranabuhanga ryacu rigufasha kugera ku ntego zawe z'imari vuba kandi mu buryo bworoshye.</p>
                            </div>
                        </li>
                     </ul>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop" alt="Customer using Zamuka app" className="rounded-lg object-cover w-full h-full" />
                </div>
            </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-12">
                     <h3 className="text-3xl font-bold text-slate-800">Ibyo Abakiriya Bacu Bavuga</h3>
                     <p className="text-slate-500 mt-2 max-w-xl mx-auto">Turi hano kubwanyu. Reba uko twafashije abandi nkawe kugera ku nzozi zabo.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard 
                        quote="Ndashimira Zamuka cyane! Nabashe kubona inguzanyo yo kwagura iduka ryanjye mu buryo butangoye. Serivisi zabo zirihuta."
                        avatar="https://picsum.photos/id/1011/100/100"
                        name="Umutoni Keza"
                        role="Umucuruzi"
                    />
                    <TestimonialCard 
                        quote="Ikimina cyacu cy' 'Abishyize Hamwe' cyabonye uburyo bunoze bwo gucunga imisanzu. Ntawe ugihangayikishijwe no kumenya uwatanze n'utaratanze."
                        avatar="https://picsum.photos/id/1012/100/100"
                        name="Gatete Jean"
                        role="Umunyamuryango w'Ikimina"
                    />
                     <TestimonialCard 
                        quote="Kuzigama byarangoraga, ariko kuva natangira gukoresha Zamuka, mbona ubwizigame bwanjye bwiyongera. Biroroshye kandi birizewe."
                        avatar="https://picsum.photos/id/1014/100/100"
                        name="Ineza Alice"
                        role="Umunyeshuri"
                    />
                </div>
            </div>
        </section>


        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 via-rw-blue to-slate-900 text-white py-12">
            <div className="container mx-auto px-6 md:px-12 text-center">
                 <div className="flex items-center justify-center space-x-2 mb-4">
                    <SunIcon className="w-8 h-8 text-rw-yellow" />
                    <h1 className="text-2xl font-bold tracking-wider">Zamuka</h1>
                </div>
                <p className="text-slate-300">© {new Date().getFullYear()} Zamuka Microfinance. Uburenganzira bwose burasigasiriwe.</p>
            </div>
        </footer>
    </div>
  );
};

export default LandingPage;