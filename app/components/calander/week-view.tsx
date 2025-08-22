import React from "react";
import { cn } from "~/lib/utils";
import { COURSE_CODES, COLOR_SCHEMES, DEFAULT_COLOR } from "~/constaants/course-codes";

interface DaySchedule {
  day: string;
  data: Array<{
    start: string;
    end: string;
    value: string;
    class: string;
    location?: string;
  }>;
}

interface WeekViewProps {
  schedules?: DaySchedule[];
}

function convertTimeToNumber(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}

const courseColorMap = new Map(
  COURSE_CODES.map((code, index) => [
    code,
    COLOR_SCHEMES[(index % COLOR_SCHEMES.length) - 1],
  ]),
);

const getCourseColor = (value: string) => {
  const match = value.match(/\b\d{3}\b/);
  if (!match) return DEFAULT_COLOR;
  return (
    courseColorMap.get(match[0] as (typeof COURSE_CODES)[number]) ||
    DEFAULT_COLOR
  );
};

function splitEventValue(value: string): string[] {
  return value.split("\n").filter(Boolean);
}

interface PositionedEvent {
  start: string;
  end: string;
  value: string;
  class: string;
  location?: string;
  day: string;
  splitIndex?: number;
  totalSplits?: number;
}

export default function WeekView({ schedules }: WeekViewProps) {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex items-center justify-center h-[700px] text-gray-500 dark:text-slate-400">
        No schedules available for this week
      </div>
    );
  }

  const processedEvents: PositionedEvent[] = schedules
    .flatMap((day) =>
      day.data
        .filter((slot): slot is typeof slot & { value: string } =>
          Boolean(slot.value),
        )
        .flatMap((slot) => {
          const values = splitEventValue(slot.value);
          return values.map((value, index) => ({
            start: slot.start,
            end: slot.end,
            value,
            class: slot.class,
            location: slot.location,
            day: day.day,
            splitIndex: index,
            totalSplits: values.length,
          }));
        }),
    );

  return (
    // <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm rounded-xl p-4">
    //   <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    //     Weekly Schedule
    //   </h2>
    //   <div className="overflow-x-auto">
    //     <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
    //       <thead>
    //         <tr className="bg-gray-100 dark:bg-gray-800">
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-500 uppercase">
    //             Day
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-500 uppercase">
    //             Time
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-500 uppercase">
    //             Course
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-500 uppercase">
    //             Class
    //           </th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-500 uppercase">
    //             Location
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
    //         {processedEvents.map((event, index) => {
    //           const colors = getCourseColor(event.value);
    //           return (
    //             <tr key={index}>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-200">
    //                 {event.day}
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-200">
    //                 {event.start} - {event.end}
    //               </td>
    //               <td
    //                 className={cn(
    //                   "px-6 py-4 whitespace-nowrap text-sm font-medium",
    //                   colors.text,
    //                   colors.bg,
    //                   colors.border,
    //                   "border-l-4",
    //                 )}
    //               >
    //                 {event.value}
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-200">
    //                 {event.class}
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-200">
    //                 {event.location || "TBA"}
    //               </td>
    //             </tr>
    //           );
    //         })}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
    <></>
  );
}