// src/components/Header/AccountDropdown.tsx
import React, { useState, useEffect } from 'react';
import ThemeToggle from './theme-toggle';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  level?: string;
  department?: string;
  loginTime: string;
}

const AccountDropdown: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user: User = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const handleLogout = () => {
    try {
      // Clear user session from localStorage
      localStorage.removeItem('currentUser');
      
      // Optionally, you can also clear other auth-related data if needed
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('refreshToken');
      
      console.log('User logged out successfully');
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still redirect to home
      window.location.href = '/';
    }
  };

  // Get user's full name and display appropriate fallback
  const getUserName = () => {
    if (!currentUser) return 'User';
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    return currentUser.firstName || currentUser.lastName || 'User';
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return 'U';
    const firstName = currentUser.firstName || '';
    const lastName = currentUser.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <div className="hs-dropdown inline-flex [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative text-start">
      <button
        id="hs-dnad"
        type="button"
        className="p-0.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
      >
        {/* Avatar with fallback initials */}
        <div className="shrink-0 size-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials()}
        </div>
      </button>

      <div
        className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-slate-900 dark:border-slate-700"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-dnad"
      >
        {/* User Info Section */}
        <div className="py-2 px-3.5">
          <span className="font-medium text-gray-800 dark:text-slate-300">
            {getUserName()}
          </span>
          <p className="text-sm text-gray-500 dark:text-slate-500">
            {currentUser?.email || 'user@example.com'}
          </p>
          {currentUser?.userType && (
            <p className="text-xs text-gray-400 dark:text-slate-400 capitalize">
              {currentUser.userType}
              {currentUser.department && ` • ${currentUser.department}`}
              {currentUser.level && ` • Level ${currentUser.level}`}
            </p>
          )}
        </div>

        {/* Theme Toggle Section */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-800">
          <ThemeToggle />
        </div>

        {/* Menu Links Section */}
        <div className="p-1 border-t border-gray-200 dark:border-slate-800">
          <a 
            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer" 
            href="/profile"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </a>
          
          <a 
            className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer" 
            href="/settings"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6"/>
              <path d="m15.5 3.5-3 3-3-3"/>
              <path d="m15.5 20.5-3-3-3 3"/>
            </svg>
            Settings
          </a>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDropdown;