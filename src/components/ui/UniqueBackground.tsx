import { memo } from 'react';

export const UniqueBackground = memo(() => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fbff_0%,#f3f8fd_48%,#eef5fb_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[#cfe0f1]" />
    </div>
));

UniqueBackground.displayName = 'UniqueBackground';
