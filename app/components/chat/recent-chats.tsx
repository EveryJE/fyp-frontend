// src/components/Sidebar/RecentChats.tsx
import React from 'react';
import ChatItem from './chat-item';

const RecentChats: React.FC = () => {
  const chats = [
    'Preline UI Overview',
    'Product Photography Lighting Setup',
    'Social Media Content',
    'Website Optimization',
    'Customer Support Ticket System',
  ];

  return (
    <div className="hs-overlay-minified:opacity-0 transition-opacity duration-300 pb-4 px-2 size-full flex flex-col gap-y-5 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div className="flex flex-col">
        <span className="block ps-2.5 mb-2 text-sm text-gray-400 dark:text-neutral-500">
          Recent chats
        </span>
        <ul className="flex flex-col gap-y-0.5">
          {chats.map((chatTitle, index) => (
            <ChatItem key={index} title={chatTitle} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentChats;