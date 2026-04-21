import { useState, memo, useRef, useEffect, useMemo, lazy, Suspense, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    MapPin,
    Calendar,
    Rocket,
    Edit3,
    // Info,
    ChevronLeft,
    ChevronRight,
    IdCard,
    Home,
    ScanBarcode,
    ShieldOff,
    Plane,
    // HelpCircle,
    ShieldAlert,
    // Newspaper,
    Wallet,
    MessageSquare,
    ListOrdered,
    Calculator, // Calculator bu yerda import qilingan
    Search,
    Package,
} from "lucide-react";
import TrackCodeTab from "./dashboard/TrackCodeTab";
import {
    getActiveCarouselItems,
    trackCarouselView,
    trackCarouselClick,
    type CarouselMediaItemResponse,
} from "@/api/services/carousel";
import CarouselMediaModal from "@/components/carousel/CarouselMediaModal";
import { toast } from "sonner";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { ActionButton, type ActionItemData } from "@/components/user_page/ActionButtons";
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from "framer-motion";
import { AKBLogo } from "@/components/user_panel/AKBLogo";
import { useProfile } from "@/hooks/useProfile";

interface CarouselItemData {
    id: number;
    type: "feature" | "ad";
    titleKey?: string;
    subKey?: string;
    title?: string;
    sub?: string;
    /** Tailwind accent classes for static items */
    gradient?: string;
    /** CSS accent value for items fetched from the API */
    gradientStyle?: string;
    bgIcon?: React.ReactNode;
    mainIcon?: React.ReactNode;
    mediaType?: "image" | "video" | "gif";
    mediaUrl?: string;
    actionUrl?: string;
    textColor?: string;
    /** True when this item came from the API and should be tracked */
    fromApi?: boolean;
    /** Gallery slides — drives the media detail modal when length > 1 */
    mediaItems?: CarouselMediaItemResponse[];
}

// --- Data ---
const CAROUSEL_ITEMS: CarouselItemData[] = [
    // {
    //     id: 5,
    //     type: "feature",
    //     titleKey: "dashboard.carousel.news.title",
    //     subKey: "dashboard.carousel.news.sub",
    //     gradient: "from-[#eef7ff] to-[#eafaff]",
    //     bgIcon: <Newspaper className="text-white/10 absolute -right-4 -top-4" style={{ width: 96, height: 96 }} />,
    //     mainIcon: <Newspaper className="text-white/90" style={{ width: 32, height: 32 }} />,
    // },
    {
        id: 1,
        type: "feature",
        titleKey: "dashboard.carousel.prohibited.title",
        subKey: "dashboard.carousel.prohibited.sub",
        gradient: "from-[#fff5f5] to-[#eef7ff]",
        bgIcon: <ShieldAlert className="text-white/10 absolute -right-4 -top-4" style={{ width: 96, height: 96 }} />,
        mainIcon: <ShieldOff style={{ width: 32, height: 32 }} />,
    },
    {
        id: 2,
        type: "feature",
        titleKey: "dashboard.carousel.id.title",
        subKey: "dashboard.carousel.id.sub",
        gradient: "from-[#f8fbfe] to-[#eef7ff]",
        bgIcon: <IdCard className="text-white/10 absolute -right-4 -top-4" style={{ width: 96, height: 96 }} />,
        mainIcon: <IdCard style={{ width: 32, height: 32 }} />,
    },
    {
        id: 3,
        type: "feature",
        titleKey: "dashboard.carousel.delivery.title",
        subKey: "dashboard.carousel.delivery.sub",
        gradient: "from-[#eafaff] to-[#eef7ff]",
        bgIcon: <Rocket className="text-white/10 absolute -right-4 -top-4" style={{ width: 96, height: 96 }} />,
        mainIcon: <Plane style={{ width: 32, height: 32 }} />,
    },
    // {
    //     id: 4,
    //     type: "feature",
    //     titleKey: "dashboard.carousel.help.title",
    //     subKey: "dashboard.carousel.help.sub",
    //     gradient: "from-[#eafaff] to-[#eef7ff]",
    //     bgIcon: <HelpCircle className="text-white/10 absolute -right-4 -top-4" style={{ width: 96, height: 96 }} />,
    //     mainIcon: <Info className="text-white/90" style={{ width: 32, height: 32 }} />,
    // },
];

const PRIMARY_ACTIONS: (Omit<ActionItemData, 'label' | 'desc' | 'badge' | 'actionLabel'> & { labelKey: string; descKey: string; badgeKey: string; actionLabelKey: string })[] = [
    {
        id: "request",
        icon: <Edit3 className="w-5 h-5" />,
        bgIcon: <Edit3 style={{ width: 80, height: 80 }} />,
        labelKey: "dashboard.actions.request.label",
        descKey: "dashboard.actions.request.desc",
        badgeKey: "dashboard.actions.request.badge",
        actionLabelKey: "dashboard.actions.request.action",
        theme: "blue",
        priority: "primary",
    },
    {
        id: "report",
        icon: <Package className="w-5 h-5" />,
        bgIcon: <Package style={{ width: 80, height: 80 }} />,
        labelKey: "dashboard.sections.myCargo",
        descKey: "dashboard.sections.cargoReport",
        badgeKey: "dashboard.actions.history.badge",
        actionLabelKey: "dashboard.actions.history.action",
        theme: "cyan",
        priority: "primary",
    },
    {
        id: "payment",
        icon: <Wallet className="w-5 h-5" />,
        bgIcon: <Wallet style={{ width: 80, height: 80 }} />,
        labelKey: "dashboard.actions.payment.label",
        descKey: "dashboard.actions.payment.desc",
        badgeKey: "dashboard.actions.payment.badge",
        actionLabelKey: "dashboard.actions.payment.action",
        theme: "green",
        priority: "primary",
    },
    {
        id: "china",
        icon: <MapPin className="w-5 h-5" />,
        bgIcon: <MapPin style={{ width: 80, height: 80 }} />,
        labelKey: "dashboard.actions.china.label",
        descKey: "dashboard.actions.china.desc",
        badgeKey: "dashboard.actions.china.badge",
        actionLabelKey: "dashboard.actions.china.action",
        theme: "slate",
        priority: "primary",
    },
];

const SECONDARY_ACTIONS: (Omit<ActionItemData, 'label' | 'desc' | 'badge' | 'actionLabel'> & { labelKey: string; descKey: string; badgeKey: string; actionLabelKey: string })[] = [
    {
        id: "calculator",
        icon: <Calculator className="w-5 h-5" />,
        bgIcon: <Calculator style={{ width: 72, height: 72 }} />,
        labelKey: "dashboard.actions.calculator.label",
        descKey: "dashboard.actions.calculator.desc",
        badgeKey: "dashboard.actions.calculator.badge",
        actionLabelKey: "dashboard.actions.calculator.action",
        theme: "cyan",
        priority: "secondary",
    },
    {
        id: "schedule",
        icon: <Calendar className="w-5 h-5" />,
        bgIcon: <Calendar style={{ width: 72, height: 72 }} />,
        labelKey: "dashboard.actions.schedule.label",
        descKey: "dashboard.actions.schedule.desc",
        badgeKey: "dashboard.actions.schedule.badge",
        actionLabelKey: "dashboard.actions.schedule.action",
        theme: "blue",
        priority: "secondary",
    },
    {
        id: "delivery_history",
        icon: <ListOrdered className="w-5 h-5" />,
        bgIcon: <ListOrdered style={{ width: 72, height: 72 }} />,
        labelKey: "dashboard.actions.history.label",
        descKey: "dashboard.actions.history.desc",
        badgeKey: "dashboard.actions.history.badge",
        actionLabelKey: "dashboard.actions.history.action",
        theme: "slate",
        priority: "secondary",
    },
];

const cubeCardVariants = {
    enter: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 38 : -38,
        rotateY: direction > 0 ? 30 : -30,
        scale: 0.96,
    }),
    center: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        scale: 1,
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -38 : 38,
        rotateY: direction > 0 ? -30 : 30,
        scale: 0.96,
    }),
};

