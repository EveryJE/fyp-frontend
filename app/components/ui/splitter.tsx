import { Analytics } from '@vercel/analytics/remix';
import React, { useEffect } from 'react';
import MapComponent from '../map-component';

interface SplitterConfig {
    horizontalSplitterTemplate: string;
    verticalSplitterTemplate: string;
    horizontalSplitterClasses: string;
    verticalSplitterClasses: string;
}

interface SplitterProps {
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    leftSize?: number;
    rightSize?: number;
    height?: string;
    width?: string;
}

const Splitter: React.FC<SplitterProps> = ({
    leftContent = 'Left',
    rightContent = 'Right',
    leftSize = 50,
    rightSize = 50,
    height = 'h-full',
    width = 'w-full',
}) => {
    useEffect(() => {
        // Initialize Preline's HSSplit after component mounts
        if (window.HSStaticMethods) {
            window.HSStaticMethods.autoInit(['layoutSplitter']);
        } else {
            console.error('Preline HSStaticMethods not found. Ensure Preline is loaded.');
        }
    }, []);

    const splitterConfig: SplitterConfig = {
        horizontalSplitterTemplate: `
      <div>
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-4 h-6 flex justify-center items-center bg-white border border-gray-200 text-gray-400 rounded-md cursor-col-resize hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-600 dark:hover:bg-neutral-900">
          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="12" r="1"/>
            <circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="5" r="1"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
        </span>
      </div>
    `,
        verticalSplitterTemplate: `
      <div>
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-6 h-4 flex justify-center items-center bg-white border border-gray-200 text-gray-400 rounded-md cursor-row-resize hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-600 dark:hover:bg-neutral-900">
          <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="9" r="1"/>
            <circle cx="5" cy="9" r="1"/>
            <circle cx="19" cy="9" r="1"/>
            <circle cx="12" cy="15" r="1"/>
            <circle cx="5" cy="15" r="1"/>
            <circle cx="19" cy="15" r="1"/>
          </svg>
        </span>
      </div>
    `,
        horizontalSplitterClasses: 'relative flex border-s border-gray-200 dark:border-neutral-700',
        verticalSplitterClasses: 'relative flex border-t border-gray-200 dark:border-neutral-700',
    };

    return (
        <div className={width} data-hs-layout-splitter={JSON.stringify(splitterConfig)}>
            <div
                className={`flex border border-gray-200 rounded-lg ${height} flex-col md:flex-row dark:border-neutral-700`}
                data-hs-layout-splitter-horizontal-group=""
            >
                <div
                    className="overflow-hidden h-full"
                    data-hs-layout-splitter-item={leftSize}
                    style={{ flex: `${leftSize} 1 0` }}
                >
                    <div className="flex items-center justify-center h-full p-3 text-gray-800 dark:text-neutral-200">
                        {leftContent}
                    </div>
                </div>

                <div data-hs-layout-splitter-item={rightSize}
                    style={{ flex: `${rightSize} 1 0` }} className="relative w-90 flex h-svh items-center justify-center bg">
                    <Analytics />
                    <MapComponent />
                </div>
            </div>
        </div>
    );
};

export default Splitter;