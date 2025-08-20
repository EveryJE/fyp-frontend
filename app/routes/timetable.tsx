import React from 'react'
import ChatContainer from '~/components/chat/chat-container'
import Header from '~/components/layout/header/header'
import Sidebar from '~/components/layout/sidebar/sidebar'
import { GridPattern } from '~/components/magicui/grid-pattern'
import { cn } from '~/lib/utils'
import { Chatbot } from "~/components/chat/google-bot";
import { Link } from '@remix-run/react'
import { useState } from "react";
import { TypewriterEffectSmooth } from '~/components/ui/typewriter-text'
import AccountDropdown from '~/components/layout/header/account-dropdown'
import TimetableCalendar from '~/components/calander'



export default function home() {


    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        // Placeholder for search functionality (e.g., navigate to search results or call API)
        console.log("Searching for:", searchQuery);
    };



    const words = [
        {
            text: "Campus",
        },
        {
            text: "Navigation",
        }
    ];
    return (
        //  <div>
        //         <GridPattern
        //             width={30}
        //             height={30}
        //             x={-1}
        //             y={-1}   
        //             strokeDasharray={"4 2"}
        //             className={cn(
        //                 "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
        //                 "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        //             )}
        //         />
        //         <div className="dark:bg-slate-800">
        //             {/* <Sidebar/> */}
        //             <main className="md:ps-65 md:hs-overlay-minified:ps-13 transition-all duration-300 pb-4 h-screen flex flex-col">
        //                 {/* <Header /> */}
        //                 <Chatbot/>
        //                 <div className="">
        //                 </div>
        //             </main>
        //         </div>
        //     </div>

        <div className="relative overflow-hidden  h-full min-h-[100svh] grid">
            <Chatbot />
            <div className="absolute top-6 right-6"> <AccountDropdown />
            </div>
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
            <div className=" mx-auto px-4">
                <TimetableCalendar />
            </div>
        </div>
    )
}