const CarouselCard = memo(({ item, onView }: { item: CarouselItemData; onView?: () => void }) => {
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);
    const isAd = item.type === "ad";
    const title = item.titleKey ? t(item.titleKey) : item.title;
    const sub = item.subKey ? t(item.subKey) : item.sub;

    // Fire onView once when the card is ≥50% visible (IntersectionObserver)
    useEffect(() => {
        if (!onView || !cardRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onView();
                    observer.disconnect();
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [onView]);

    if (isAd) {
        return (
            <div
                ref={cardRef}
                className="
                    h-full w-full rounded-lg relative overflow-hidden text-left
                    cursor-pointer transition-all duration-300
                    border border-[#dbe8f4] bg-white shadow-[0_10px_24px_rgba(15,47,87,0.08)] group
                    hover:border-[#0b84e5]
                "
            >
                {item.mediaUrl && (
                    item.mediaType === "video" ? (
                        <video
                            src={item.mediaUrl}
                            className="absolute inset-y-0 right-0 h-full w-[58%] object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <img
                            src={item.mediaUrl}
                            alt={item.title || "Ad"}
                            className="absolute inset-y-0 right-0 h-full w-[58%] object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                        />
                    )
                )}

                {item.mediaUrl && (
                    <div
                        className="absolute inset-y-0 right-0 w-[62%]"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(var(--akb-surface-rgb, 255, 255, 255), 1) 0%, rgba(var(--akb-surface-rgb, 255, 255, 255), 0.84) 26%, rgba(var(--akb-surface-rgb, 255, 255, 255), 0) 100%)",
                        }}
                    />
                )}
                <div className="absolute inset-x-0 top-0 h-1 bg-[#0b4edb]" />
                <div className="absolute left-4 top-4 rounded-md border border-[#cfe0f1] bg-[#eef7ff] px-2 py-1 text-[10px] font-semibold uppercase text-[#0b4edb]">
                    {t('dashboard.carousel.badge', 'Yangilik')}
                </div>

                <div className="absolute inset-0 flex max-w-[72%] flex-col justify-end p-5 sm:p-6">
                    {title && (
                        <h3
                            className="mb-2 text-lg font-semibold leading-tight text-[#07182f] sm:text-xl"
                            style={item.textColor && item.textColor !== "#ffffff" ? { color: item.textColor } : undefined}
                        >
                            {title}
                        </h3>
                    )}
                    {sub && (
                        <p className="flex items-center gap-1 text-sm font-medium leading-snug text-[#63758a]">
                            {sub} <ChevronRight className="w-4 h-4" />
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Feature card — supports both Tailwind gradient classes (static) and CSS gradient value (API)
return (
    <div
        ref={cardRef}
        className={`
            h-full w-full rounded-lg relative overflow-hidden
            cursor-pointer transition-all duration-300
            border border-[#dbe8f4] bg-white shadow-[0_10px_24px_rgba(15,47,87,0.08)]
            hover:border-[#0b84e5]
        `}
    >
        {/* Background media — faqat mediaUrl bo'lib, mainIcon bo'lmaganda */}
        {item.mediaUrl && !item.mainIcon && (
            <>
                <img
                    src={item.mediaUrl}
                    alt={item.title || "Feature"}
                    className="absolute inset-y-0 right-0 h-full w-[72%] object-cover"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(var(--akb-surface-rgb, 255, 255, 255), 1) 0%, rgba(var(--akb-surface-rgb, 255, 255, 255), 0.92) 45%, rgba(var(--akb-surface-rgb, 255, 255, 255), 0.12) 100%)",
                    }}
                />
            </>
        )}

        {/* Content */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#0b4edb]" />
        <div className="absolute right-4 top-4 h-16 w-16 rounded-lg border border-[#dbe8f4] bg-[#f8fbfe]" />
        <div className="h-full flex flex-col justify-between relative z-10 p-5 sm:p-6">
            {/* Top: icon yoki thumbnail */}
            {item.mainIcon ? (
                <div className="w-12 h-12 rounded-lg border border-[#cfe0f1] bg-[#eef7ff] text-[#0b4edb] flex items-center justify-center [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-current">
                    {item.mainIcon}
                </div>
            ) : item.mediaUrl ? (
                // mediaUrl bor, mainIcon yo'q — top-left badge
                <div className="self-start rounded-md border border-[#cfe0f1] bg-[#eef7ff] px-2 py-1 text-[10px] font-bold uppercase tracking-normal text-[#0b4edb]">
                    {t('dashboard.carousel.badge', 'Yangilik')}
                </div>
            ) : (
                <div /> // spacer — text pastda qolsin
            )}

            {/* Bottom: title + sub */}
            <div className={item.mediaUrl && !item.mainIcon ? "max-w-[72%]" : ""}>
                <h3
                    className="mb-2 text-lg font-semibold leading-tight text-[#07182f] sm:text-xl"
                    style={item.textColor && item.textColor !== "#ffffff" ? { color: item.textColor } : undefined}
                >
                    {title}
                </h3>
                {sub && (
                    <p
                        className="text-sm font-medium leading-snug text-[#63758a]"
                    >
                        {sub}
                    </p>
                )}
            </div>
        </div>
    </div>
);
});

const UniqueBackground = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
            className="absolute inset-0"
            style={{
                background:
                    "linear-gradient(180deg, var(--akb-page-top, #f7fbff) 0%, var(--akb-page-bg, #f4f8fc) 48%, var(--akb-page-bottom, #eef5fb) 100%)",
            }}
        />
        <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ backgroundColor: "var(--akb-border-strong, #cfe0f1)" }}
        />
    </div>
);

