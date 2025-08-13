// src/components/Chat/Suggestions.tsx
import React from 'react';

interface SuggestionProps {
  name: string;
  icon: React.ReactNode;
}

const Suggestion: React.FC<SuggestionProps> = ({ name, icon }) => (
  <a
    className="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm text-gray-800 bg-gray-100 hover:text-cyan-700 rounded-lg focus:outline-hidden focus:text-cyan-700 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-400"
    href="#"
  >
    {icon}
    {name}
  </a>
);

const Suggestions: React.FC = () => {
  const suggestions: SuggestionProps[] = [
    { name: 'Health', icon: <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg> },
    { name: 'Learn', icon: <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg> },
    { name: 'Technology', icon: <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v2" /><path d="M12 2v2" /><path d="M17 20v2" /><path d="M17 2v2" /><path d="M2 12h2" /><path d="M2 17h2" /><path d="M2 7h2" /><path d="M20 12h2" /><path d="M20 17h2" /><path d="M20 7h2" /><path d="M7 20v2" /><path d="M7 2v2" /><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="8" y="8" width="8" height="8" rx="1" /></svg> },
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {suggestions.map((s, i) => (
          <Suggestion key={i} name={s.name} icon={s.icon} />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;