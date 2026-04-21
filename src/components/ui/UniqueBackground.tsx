import { memo } from 'react';

export const UniqueBackground = memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 isolate">
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, var(--akb-page-top, #f7fbff) 0%, var(--akb-page-bg, #f4f8fc) 48%, var(--akb-page-bottom, #eef5fb) 100%)",
      }}
    />

    <div className="absolute inset-0 dark:hidden">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0) 34%), radial-gradient(circle at 78% 14%, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0) 28%), radial-gradient(circle at 50% 84%, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0) 30%)",
        }}
      />

      <div
        className="akb-light-blob akb-light-blob--one absolute -left-24 top-4 h-[20rem] w-[20rem] rounded-full mix-blend-multiply opacity-75"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(125,211,252,0.82) 0%, rgba(56,189,248,0.52) 42%, rgba(56,189,248,0) 72%)",
        }}
      />
      <div
        className="akb-light-blob akb-light-blob--two absolute right-[-4.5rem] top-28 h-[24rem] w-[24rem] rounded-full mix-blend-multiply opacity-70"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(96,165,250,0.7) 0%, rgba(59,130,246,0.46) 44%, rgba(59,130,246,0) 74%)",
        }}
      />
      <div
        className="akb-light-blob akb-light-blob--three absolute left-[12%] bottom-[-5rem] h-[22rem] w-[22rem] rounded-full mix-blend-multiply opacity-65"
        style={{
          background:
            "radial-gradient(circle at 45% 45%, rgba(103,232,249,0.62) 0%, rgba(34,211,238,0.44) 44%, rgba(34,211,238,0) 74%)",
        }}
      />
      <div
        className="akb-light-blob akb-light-blob--four absolute right-[18%] bottom-[8%] h-[16rem] w-[16rem] rounded-full mix-blend-multiply opacity-55"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(147,197,253,0.6) 0%, rgba(96,165,250,0.34) 46%, rgba(96,165,250,0) 76%)",
        }}
      />
      <div
        className="absolute inset-0 bg-white/18 backdrop-blur-[14px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.22) 100%)",
        }}
      />
    </div>

    <div className="absolute inset-0 hidden dark:block">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,19,39,0.98) 0%, rgba(11,27,56,0.97) 46%, rgba(18,38,75,0.99) 100%)",
        }}
      />
      <div
        className="akb-galaxy-stars akb-galaxy-stars--far absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.84) 0 0.8px, transparent 1.1px), radial-gradient(circle, rgba(120,173,255,0.58) 0 0.9px, transparent 1.2px), radial-gradient(circle, rgba(57,198,255,0.48) 0 0.65px, transparent 1px)",
          backgroundSize: "220px 220px, 300px 300px, 260px 260px",
          backgroundPosition: "18px 24px, 130px 90px, 42px 150px",
        }}
      />
      <div
        className="akb-galaxy-stars akb-galaxy-stars--near absolute inset-0 opacity-85"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.96) 0 1px, transparent 1.35px), radial-gradient(circle, rgba(164,197,255,0.76) 0 1.1px, transparent 1.45px), radial-gradient(circle, rgba(57,198,255,0.78) 0 0.95px, transparent 1.3px)",
          backgroundSize: "160px 160px, 210px 210px, 190px 190px",
          backgroundPosition: "0 0, 72px 108px, 124px 26px",
        }}
      />
      <div
        className="akb-galaxy-nebula akb-galaxy-nebula--one absolute -left-20 top-0 h-[22rem] w-[22rem] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle at 42% 38%, rgba(57,198,255,0.34) 0%, rgba(47,107,255,0.22) 36%, rgba(26,46,92,0) 74%)",
        }}
      />
      <div
        className="akb-galaxy-nebula akb-galaxy-nebula--two absolute right-[-7rem] top-[14%] h-[24rem] w-[24rem] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(47,107,255,0.3) 0%, rgba(26,46,92,0.24) 42%, rgba(11,27,56,0) 76%)",
        }}
      />
      <div
        className="akb-galaxy-nebula akb-galaxy-nebula--three absolute left-[18%] bottom-[-7rem] h-[26rem] w-[26rem] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle at 48% 48%, rgba(57,198,255,0.26) 0%, rgba(18,38,75,0.18) 40%, rgba(11,27,56,0) 76%)",
        }}
      />
      <div
        className="absolute left-1/2 top-[10%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(47,107,255,0.1) 18%, rgba(57,198,255,0.08) 32%, rgba(7,19,39,0) 64%)",
          filter: "blur(28px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 12%, rgba(57,198,255,0.1) 0%, rgba(57,198,255,0) 24%), radial-gradient(circle at 50% 50%, rgba(15,23,42,0) 46%, rgba(3,10,24,0.34) 100%)",
        }}
      />
    </div>

    <div
      className="absolute inset-x-0 top-0 h-px"
      style={{ backgroundColor: "var(--akb-border-strong, #cfe0f1)" }}
    />
  </div>
));

UniqueBackground.displayName = 'UniqueBackground';
