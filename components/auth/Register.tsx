import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import Card from '../Card';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, MapPinIcon, CheckIcon, XMarkIcon, PhoneIcon } from '../Icons';

interface RegisterProps {
  onToggleForm: () => void;
  onRegisterSuccess: () => void;
}

const locationData: { [province: string]: { [district: string]: string[] } } = {
    "Umujyi wa Kigali": {
        "Gasabo": ["Remera", "Kacyiru", "Kimihurura", "Gisozi"],
        "Kicukiro": ["Gatenga", "Kicukiro", "Kanombe", "Gikondo"],
        "Nyarugenge": ["Nyamirambo", "Kiyovu", "Rwezamenyo", "Nyakabanda"],
    },
    "Intara y'Iburasirazuba": {
        "Nyagatare": ["Nyagatare", "Karangazi", "Rwimiyaga"],
        "Gatsibo": ["Kiramuruzi", "Gatsibo", "Kabarore"],
        "Kayonza": ["Mukarange", "Ndego", "Rwamagana"],
        "Rwamagana": ["Kigabiro", "Musha", "Fumbwe"],
    },
    "Intara y'Amajyaruguru": {
        "Musanze": ["Muhoza", "Cyuve", "Kinigi"],
        "Gicumbi": ["Byumba", "Rushaki", "Miyove"],
        "Rulindo": ["Shyorongi", "Base", "Masoro"],
    },
    "Intara y'Iburengerazuba": {
        "Rubavu": ["Gisenyi", "Rugero", "Nyakiriba"],
        "Rusizi": ["Kamembe", "Gihundwe", "Nkombo"],
        "Karongi": ["Bwishyura", "Gishyita", "Rubengera"],
    },
    "Intara y'Amajyepfo": {
        "Huye": ["Ngoma", "Tumba", "Maraba"],
        "Nyanza": ["Busasamana", "Kibirizi", "Muyira"],
        "Gisagara": ["Ndora", "Musha", "Kansi"],
    }
};


const PasswordStrengthMeter: React.FC<{ password?: string }> = ({ password = '' }) => {
    const strength = useMemo(() => {
        let score = 0;
        if (password.length > 8) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;
        return score;
    }, [password]);

    const getStrengthLabelAndColor = () => {
        switch (strength) {
            case 0:
            case 1:
            case 2:
                return { label: 'Inke', color: 'bg-red-500' };
            case 3:
                return { label: 'Riringaniye', color: 'bg-yellow-500' };
            case 4:
            case 5:
                return { label: 'Komeye', color: 'bg-rw-green' };
            default:
                return { label: '', color: 'bg-slate-200' };
        }
    };
    
    const { label, color } = getStrengthLabelAndColor();
    const progressWidth = password.length > 0 ? `${(strength / 5) * 100}%` : '0%';

    return (
        <div>
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-slate-600">Imbaraga z'ijambobanga</span>
                <span className={`font-semibold ${
                    strength <= 2 ? 'text-red-500' 
                    : strength === 3 ? 'text-yellow-600' 
                    : 'text-rw-green'}`}>{label}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
                    style={{ width: progressWidth }}
                ></div>
            </div>
        </div>
    );
};

const PasswordRequirement: React.FC<{isValid: boolean; text: string}> = ({ isValid, text }) => (
    <li className={`flex items-center text-sm transition-colors ${isValid ? 'text-rw-green' : 'text-slate-500'}`}>
        {isValid ? <CheckIcon className="w-4 h-4 mr-2 flex-shrink-0" /> : <XMarkIcon className="w-4 h-4 mr-2 flex-shrink-0" />}
        <span>{text}</span>
    </li>
);

