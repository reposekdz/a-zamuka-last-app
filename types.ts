// FIX: Removed self-import of `Page` which caused a conflict with the local enum declaration.

export enum Page {
  Dashboard = 'AHABANZA',
  Saving = 'KUZIGAMA',
  Loan = 'INGUZANYO',
  Ikimina = 'IKIMINA'
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'payment';
  description: string;
  amount: number;
  date: string;
}

export interface IkiminaMember {
  id: number;
  name: string;
  avatar: string;
  status: 'paid' | 'unpaid' | 'invited';
  isAdmin?: boolean;
  contributionAmount?: number;
}

export interface IkiminaTransaction {
  id: number;
  type: 'contribution' | 'payout';
  memberName: string;
  amount: number;
  date: string;
}

export interface IkiminaGroup {
  id: number;
  name: string;
  contributionAmount: number;
  contributionFrequency: 'Buri cyumweru' | 'Buri kwezi';
  nextPayout: {
    memberName: string;
    date: string;
  };
  members: IkiminaMember[];
  totalPot: number;
  transactions?: IkiminaTransaction[];
}