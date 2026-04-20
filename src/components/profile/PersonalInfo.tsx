import { motion } from 'framer-motion';
import { FileText, CreditCard, MapPin, Calendar, Users, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type ProfileResponse } from '@/types/profile';

interface PersonalInfoProps {
    user: ProfileResponse;
}

export const PersonalInfo = ({ user }: PersonalInfoProps) => {
    const { t } = useTranslation();

    const maskValue = (value?: string | null, visibleStart = 2, visibleEnd = 2) => {
        if (!value) return t('profile.personalInfo.notAvailable');
        const clean = String(value);
        if (clean.length <= visibleStart + visibleEnd) return '*'.repeat(clean.length);
        return `${clean.slice(0, visibleStart)}${'•'.repeat(Math.min(6, clean.length - visibleStart - visibleEnd))}${clean.slice(-visibleEnd)}`;
    };

    const items = [
        { label: t('profile.edit.phone'), value: maskValue(user.phone, 4, 2), rawValue: '', icon: Phone, color: 'text-[#0b4edb]', bg: 'bg-[#eef6ff]', sensitive: true },
        { label: t('profile.personalInfo.passport'), value: maskValue(user.passport_series, 2, 2), rawValue: '', icon: FileText, color: 'text-[#0b4edb]', bg: 'bg-[#eef6ff]', sensitive: true },
        { label: t('profile.personalInfo.pinfl'), value: maskValue(user.pinfl, 3, 3), rawValue: '', icon: CreditCard, color: 'text-[#0b4edb]', bg: 'bg-[#eef6ff]', sensitive: true },
        { label: t('profile.personalInfo.dateOfBirth'), value: user.date_of_birth, rawValue: user.date_of_birth, icon: Calendar, color: 'text-[#15835b]', bg: 'bg-[#effbf5]', sensitive: false },
        { label: t('profile.personalInfo.region'), value: user.region, rawValue: user.region, icon: MapPin, color: 'text-[#0784a6]', bg: 'bg-[#eafaff]', sensitive: false },
        { label: t('profile.personalInfo.district'), value: user.district ? user.district : t('profile.personalInfo.notAvailable'), rawValue: user.district ?? '', icon: MapPin, color: 'text-[#0784a6]', bg: 'bg-[#eafaff]', sensitive: false },
        { label: t('profile.personalInfo.address'), value: user.address, rawValue: user.address, icon: MapPin, color: 'text-[#334a62]', bg: 'bg-[#f2f6fa]', sensitive: false },
        { label: t('profile.personalInfo.referrals'), value: t('profile.personalInfo.referralCount', { count: user.referral_count }), rawValue: '', icon: Users, color: 'text-[#15835b]', bg: 'bg-[#effbf5]', sensitive: false },
    ];



    return (
        <div className="mb-8 max-w-md mx-auto md:max-w-none md:mx-0 md:px-0">
            <h3 className="text-lg font-semibold text-[#07182f] mb-4 pl-1">
                <span className="w-1 h-4 bg-[#0b4edb] rounded-full inline-block mr-2"></span>
                {t('profile.personalInfo.title')}
            </h3>
            <div className="bg-white rounded-lg shadow-sm border border-[#dbe8f4] overflow-hidden">
                <div className="divide-y divide-[#edf3f8] md:divide-y-0 md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-0">
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
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-lg ${item.bg} ${item.color}`}>
                                    <item.icon size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs md:text-sm text-[#7d91a8] font-medium">{item.label}</span>
                                    <span className="text-sm md:text-base font-semibold text-[#07182f]">{item.value || t('profile.personalInfo.notAvailable')}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