const Register: React.FC<RegisterProps> = ({ onToggleForm, onRegisterSuccess }) => {
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [districts, setDistricts] = useState<string[]>([]);
    const [sectors, setSectors] = useState<string[]>([]);

    useEffect(() => {
        setPasswordValidity({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
        });
    }, [password]);

    const isPasswordValid = Object.values(passwordValidity).every(Boolean);

    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setSelectedDistrict('');
        setDistricts(province ? Object.keys(locationData[province]) : []);
        setSectors([]);
    };

    const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        setSectors(selectedProvince && district ? locationData[selectedProvince][district] : []);
    };
    
    const validatePhone = (phone: string): boolean => {
        const rwandanPhoneRegex = /^07\d{8}$/;
        if (!phone) {
            setPhoneError('Nimero ya telefone irakenewe.');
            return false;
        }
        if (!rwandanPhoneRegex.test(phone)) {
            setPhoneError('Nimero igomba gutangira na 07 kandi ikagira imibare 10.');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value;
        setPhoneNumber(newPhone);
        if (phoneError) {
            validatePhone(newPhone);
        }
    };

    const handlePhoneBlur = () => {
        validatePhone(phoneNumber);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isPhoneCurrentlyValid = validatePhone(phoneNumber);
        if (!isPasswordValid || !isPhoneCurrentlyValid) return;
        
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onRegisterSuccess();
        }, 1500);
    };

    return (
    <Card>
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Fungura Konti</h2>
      <p className="text-center text-slate-500 mb-6">Tangira urugendo rwawe na Zamuka.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
         <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
            Amazina Yombi
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              id="fullName"
              placeholder="Umutoni Keza"
              className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone-reg" className="block text-sm font-medium text-slate-700 mb-1">
            Telefone
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhoneIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="tel"
              id="phone-reg"
              placeholder="07..."
              value={phoneNumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              className={`block w-full rounded-md border ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-rw-blue'} pl-10 shadow-sm focus:border-rw-blue focus:ring sm:text-sm py-2`}
              required
            />
          </div>
          {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="province" className="block text-sm font-medium text-slate-700 mb-1">Intara</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPinIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <select id="province" value={selectedProvince} onChange={handleProvinceChange} required className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2">
                        <option value="">Hitamo Intara</option>
                        {Object.keys(locationData).map(province => (
                            <option key={province} value={province}>{province}</option>
                        ))}
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="district" className="block text-sm font-medium text-slate-700 mb-1">Akarere</label>
                <select id="district" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince} required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2 disabled:bg-slate-100">
                    <option value="">Hitamo Akarere</option>
                    {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
            </div>
        </div>
         <div>
            <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-1">Umurenge</label>
            <select id="sector" disabled={!selectedDistrict} required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2 disabled:bg-slate-100">
                <option value="">Hitamo Umurenge</option>
                {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                ))}
            </select>
        </div>

        <div>
          <label htmlFor="password-reg" className="block text-sm font-medium text-slate-700 mb-1">
            Ijambobanga
          </label>
           <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password-reg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Shyiramo ijambobanga rikomeye"
              className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2"
              required
              aria-describedby="password-requirements"
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
          {password && (
            <div id="password-requirements" className="mt-2">
                <PasswordStrengthMeter password={password} />
                <ul className="mt-2 space-y-1">
                    <PasswordRequirement isValid={passwordValidity.minLength} text="Nibura inyuguti 8" />
                    <PasswordRequirement isValid={passwordValidity.hasLowercase} text="Inyuguti ntoya imwe (a-z)" />
                    <PasswordRequirement isValid={passwordValidity.hasUppercase} text="Inyuguti nkuru imwe (A-Z)" />
                    <PasswordRequirement isValid={passwordValidity.hasNumber} text="Umubare umwe (0-9)" />
                    <PasswordRequirement isValid={passwordValidity.hasSpecialChar} text="Ikimenyetso kimwe (!@#$%)" />
                </ul>
            </div>
            )}
        </div>
        <button
            type="submit"
            disabled={isLoading || !isPasswordValid || !!phoneError}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rw-blue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rw-blue disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
             {isLoading ? 'Uteganye gato...' : 'Iyandikishe'}
        </button>
      </form>
       <p className="mt-6 text-center text-sm text-slate-600">
        Usanzwe ufite konti?{' '}
        <button onClick={onToggleForm} className="font-medium text-rw-blue hover:text-sky-700">
          Injira
        </button>
      </p>
    </Card>
  );
};

export default Register;