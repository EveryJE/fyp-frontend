// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import SidebarHeader from './sidebar-header';
import SidebarNav from './sidebar-nav';
import RecentChats from '../../chat/recent-chats';

const Sidebar: React.FC = () => {
  return (
    <div
      id="hs-pro-sidebar"
      className="hs-overlay [--auto-close:md] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-65 hs-overlay-minified:w-13 overflow-hidden hidden fixed inset-y-0 z-60 start-0 bg-white border-e border-gray-200 dark:border-neutral-700 md:block md:translate-x-0 md:end-auto md:bottom-0 dark:bg-neutral-800"
      role="dialog"
      tabIndex={-1}
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col h-full max-h-full">
        <SidebarHeader />
        <div className="mb-5 px-2 flex flex-col gap-y-5">
          <SidebarNav />
        </div>
        <RecentChats />
      </div>
    </div>
  );
};

export default Sidebar;