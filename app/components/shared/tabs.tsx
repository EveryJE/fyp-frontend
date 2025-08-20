import React from 'react'

const tabs = () => {
  return (
   <div className="w-full bg-white rounded-lg shadow-md dark:bg-neutral-800">
  <div className="border-b border-gray-200 px-4 dark:border-neutral-700">
    <nav className="flex gap-x-2" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
      <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500 active" id="basic-tabs-item-1" aria-selected="true" data-hs-tab="#basic-tabs-1" aria-controls="basic-tabs-1" role="tab">
        Tab 1
      </button>
      <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500" id="basic-tabs-item-2" aria-selected="false" data-hs-tab="#basic-tabs-2" aria-controls="basic-tabs-2" role="tab">
        Tab 2
      </button>
      <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500" id="basic-tabs-item-3" aria-selected="false" data-hs-tab="#basic-tabs-3" aria-controls="basic-tabs-3" role="tab">
        Tab 3
      </button>
    </nav>
  </div>

  <div className="mt-3 p-4">
    <div id="basic-tabs-1" role="tabpanel" aria-labelledby="basic-tabs-item-1">
      <p className="text-gray-500 dark:text-neutral-400">
        This is the <em className="font-semibold text-gray-800 dark:text-neutral-200">first</em> item's tab body.
      </p>
    </div>
    <div id="basic-tabs-2" className="hidden" role="tabpanel" aria-labelledby="basic-tabs-item-2">
      <p className="text-gray-500 dark:text-neutral-400">
        This is the <em className="font-semibold text-gray-800 dark:text-neutral-200">second</em> item's tab body.
      </p>
    </div>
    <div id="basic-tabs-3" className="hidden" role="tabpanel" aria-labelledby="basic-tabs-item-3">
      <p className="text-gray-500 dark:text-neutral-400">
        This is the <em className="font-semibold text-gray-800 dark:text-neutral-200">third</em> item's tab body.
      </p>
    </div>
  </div>
</div>
  )
}

export default tabs