const SectionTitle = memo(({
    children,
    eyebrow,
    accessory,
}: {
    children: React.ReactNode;
    eyebrow?: string;
    accessory?: React.ReactNode;
}) => {
    return (
        <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="mb-1 text-[11px] font-semibold uppercase text-[#0b84e5]">
                        {eyebrow}
                    </p>
                )}
                <h2 className="text-lg font-semibold leading-tight tracking-normal text-[#07182f]">
                    {children}
                </h2>
            </div>
            {accessory}
        </div>
    );
});

SectionTitle.displayName = "SectionTitle";

// --- Compact Subpage Tab Component ---
const HeaderTabs = memo(({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) => {
    const { t } = useTranslation();
    const trackLabel = activeTab === 'track'
        ? t('dashboard.tabs.track')
        : activeTab === 'schedule'
            ? t('dashboard.tabs.schedule')
            : activeTab === 'request'
                ? t('dashboard.tabs.request')
                : activeTab === 'delivery_history'
                    ? t('dashboard.tabs.history')
                    : t('dashboard.tabs.track');

    return (
        <div className="relative mb-5 z-10">
            <div className="grid grid-cols-[1fr_1.35fr] items-center gap-2 rounded-lg border border-[#dbe8f4] bg-white p-1.5 shadow-sm">
                <button
                    onClick={() => setActiveTab("home")}
                    className="relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md px-3 text-sm font-semibold text-[#63758a] transition-colors hover:bg-[#eef6ff] hover:text-[#0b4edb]"
                >
                    <Home className="h-4 w-4" />
                    <span className="relative z-10">{t('dashboard.tabs.home')}</span>
                </button>

                <div
                    className="relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md bg-[#0b4edb] px-3 text-sm font-semibold text-white shadow-sm"
                >
                    {activeTab === 'track' ? (
                        <ScanBarcode className="relative z-10 h-4 w-4" />
                    ) : activeTab === 'schedule' ? (
                        <Calendar className="relative z-10 h-4 w-4" />
                    ) : activeTab === 'request' ? (
                        <Edit3 className="relative z-10 h-4 w-4" />
                    ) : activeTab === 'delivery_history' ? (
                        <ListOrdered className="relative z-10 h-4 w-4" />
                    ) : (
                        <ScanBarcode className="relative z-10 h-4 w-4" />
                    )}
                    <span className="relative z-10">{trackLabel}</span>
                </div>
            </div>

        </div>
    );
});

const PageLoadingFallback = memo(() => {
    const { t } = useTranslation();
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center w-full animate-in fade-in duration-300">
            <div className="w-16 h-16 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#dbe8f4]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-cyan-500 animate-spin"></div>
                <Plane className="w-6 h-6 text-cyan-500 animate-pulse absolute" />
            </div>
            <p className="mt-4 text-sm font-medium text-[#63758a] animate-pulse">
                {t('dashboard.loading')}
            </p>
        </div>
    );
});

const LanguageSwitcher = memo(() => {
    const { i18n } = useTranslation();
    const language = i18n.language || "uz";

    return (
        <div className="flex items-center rounded-lg border border-[#dbe8f4] bg-white p-1 shadow-sm">
            {(["uz", "ru"] as const).map((lng) => (
                <button
                    key={lng}
                    type="button"
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`h-8 rounded-md px-2.5 text-xs font-bold uppercase transition-colors ${
                        language.startsWith(lng)
                            ? "bg-[#0b4edb] text-white"
                            : "text-[#63758a] hover:bg-[#eef6ff] hover:text-[#0b4edb]"
                    }`}
                >
                    {lng}
                </button>
            ))}
        </div>
    );
});

const DashboardHeader = memo(({ name }: { name?: string }) => {
    const { t } = useTranslation();
    const displayName = name?.trim().split(/\s+/)[0];

    return (
        <header className="mb-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
                <AKBLogo />
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <NotificationCenter />
                </div>
            </div>

            <div className="rounded-lg border border-[#dbe8f4] bg-white p-4 shadow-[0_8px_20px_rgba(15,47,87,0.05)]">
                <p className="text-sm font-medium text-[#0b84e5]">{t('dashboard.greeting', 'Assalomu alaykum 👋')}</p>
                <h1 className="mt-1 max-w-md text-xl font-semibold leading-tight text-[#07182f]">
                    {displayName
                        ? `${displayName}, ${t('dashboard.welcomeCabinet', 'welcome to your AKB Cargo cabinet')}`
                        : t('dashboard.customerWelcome', 'Welcome to your AKB Cargo cabinet')}
                </h1>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#7d91a8]">
                    {t('dashboard.customer', 'AKB Cargo mijozi')}
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#63758a]">
                    {t('dashboard.heroSubtitle', 'Yukingizni kuzating, zayavka qoldiring va to‘lovlarni boshqaring.')}
                </p>
            </div>
        </header>
    );
});

