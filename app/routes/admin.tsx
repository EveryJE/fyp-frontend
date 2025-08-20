import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import { useEffect } from 'react';
import { Chatbot } from '~/components/chat/google-bot';
import Header from '~/components/layout/header/header';
import Sidebar from '~/components/layout/sidebar/sidebar';

export default function OwnerDashboard({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {


  return (
    <div>
      <div className="dark:bg-slate-700/70">
        <Sidebar />
        <main className="md:ps-65  md:hs-overlay-minified:ps-13 transition-all duration-300 h-screen flex flex-col">
          <Header />
          <Chatbot />
          <div className="w-full h-full pt-16">
            <div className=" space-y-4 sm:space-y-6">
                {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>


  );
}
