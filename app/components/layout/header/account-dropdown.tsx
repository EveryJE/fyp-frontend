// src/components/Header/AccountDropdown.tsx
import React from 'react';
import ThemeToggle from './theme-toggle';

const AccountDropdown: React.FC = () => {
  return (
    <div className="hs-dropdown inline-flex [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative text-start">
      <button
        id="hs-dnad"
        type="button"
        className="p-0.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
      >
        <img
          className="shrink-0 size-8 rounded-full"
          src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
          alt="Avatar"
        />
      </button>

      <div
        className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 dark:border-neutral-700"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-dnad"
      >
        <div className="py-2 px-3.5">
          <span className="font-medium text-gray-800 dark:text-neutral-300">James Collison</span>
          <p className="text-sm text-gray-500 dark:text-neutral-500">jamescollison@site.com</p>
        </div>
        <div className="px-4 py-2 border-t border-gray-200 dark:border-neutral-800">
          <ThemeToggle />
        </div>
        <div className="p-1 border-t border-gray-200 dark:border-neutral-800">
          {/* Links like Profile, Settings, Log out */}
          <a className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800" href="#">
            Profile
          </a>
          <a className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800" href="#">
            Settings
          </a>
          <a className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800" href="#">
            Log out
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountDropdown;