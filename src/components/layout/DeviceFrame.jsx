import React from 'react';
import { useApp } from '../../context/AppContext';

export default function DeviceFrame({ children }) {
  const { deviceMode, setDeviceMode } = useApp();

  if (deviceMode !== 'mobile-frame') {
    return <div className="w-full min-h-screen flex flex-col bg-surface">{children}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-surface-container-high/80 flex flex-col items-center justify-center p-2 sm:p-6 text-on-surface">
      {/* Floating Mode Switcher */}
      <div className="w-full max-w-sm mb-4 flex items-center justify-between bg-surface-container-lowest/90 backdrop-blur-md px-4 py-2 rounded-full border border-surface-container-highest shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
          <span className="text-xs font-bold text-on-surface">معاينة تطبيق الهاتف (iOS / Android)</span>
        </div>
        <button
          onClick={() => setDeviceMode('responsive')}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-on-primary hover:opacity-90 transition-all"
        >
          عرض الموقع كامل
        </button>
      </div>

      {/* iPhone Device Mockup Shell */}
      <div className="relative w-full max-w-[390px] h-[844px] max-h-[92vh] bg-surface rounded-[48px] border-[10px] border-surface-dim shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        {/* Dynamic Island Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-end px-3" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Scrollable Screen Content */}
        <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col bg-surface overscroll-contain">
          {children}
        </div>

        {/* Home Bar Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/30 rounded-full z-50 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}
