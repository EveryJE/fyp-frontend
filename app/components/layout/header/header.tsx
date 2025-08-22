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

          <a className="flex justify-center items-center gap-x-1.5 py-2 px-2.5 text-sm whitespace-nowrap text-cyan-700 rounded-lg hover:bg-cyan-700/10 dark:text-cyan-500 dark:hover:bg-cyan-700/20" href="#">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></svg>
            Get Plus
          </a>
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