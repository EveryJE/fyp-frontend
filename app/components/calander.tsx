import React, { useState } from "react";
import { Link } from "@remix-run/react";

const TimetableCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);

    //   const events: { [date: string]: { time: string; title: string; color: string }[] } = {
    //     "2024-01-10": [
    //       { time: "9-10AM", title: "Searchbox", color: "bg-pink-700" },
    //       { time: "5-6AM", title: "Preline QI tasks review", color: "bg-green-800" },
    //     ],
    //     "2024-01-24": [
    //       { time: "3-6PM", title: "Marketing Discussion Zoom Meeting", color: "bg-orange-700" },
    //     ],
    //     "2024-01-27": [
    //       { time: "6-6:30PM", title: "Review Preline Figma Optimization", color: "bg-yellow-600" },
    //     ],
    //   };



    return (

        <div className="w-full dark:bg-slate-800">
            <div className="border border-gray-200 px-4 dark:border-slate-700">
                <nav className="flex gap-x-2 " aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                    <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 dark:hover:text-blue-500 dark:focus:text-blue-500 active" id="basic-tabs-item-1" aria-selected="true" data-hs-tab="#basic-tabs-1" aria-controls="basic-tabs-1" role="tab">
                        Days
                    </button>
                    <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 dark:hover:text-blue-500 dark:focus:text-blue-500" id="basic-tabs-item-2" aria-selected="false" data-hs-tab="#basic-tabs-2" aria-controls="basic-tabs-2" role="tab">
                        Weeks
                    </button>
                    <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 dark:hover:text-blue-500 dark:focus:text-blue-500" id="basic-tabs-item-3" aria-selected="false" data-hs-tab="#basic-tabs-3" aria-controls="basic-tabs-3" role="tab">
                        Months
                    </button>
                </nav>
            </div>



            <div className="mt-3 p-4">
                <div id="basic-tabs-1" role="tabpanel" aria-labelledby="basic-tabs-item-1">
                    <div
                        className="overflow-clip relative h-full flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700"
                    >


                        <div
                            className="px-6 py-4 grid gap-3  border-b border-gray-200 dark:border-slate-700"
                        >
                            <div className="w-full flex-grow overflow-x-auto overflow-y-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                    <thead> <tr >
                                        {Array.from({ length: 7 }).map((_, i) => {
                                            const hour = 7 + i;
                                            const minutes = i % 1 === 0 ? "00" : "30";
                                            const time = `${hour < 10 ? "0" + hour : hour}:${minutes}`;
                                            return (

                                                <th key={time} scope="col" className=" py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-slate-500  min-w-20">
                                                    {time}
                                                </th>
                                            );
                                        })}
                                        <th className=" py-3 text-start text-base font-bold text-black uppercase  min-w-10"></th>
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const hour = 12 + i; // Start at 12 and increment by 1
                                            const minutes = "30"; // Fixed to 30 minutes
                                            const isPM = hour >= 12;
                                            const displayHour = hour > 12 ? hour - 12 : hour === 12 ? 12 : hour; // Convert to 12-hour format
                                            const time = `${displayHour < 10 ? "0" + displayHour : displayHour}:${minutes} ${isPM ? "PM" : "AM"}`;
                                            return (
                                                <th
                                                    key={time}
                                                    scope="col"
                                                    className="py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-slate-500 min-w-20"
                                                >
                                                    {time}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                        <tr>

                                            {Array.from({ length: 12 }).map((_, i) => {
                                                return (
                                                    <td
                                                        key={i}
                                                        scope="col"
                                                        className="bg-blue-100 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-slate-800"                                                >
                                                        {/* {'string'} */}

                                                    </td>
                                                );
                                            })}

                                        </tr>


                                    </tbody>
                                </table>

                            </div>

                            {/* <!-- Footer --> */}

                            {/* </div> */}
                            <div className="p-5">

                            </div>
                            {/* <!-- End Footer --> */}
                        </div>
                    </div>
                    <div id="basic-tabs-2" className="hidden" role="tabpanel" aria-labelledby="basic-tabs-item-2">
                        <p className="text-gray-500 dark:text-slate-400">
                            This is the <em className="font-semibold text-gray-800 dark:text-slate-200">second</em> item's tab body.
                        </p>
                    </div>
                    <div id="basic-tabs-3" className="hidden" role="tabpanel" aria-labelledby="basic-tabs-item-3">
                        <p className="text-gray-500 dark:text-slate-400">
                            This is the <em className="font-semibold text-gray-800 dark:text-slate-200">third</em> item's tab body.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableCalendar;

