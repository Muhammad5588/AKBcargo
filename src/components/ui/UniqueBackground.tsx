import { memo } from 'react';

export const UniqueBackground = memo(() => (
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
));

UniqueBackground.displayName = 'UniqueBackground';
