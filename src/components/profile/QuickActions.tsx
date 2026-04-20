import { CreditCard, FilePlus, UserCog } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface QuickActionsProps {
    onWalletClick: () => void;
    onCardsClick: () => void;
    onPassportsClick: () => void;
}

export const QuickActions = memo(({ onWalletClick, onCardsClick, onPassportsClick }: QuickActionsProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-3 gap-3 px-4 mb-6 md:mb-0 md:px-0 md:max-w-none md:gap-4 max-w-lg mx-auto md:mx-0">
            <ActionButton
                icon={<CreditCard className="h-6 w-6 text-[#0b4edb]" />}
                label={t('profile.quickActions.payments')}
                onClick={onWalletClick}
                delay={0.1}
                bgColor="bg-[#eef6ff]"
            />
            <ActionButton
                icon={<FilePlus className="h-6 w-6 text-[#15835b]" />}
                label={t('profile.quickActions.addPassport')}
                onClick={onPassportsClick}
                delay={0.2}
                bgColor="bg-[#effbf5]"
            />
            <ActionButton
                icon={<UserCog className="h-6 w-6 text-[#334a62]" />}
                label={t('profile.quickActions.myCards')}
                onClick={onCardsClick}
                delay={0.3}
                bgColor="bg-[#f2f6fa]"
            />
        </div>
    );
});
QuickActions.displayName = 'QuickActions';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    delay: number;
    bgColor: string;
}

const ActionButton = memo(({ icon, label, onClick, delay, bgColor }: ActionButtonProps) => {
    return (
        <button
            className="
                group relative flex flex-col items-center justify-center p-3 h-28 md:h-32 w-full
                rounded-lg transition-all duration-300
                bg-white
                border border-[#dbe8f4]
                shadow-sm
                hover:border-[#0b84e5] hover:bg-[#f8fbfe]
                active:scale-95 active:shadow-inner
            "
            onClick={onClick}
            style={{ animationDelay: `${delay}s` }}
        >
            <div className={`
                w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-3
                transition-transform duration-300 group-hover:scale-110 group-active:scale-90
                ${bgColor}
            `}>
                {icon}
            </div>

            <span className="text-xs md:text-sm font-bold text-[#07182f] tracking-normal">
                {label}
            </span>
        </button>
    );
});
ActionButton.displayName = 'ActionButton';
