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
                      <Chatbot/>

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
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 my-auto  place-self-center">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-slate-200">
                        Campus Navigation
                        <div className="flex flex-col items-center justify-center  ">


                        </div>


                    </h1>
                    <p className="mt-3 text-gray-600 dark:text-slate-400">
                        Find your way around campus with ease.
                    </p>
                    <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
                        {/* Search Input */}
                        <div className="relative z-10 flex gap-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-100 dark:bg-slate-900 dark:border-slate-700 dark:shadow-gray-900/20">
                            <div className="w-full">
                                <label htmlFor="search-campus" className="block text-sm text-gray-700 font-medium dark:text-white sr-only">
                                    Search campus
                                </label>
                                <input
                                    type="text"
                                    id="search-campus"
                                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-teal-500 focus:ring-teal-500 dark:bg-slate-900 dark:border-transparent dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600"
                                    placeholder="Search for a location (e.g., Mr. Sitti’s office)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                            <div>
                                <button
                                    className="size-11 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={handleSearch}
                                >
                                    <svg
                                        className="shrink-0 size-5"
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
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* SVG Decorations */}
                        <div className=" md:block absolute top-0 right-0 -translate-y-12 translate-x-20">
                            <svg
                                className="w-16 h-auto text-teal-500"
                                width="121"
                                height="135"
                                viewBox="0 0 121 135"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div className=" md:block absolute bottom-0 left-0 translate-y-10 -translate-x-32">
                            <svg
                                className="w-40 h-auto text-brown-500"
                                width="347"
                                height="188"
                                viewBox="0 0 347 188"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                                    stroke="currentColor"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-10 sm:mt-20 flex flex-wrap justify-center">
                        <Link
                            to="/timetable"
                            className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700"
                        >
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
                                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                          Extract  Timetable
                        </Link>
                      
                     
                        <Link
                            to="/scheduling"
                            className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700"
                        >
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
                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                <path d="M10 6h4" />
                                <path d="M10 10h4" />
                                <path d="M10 14h4" />
                                <path d="M10 18h4" />
                            </svg>
                            Find Location
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