const QuickTrackSearch = memo(({
    onSubmit,
    onCargoClick,
}: {
    onSubmit: (code: string) => void;
    onCargoClick?: () => void;
}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const clean = value.trim().toUpperCase();
        if (clean.length < 3) {
            toast.error(t('tracking.validation'));
            return;
        }
        onSubmit(clean);
    };

    return (
        <section className="rounded-lg border border-[#cfe0f1] bg-white p-4 shadow-[0_12px_28px_rgba(15,47,87,0.08)]">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase text-[#0b84e5]">
                        {t('dashboard.trackModule.kicker', 'Tezkor qidiruv')}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[#07182f]">
                        {t('tracking.title')}
                    </h2>
                    <p className="mt-1 text-sm leading-snug text-[#63758a]">
                        {t('dashboard.trackModule.subtitle', 'Trek-kodni kiriting va yuk holatini tez tekshiring.')}
                    </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef7ff] text-[#0b4edb]">
                    <ScanBarcode className="h-5 w-5" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="relative min-w-0">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d91a8]" />
                    <input
                        value={value}
                        onChange={(event) => setValue(event.target.value.toUpperCase())}
                        placeholder={t('tracking.placeholder', 'Trek-kodni kiriting')}
                        className="h-12 w-full rounded-lg border border-[#cfe0f1] bg-[#f8fbfe] pl-9 pr-3 font-mono text-base font-semibold text-[#07182f] placeholder:font-sans placeholder:text-sm placeholder:font-medium placeholder:text-[#7d91a8] focus:border-[#0b84e5] focus:outline-none focus:ring-2 focus:ring-[#37c5f3]/20"
                    />
                </div>
                <button
                    type="submit"
                    className="h-12 rounded-lg bg-[#0b4edb] px-5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(11,78,219,0.18)] transition-colors hover:bg-[#073fba] active:bg-[#063493]"
                >
                    {t('tracking.search', 'Qidirish')}
                </button>
            </form>

            <button
                type="button"
                onClick={onCargoClick}
                className="mt-3 flex w-full items-center justify-between rounded-lg border border-[#dbe8f4] bg-[#f8fbfe] px-3 py-2.5 text-sm font-semibold text-[#0b4edb] transition-colors hover:border-[#cfe0f1] hover:bg-[#eef7ff]"
            >
                <span className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {t('dashboard.sections.myCargo')}
                </span>
                <ChevronRight className="h-4 w-4" />
            </button>
        </section>
    );
});

const ChinaAddressModal = lazy(() => import('../components/modals/ChinaAddressModal'));
const MakePaymentModal = lazy(() => import('../components/modals/MakePaymentModal'));
const FlightSchedulePage = lazy(() => import('../components/pages/FlightSchedulePage'));
const DeliveryRequestPage = lazy(() => import('../components/pages/DeliveryRequestPage'));
const DeliveryHistoryPage = lazy(() => import('../components/pages/DeliveryHistoryPage'));
const CalculatorModal = lazy(() => import('../components/modals/CalculatorModal'));
const ProhibitedItemsModal = lazy(() => import('../components/modals/ProhibitedItemsModal'));

interface DashboardProps {
    onNavigateToReports?: () => void;
    onNavigateToHistory?: () => void;
}

export default function Dashboard({ onNavigateToReports, onNavigateToHistory }: DashboardProps) {
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const valid = ["home", "track", "schedule", "request", "delivery_history"];
        return valid.includes(tab ?? "") ? (tab as string) : "home";
    });
    const [initialTrackView] = useState<'search' | 'history'>('search');
    const [isChinaModalOpen, setIsChinaModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isProhibitedModalOpen, setIsProhibitedModalOpen] = useState(false);
    const [trackAutoFocus, setTrackAutoFocus] = useState(false);
    const [initialTrackQuery, setInitialTrackQuery] = useState<string | undefined>();
    const [mediaModalItem, setMediaModalItem] = useState<CarouselItemData | null>(null);

    const { t } = useTranslation();
    const { data: profile } = useProfile();

    const { data: apiCarouselItems } = useQuery({
        queryKey: ['carousel-items'],
        queryFn: getActiveCarouselItems,
        staleTime: 5 * 60 * 1000,
        // Don't show error toasts — silently fall back to static items
        retry: 1,
    });

    const sortedCarouselItems = useMemo((): CarouselItemData[] => {
        // API items (ads + admin features) come first, sorted by their `order` field
        const fromApi: CarouselItemData[] = apiCarouselItems
            ? [...apiCarouselItems]
                .sort((a, b) => a.order - b.order)
                .map((item) => ({
                    id: item.id,
                    type: item.type as "ad" | "feature",
                    title: item.title ?? undefined,
                    sub: item.sub_title ?? undefined,
                    gradientStyle: item.gradient ?? 'linear-gradient(135deg, #eef7ff, #eafaff)',
                    mediaType: item.media_type,
                    mediaUrl: item.media_url,
                    actionUrl: item.action_url ?? undefined,
                    textColor: item.text_color,
                    fromApi: true,
                    mediaItems: item.media_items ?? [],
                }))
            : [];

        // Static feature cards (prohibited items, ID card, delivery info) always appended
        const staticFeatures = CAROUSEL_ITEMS
            .filter(i => i.type === "feature")
            .sort((a, b) => a.id - b.id);

        return [...fromApi, ...staticFeatures];
    }, [apiCarouselItems]);
    
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const carouselTouchStartX = useRef<number | null>(null);
    const carouselTouchStartY = useRef<number | null>(null);
    const viewedCarouselIdsRef = useRef<Set<number>>(new Set());
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
    const [carouselDirection, setCarouselDirection] = useState(1);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);

    const boundedCarouselIndex = sortedCarouselItems.length > 0
        ? Math.min(activeCarouselIndex, sortedCarouselItems.length - 1)
        : 0;
    const activeCarouselItem = sortedCarouselItems[boundedCarouselIndex];

    const handleCarouselStep = useCallback((direction: 1 | -1) => {
        if (sortedCarouselItems.length <= 1) {
            return;
        }

        setCarouselDirection(direction);
        setActiveCarouselIndex((currentIndex) => {
            return (currentIndex + direction + sortedCarouselItems.length) % sortedCarouselItems.length;
        });
    }, [sortedCarouselItems.length]);

    useEffect(() => {
        if (!activeCarouselItem?.fromApi || activeTab !== "home") {
            return;
        }

        if (viewedCarouselIdsRef.current.has(activeCarouselItem.id)) {
            return;
        }

        viewedCarouselIdsRef.current.add(activeCarouselItem.id);
        trackCarouselView(activeCarouselItem.id);
    }, [activeCarouselItem?.fromApi, activeCarouselItem?.id, activeTab]);

    useEffect(() => {
        if (activeTab !== "home" || isCarouselPaused || sortedCarouselItems.length <= 1) return;

        const interval = setInterval(() => {
            handleCarouselStep(1);
        }, 4500);

        return () => clearInterval(interval);
    }, [activeTab, handleCarouselStep, isCarouselPaused, sortedCarouselItems.length]);

    const handleSetActiveTab = useCallback((tab: string) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        if (tab === "home") {
            url.searchParams.delete("tab");
        } else {
            url.searchParams.set("tab", tab);
        }
        window.history.replaceState(null, "", url.toString());
    }, []);

    const handleHomeTrackSearch = (code: string) => {
        setTrackAutoFocus(false);
        setInitialTrackQuery(code);
        handleSetActiveTab("track");
    };

    const handleCarouselItemClick = useCallback((item: CarouselItemData) => {
        if (item.fromApi) {
            const hasGallery = (item.mediaItems?.length ?? 0) > 1;
            if (hasGallery) {
                // CASE B — open fullscreen media gallery modal;
                // click is tracked only when the CTA inside the modal is tapped
                setMediaModalItem(item);
            } else if (item.actionUrl) {
                // CASE A — single/no gallery: open action URL directly
                trackCarouselClick(item.id);
                window.open(item.actionUrl, "_blank");
            }
        } else {
            // Static item special actions
            if (item.id === 1) setIsProhibitedModalOpen(true);
        }
    }, []);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
        setIsCarouselPaused(true);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartX.current || !touchStartY.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const distanceX = touchStartX.current - touchEndX;
        const distanceY = touchStartY.current - touchEndY;
        const minSwipeDistance = 50;

        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            if (distanceX > minSwipeDistance) {
                handleSetActiveTab("track");
            }
            if (distanceX < -minSwipeDistance) {
                handleSetActiveTab("home");
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;

        setTimeout(() => setIsCarouselPaused(false), 3000);
    };

    const onCarouselTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        carouselTouchStartX.current = e.targetTouches[0].clientX;
        carouselTouchStartY.current = e.targetTouches[0].clientY;
        setIsCarouselPaused(true);
    };

    const onCarouselTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation();

        if (carouselTouchStartX.current === null || carouselTouchStartY.current === null) {
            setTimeout(() => setIsCarouselPaused(false), 3000);
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const distanceX = carouselTouchStartX.current - touchEndX;
        const distanceY = carouselTouchStartY.current - touchEndY;

        if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 36) {
            handleCarouselStep(distanceX > 0 ? 1 : -1);
        }

        carouselTouchStartX.current = null;
        carouselTouchStartY.current = null;
        setTimeout(() => setIsCarouselPaused(false), 3000);
    };

    const handleActionClick = (id: string) => {
        if (id === 'calculator') {
        setIsCalculatorOpen(true);
        return;
        } else if (id === 'history') {
            onNavigateToHistory?.();
            return;
        } else if (id === 'china') {
            setIsChinaModalOpen(true);
            return;
        } else if (id === 'schedule') {
            handleSetActiveTab('schedule');
            return;
        } else if (id === 'request') {
            handleSetActiveTab('request');
            return;
        } else if (id === 'delivery_history') {
            handleSetActiveTab('delivery_history');
            return;
        } else if (id === 'payment') {
            setIsPaymentModalOpen(true);
            return;
        } else if (id === 'report') {
            onNavigateToReports?.();
            return;
        } else {
            toast.info(t('dashboard.toast.comingSoon', { id }));
        }
    };

    return (
        <div
            className="min-h-screen bg-[#f4f8fc] text-[#07182f] pb-24 transition-colors duration-300 font-sans selection:bg-[#37c5f3]/20"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <UniqueBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
                <DashboardHeader name={profile?.full_name} />

                {activeTab !== "home" && (
                    <HeaderTabs activeTab={activeTab} setActiveTab={handleSetActiveTab} />
                )}

                {activeTab === 'schedule' && (
                    <Suspense fallback={<PageLoadingFallback />}>
                        <FlightSchedulePage
                            onBack={() => handleSetActiveTab('home')}
                            onNavigateToTrack={() => handleSetActiveTab('track')}
                        />
                    </Suspense>
                )}

                {activeTab === 'request' && (
                    <Suspense fallback={<PageLoadingFallback />}>
                        <DeliveryRequestPage
                            onBack={() => handleSetActiveTab('home')}
                            onNavigateToProfile={() => {/* Handle profile navigation if needed */}}
                            onNavigateToHistory={() => handleSetActiveTab('delivery_history')}
                        />
                    </Suspense>
                )}

                {activeTab === 'delivery_history' && (
                    <Suspense fallback={<PageLoadingFallback />}>
                        <DeliveryHistoryPage onBack={() => handleSetActiveTab('home')} />
                    </Suspense>
                )}

                {activeTab === "home" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <QuickTrackSearch
                            onSubmit={handleHomeTrackSearch}
                            onCargoClick={onNavigateToReports}
                        />

                        <section>
                            <SectionTitle eyebrow={t('dashboard.sections.priority', 'Asosiy yo\'nalishlar')}>
                                {t('dashboard.sections.mainActions', 'Asosiy amallar')}
                            </SectionTitle>

                            <div className="grid grid-cols-2 gap-3">
                                {PRIMARY_ACTIONS.map((action) => (
                                    <ActionButton
                                        key={action.id}
                                        item={{
                                            ...action,
                                            label: t(action.labelKey),
                                            desc: t(action.descKey),
                                            badge: t(action.badgeKey),
                                            actionLabel: t(action.actionLabelKey),
                                        }}
                                        onClick={() => handleActionClick(action.id)}
                                    />
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionTitle eyebrow={t('dashboard.sections.info', 'Muhim ma\'lumotlar')} accessory={
                                <div className="hidden md:flex items-center gap-2">
                                    <button
                                        onClick={() => handleCarouselStep(-1)}
                                        disabled={sortedCarouselItems.length <= 1}
                                        className="p-1.5 rounded-lg bg-white text-[#0b4edb] border border-[#dbe8f4] hover:bg-[#0b4edb] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0b4edb] transition-colors active:scale-95"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleCarouselStep(1)}
                                        disabled={sortedCarouselItems.length <= 1}
                                        className="p-1.5 rounded-lg bg-white text-[#0b4edb] border border-[#dbe8f4] hover:bg-[#0b4edb] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0b4edb] transition-colors active:scale-95"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            }>
                                {t('dashboard.sections.important')}
                            </SectionTitle>

                            <div
                                className="relative -mx-1 px-1 pb-4 sm:mx-0 sm:px-0"
                                onTouchStart={onCarouselTouchStart}
                                onTouchEnd={onCarouselTouchEnd}
                                onMouseEnter={() => setIsCarouselPaused(true)}
                                onMouseLeave={() => setIsCarouselPaused(false)}
                            >
                                <div className="relative h-[168px] overflow-hidden rounded-lg border border-[#dbe8f4] bg-white shadow-sm sm:h-[196px] [perspective:1200px]">
                                    <AnimatePresence initial={false} custom={carouselDirection}>
                                        {activeCarouselItem && (
                                            <motion.button
                                                type="button"
                                                key={`${activeCarouselItem.fromApi ? "api" : "static"}-${activeCarouselItem.id}`}
                                                custom={carouselDirection}
                                                variants={cubeCardVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{ type: "spring", stiffness: 230, damping: 27, mass: 0.72 }}
                                                className="group absolute inset-0 h-full w-full text-left outline-none [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                                onClick={() => handleCarouselItemClick(activeCarouselItem)}
                                            >
                                                <CarouselCard item={activeCarouselItem} />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {sortedCarouselItems.length > 1 && (
                                    <div className="mt-3 flex items-center justify-center gap-1.5">
                                        {sortedCarouselItems.map((item, index) => (
                                            <button
                                                key={`${item.fromApi ? "api" : "static"}-dot-${item.id}`}
                                                type="button"
                                                onClick={() => {
                                                    setCarouselDirection(index > boundedCarouselIndex ? 1 : -1);
                                                    setActiveCarouselIndex(index);
                                                }}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${index === boundedCarouselIndex ? "w-6 bg-[#0b4edb]" : "w-1.5 bg-[#cfe0f1] hover:bg-[#9edcf0]"}`}
                                                aria-label={`${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <SectionTitle eyebrow={t('dashboard.sections.more', 'Qo\'shimcha xizmatlar')}>
                                {t('dashboard.sections.services')}
                            </SectionTitle>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                {SECONDARY_ACTIONS.map((action) => (
                                    <ActionButton
                                        key={action.id}
                                        item={{
                                            ...action,
                                            label: t(action.labelKey),
                                            desc: t(action.descKey),
                                            badge: t(action.badgeKey),
                                            actionLabel: t(action.actionLabelKey),
                                        }}
                                        onClick={() => handleActionClick(action.id)}
                                    />
                                ))}
                            </div>
                        </section>

                        <section className="pb-8 px-1">
                            <button
                                className="
                                    group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden rounded-lg p-3
                                    bg-white text-[#07182f]
                                    border border-[#dbe8f4]
                                    active:scale-[0.98] transition-all duration-300 shadow-sm hover:border-[#0b84e5] hover:bg-[#f8fbfe]
                                "
                                onClick={() => window.open("https://t.me/mandarin_admin", "_blank")}
                            >
                                <div className="absolute inset-y-2 left-2 w-1 rounded-lg bg-[#0b84e5]" />
                                <div className="w-11 h-11 rounded-lg bg-[#eef7ff] text-[#0b4edb] flex items-center justify-center transition-transform group-hover:scale-105">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 text-left">
                                    <h3 className="text-sm font-bold">{t('dashboard.sections.feedback')}</h3>
                                    <p className="text-[10px] text-[#63758a] font-medium">
                                        {t('dashboard.sections.contactUs')}
                                    </p>
                                </div>
                                <div className="h-9 w-9 rounded-lg bg-[#0b4edb] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-[10px] text-[#9fb7cc] font-mono">
                                    v2.0 - AKB Cargo
                                </p>
                            </div>
                        </section>

                    </div>
                ) : activeTab === "track" ? (
                        <TrackCodeTab
                            key={`${initialTrackView}-${initialTrackQuery ?? "empty"}`}
                            initialView={initialTrackView}
                            initialQuery={initialTrackQuery}
                            autoFocus={trackAutoFocus}
                            onFocusConsumed={() => setTrackAutoFocus(false)}
                        />
                ) : null
                }

                <Suspense fallback={null}>
                    <ChinaAddressModal
                        isOpen={isChinaModalOpen}
                        onClose={() => setIsChinaModalOpen(false)}
                    />
                    <MakePaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                    />
                    <CalculatorModal
                        isOpen={isCalculatorOpen}
                        onClose={() => setIsCalculatorOpen(false)}
                    />
                    <ProhibitedItemsModal
                        isOpen={isProhibitedModalOpen}
                        onClose={() => setIsProhibitedModalOpen(false)}
                    />
                </Suspense>

                <CarouselMediaModal
                    isOpen={mediaModalItem !== null}
                    onClose={() => setMediaModalItem(null)}
                    itemId={mediaModalItem?.id ?? 0}
                    title={mediaModalItem?.title}
                    subTitle={mediaModalItem?.sub}
                    actionUrl={mediaModalItem?.actionUrl}
                    mediaItems={mediaModalItem?.mediaItems ?? []}
                />

            </div >
        </div >
    );
}
