// src/components/Sidebar/SidebarHeader.tsx
import React from 'react';

const SidebarHeader: React.FC = () => {
  return (
    <header className="py-2.5 px-4 md:hs-overlay-minified:px-1 flex justify-between items-center gap-x-2">
      <div className="-ms-2 flex items-center gap-x-1">
        <div className="md:hs-overlay-minified:hidden">
          <a
            className="shrink-0 inline-flex justify-center items-center h-9 rounded-lg text-xl font-semibold hover:scale-105 transition-all duration-300 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="/"
            aria-label="Preline"
          >
         <img className='w-5 aspect-[2/3]' src='/images/logo.png'/>
         <span className='text-[#2E7D32]'>M</span>
         <span className='text-[#FFCA28]'>a</span>
         <span className='text-[#2E7D32]'>p</span>
          </a>
        </div>

        {/* Other header elements like dropdowns would go here */}
      </div>

      {/* Sidebar Toggle Button */}
      <button
        type="button"
        className="hidden md:hs-overlay-minified:block bg md:flex md:hs-overlay-minified:flex justify-center items-center flex-none gap-x-3 size-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        aria-haspopup="dialog"
        aria-expanded="true"
        aria-controls="hs-pro-sidebar"
        aria-label="Minify navigation"
        data-hs-overlay-minifier="#hs-pro-sidebar"
      >
        {/* Minify/Expand Icons */}
        <svg className="hidden hs-overlay-minified:block shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path><path d="m8 9 3 3-3 3"></path></svg>
        <svg className="hs-overlay-minified:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path><path d="m10 15-3-3 3-3"></path></svg>
        <span className="sr-only">Sidebar Toggle</span>
      </button>
    </header>
  );
};

export default SidebarHeader;