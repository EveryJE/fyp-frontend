import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimetableData, DayData, ExamData } from "~/types/timetable";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert timetable data to CSV format
export function convertTimetableToCSV(timetableData: TimetableData): string {
  const headers = ["Day", "Time", "Class", "Subject", "Location", "Invigilator"];
  const rows: string[] = [headers.join(",")];

  timetableData.data.forEach((day: DayData) => {
    day.data.forEach((slot: ExamData) => {
      const row = [
        day.day,
        `${slot.start} - ${slot.end}`,
        slot.class,
        slot.value,
        slot.location,
        slot.invigilator || ""
      ].map(field => `"${field}"`).join(",");
      rows.push(row);
    });
  });

  return rows.join("\n");
}

// Download timetable as CSV file
export function downloadTimetableAsCSV(timetableData: TimetableData, filename: string = "timetable.csv") {
  const csvContent = convertTimetableToCSV(timetableData);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Convert timetable data to Excel-like format (TSV for better compatibility)
export function convertTimetableToTSV(timetableData: TimetableData): string {
  const headers = ["Day", "Time", "Class", "Subject", "Location", "Invigilator"];
  const rows: string[] = [headers.join("\t")];

  timetableData.data.forEach((day: DayData) => {
    day.data.forEach((slot: ExamData) => {
      const row = [
        day.day,
        `${slot.start} - ${slot.end}`,
        slot.class,
        slot.value,
        slot.location,
        slot.invigilator || ""
      ].join("\t");
      rows.push(row);
    });
  });

  return rows.join("\n");
}

// Download timetable as TSV file (Excel compatible)
export function downloadTimetableAsTSV(timetableData: TimetableData, filename: string = "timetable.tsv") {
  const tsvContent = convertTimetableToTSV(timetableData);
  const blob = new Blob([tsvContent], { type: "text/tab-separated-values;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Download filtered timetable data
export function downloadFilteredTimetable(
  timetableData: TimetableData,
  filters: {
    selectedClass?: string;
    selectedDay?: string | null;
    selectedDepartment?: string;
    selectedYear?: number;
  },
  format: 'csv' | 'tsv' = 'csv'
) {
  let filteredData = { ...timetableData };

  // Apply class filter
  if (filters.selectedClass && filters.selectedClass !== 'all') {
    filteredData.data = filteredData.data.map(day => ({
      ...day,
      data: day.data.filter(slot => slot.class === filters.selectedClass)
    }));
  }

  // Apply day filter
  if (filters.selectedDay) {
    filteredData.data = filteredData.data.filter(day => day.day === filters.selectedDay);
  }

  // Generate filename with filters
  let filename = `timetable_${filters.selectedDepartment || 'all'}_${filters.selectedYear || 'all'}`;
  if (filters.selectedClass && filters.selectedClass !== 'all') {
    filename += `_${filters.selectedClass}`;
  }
  if (filters.selectedDay) {
    filename += `_${filters.selectedDay}`;
  }

  if (format === 'csv') {
    downloadTimetableAsCSV(filteredData, `${filename}.csv`);
  } else {
    downloadTimetableAsTSV(filteredData, `${filename}.tsv`);
  }
}

// Download current view data (day or week view)
export function downloadCurrentView(
  timetableData: TimetableData,
  activeTab: 'day' | 'week',
  selectedDay: string | null,
  filters: {
    selectedClass?: string;
    selectedDepartment?: string;
    selectedYear?: number;
  },
  format: 'csv' | 'tsv' = 'csv'
) {
  let viewData = { ...timetableData };

  // Apply class filter
  if (filters.selectedClass && filters.selectedClass !== 'all') {
    viewData.data = viewData.data.map(day => ({
      ...day,
      data: day.data.filter(slot => slot.class === filters.selectedClass)
    }));
  }

  // Apply day filter for day view
  if (activeTab === 'day' && selectedDay) {
    viewData.data = viewData.data.filter(day => day.day === selectedDay);
  }

  // Generate filename for current view
  let filename = `timetable_${filters.selectedDepartment || 'all'}_${filters.selectedYear || 'all'}`;
  if (filters.selectedClass && filters.selectedClass !== 'all') {
    filename += `_${filters.selectedClass}`;
  }
  if (activeTab === 'day' && selectedDay) {
    filename += `_${selectedDay}`;
  }
  filename += `_${activeTab}View`;

  if (format === 'csv') {
    downloadTimetableAsCSV(viewData, `${filename}.csv`);
  } else {
    downloadTimetableAsTSV(viewData, `${filename}.tsv`);
  }
}
