// src/components/Header/Header.tsx
import React from 'react';
import AccountDropdown from './account-dropdown';

interface HeaderProps {
  userRole?: string;
  userData?: {
    userType: string;
    name?: string;
    email?: string;
    [key: string]: any;
  };
}

const Header: React.FC<HeaderProps> = ({ userRole, userData }) => {
  const isStudent = userRole === 'student';

  return (
    <header className={`${
      isStudent 
        ? '' // No margin for students (no sidebar)
        : 'md:ms-65 md:hs-overlay-minified:ms-13' // Normal sidebar margin for other users
    } border-b xl:hs-overlay-layout-open:me-96 transition-all duration-300 fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 md:z-61 bg-white py-2.5 dark:bg-slate-800`}>
      <nav className="px-4 sm:px-5.5 flex basis-full justify-between items-center w-full mx-auto">
        {/* Button Group */}
        <div className="flex items-center sm:gap-x-1.5 truncate">
          {/* Mobile Sidebar Toggle - Only show for non-students */}
          {!isStudent && (
            <button
              type="button"
              className="md:hidden flex justify-center items-center flex-none gap-x-3 size-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700"
              data-hs-overlay="#hs-pro-sidebar"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path><path d="m8 9 3 3-3 3"></path></svg>
              <span className="sr-only">Sidebar Toggle</span>
            </button>
          )}

          {/* User Type Badge */}
          <div className="flex items-center gap-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userRole === 'student' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                : userRole === 'admin'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                : userRole === 'teacher'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
            </span>
            
            {userData?.name && (
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {userData.name}
              </span>
            )}
          </div>
        </div>

        {/* Right-side Button Group */}
        <div className="flex items-center sm:gap-x-1.5">
          {/* Other buttons like 'More' and 'Language' can be added here */}
          <AccountDropdown />
        </div>
      </nav>
    </header>
  );
};

export default Header;