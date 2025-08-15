import React from 'react'
import ChatContainer from '~/components/chat/chat-container'
import Header from '~/components/layout/header/header'
import Sidebar from '~/components/layout/sidebar/sidebar'
import { GridPattern } from '~/components/magicui/grid-pattern'
import { ArcTimeline } from '~/components/ui/arc-time-line'
import { TypewriterEffectSmooth } from '~/components/ui/typewriter-text'
import { cn } from '~/lib/utils'

export default function guest() {

  const words = [
    {
      text: "Campus",
    },
    {
      text: "Navigation",
    }
  ];
  const wordsCont = [

    {
      text: "with",
    },
    {
      text: "Timetable",
    },
    {
      text: "integration.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  const data = [
    {
      time: "2025",
      steps: [
        { icon: <span>🚀</span>, content: "Launched v1" },
        { icon: <span>✨</span>, content: "Improved UX" },
      ],
    },
    {
      time: "2026",
      steps: [{ icon: <span>📈</span>, content: "Growth" }],
    },
  ];


  return (
    <div>
      {/* <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      /> */}


      <div className="relative  overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-1 before:transform before:-translate-x-1/2">


        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">

          {/* <div className="w-full   flex mt-10 p-5 items-center justify-center">  <a
          className="shrink-0  inline-flex justify-center items-center h-9 rounded-lg text-xl font-semibold hover:scale-105 transition-all duration-300  "
          href="/"
          aria-label="Umap"
        >
          <img className='w-10 aspect-[2/3] ' src='/images/logo.png' />
          <span className='text-[#2E7D32]'>M</span>
          <span className='text-[#FFCA28]'>a</span>
          <span className='text-[#2E7D32]'>p</span>
        </a></div> */}

          {/* Announcement Banner */}
          <div className="flex justify-center">
            <a className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-xs text-gray-600 p-2 px-3 rounded-full transition hover:border-gray-300 focus:outline-none focus:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:focus:border-neutral-600" href="#">
              Explore Our Campus Map
              <span className="flex items-center gap-x-1">
                <span className="border-s border-gray-200 text-blue-600 ps-2 dark:text-blue-500 dark:border-neutral-700">Try now</span>
                <svg className="shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </a>
          </div>
          {/* End Announcement Banner */}

          {/* Title */}
          <div className="flex flex-col items-center justify-center h-[40rem]  ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
              The road to freedom starts from here
            </p>
            <TypewriterEffectSmooth words={words} />
            <TypewriterEffectSmooth words={wordsCont} />

          </div>
          {/* End Title */}

          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              Find your way around campus with real-time directions, building information, and accessible routes.
            </p>
          </div>

          <ArcTimeline data={data} />
        </div>
      </div>
    </div>
  )
}
