import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Department,Year,departments,useTimetableStore,years } from '~/stores/time-table';
import { TimetableData } from '~/types/timetable';

export async function loader({ request }: LoaderFunctionArgs) {
  // Initialize default values or extract from URL query params if needed
  const url = new URL(request.url);
  const department = url.searchParams.get('department') || 'EL';
  const year = url.searchParams.get('year') || '3';
  const classPattern = `${department} ${year}`;

  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `http://localhost:3000/api/v1/get_time_table?t=${timestamp}`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          filename: 'Draft_1_ex.xlsx',
          class_pattern: classPattern,
          is_exam: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch exam data: ${response.statusText}`);
    }

    const data: TimetableData = await response.json();
    return json({ timetableData: data, department, year });
  } catch (error) {
    return json(
      { error: (error as Error).message || 'Failed to load exam timetable' },
      { status: 500 },
    );
  }
}

export default function TimetablePage() {
  const navigate = useNavigate();
  const { timetableData, error, department, year } = useLoaderData<{
    timetableData?: TimetableData;
    error?: string;
    department?: string;
    year?: string;
  }>();
  const {
    exams,
    selectedDepartment,
    selectedYear,
    setDepartment,
    setYear,
    fetchExams,
    isLoading,
    error: storeError,
    clearError,
  } = useTimetableStore();
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Initialize store with loader data
  useEffect(() => {
    if (department && year) {
      setDepartment(department as Department);
      setYear(Number(year) as Year);
    }
    if (timetableData) {
      useTimetableStore.setState({ exams: timetableData });
    }
  }, [department, year, timetableData]);

  // Get unique classes from exam data
  const getUniqueClasses = () => {
    if (!exams) return [];
    return Array.from(
      new Set(exams.data.flatMap((day) => day.data.map((exam) => exam.class))),
    ).sort();
  };

  const classes = getUniqueClasses();

  // Filter exam data based on selected class
  const filteredData = exams?.data.filter((day) =>
    selectedClass === 'all'
      ? true
      : day.data.some((exam) => exam.class === selectedClass),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#02040A] flex items-center justify-center">
        <div className="text-[#71717A] dark:text-[#D4D4D8]">
          Loading exam timetable...
        </div>
      </div>
    );
  }

  if (error || storeError) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#02040A] flex items-center justify-center">
        <div className="text-red-500">
          {error || storeError}
          <button onClick={clearError} className="ml-4 text-blue-500">
            Clear Error
          </button>
        </div>
      </div>
    );
  }

  if (!exams) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#02040A] flex items-center justify-center">
        <div className="text-[#71717A] dark:text-[#D4D4D8]">
          No exam timetable found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#02040A] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam Timetable
          </h1>
        </div>

        {/* Department and Year Selection */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div>
            <label
              htmlFor="department"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
            >
              Department:
            </label>
            <select
              id="department"
              value={selectedDepartment || ''}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
            <label
              htmlFor="year"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
            >
              Year:
            </label>
            <select
              id="year"
              value={selectedYear || ''}
              onChange={(e) => setYear(Number(e.target.value) as Year)}
              className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
            onClick={() => fetchExams()}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Load Exams
          </button>
        </div>

        {/* Class Filter */}
        <div className="mb-6">
          <label
            htmlFor="class-filter"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2"
          >
            Filter by Class:
          </label>
          <select
            id="class-filter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="all">All Classes</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Timetable */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Time
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Course
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Class
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Location
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Invigilator
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((day, index) =>
                day.data.map((exam, examIndex) => (
                  <tr
                    key={`${index}-${examIndex}`}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {day.day}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {`${exam.start} - ${exam.end}`}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {exam.value}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {exam.class}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {exam.location}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {exam.invigilator || 'TBA'}
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}