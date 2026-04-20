import { motion, animate } from 'framer-motion';
import { Wallet, Copy, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type ProfileResponse } from '@/types/profile';
import { useState, memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/api/services/walletService';

interface ProfileHeroProps {
    user: ProfileResponse;
    onBalanceClick?: () => void;
}

export const ProfileHero = memo(({ user, onBalanceClick }: ProfileHeroProps) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    // Fetch wallet balance
    const { data: walletData } = useQuery({
        queryKey: ['walletBalance'],
        queryFn: walletService.getWalletBalance,
        refetchInterval: 30000,
    });

    const walletBalance = walletData?.wallet_balance ?? 0;
    const debt = walletData?.debt ?? 0;
    const hasDebt = debt < 0;
    const displayCode = user.extra_code || user.client_code;

    // The primary display value: debt (absolute) if in debt, otherwise wallet balance
    const primaryValue = hasDebt ? Math.abs(debt) : walletBalance;

    // Animation for primary number — direct DOM update to avoid re-renders
    const balanceRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!balanceRef.current) return;
        
        const controls = animate(0, primaryValue, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate(value) {
                if (balanceRef.current) {
                    balanceRef.current.textContent = Math.round(value).toLocaleString();
                }
            }
        });
        
        return controls.stop;
    }, [primaryValue]);

    const handleCopyId = () => {
        navigator.clipboard.writeText(displayCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success(t('profile.hero.idCopied'));
    };

    return (
        <div className="relative mb-6 bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="
                    bg-white
                    pt-16 pb-6 md:pt-12 md:pb-8 px-5 sm:px-6
                    rounded-lg
                    shadow-sm text-[#07182f] text-left relative transform-gpu
                    border border-[#dbe8f4]
                    overflow-hidden
                "
                style={{ willChange: 'transform, opacity' }}
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-[#0b4edb]" />

                <div className="relative z-10 flex flex-col items-start">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="relative mb-4 group"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <Avatar className="w-24 h-24 md:w-20 md:h-20 border border-[#cfe0f1] shadow-sm relative z-10 rounded-lg">
                            <AvatarImage src={user.avatar_url} alt={user.full_name} className="object-cover" />
                            <AvatarFallback className="text-3xl font-bold bg-[#0b4edb] text-white rounded-lg">
                                {user.full_name?.charAt(0) || 'A'}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>

                    <h1 className="text-3xl md:text-2xl font-semibold tracking-normal mb-1 text-[#07182f]">
                        {user.full_name}
                    </h1>
                    <span className="text-[#63758a] text-xs font-medium tracking-normal">{t('profile.hero.registeredDate', { date: user.created_at })}</span>
                    <div
                        className="flex items-center gap-2 bg-[#eef6ff] px-3 py-1 rounded-md border border-[#cfe0f1] cursor-pointer hover:bg-[#e1f0ff] transition-colors mt-3"
                        onClick={handleCopyId}
                    >
                        <span className="text-[#0b4edb] text-sm font-medium tracking-normal">ID: {displayCode}</span>
                        {copied ? <Check size={14} className="text-[#15835b]" /> : <Copy size={14} className="text-[#0b4edb]" />}
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                className="relative mt-3 w-full z-20 pointer-events-none"
                style={{ willChange: 'transform, opacity' }}
            >
                <div
                    onClick={onBalanceClick}
                    className="bg-white border border-[#dbe8f4] shadow-sm rounded-lg p-5 relative overflow-hidden pointer-events-auto cursor-pointer hover:border-[#0b84e5] active:scale-[0.99] transition-all duration-200"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm text-[#63758a] font-medium mb-1">
                                {hasDebt ? t('profile.hero.debtLabel') : t('profile.hero.balance')}
                            </p>
                            <h2 className={`text-3xl font-semibold tracking-normal ${
                                hasDebt
                                    ? 'text-[#c44747]'
                                    : 'text-[#15835b]'
                            }`}>
                                {hasDebt && <span>-</span>}
                                <span ref={balanceRef}>{primaryValue.toLocaleString()}</span>{' '}
                                <span className="text-lg text-[#7d91a8] font-normal">{t('profile.hero.currency')}</span>
                            </h2>
                            {hasDebt ? (
                                <div className="inline-flex items-center gap-1.5 mt-2 bg-[#effbf5] rounded-full px-2.5 py-1">
                                    <Wallet className="w-3.5 h-3.5 text-[#15835b] shrink-0" />
                                    <span className="text-xs font-semibold text-[#15835b]">
                                        {t('profile.hero.availableLabel')}: {walletBalance.toLocaleString()} {t('profile.hero.currency')}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                        <div className={`
                            h-12 w-12 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-300
                            ${hasDebt ? 'bg-[#c44747]' : 'bg-[#22a06b]'}
                        `}>
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});
ProfileHero.displayName = 'ProfileHero';
