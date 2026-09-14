import React from 'react';
import DesktopCreatorAnalytics from '../components/desktop/DesktopCreatorAnalytics';

export default function CreatorStudio() {
  return (
    <div className="w-full flex-1 max-w-[1780px] mx-auto px-3 sm:px-6 md:px-8 py-3 md:py-6 pb-24 md:pb-8">
      <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
        <DesktopCreatorAnalytics />
      </div>
    </div>
  );
}
