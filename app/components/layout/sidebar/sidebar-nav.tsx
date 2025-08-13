// src/components/Sidebar/SidebarNav.tsx
import React from 'react';

const SidebarNav: React.FC = () => {
  const navItems = [
    { name: 'New chat', icon: <svg className="shrink-0 size-4 group-hover:scale-115 group-focus:scale-115 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>, active: true },
    { name: 'Search chats', icon: <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path className="group-hover:scale-100 group-focus:scale-100 scale-115 transition-transform duration-300" d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg> },
    { name: 'Explore', icon: <svg className="shrink-0 size-4 group-hover:rotate-180 group-focus:rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg> },
    { name: 'Chat details', icon: <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path className="group-hover:scale-110 group-focus:scale-110 transition-transform duration-300" d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path className="group-hover:scale-95 group-focus:scale-95 transition-transform duration-300" d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg> },
  ];

  return (
    <ul className="flex flex-col gap-y-0.5">
      {navItems.map((item, index) => (
        <li key={index}>
          <a
            className={`group relative w-full flex items-center gap-1 py-1.5 px-2.5 text-sm rounded-lg focus:outline-hidden ${
              item.active
                ? 'bg-gray-200/70 text-cyan-700 before:absolute before:inset-y-0 before:-start-2 before:rounded-e-full before:w-1 before:h-full before:bg-cyan-700 dark:bg-neutral-700 dark:text-cyan-400 dark:before:bg-cyan-400'
                : 'text-gray-800 hover:bg-gray-100/70 focus:bg-gray-100/70 dark:text-neutral-200 dark:hover:bg-neutral-700/50 dark:focus:bg-neutral-700/50'
            }`}
            href="#"
          >
            <span className="-ms-[5px] flex shrink-0 justify-center items-center size-6">
              {item.icon}
            </span>
            <span className="truncate hs-overlay-minified:opacity-0 transition-opacity duration-300">{item.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNav;