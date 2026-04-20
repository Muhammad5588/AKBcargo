import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Plane, CheckCircle, FileText, PackageCheck, ChevronDown, Scale, Box, Calculator, CalendarClock
} from "lucide-react";
import type { TrackCodeSearchResponse } from "@/api/services/cargo";
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';

interface TrackResultCardProps {
    data: TrackCodeSearchResponse;
}

export function TrackResultCard({ data }: TrackResultCardProps) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const allItems = useMemo(() => data.items ?? [], [data]);

    const formatMoney = (val?: string | number | null) => {
        if (val == null || val === '') return null;
        const num = Number(val);
        return isNaN(num) ? val : num.toLocaleString('ru-RU');
    };

    const summaryStatus = useMemo(() => {
        if (allItems.some(i => i.is_taken_away)) return { label: t('cargoStatus.taken'), bg: "bg-[#f2f6fa]", text: "text-[#334a62]", border: "border-[#dbe8f4]" };
        if (allItems.some(i => i.is_sent_web)) return { label: t('cargoStatus.reportReady'), bg: "bg-[#effbf5]", text: "text-[#15835b]", border: "border-[#ccebdc]" };
        if (allItems.some(i => i.checkin_status === 'post')) return { label: t('cargoStatus.inUzb'), bg: "bg-[#effbf5]", text: "text-[#15835b]", border: "border-[#ccebdc]" };
        if (allItems.some(i => i.checkin_status === 'pre')) return { label: t('cargoStatus.inChina'), bg: "bg-[#eef6ff]", text: "text-[#0b4edb]", border: "border-[#c7dcf3]" };
        return { label: t('cargoStatus.pending'), bg: "bg-[#f2f6fa]", text: "text-[#63758a]", border: "border-[#dbe8f4]" };
    }, [allItems, t]);

    const steps = useMemo(() => {
        const hasChina = allItems.some(i => !!i.pre_checkin_date || i.checkin_status === 'pre' || i.checkin_status === 'post');
        const hasUz = allItems.some(i => !!i.post_checkin_date || i.checkin_status === 'post');
        const hasSentWeb = allItems.some(i => i.is_sent_web);
        const hasTaken = allItems.some(i => i.is_taken_away);

        const wayStatus = hasChina ? (hasUz ? 'completed' : 'active') : 'upcoming';

        return [
            { id: 1, label: t('cargoSteps.china'), icon: MapPin, status: hasChina ? 'completed' : 'upcoming' },
            { id: 2, label: t('cargoSteps.onWay'), icon: Plane, status: wayStatus },
            { id: 3, label: t('cargoSteps.uzb'), icon: CheckCircle, status: hasUz ? 'completed' : 'upcoming' },
            { id: 4, label: t('cargoSteps.report'), icon: FileText, status: hasSentWeb ? 'completed' : 'upcoming' },
            { id: 5, label: t('cargoSteps.distribute'), icon: PackageCheck, status: hasTaken ? 'completed' : 'upcoming' },
        ];
    }, [allItems, t]);

    return (
        <motion.div
            layout
            onClick={() => setExpanded(!expanded)}
            className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${expanded ? 'border-[#0b84e5] shadow-sm ring-2 ring-[#37c5f3]/20' : 'border-[#dbe8f4] shadow-sm hover:border-[#0b84e5]'}`}
        >
            <div className="p-4 sm:p-6 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl sm:text-3xl font-black font-mono tracking-normal text-[#07182f]">
                        {data.track_code}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${summaryStatus.bg} ${summaryStatus.text} ${summaryStatus.border}`}>
                            {summaryStatus.label}
                        </span>
                        {allItems[0]?.flight_name && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold text-[#334a62] bg-[#f2f6fa] border border-[#dbe8f4]">
                                {t('cargoHistory.flight', { name: allItems[0].flight_name })}
                            </span>
                        )}
                    </div>
                </div>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#eef6ff] flex items-center justify-center border border-[#cfe0f1] shrink-0">
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#0b4edb]" />
                </motion.div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <div className="px-3 sm:px-6 pb-6 pt-2 border-t border-[#edf3f8]">
                            
                            {/* Responsive Flex Stepper */}
                            <div className="my-6 relative max-w-2xl mx-auto w-full">
                                <div className="absolute top-[18px] sm:top-[22px] left-[10%] right-[10%] h-px bg-[#dbe8f4] -z-10" />
                                
                                <div className="flex justify-between relative w-full">
                                    {steps.map((step) => {
                                        const isCompleted = step.status === 'completed';
                                        const isActive = step.status === 'active';
                                        const isUpcoming = step.status === 'upcoming';

                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-1.5 sm:gap-2 z-10 flex-1">
                                                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-500 border ${isCompleted ? 'bg-[#22a06b] text-white border-[#22a06b] shadow-sm' : isActive ? 'bg-[#0b4edb] text-white border-[#0b4edb] shadow-sm ring-2 ring-[#37c5f3]/20' : 'bg-white text-[#9fb7cc] border-dashed border-[#dbe8f4]'}`}>
                                                    <step.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${isUpcoming ? 'opacity-50' : ''}`} />
                                                </div>
                                                <span className={`text-[8px] sm:text-[10px] text-center uppercase tracking-normal leading-tight px-0.5 break-words w-full ${isCompleted ? 'text-[#15835b] font-bold' : isActive ? 'text-[#0b4edb] font-bold' : 'text-[#9fb7cc] font-medium'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {allItems.map((item) => (
                                    <div key={item.id} className="bg-[#f8fbfe] rounded-lg p-4 sm:p-6 border border-[#dbe8f4] relative overflow-hidden group">
                                        <div className={`absolute top-0 left-0 bottom-0 w-1 ${item.is_taken_away ? 'bg-[#37c5f3]' : item.is_sent_web ? 'bg-[#22a06b]' : 'bg-[#0b4edb]'}`} />
                                        <div className="pl-1 sm:pl-2 space-y-4 sm:space-y-6">
                                            
                                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#63758a] bg-white w-fit px-3 py-1.5 rounded-lg border border-[#dbe8f4] shadow-sm">
                                                <CalendarClock className="w-3 h-3 sm:w-4 sm:h-4 text-[#0b84e5]" />
                                                <span className="font-medium">{t('tracking.dateLabel')}</span>
                                                <span className="font-mono text-[#07182f]">
                                                    {item.taken_away_date ? format(new Date(item.taken_away_date), 'dd.MM.yyyy HH:mm') : item.post_checkin_date ? format(new Date(item.post_checkin_date), 'dd.MM.yyyy HH:mm') : item.pre_checkin_date ? format(new Date(item.pre_checkin_date), 'dd.MM.yyyy HH:mm') : t('tracking.noDate')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                                                <div className="col-span-2 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg border border-[#dbe8f4] shadow-sm">
                                                    <div>
                                                        <span className="text-[10px] sm:text-xs text-[#7d91a8] uppercase font-bold tracking-normal mb-1 block">{t('cargoHistory.names.cn')}</span>
                                                        <span className="text-sm sm:text-base font-semibold text-[#07182f]">{item.item_name_cn || t('cargoHistory.names.notEntered')}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] sm:text-xs text-[#7d91a8] uppercase font-bold tracking-normal mb-1 block">{t('cargoHistory.names.ru')}</span>
                                                        <span className="text-sm sm:text-base font-semibold text-[#07182f]">{item.item_name_ru || t('cargoHistory.names.notEntered')}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-[#dbe8f4] shadow-sm flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[#7d91a8]">
                                                        <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="text-[9px] sm:text-xs uppercase font-bold tracking-normal">{t('cargoHistory.details.actualWeight')}</span>
                                                    </div>
                                                    <span className="text-base sm:text-xl font-black font-mono text-[#07182f]">
                                                        {item.weight_kg != null && item.weight_kg !== '' ? `${item.weight_kg} kg` : t('cargoHistory.details.notMeasured')}
                                                    </span>
                                                </div>

                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-[#dbe8f4] shadow-sm flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[#7d91a8]">
                                                        <Box className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="text-[9px] sm:text-xs uppercase font-bold tracking-normal">{t('cargoHistory.details.boxCount')}</span>
                                                    </div>
                                                    <span className="text-base sm:text-xl font-black font-mono text-[#07182f]">
                                                        {item.box_number != null && item.box_number !== '' ? item.box_number : '-'}
                                                    </span>
                                                </div>

                                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-[#dbe8f4] shadow-sm flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[#7d91a8]">
                                                        <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        <span className="text-[9px] sm:text-xs uppercase font-bold tracking-normal">{t('cargoHistory.details.count')}</span>
                                                    </div>
                                                    <span className="text-base sm:text-xl font-black font-mono text-[#07182f]">
                                                        {item.quantity != null && item.quantity !== '' ? `${item.quantity} ta` : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-[#dbe8f4]">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] sm:text-xs text-[#63758a] uppercase font-bold tracking-normal mb-1">{t('cargoHistory.financials.pricePerKg')}</span>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-lg sm:text-xl font-bold font-mono text-[#07182f]">
                                                                {item.price_per_kg_uzs != null && item.price_per_kg_uzs !== '' ? `${formatMoney(item.price_per_kg_uzs)} so'm` : t('cargoHistory.financials.notCalculated')}
                                                            </span>
                                                            {item.price_per_kg_usd != null && item.price_per_kg_usd !== '' && (
                                                                <span className="text-sm font-medium text-[#63758a]">(${item.price_per_kg_usd})</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:items-end w-full sm:w-auto bg-[#effbf5] p-4 sm:p-3 rounded-lg border border-[#ccebdc]">
                                                        <span className="text-[10px] sm:text-xs text-[#15835b] uppercase font-black tracking-normal mb-1">{t('cargoHistory.financials.totalPayment')}</span>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-xl sm:text-3xl font-black font-mono text-[#15835b]">
                                                                {item.total_payment_uzs != null && item.total_payment_uzs !== '' ? `${formatMoney(item.total_payment_uzs)} so'm` : t('cargoHistory.financials.notCalculated')}
                                                            </span>
                                                            {item.total_payment_usd != null && item.total_payment_usd !== '' && (
                                                                <span className="text-sm sm:text-base font-bold text-[#15835b]/70">(${item.total_payment_usd})</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {item.exchange_rate != null && item.exchange_rate !== '' && (
                                                    <div className="mt-3 flex justify-start sm:justify-end">
                                                        <span className="text-[10px] sm:text-xs font-medium text-[#63758a] bg-[#f2f6fa] px-3 py-1.5 rounded-lg">
                                                            {t('cargoHistory.financials.exchangeRate', { rate: formatMoney(item.exchange_rate) })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
