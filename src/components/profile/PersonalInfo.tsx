import { motion } from 'framer-motion';
import { FileText, CreditCard, MapPin, Calendar, Users, Phone, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type ProfileResponse } from '@/types/profile';

interface PersonalInfoProps {
    user: ProfileResponse;
}

export const PersonalInfo = ({ user }: PersonalInfoProps) => {
    const { t } = useTranslation();

    const maskValue = (value?: string | null, visibleStart = 2, visibleEnd = 2, maskLength = 6) => {
        if (!value) return t('profile.personalInfo.notAvailable');
        const clean = String(value);
        if (clean.length <= visibleStart + visibleEnd) return '*'.repeat(clean.length);
        return `${clean.slice(0, visibleStart)}${'*'.repeat(Math.min(maskLength, clean.length - visibleStart - visibleEnd))}${clean.slice(-visibleEnd)}`;
    };

    const maskPhone = (value?: string | null) => {
        if (!value) return t('profile.personalInfo.notAvailable');
        const digits = value.replace(/\D/g, '');
        if (digits.length < 4) return maskValue(value, 1, 1, 4);
        const prefix = digits.startsWith('998') ? '+998' : `+${digits.slice(0, Math.min(3, digits.length - 2))}`;
        return `${prefix} ** *** ** ${digits.slice(-2)}`;
    };

    const items = [
        { label: t('profile.edit.phone'), value: maskPhone(user.phone), rawValue: '', icon: Phone, color: 'text-[#0b4edb]', bg: 'bg-[#eef6ff]', border: 'border-[#cfe0f1]', sensitive: true },
        { label: t('profile.personalInfo.passport'), value: maskValue(user.passport_series, 2, 2, 5), rawValue: '', icon: FileText, color: 'text-[#0b4edb]', bg: 'bg-[#eef6ff]', border: 'border-[#cfe0f1]', sensitive: true },
        { label: t('profile.personalInfo.pinfl'), value: maskValue(user.pinfl, 4, 2, 8), rawValue: '', icon: CreditCard, color: 'text-[#0b4edb]', bg: 'bg-[#eef6ff]', border: 'border-[#cfe0f1]', sensitive: true },
        { label: t('profile.personalInfo.dateOfBirth'), value: user.date_of_birth, rawValue: user.date_of_birth, icon: Calendar, color: 'text-[#15835b]', bg: 'bg-[#effbf5]', border: 'border-[#ccebdc]', sensitive: false },
        { label: t('profile.personalInfo.region'), value: user.region, rawValue: user.region, icon: MapPin, color: 'text-[#0784a6]', bg: 'bg-[#eafaff]', border: 'border-[#bdebf7]', sensitive: false },
        { label: t('profile.personalInfo.district'), value: user.district ? user.district : t('profile.personalInfo.notAvailable'), rawValue: user.district ?? '', icon: MapPin, color: 'text-[#0784a6]', bg: 'bg-[#eafaff]', border: 'border-[#bdebf7]', sensitive: false },
        { label: t('profile.personalInfo.address'), value: user.address, rawValue: user.address, icon: MapPin, color: 'text-[#334a62]', bg: 'bg-[#f2f6fa]', border: 'border-[#dbe8f4]', sensitive: false },
        { label: t('profile.personalInfo.referrals'), value: t('profile.personalInfo.referralCount', { count: user.referral_count }), rawValue: '', icon: Users, color: 'text-[#15835b]', bg: 'bg-[#effbf5]', border: 'border-[#ccebdc]', sensitive: false },
    ];

    return (
        <div className="mb-8 max-w-md mx-auto md:max-w-none md:mx-0 md:px-0">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-normal text-[#0b4edb]">
                        {t('profile.personalInfo.secureLabel', 'Himoyalangan')}
                    </p>
                    <h3 className="text-lg font-semibold text-[#07182f]">
                        {t('profile.personalInfo.title')}
                    </h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#cfe0f1] bg-[#eef6ff] text-[#0b4edb]">
                    <ShieldCheck className="h-5 w-5" />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-[0_8px_20px_rgba(10,35,70,0.05)] border border-[#dbe8f4] overflow-hidden">
                <div className="divide-y divide-[#edf3f8] md:divide-y-0 md:grid md:grid-cols-2 md:gap-2 md:p-2">
                    {items.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 + 0.2 }}
                            className="p-4 flex items-center justify-between group hover:bg-[#f8fbfe] transition-colors md:rounded-lg"
                            onClick={() => {
                                if (!item.sensitive && item.rawValue) {
                                    navigator.clipboard.writeText(item.rawValue);
                                }
                            }}
                        >
                            <div className="flex min-w-0 items-center gap-4">
                                <div className={`p-2.5 rounded-lg border ${item.border} ${item.bg} ${item.color}`}>
                                    <item.icon size={18} />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                    <span className="text-xs md:text-sm text-[#7d91a8] font-medium">{item.label}</span>
                                    <span className="break-words text-sm md:text-base font-semibold text-[#07182f]">{item.value || t('profile.personalInfo.notAvailable')}</span>
                                </div>
                            </div>
                            {item.sensitive && (
                                <span className="ml-3 shrink-0 rounded-full border border-[#dbe8f4] bg-[#f8fbfe] px-2 py-1 text-[10px] font-bold text-[#63758a]">
                                    {t('profile.personalInfo.masked', 'Maxfiy')}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
