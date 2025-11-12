import React, { useState } from 'react';
import Card from '../Card';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, GoogleIcon, FacebookIcon, SpinnerIcon } from '../Icons';

interface LoginProps {
  onToggleForm: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleForm, onLoginSuccess }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (rememberMe) {
                localStorage.setItem('rememberUser', 'true');
            } else {
                localStorage.removeItem('rememberUser');
            }
            setIsLoading(false);
            onLoginSuccess();
        }, 1500);
    };

    const handleSocialLogin = () => {
        setIsLoading(true);
        // Simulate API call for social login
        setTimeout(() => {
            if (rememberMe) {
                localStorage.setItem('rememberUser', 'true');
            } else {
                localStorage.removeItem('rememberUser');
            }
            setIsLoading(false);
            onLoginSuccess();
        }, 1000);
    }

  return (
    <Card className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Injira</h2>
      <p className="text-center text-slate-500 mb-6">Ongera urakaza neza kuri Zamuka!</p>
      
      <div className="space-y-3 mb-6">
          <button onClick={handleSocialLogin} className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              <GoogleIcon className="w-5 h-5 mr-3" />
              Komeza na Google
          </button>
           <button onClick={handleSocialLogin} className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              <FacebookIcon className="w-5 h-5 mr-3" />
              Komeza na Facebook
          </button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-300"></div>
        <span className="flex-shrink mx-4 text-slate-500 text-sm">cyangwa</span>
        <div className="flex-grow border-t border-slate-300"></div>
      </div>

      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Telefone cyangwa Imeyili
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="phone"
              placeholder="Shyiramo telefone yawe"
              className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Ijambobanga
          </label>
           <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Shyiramo ijambobanga"
              className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2"
              required
            />
             <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
              onClick={() => setPasswordVisible(!passwordVisible)}
              aria-label={passwordVisible ? 'Hisha ijambobanga' : 'Erekana ijambobanga'}
            >
              {passwordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-rw-blue focus:ring-rw-blue border-slate-300 rounded" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="remember-me" className="ml-2 block text-slate-800">Unzibuke</label>
            </div>
            <button type="button" onClick={() => alert('Password reset flow would start here!')} className="font-medium text-rw-blue hover:text-sky-700">Wibagiwe ijambobanga?</button>
        </div>

         <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rw-blue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rw-blue disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Injira'}
          </button>
      </form>
       <p className="mt-6 text-center text-sm text-slate-600">
        Nta konti ufite?{' '}
        <button onClick={onToggleForm} className="font-medium text-rw-blue hover:text-sky-700">
          Iyandikishe
        </button>
      </p>
    </Card>
  );
};

export default Login;