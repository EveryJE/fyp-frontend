// src/components/Header/ThemeToggle.tsx
import React from 'react';

const ThemeToggle: React.FC = () => {
  // Add state management (e.g., useState, useContext) to handle theme changes
  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <span className="flex-1 cursor-pointer text-sm text-gray-600 dark:text-neutral-400">Theme</span>
      <div className="p-0.5 relative inline-flex cursor-pointer bg-gray-100 rounded-full dark:bg-neutral-800">
        <label htmlFor="darkSwtich" className="relative inline-block w-12 h-6 cursor-pointer">
          <input data-hs-theme-switch="" type="checkbox" id="darkSwtich" className="peer sr-only" />
          <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-natural-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
          <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-sm !transition-transform duration-200 ease-in-out peer-checked:translate-x-[1.5rem] dark:bg-neutral-400 dark:peer-checked:bg-neutral-900"></span>

          <div className='absolute p-1 w-full flex justify-between items-center h-full'>  <svg className="shrink-0 size-3.5 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>

            <svg className="shrink-0 size-3.5 right-0 text-amber-500 dark:bg-text-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
          </div>

        </label>
      </div>
    </div>
  );
};

export default ThemeToggle;
{/* <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>

 <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      */}