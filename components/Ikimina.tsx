import React, { useState } from 'react';
import { IkiminaGroup, IkiminaMember } from '../types';
import Card from './Card';
import { UsersIcon, PlusIcon, ArrowLeftIcon, ChevronRightIcon, ShareIcon, GiftIcon, RefreshIcon, CheckIcon, ClockIcon, TrashIcon, PencilIcon, SearchIcon, ArrowDownTrayIcon, UserPlusIcon, CheckCircleIcon, ClipboardIcon, XMarkIcon, SpinnerIcon } from './Icons';

// Mock Data based on types.ts
const mockIkiminaGroups: IkiminaGroup[] = [
  {
    id: 1,
    name: 'Abishyize Hamwe Family',
    contributionAmount: 10000,
    contributionFrequency: 'Buri cyumweru',
    nextPayout: {
      memberName: 'Gatete Jean',
      date: '5 Kanama, 2024',
    },
    totalPot: 120000,
    members: [
      { id: 1, name: 'Umutoni Keza', avatar: 'https://picsum.photos/id/1011/100/100', status: 'unpaid', isAdmin: true, contributionAmount: 10000 },
      { id: 2, name: 'Gatete Jean', avatar: 'https://picsum.photos/id/1012/100/100', status: 'paid', contributionAmount: 10000 },
      { id: 3, name: 'Mugisha Chris', avatar: 'https://picsum.photos/id/1013/100/100', status: 'unpaid', contributionAmount: 10000 },
      { id: 4, name: 'Ineza Alice', avatar: 'https://picsum.photos/id/1014/100/100', status: 'paid', contributionAmount: 10000 },
      { id: 5, name: 'Kwihangana Paul', avatar: 'https://picsum.photos/id/1015/100/100', status: 'invited', contributionAmount: 10000 },
    ],
    transactions: [
        { id: 1, type: 'contribution', memberName: 'Umutoni Keza', amount: 10000, date: '29 Nyakanga, 2024' },
        { id: 2, type: 'contribution', memberName: 'Gatete Jean', amount: 10000, date: '29 Nyakanga, 2024' },
        { id: 3, type: 'payout', memberName: 'Niyonsenga Eva', amount: -40000, date: '22 Nyakanga, 2024' },
    ]
  },
  {
    id: 2,
    name: 'Ejo Heza Vision 2025',
    contributionAmount: 50000,
    contributionFrequency: 'Buri kwezi',
    nextPayout: {
      memberName: 'Mutesi Grace',
      date: '1 Nzeri, 2024',
    },
    totalPot: 300000,
    members: [
      { id: 1, name: 'Umutoni Keza', avatar: 'https://picsum.photos/id/1011/100/100', status: 'paid', isAdmin: true, contributionAmount: 50000 },
      { id: 2, name: 'Mutesi Grace', avatar: 'https://picsum.photos/id/1016/100/100', status: 'paid', contributionAmount: 50000 },
      { id: 3, name: 'Habimana Eric', avatar: 'https://picsum.photos/id/1018/100/100', status: 'paid', contributionAmount: 50000 },
      { id: 4, name: 'Dusingize Solange', avatar: 'https://picsum.photos/id/1020/100/100', status: 'paid', contributionAmount: 50000 },
    ],
     transactions: [
        { id: 1, type: 'contribution', memberName: 'All Members', amount: 200000, date: '1 Kanama, 2024' },
        { id: 2, type: 'payout', memberName: 'Habimana Eric', amount: -200000, date: '1 Kanama, 2024' },
    ]
  }
];

type ModalState = 'idle' | 'confirming' | 'processing' | 'success';

const ContributionModal: React.FC<{
    groupName: string;
    amount: number;
    onClose: () => void;
    onConfirm: () => void;
    modalState: ModalState;
}> = ({ groupName, amount, onClose, onConfirm, modalState }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
                {modalState === 'confirming' && (
                    <>
                        <h3 className="text-lg font-bold text-slate-800">Emeza Umusanzu</h3>
                        <p className="text-slate-600 my-4">
                            Ugiye gutanga umusanzu wa <span className="font-bold">{amount.toLocaleString('fr-FR')} RWF</span> mu itsinda <span className="font-bold">{groupName}</span>.
                        </p>
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
                        <p className="text-slate-600 my-2">Ohereje ubusabe bwo kwishyura kuri telefone yawe.</p>
                    </>
                )}
                {modalState === 'success' && (
                    <>
                        <CheckCircleIcon className="w-16 h-16 text-rw-green mx-auto" />
                        <h3 className="text-lg font-bold text-slate-800 mt-4">Byakunze!</h3>
                        <p className="text-slate-600 my-2">Umusanzu wa {amount.toLocaleString('fr-FR')} RWF watanzwe neza.</p>
                        <button onClick={onClose} className="w-full bg-rw-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4">OK</button>
                    </>
                )}
            </div>
        </div>
    );
};


const MemberStatusIcon: React.FC<{ status: IkiminaMember['status']; size?: string }> = ({ status, size = 'w-5 h-5' }) => {
    switch (status) {
        case 'paid':
            return <CheckIcon className={`${size} text-green-500`} />;
        case 'unpaid':
            return <ClockIcon className={`${size} text-orange-500`} />;
        case 'invited':
            return <ShareIcon className={`${size} text-slate-400`} />;
        default:
            return null;
    }
};

const StatusOption: React.FC<{
  status: IkiminaMember['status'];
  label: string;
  onClick: () => void;
}> = ({ status, label, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
      role="menuitem"
    >
      <MemberStatusIcon status={status} />
      <span className="ml-3">{label}</span>
    </button>
  </li>
);


interface GroupDetailsProps {
    group: IkiminaGroup;
    onBack: () => void;
    onMemberStatusChange: (memberId: number, newStatus: IkiminaMember['status']) => void;
    onMemberContributionChange: (memberId: number, newAmount: number) => void;
    onInviteMember: (username: string) => void;
    onMakeContribution: (memberId: number, amount: number) => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group, onBack, onMemberStatusChange, onMemberContributionChange, onInviteMember, onMakeContribution }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStatusMemberId, setEditingStatusMemberId] = useState<number | null>(null);
    const [editingContributionMemberId, setEditingContributionMemberId] = useState<number | null>(null);
    const [newContributionAmount, setNewContributionAmount] = useState('');
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteConfirmationMessage, setInviteConfirmationMessage] = useState('');
    
    // Contribution Modal State
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [contributionModalState, setContributionModalState] = useState<ModalState>('idle');

    const currentUserName = 'Umutoni Keza'; // Hardcoded for demo
    const currentUser = group.members.find(m => m.name === currentUserName);
    const currentUserIsAdmin = currentUser?.isAdmin;

    const filteredMembers = group.members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleStatusSelect = (memberId: number, newStatus: IkiminaMember['status']) => {
        onMemberStatusChange(memberId, newStatus);
        setEditingStatusMemberId(null);
    }

    const handleStartEditingContribution = (member: IkiminaMember) => {
        setEditingContributionMemberId(member.id);
        setNewContributionAmount(String(member.contributionAmount ?? group.contributionAmount));
    };

    const handleSaveContribution = () => {
        if (editingContributionMemberId !== null && newContributionAmount !== '') {
            onMemberContributionChange(editingContributionMemberId, Number(newContributionAmount));
        }
        setEditingContributionMemberId(null);
    };
    
    const handleInviteClick = () => {
        if (!inviteUsername.trim()) return;
        onInviteMember(inviteUsername);
        setInviteConfirmationMessage(`Ubutumire bwoherejwe kuri ${inviteUsername} neza.`);
        setInviteUsername('');
        setTimeout(() => {
            setInviteConfirmationMessage('');
        }, 4000);
    };

    const handleOpenContributionModal = () => {
        setContributionModalState('confirming');
        setShowContributionModal(true);
    }

    const handleConfirmContribution = () => {
        if(!currentUser) return;
        setContributionModalState('processing');
        setTimeout(() => {
            onMakeContribution(currentUser.id, currentUser.contributionAmount ?? group.contributionAmount);
            setContributionModalState('success');
        }, 2500);
    };

    const handleCloseContributionModal = () => {
        setShowContributionModal(false);
        setTimeout(() => setContributionModalState('idle'), 300);
    };

    const handleDownloadReport = () => {
        const escapeCsvCell = (cell: any) => {
            const stringCell = String(cell ?? '');
            if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                return `"${stringCell.replace(/"/g, '""')}"`;
            }
            return stringCell;
        };

        let csvContent = [];

        // Group Summary
        csvContent.push(`Raporo y'Itsinda: ${escapeCsvCell(group.name)}`);
        csvContent.push(`Umusanzu:,${escapeCsvCell(`${group.contributionAmount.toLocaleString('fr-FR')} RWF`)}`);
        csvContent.push(`Igihe cy'Umusanzu:,${escapeCsvCell(group.contributionFrequency)}`);
        csvContent.push(`Amafaranga yose mu isanduku:,${escapeCsvCell(`${group.totalPot.toLocaleString('fr-FR')} RWF`)}`);
        csvContent.push(`Uhabwa ubutaha:,${escapeCsvCell(group.nextPayout.memberName)} kuri ${escapeCsvCell(group.nextPayout.date)}`);
        csvContent.push(''); // Blank line separator

        // Member List
        csvContent.push("Urutonde rw'Abanyamuryango");
        const memberHeaders = ['Izina', 'Status', 'Umusanzu (RWF)'];
        csvContent.push(memberHeaders.map(escapeCsvCell).join(','));
        group.members.forEach(member => {
            const statusKinyarwanda = {
                paid: 'Yishyuye',
                unpaid: 'Ntaryishyura',
                invited: 'Yatumiwe'
            };
            const row = [
                member.name,
                statusKinyarwanda[member.status],
                member.contributionAmount ?? group.contributionAmount
            ];
            csvContent.push(row.map(escapeCsvCell).join(','));
        });
        csvContent.push(''); // Blank line separator

        // Transaction History
        csvContent.push("Amateka y'Ihererekanya");
        const transactionHeaders = ["Itariki", "Ubwoko", "Umunyamuryango", "Umubare (RWF)"];
        csvContent.push(transactionHeaders.map(escapeCsvCell).join(','));
        (group.transactions ?? []).forEach(tx => {
            const typeKinyarwanda = {
                contribution: 'Umusanzu',
                payout: 'Yahawe'
            };
            const row = [
                tx.date,
                typeKinyarwanda[tx.type],
                tx.memberName,
                tx.amount
            ];
            csvContent.push(row.map(escapeCsvCell).join(','));
        });

        const csvString = csvContent.join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        const fileName = `raporo_${group.name.replace(/\s+/g, '_')}.csv`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <button onClick={onBack} className="text-slate-600 hover:text-rw-blue p-2 rounded-full bg-slate-100">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800">{group.name}</h2>
            </div>

            <Card className="bg-gradient-to-br from-rw-yellow to-amber-500 text-white shadow-lg">
                <p className="text-lg font-light opacity-80">Amafaranga ari mu isanduku</p>
                <p className="text-4xl font-bold tracking-tight mt-1">{group.totalPot.toLocaleString('fr-FR')} RWF</p>
                <div className="mt-4 pt-4 border-t border-white/30 flex justify-between items-center text-sm">
                    <div>
                        <p className="font-semibold">Umusanzu</p>
                        <p>{group.contributionAmount.toLocaleString('fr-FR')} RWF / {group.contributionFrequency === 'Buri cyumweru' ? 'Icyumweru' : 'Ukwezi'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Uhabwa ubutaha</p>
                        <p>{group.nextPayout.memberName}</p>
                    </div>
                </div>
            </Card>

            {currentUser?.status === 'unpaid' && (
                <Card className="bg-rw-blue/10 border border-rw-blue">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <h4 className="font-bold text-rw-blue">Umusanzu wawe urategerejwe</h4>
                            <p className="text-slate-700 text-sm">Emeza umusanzu wawe w'iki cyiciro ungana na {(currentUser.contributionAmount ?? group.contributionAmount).toLocaleString('fr-FR')} RWF.</p>
                        </div>
                        <button onClick={handleOpenContributionModal} className="w-full sm:w-auto bg-rw-blue text-white font-bold py-2 px-6 rounded-lg whitespace-nowrap hover:bg-sky-700 transition-colors">
                            Tanga Umusanzu
                        </button>
                    </div>
                </Card>
            )}
            
            <div className="space-y-3">
                {currentUserIsAdmin && (
                     <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserPlusIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={inviteUsername}
                                onChange={(e) => setInviteUsername(e.target.value)}
                                placeholder="Andika izina ry'uwo utumira"
                                className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2"
                            />
                        </div>
                        <button 
                            onClick={handleInviteClick}
                            disabled={!inviteUsername.trim()}
                            className="bg-rw-blue text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-sky-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                            <ShareIcon className="w-5 h-5" />
                            <span>Tumira</span>
                        </button>
                    </div>
                )}

                {inviteConfirmationMessage && (
                     <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-100 p-3 rounded-lg animate-fade-in-up">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{inviteConfirmationMessage}</span>
                    </div>
                )}

                 <div className="flex gap-2">
                    <button onClick={handleDownloadReport} className="flex-1 bg-rw-green text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Raporo</span>
                    </button>
                     <button className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-300 transition-colors">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                     <button className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-300 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>


            <Card>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Abanyamuryango ({group.members.length})</h3>
                
                <div className="relative mb-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Shakisha umunyamuryango..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-rw-blue focus:ring-rw-blue sm:text-sm py-2"
                    />
                </div>

                {filteredMembers.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredMembers.map(member => (
                            <li key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="flex items-center space-x-1.5">
                                            <p className="font-semibold text-slate-700">{member.name}</p>
                                            <MemberStatusIcon status={member.status} size="w-4 h-4" />
                                        </div>
                                         {editingContributionMemberId === member.id ? (
                                            <div className="flex items-center space-x-1 mt-1">
                                                <input
                                                    type="number"
                                                    value={newContributionAmount}
                                                    onChange={(e) => setNewContributionAmount(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveContribution(); }}
                                                    onBlur={handleSaveContribution}
                                                    className="w-24 text-sm rounded-md border-slate-300 shadow-sm focus:border-rw-blue focus:ring-rw-blue py-1"
                                                    autoFocus
                                                />
                                                <button onClick={handleSaveContribution} className="text-rw-green hover:bg-green-100 p-1 rounded-full">
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-1 text-sm text-slate-500">
                                                <span>{(member.contributionAmount ?? group.contributionAmount).toLocaleString('fr-FR')} RWF</span>
                                                {currentUserIsAdmin && (
                                                    <button onClick={() => handleStartEditingContribution(member)} className="text-slate-500 hover:text-rw-blue p-1">
                                                        <PencilIcon className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {member.isAdmin && <p className="text-xs text-rw-blue font-bold">Umuyobozi</p>}
                                    </div>
                                </div>
                                <div className="relative">
                                     {currentUserIsAdmin && !member.isAdmin && (
                                        <>
                                            <button
                                                onClick={() => setEditingStatusMemberId(editingStatusMemberId === member.id ? null : member.id)}
                                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-rw-blue"
                                                aria-haspopup="true"
                                                aria-expanded={editingStatusMemberId === member.id}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            {editingStatusMemberId === member.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200">
                                                    <ul className="py-1" role="menu" aria-orientation="vertical">
                                                        <StatusOption status="paid" label="Yishyuye" onClick={() => handleStatusSelect(member.id, 'paid')} />
                                                        <StatusOption status="unpaid" label="Ntaryishyura" onClick={() => handleStatusSelect(member.id, 'unpaid')} />
                                                        <StatusOption status="invited" label="Yatumiwe" onClick={() => handleStatusSelect(member.id, 'invited')} />
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                     )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-slate-500 py-4">Nta munyamuryango ubashije kuboneka.</p>
                )}
            </Card>
            
            <Card>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Ihererekanya rya Vuba</h3>
                {group.transactions && group.transactions.length > 0 ? (
                    <ul className="space-y-3">
                        {group.transactions.map(tx => (
                            <li key={tx.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-700 capitalize">{tx.type === 'contribution' ? `Umusanzu (${tx.memberName})` : `Yahawe (${tx.memberName})`}</p>
                                    <p className="text-sm text-slate-500">{tx.date}</p>
                                </div>
                                <p className={`font-bold ${tx.amount > 0 ? 'text-rw-green' : 'text-slate-700'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')} RWF
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-4">Nta hererekanya rirakorwa.</p>
                )}
            </Card>

            {showContributionModal && currentUser && (
                <ContributionModal 
                    groupName={group.name}
                    amount={currentUser.contributionAmount ?? group.contributionAmount}
                    modalState={contributionModalState}
                    onClose={handleCloseContributionModal}
                    onConfirm={handleConfirmContribution}
                />
            )}
        </div>
    );
};

interface ShareGroupModalProps {
    group: IkiminaGroup;
    onClose: () => void;
}

const ShareGroupModal: React.FC<ShareGroupModalProps> = ({ group, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);
    const shareLink = `https://zamuka.app/join/${group.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareLink)}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                     <h3 id="share-modal-title" className="text-xl font-bold text-slate-800">Saranganya Itsinda</h3>
                     <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                         <XMarkIcon className="w-6 h-6" />
                     </button>
                </div>
               
                <p className="text-slate-600 mb-4">
                    Ohereza iyi link cyangwa QR code ku bandi kugirango bajye mu itsinda <span className="font-bold">{group.name}</span>.
                </p>

                <div className="my-6">
                    <img src={qrCodeUrl} alt={`QR Code for ${group.name}`} className="mx-auto rounded-lg border-4 border-slate-100" />
                </div>

                <div>
                    <label htmlFor="share-link" className="text-sm font-medium text-slate-700 text-left block mb-1">Link yo gusangiza</label>
                    <div className="flex items-center space-x-2">
                         <input
                            id="share-link"
                            type="text"
                            readOnly
                            value={shareLink}
                            className="block w-full text-sm rounded-md border-slate-300 bg-slate-100 shadow-sm focus:border-rw-blue focus:ring-rw-blue"
                        />
                        <button
                            onClick={handleCopyLink}
                            className={`flex-shrink-0 w-28 flex items-center justify-center space-x-1.5 font-semibold py-2 px-3 rounded-lg transition-colors ${
                                isCopied
                                    ? 'bg-rw-green text-white'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {isCopied ? (
                                <>
                                    <CheckIcon className="w-5 h-5" />
                                    <span>Yigannye!</span>
                                </>
                            ) : (
                                <>
                                    <ClipboardIcon className="w-5 h-5" />
                                    <span>Gana</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Ikimina: React.FC = () => {
    const [groups, setGroups] = useState<IkiminaGroup[]>(mockIkiminaGroups);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [sharingGroup, setSharingGroup] = useState<IkiminaGroup | null>(null);

    const handleMemberStatusChange = (memberId: number, newStatus: IkiminaMember['status']) => {
        if (!selectedGroupId) return;

        setGroups(currentGroups =>
            currentGroups.map(group => {
                if (group.id === selectedGroupId) {
                    const updatedMembers = group.members.map(member =>
                        member.id === memberId ? { ...member, status: newStatus } : member
                    );
                    return { ...group, members: updatedMembers };
                }
                return group;
            })
        );
    };

    const handleMemberContributionChange = (memberId: number, newAmount: number) => {
        if (!selectedGroupId) return;

        setGroups(currentGroups =>
            currentGroups.map(group => {
                if (group.id === selectedGroupId) {
                    const updatedMembers = group.members.map(member =>
                        member.id === memberId ? { ...member, contributionAmount: newAmount } : member
                    );
                    return { ...group, members: updatedMembers };
                }
                return group;
            })
        );
    };

    const handleInviteMember = (username: string) => {
        if (!selectedGroupId || !username.trim()) return;
    
        setGroups(currentGroups =>
            currentGroups.map(group => {
                if (group.id === selectedGroupId) {
                    // Prevent adding if member with the same name already exists
                    if (group.members.some(m => m.name.toLowerCase() === username.toLowerCase())) {
                        console.warn("Member already exists");
                        return group;
                    }
    
                    const newMember: IkiminaMember = {
                        id: Math.max(0, ...group.members.map(m => m.id)) + 1,
                        name: username,
                        avatar: `https://picsum.photos/seed/${username}/100/100`,
                        status: 'invited',
                        contributionAmount: group.contributionAmount 
                    };
                    
                    const updatedMembers = [...group.members, newMember];
                    return { ...group, members: updatedMembers };
                }
                return group;
            })
        );
    };

    const handleMakeContribution = (memberId: number, amount: number) => {
        if (!selectedGroupId) return;
    
        setGroups(currentGroups => 
            currentGroups.map(group => {
                if (group.id === selectedGroupId) {
                    const memberPaying = group.members.find(m => m.id === memberId);
                    if (!memberPaying) return group;

                    const updatedMembers = group.members.map(member => 
                        member.id === memberId ? { ...member, status: 'paid' as const } : member
                    );
    
                    const newTransaction = {
                        id: Math.random(),
                        type: 'contribution' as const,
                        memberName: memberPaying.name,
                        amount: amount,
                        date: new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' an',',')
                    };
    
                    return {
                        ...group,
                        members: updatedMembers,
                        totalPot: group.totalPot + amount,
                        transactions: [newTransaction, ...(group.transactions ?? [])]
                    };
                }
                return group;
            })
        );
    };

    const selectedGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;

    if (selectedGroup) {
        return <GroupDetails 
                    group={selectedGroup} 
                    onBack={() => setSelectedGroupId(null)} 
                    onMemberStatusChange={handleMemberStatusChange}
                    onMemberContributionChange={handleMemberContributionChange}
                    onInviteMember={handleInviteMember}
                    onMakeContribution={handleMakeContribution}
                />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Amatsinda y'Ibimina</h2>
                <button className="bg-rw-blue text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-sky-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Gishya</span>
                </button>
            </div>

            {groups.map(group => {
                const currentUserIsAdmin = group.members.find(m => m.name === 'Umutoni Keza')?.isAdmin;
                const hasPendingInvites = group.members.some(m => m.status === 'invited');
                
                const activeMembers = group.members.filter(m => m.status === 'paid' || m.status === 'unpaid');
                const paidMembersCount = group.members.filter(m => m.status === 'paid').length;
                const unpaidMembersCount = activeMembers.length - paidMembersCount;
                const progressPercentage = activeMembers.length > 0 ? (paidMembersCount / activeMembers.length) * 100 : 0;

                return (
                    <Card key={group.id} onClick={() => setSelectedGroupId(group.id)}>
                        <div className="flex items-start justify-between">
                            <div className="flex-1 flex items-start space-x-4">
                                <div className="bg-rw-yellow/20 p-3 rounded-full mt-1"><UsersIcon className="w-8 h-8 text-rw-yellow"/></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{group.name}</h3>
                                    <p className="text-slate-500 font-medium">{group.totalPot.toLocaleString('fr-FR')} RWF mu isanduku</p>
                                    <div className="flex -space-x-2 mt-2">
                                        {group.members.slice(0, 4).map(member => (
                                            <img key={member.id} src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                                        ))}
                                        {group.members.length > 4 && (
                                            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                                +{group.members.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                             <ChevronRightIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
                        </div>
                        
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-semibold text-slate-600">Iterambere ry'Umusanzu</span>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span className="font-bold text-rw-green flex items-center">
                                        <CheckIcon className="w-3 h-3 mr-1"/>
                                        {paidMembersCount} bishyuye
                                    </span>
                                    <span className="font-semibold text-orange-500 flex items-center">
                                        <ClockIcon className="w-3 h-3 mr-1"/>
                                        {unpaidMembersCount} ntibishyura
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-rw-green h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercentage}%` }}
                                    role="progressbar"
                                    aria-valuenow={progressPercentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="Iterambere ry'umusanzu"
                                ></div>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-2">
                            {currentUserIsAdmin && hasPendingInvites && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert('Ubutumire bwongeye koherezwa!');
                                    }}
                                    className="inline-flex items-center space-x-1.5 bg-rw-blue/10 text-rw-blue text-xs font-semibold px-2 py-1 rounded-md hover:bg-rw-blue/20 transition-colors"
                                >
                                    <RefreshIcon className="w-4 h-4" />
                                    <span>Ongeraho Ubutumire</span>
                                </button>
                            )}
                            {currentUserIsAdmin && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSharingGroup(group);
                                    }}
                                    className="inline-flex items-center space-x-1.5 bg-rw-blue/10 text-rw-blue text-xs font-semibold px-2 py-1 rounded-md hover:bg-rw-blue/20 transition-colors"
                                >
                                    <ShareIcon className="w-4 h-4" />
                                    <span>Saranganya</span>
                                </button>
                            )}
                        </div>
                    </Card>
                )
            })}

            {sharingGroup && (
                <ShareGroupModal 
                    group={sharingGroup}
                    onClose={() => setSharingGroup(null)}
                />
            )}
        </div>
    );
};

export default Ikimina;