import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface StatusAnimationProps {
  status: 'loading' | 'success' | 'error';
  message?: string;
  onComplete?: () => void;
}

const STYLES = `
  @keyframes modal-in {
    0%   { transform: scale(.8) translateY(24px); opacity: 0; }
    100% { transform: scale(1) translateY(0);     opacity: 1; }
  }
  @keyframes bounce-in {
    0%   { transform: scale(0);   opacity: 0; }
    60%  { transform: scale(1.25); }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes shake-x {
    0%,100% { transform: translateX(0);  }
    20%,60% { transform: translateX(-9px); }
    40%,80% { transform: translateX(9px);  }
  }
  @keyframes ring-expand {
    0%   { transform: scale(1);   opacity: .55; }
    100% { transform: scale(1.9); opacity: 0;   }
  }
  @keyframes glow-pulse {
    0%,100% { opacity: .18; }
    50%     { opacity: .38; }
  }
  @keyframes bounce-dot {
    0%,100% { transform: translateY(0);    }
    50%     { transform: translateY(-12px); }
  }
  @keyframes backdrop-in {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }

  .anim-modal    { animation: modal-in  .45s cubic-bezier(.34,1.56,.64,1) forwards; }
  .anim-bounce   { animation: bounce-in .65s cubic-bezier(.68,-.55,.265,1.55) forwards; }
  .anim-shake    { animation: shake-x   .65s cubic-bezier(.36,.07,.19,.97); }
  .ring-expand   { animation: ring-expand 1.6s ease-out infinite; }
  .glow-pulse    { animation: glow-pulse  2.2s ease-in-out infinite; }
  .backdrop-in   { animation: backdrop-in .3s ease forwards; }
  .dot-0 { animation: bounce-dot 1s ease-in-out infinite; animation-delay:  0s; }
  .dot-1 { animation: bounce-dot 1s ease-in-out infinite; animation-delay: .2s; }
  .dot-2 { animation: bounce-dot 1s ease-in-out infinite; animation-delay: .4s; }
`;

const GLOW: Record<string, string> = {
  loading: 'rgba(142,227,255,0.12)',
  success: 'rgba(126,226,168,0.12)',
  error:   'rgba(255,156,156,0.12)',
};

const BAR_GRADIENT: Record<string, string> = {
  loading: 'linear-gradient(90deg, transparent, rgba(142,227,255,0.15), rgb(142,227,255), transparent)',
  success: 'linear-gradient(90deg, transparent, rgba(126,226,168,0.15), rgb(126,226,168), transparent)',
  error:   'linear-gradient(90deg, transparent, rgba(255,156,156,0.15), rgb(255,156,156), transparent)',
};

const RING_COLOR: Record<string, string> = {
  loading: 'border-[#8EE3FF]',
  success: 'border-[#7EE2A8]',
  error:   'border-[#FF9C9C]',
};

export default function StatusAnimation({ status, message, onComplete }: StatusAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setShow(true));
    if (status !== 'loading' && onComplete) {
      const t = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(t);
    }
  }, [status, onComplete]);

  return (
    <>
      <style>{STYLES}</style>

      <div className={`backdrop-in fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>

        {/* backdrop */}
        <div className="absolute inset-0 bg-[#0B1220]/56 backdrop-blur-sm" />

        {/* card */}
        <div
          className="anim-modal relative mx-4 flex min-w-[300px] max-w-sm flex-col items-center gap-6 rounded-[28px] border border-[#dbe8f4] bg-white p-10 dark:border-[#233554] dark:bg-[#111A2E]"
          style={{ boxShadow: `0 24px 52px rgba(2,10,20,.34), 0 0 0 1px rgba(255,255,255,.03), 0 0 36px ${GLOW[status]}` }}
        >
          {/* top accent bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-3xl" style={{ background: BAR_GRADIENT[status] }} />

          {/* dot-grid */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          {/* ── Icon section ── */}
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* ping ring */}
            <div className={`ring-expand absolute w-24 h-24 rounded-full border-2 ${RING_COLOR[status]}`} />

            {status === 'loading' && (
              <>
                <Loader2 className="relative z-10 h-20 w-20 animate-spin text-[#0b4edb] dark:text-[#8EE3FF]" />
                <div className="glow-pulse absolute h-20 w-20 rounded-full bg-[#0b4edb]/10 blur-lg dark:bg-[#8EE3FF]/12" />
              </>
            )}

            {status === 'success' && (
              <div className="anim-bounce relative z-10">
                <CheckCircle2 className="h-20 w-20 text-[#15835b] dark:text-[#7EE2A8]" />
                <div className="glow-pulse absolute inset-0 h-20 w-20 rounded-full bg-[#15835b]/12 blur-lg dark:bg-[#7EE2A8]/12" />
              </div>
            )}

            {status === 'error' && (
              <div className="anim-shake relative z-10">
                <XCircle className="h-20 w-20 text-[#c44747] dark:text-[#FF9C9C]" />
                <div className="glow-pulse absolute inset-0 h-20 w-20 rounded-full bg-[#c44747]/12 blur-lg dark:bg-[#FF9C9C]/12" />
              </div>
            )}
          </div>

          {/* message */}
          {message && (
            <p className={`text-base font-semibold text-center max-w-xs leading-relaxed ${
              status === 'loading' ? 'text-[#334a62] dark:text-[#B8C4D9]'
              : status === 'success' ? 'text-[#15835b] dark:text-[#7EE2A8]'
              : 'text-[#c44747] dark:text-[#FF9C9C]'
            }`}>
              {message}
            </p>
          )}

          {/* loading dots */}
          {status === 'loading' && (
            <div className="flex gap-2.5">
              <div className="dot-0 h-3 w-3 rounded-full bg-[#0b4edb] shadow-md shadow-[#0b4edb]/20 dark:bg-[#4D8DFF] dark:shadow-[#4D8DFF]/16" />
              <div className="dot-1 h-3 w-3 rounded-full bg-[#0b4edb] shadow-md shadow-[#0b4edb]/20 dark:bg-[#4D8DFF] dark:shadow-[#4D8DFF]/16" />
              <div className="dot-2 h-3 w-3 rounded-full bg-[#0b4edb] shadow-md shadow-[#0b4edb]/20 dark:bg-[#4D8DFF] dark:shadow-[#4D8DFF]/16" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
