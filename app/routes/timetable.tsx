import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLoaderData } from "@remix-run/react";
import { ArrowLeft, Download, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { downloadTimetableAsCSV, downloadTimetableAsTSV, downloadFilteredTimetable, downloadCurrentView } from "~/lib/utils";
import { Department, Year, departments, years, useTimetableStore } from "~/stores/time-table";
import { TimetableData, DaySchedule } from "~/types/timetable";
import DayView from "~/components/calander/day-view";
import WeekView from "~/components/calander/week-view";

export async function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const department = url.searchParams.get("department") || "EL";
    const year = url.searchParams.get("year") || "3";
    const classPattern = `${department} ${year}`;

    try {
        const timestamp = new Date().getTime();
        const response = await fetch(
            `http://localhost:3000/api/v1/get_time_table?t=${timestamp}`,
            {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
                body: JSON.stringify({
                    filename: "Draft_1.xlsx",
                    class_pattern: classPattern,
                    is_exam: false,
                }),
            },
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch schedule data: ${response.statusText}`);
        }

        const data: TimetableData = await response.json();
        return { timetableData: data, department, year };
    } catch (error) {
        return {
            error: (error as Error).message || "Failed to load class schedules",
            status: 500,
        };
    }
}

export default function TimetableCalendar() {
    const navigate = useNavigate();
    const { timetableData, department, year } = useLoaderData<{
        timetableData?: TimetableData;
        department?: string;
        year?: string;
    }>();
    const {
        schedules,
        selectedDepartment,
        selectedYear,
        setDepartment,
        setYear,
        fetchSchedules,
        isLoading,
        error: storeError,
        clearError,
    } = useTimetableStore();
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"day" | "week">("week");

    useEffect(() => {
        if (department && year) {
            setDepartment(department as Department);
            setYear(Number(year) as Year);
        }
        if (timetableData) {
            useTimetableStore.setState({ schedules: timetableData });
        }
    }, [department, year, timetableData]);

    const getUniqueClasses = () => {
        if (!schedules) return [];
        return Array.from(
            new Set(schedules.data.flatMap((day) => day.data.map((schedule) => schedule.class))),
        ).sort();
    };

    const classes = getUniqueClasses();

    const filteredData = schedules?.data.filter((day) =>
        selectedClass === "all"
            ? true
            : day.data.some((schedule) => schedule.class === selectedClass),
    );

    // Generate time slots from 7 AM to 7 PM
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 7; hour <= 19; hour++) {
            const time = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
            slots.push({ display: time, value: hour });
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const getEventForTimeSlot = (day: string, timeSlot: number) => {
        if (!schedules) return null;
        const dayData = schedules.data.find(d => d.day === day);
        if (!dayData) return null;

        return dayData.data.find(schedule => {
            const startHour = parseInt(schedule.start.split(':')[0]);
            const endHour = parseInt(schedule.end.split(':')[0]);
            return timeSlot >= startHour && timeSlot < endHour;
        });
    };

    // Course code colors mapping
    const getCourseColor = (courseCode: string) => {
        const colorMap: { [key: string]: string } = {
            '372': 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200',
            '374': 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-400 dark:text-green-200',
            '382': 'bg-purple-100 border-purple-500 text-purple-800 dark:bg-purple-900 dark:border-purple-400 dark:text-purple-200',
            '376': 'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900 dark:border-orange-400 dark:text-orange-200',
            '364': 'bg-pink-100 border-pink-500 text-pink-800 dark:bg-pink-900 dark:border-pink-400 dark:text-pink-200',
        };
        return colorMap[courseCode] || 'bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-900 dark:border-gray-400 dark:text-gray-200';
    };

    const parseEventValue = (value: string) => {
        if (!value) return [];

        // Split by newlines to get multiple entries
        const entries = value.split('\n');

        const parsedEntries = entries.map(entry => {
            // Extract class codes (e.g., EL 3A, EL 3B)
            const classMatch = entry.match(/(EL\s+\d+[AB]?)/g);
            const classes = classMatch || [];

            // Extract course code (e.g., 372, 374, 382)
            const courseMatch = entry.match(/(\d{3})/);
            const courseCode = courseMatch ? courseMatch[1] : '';

            // Extract lecturer name (text after course code, before location)
            const lecturerMatch = entry.match(/(\d{3})\s+([^(]+)/);
            const lecturer = lecturerMatch ? lecturerMatch[2].trim() : '';

            // Extract location (text in parentheses)
            const locationMatch = entry.match(/\(([^)]+)\)/);
            const location = locationMatch ? locationMatch[1] : '';

            return { classes, courseCode, lecturer, location };
        });

        return parsedEntries;
    };

    // PDF Download function
    const downloadAsPDF = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Timetable - ${selectedDepartment} ${selectedYear}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; font-weight: bold; }
                            .course-card { margin: 5px 0; padding: 5px; border-left: 3px solid; }
                            .course-code { font-weight: bold; }
                            .lecturer { font-size: 0.9em; color: #666; }
                            .location { font-size: 0.8em; color: #888; }
                        </style>
                    </head>
                    <body>
                        <h1>Class Timetable - ${selectedDepartment} ${selectedYear}</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    ${days.map(day => `<th>${day}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${timeSlots.map(timeSlot => `
                                    <tr>
                                        <td><strong>${timeSlot.display}</strong></td>
                                        ${days.map(day => {
                const event = getEventForTimeSlot(day, timeSlot.value);
                if (event && event.value) {
                    const entries = parseEventValue(event.value);
                    return `<td>${entries.map(entry => `
                                                    <div class="course-card" style="border-left-color: ${getCourseColor(entry.courseCode).includes('blue') ? '#3b82f6' : getCourseColor(entry.courseCode).includes('green') ? '#10b981' : getCourseColor(entry.courseCode).includes('purple') ? '#8b5cf6' : getCourseColor(entry.courseCode).includes('orange') ? '#f97316' : getCourseColor(entry.courseCode).includes('pink') ? '#ec4899' : '#6b7280'}">
                                                        <div class="course-code">${entry.classes.join(', ')} ${entry.courseCode}</div>
                                                        <div class="lecturer">${entry.lecturer}</div>
                                                        <div class="location">${entry.location}</div>
                </div>
                                                `).join('')}</td>`;
                }
                return '<td>-</td>';
            }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    if (storeError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-red-500">
                    {storeError}
                    <button onClick={clearError} className="ml-4 text-emerald-600">
                        Clear Error
                    </button>
                </div>
            </div>
        );
    }

    if (!schedules) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-700 dark:text-gray-300">
                    No class schedules found.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with back button and title */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Class Timetable
                        </h1>
                    </div>

                    {/* Download Buttons */}
                    {schedules && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => downloadTimetableAsCSV(schedules, `timetable_${selectedDepartment}_${selectedYear}.csv`)}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-lg border-[1px] border-gray-600"
                                title="Download as Excel (CSV)"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Download Excel
                            </button>
                            <button
                                onClick={() => downloadTimetableAsTSV(schedules, `timetable_${selectedDepartment}_${selectedYear}.tsv`)}
                                className="px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 flex items-center gap-2 text-sm font-medium transition-colors shadow-lg border-[1px] border-gray-700"
                                title="Download as TSV"
                            >
                                <FileText className="w-4 h-4" />
                                Download TSV
                            </button>
                            <button
                                onClick={downloadAsPDF}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-lg border-[1px] border-red-600"
                                title="Download as PDF"
                            >
                                <FileDown className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border-[1px] border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Department
                            </label>
                            <select
                                id="department"
                                value={selectedDepartment || ""}
                                onChange={(e) => setDepartment(e.target.value as Department)}
                                className="px-4 py-2 border-[1px] border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-gray-500 focus:outline-none transition-colors"
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Year
                            </label>
                            <select
                                id="year"
                                value={selectedYear || ""}
                                onChange={(e) => setYear(Number(e.target.value) as Year)}
                                className="px-4 py-2 border-[1px] border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-gray-500 focus:outline-none transition-colors"
                            >
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {year.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => fetchSchedules()}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium border-[1px] border-gray-600"
                        >
                            Load Schedules
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border-[1px] border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 dark:border-gray-700">
                        <nav className="flex gap-x-2">
                            <button
                                type="button"
                                className={cn(
                                    "py-3 px-6 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap transition-colors",
                                    activeTab === "day"
                                        ? "font-semibold border-gray-600 text-emerald-600 dark:text-emerald-400"
                                        : "border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400",
                                )}
                                onClick={() => setActiveTab("day")}
                            >
                                Day View
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    "py-3 px-6 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap transition-colors",
                                    activeTab === "week"
                                        ? "font-semibold border-gray-600 text-emerald-600 dark:text-emerald-400"
                                        : "border-transparent text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400",
                                )}
                                onClick={() => setActiveTab("week")}
                            >
                                Week View
                            </button>
                        </nav>

                        {/* Day Selector for Day View */}
                        {activeTab === "day" && (
                            <div className="flex items-center gap-3">
                                <label htmlFor="day-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select Day:
                                </label>
                                <select
                                    id="day-selector"
                                    value={selectedDay || ""}
                                    onChange={(e) => setSelectedDay(e.target.value || null)}
                                    className="px-3 py-2 border-[1px] border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-gray-500 focus:outline-none transition-colors"
                                >
                                    <option value="">Select a day</option>
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        {activeTab === "day" && (
                            <div role="tabpanel">
                                {selectedDay ? (
                                    <DayView
                                        schedule={filteredData?.find((day) => day.day === selectedDay)}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
                                        Please select a day to view the schedule
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "week" && (
                            <div role="tabpanel">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                                        <span className="ml-3">Loading schedules...</span>
                                    </div>
                                ) : (
                                    <WeekView schedules={filteredData} />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Timetable Grid - Only show when not in day view */}
                {activeTab === "week" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-[1px] border-gray-200 dark:border-gray-700">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                                <span className="ml-3">Loading schedules...</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-700">
                                            <th className="p-4 text-left font-semibold min-w-[120px] border-r border-gray-300 dark:border-gray-600">
                                                Time
                                            </th>
                                            {days.map((day) => (
                                                <th key={day} className="p-4 text-center font-semibold min-w-[200px] border-r border-gray-300 dark:border-gray-600 last:border-r-0">
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((timeSlot, index) => (
                                            <tr key={timeSlot.value} className={cn(
                                                "border-b border-gray-200 dark:border-gray-700",
                                                index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                                            )}>
                                                <td className="p-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                                                    {timeSlot.display}
                                                </td>
                                                {days.map((day) => {
                                                    const event = getEventForTimeSlot(day, timeSlot.value);

                                                    return (
                                                        <td
                                                            key={`${day}-${timeSlot.value}`}
                                                            className="p-3 text-center min-h-[80px] relative border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                                                        >
                                                            {event && event.value ? (
                                                                <div className="text-left">
                                                                    {parseEventValue(event.value).map((entry, entryIndex) => (
                                                                        <div key={entryIndex} className={cn(
                                                                            "mb-2 p-2 rounded-lg border-l-4",
                                                                            getCourseColor(entry.courseCode)
                                                                        )}>
                                                                            <div className="font-semibold text-sm">
                                                                                {entry.classes.join(', ')} {entry.courseCode}
                                                                            </div>
                                                                            <div className="text-xs opacity-80">
                                                                                {entry.lecturer}
                                                                            </div>
                                                                            <div className="text-xs font-medium opacity-90">
                                                                                {entry.location}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-600 text-sm">-</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Additional Download Options */}
                {schedules && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-[1px] border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Additional Download Options
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => downloadFilteredTimetable(schedules, {
                                    selectedClass,
                                    selectedDay,
                                    selectedDepartment: selectedDepartment || undefined,
                                    selectedYear: selectedYear || undefined
                                }, 'csv')}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 text-sm transition-colors border-[1px] border-gray-500"
                                title="Download filtered data as CSV"
                            >
                                <Download className="w-4 h-4" />
                                Download Filtered CSV
                            </button>
                            <button
                                onClick={() => downloadCurrentView(schedules, activeTab, selectedDay, {
                                    selectedClass,
                                    selectedDepartment: selectedDepartment || undefined,
                                    selectedYear: selectedYear || undefined
                                }, 'csv')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm transition-colors border-[1px] border-gray-600"
                                title="Download current view as CSV"
                            >
                                <Download className="w-4 h-4" />
                                Download Current View
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}