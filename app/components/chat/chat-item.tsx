// src/components/Sidebar/ChatItem.tsx
import React from 'react';

interface ChatItemProps {
  title: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ title }) => {
  return (
    <li>
      <div className="relative group">
        <a
          className="w-full flex items-center gap-x-2 py-2 ps-2.5 pe-8 text-sm text-gray-800 truncate rounded-lg hover:bg-gray-100/70 focus:outline-hidden focus:bg-gray-100/70 dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50 dark:text-neutral-200"
          href="#"
        >
          <span className="truncate">{title}</span>
        </a>
        <div className="absolute top-1/2 end-0 z-1 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
          {/* Dropdown for more options can be a separate component */}
          <button type="button" className="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-neutral-400 dark:hover:bg-neutral-700">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

export default ChatItem;