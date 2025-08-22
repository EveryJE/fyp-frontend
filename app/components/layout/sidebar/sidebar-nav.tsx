import { useMatches, NavLink } from '@remix-run/react';

const SidebarNav = () => {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || '/';

  const navItems = [
    {
      name: 'View Map',
      path: '/navigate',
      icon: (
        <svg
          className="shrink-0 size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/>
          <path d="M15 5.764v15"/>
          <path d="M9 3.236v15"/>
        </svg>
      ),
    },
  ];

  return (
    <ul className="flex flex-col gap-y-0.5">
      {navItems.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `group relative w-full flex items-center gap-1 py-1.5 px-2.5 text-sm rounded-lg focus:outline-none ${
                isActive
                  ? 'bg-gray-200/70 text-cyan-700 before:absolute before:inset-y-0 before:-start-2 before:rounded-e-full before:w-1 before:h-full before:bg-cyan-700 dark:bg-slate-700 dark:text-cyan-400 dark:before:bg-cyan-400'
                  : 'text-gray-800 hover:bg-gray-100/70 focus:bg-gray-100/70 dark:text-slate-200 dark:hover:bg-slate-700/50 dark:focus:bg-slate-700/50'
              }`
            }
          >
            <span className="-ms-[5px] flex shrink-0 justify-center items-center size-6">
              {item.icon}
            </span>
            <span className="truncate hs-overlay-minified:opacity-0 transition-opacity duration-300">
              {item.name}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNav;