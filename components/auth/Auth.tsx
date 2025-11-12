import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { SunIcon, ShieldCheckIcon } from '../Icons';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="md:grid md:grid-cols-2 lg:grid-cols-5">
        
        {/* Left Panel: Illustration and Welcome Text (Hidden on mobile) */}
        <div className="hidden md:flex md:col-span-1 lg:col-span-2 flex-col justify-between p-8 lg:p-12 bg-rw-blue text-white min-h-screen">
          <div className="flex items-center space-x-3">
            <SunIcon className="w-10 h-10 text-rw-yellow" />
            <h1 className="text-3xl font-bold tracking-wider">Zamuka</h1>
          </div>
          <div>
            <blockquote className="text-2xl lg:text-3xl font-medium italic">
              "Ubufatanye n'ikoranabuhanga ni byo byugururira amarembo y'ejo heza."
            </blockquote>
            <p className="mt-4 text-lg opacity-80">- Zamuka Team</p>
          </div>
          <div className="flex items-center space-x-2 text-sm opacity-70">
            <ShieldCheckIcon className="w-5 h-5"/>
            <span>Umutekano wawe niwo nshingano yacu.</span>
          </div>
        </div>
        
        {/* Right Panel: Form */}
        <div className="md:col-span-1 lg:col-span-3 flex flex-col justify-center items-center min-h-screen p-4 bg-slate-50 md:bg-transparent">
          <div className="w-full max-w-md">
            {/* Logo for mobile view */}
            <div className="flex items-center space-x-3 mb-8 md:hidden">
              <SunIcon className="w-12 h-12 text-rw-yellow" />
              <h1 className="text-4xl font-bold tracking-wider text-rw-blue">Zamuka</h1>
            </div>
            
            {isRegistering ? (
              <Register onToggleForm={toggleForm} onRegisterSuccess={onLoginSuccess} />
            ) : (
              <Login onToggleForm={toggleForm} onLoginSuccess={onLoginSuccess} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
