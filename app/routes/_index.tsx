import React from 'react'
import ChatContainer from '~/components/chat/chat-container'
import Header from '~/components/layout/header/header'
import Sidebar from '~/components/layout/sidebar/sidebar'
import { GridPattern } from '~/components/magicui/grid-pattern'
import { cn } from '~/lib/utils'

export default function home() {
  return (
     <div>
            <GridPattern
                width={30}
                height={30}
                x={-1}
                y={-1}   
                strokeDasharray={"4 2"}
                className={cn(
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                )}
            />
            <div className="dark:bg-neutral-800">
                <Sidebar/>
                <main className="md:ps-65 md:hs-overlay-minified:ps-13 transition-all duration-300 pb-4 h-screen flex flex-col">
                    <Header />
                    <ChatContainer />
                </main>
            </div>
        </div>
  )
}
