import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import React from 'react';
import { useEffect, useState } from 'react';
import { Chatbot } from '~/components/chat/google-bot';
import Header from '~/components/layout/header/header';
import Sidebar from '~/components/layout/sidebar/sidebar';

interface User {
  userType: string;
  name?: string;
  email?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  level?: string;
  department?: string;
  [key: string]: any;
}

interface OwnerDashboardProps {
  title: string;
  children?: React.ReactNode;
}

interface TimetableEntry {
  id: string;
  subject: string;
  time: string;
  room: string;
  day: string;
  instructor?: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'exam';
  class?: string; // For lecturer - which class they're teaching
  students?: number; // For lecturer - number of students
}

// Mock student timetable data
const mockStudentTimetableData: TimetableEntry[] = [
  {
    id: '1',
    subject: 'Computer Science 101',
    time: '9:00 AM - 10:30 AM',
    room: 'CS Building - Room 201',
    day: 'Monday',
    instructor: 'Dr. Smith',
    type: 'lecture'
  },
  {
    id: '2',
    subject: 'Mathematics',
    time: '11:00 AM - 12:30 PM',
    room: 'Math Building - Room 105',
    day: 'Monday',
    instructor: 'Prof. Johnson',
    type: 'lecture'
  },
  {
    id: '3',
    subject: 'Programming Lab',
    time: '2:00 PM - 4:00 PM',
    room: 'CS Lab - Room 301',
    day: 'Tuesday',
    instructor: 'Dr. Wilson',
    type: 'lab'
  },
  {
    id: '4',
    subject: 'Physics',
    time: '10:00 AM - 11:30 AM',
    room: 'Physics Building - Room 150',
    day: 'Wednesday',
    instructor: 'Dr. Brown',
    type: 'lecture'
  },
  {
    id: '5',
    subject: 'Database Systems',
    time: '1:00 PM - 2:30 PM',
    room: 'CS Building - Room 210',
    day: 'Thursday',
    instructor: 'Prof. Davis',
    type: 'tutorial'
  }
];

// Mock lecturer timetable data (what the lecturer is teaching)
const mockLecturerTimetableData: TimetableEntry[] = [
  {
    id: '1',
    subject: 'Advanced Algorithms',
    time: '9:00 AM - 10:30 AM',
    room: 'CS Building - Room 301',
    day: 'Monday',
    class: 'CS 300 - Section A',
    students: 45,
    type: 'lecture'
  },
  {
    id: '2',
    subject: 'Data Structures Lab',
    time: '2:00 PM - 4:00 PM',
    room: 'CS Lab - Room 205',
    day: 'Monday',
    class: 'CS 250 - Lab Group 1',
    students: 25,
    type: 'lab'
  },
  {
    id: '3',
    subject: 'Software Engineering',
    time: '11:00 AM - 12:30 PM',
    room: 'CS Building - Room 401',
    day: 'Tuesday',
    class: 'CS 400 - Section B',
    students: 38,
    type: 'lecture'
  },
  {
    id: '4',
    subject: 'Algorithm Tutorial',
    time: '3:00 PM - 4:00 PM',
    room: 'CS Building - Room 301',
    day: 'Wednesday',
    class: 'CS 300 - Tutorial',
    students: 20,
    type: 'tutorial'
  },
  {
    id: '5',
    subject: 'Project Supervision',
    time: '10:00 AM - 12:00 PM',
    room: 'CS Building - Room 501',
    day: 'Thursday',
    class: 'Final Year Projects',
    students: 8,
    type: 'tutorial'
  }
];

const TimetableSummaryCards: React.FC<{ user: User }> = ({ user }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isLecturer = user.userType === 'lecturer' || user.userType === 'instructor';
  
  // Use appropriate data based on user type
  const timetableData = isLecturer ? mockLecturerTimetableData : mockStudentTimetableData;
  const todayClasses = timetableData.filter(entry => entry.day === today);
  const upcomingClasses = timetableData.slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'lab':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'tutorial':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'exam':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'lab':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'tutorial':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'exam':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Calculate stats based on user type
  const getStatsForUserType = () => {
    if (isLecturer) {
      const totalStudents = timetableData.reduce((sum, entry) => sum + (entry.students || 0), 0);
      return {
        todayLabel: "Today's Classes",
        todayCount: todayClasses.length,
        secondLabel: "Total Students",
        secondCount: totalStudents,
        thirdLabel: "Lab Sessions",
        thirdCount: timetableData.filter(t => t.type === 'lab').length,
        fourthLabel: "This Week",
        fourthCount: timetableData.length
      };
    } else {
      return {
        todayLabel: "Today's Classes",
        todayCount: todayClasses.length,
        secondLabel: "Total Subjects",
        secondCount: new Set(timetableData.map(t => t.subject)).size,
        thirdLabel: "Lab Sessions",
        thirdCount: timetableData.filter(t => t.type === 'lab').length,
        fourthLabel: "This Week",
        fourthCount: timetableData.length
      };
    }
  };

  const stats = getStatsForUserType();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user.firstName || user.name || (isLecturer ? 'Lecturer' : 'Student')}!
        </h1>
        <p className="text-teal-100">
          {isLecturer 
            ? 'Ready to teach your classes today?' 
            : 'Ready for your classes today?'
          }
        </p>
        {user.level && user.department && (
          <p className="text-sm text-teal-200 mt-1">
            {user.department} {!isLecturer && `• Level ${user.level}`}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stats.todayLabel}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayCount}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stats.secondLabel}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.secondCount}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              {isLecturer ? (
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stats.thirdLabel}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thirdCount}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stats.fourthLabel}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.fourthCount}</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isLecturer ? "Today's Teaching Schedule" : "Today's Schedule"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400">{today}</p>
        </div>
        <div className="p-6">
          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className={`p-2 rounded-lg ${getTypeColor(classItem.type)}`}>
                    {getTypeIcon(classItem.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{classItem.subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{classItem.time}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500">{classItem.room}</p>
                    {isLecturer && classItem.class && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">{classItem.class}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
                      {classItem.type}
                    </span>
                    {isLecturer ? (
                      classItem.students && (
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{classItem.students} students</p>
                      )
                    ) : (
                      classItem.instructor && (
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{classItem.instructor}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 dark:text-slate-400">
                {isLecturer ? "No classes to teach today" : "No classes scheduled for today"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isLecturer ? "Upcoming Teaching Schedule" : "Upcoming Classes"}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
                    {classItem.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-500">{classItem.day}</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{classItem.subject}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">{classItem.time}</p>
                <p className="text-xs text-gray-500 dark:text-slate-500">{classItem.room}</p>
                {isLecturer ? (
                  <>
                    {classItem.class && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">📚 {classItem.class}</p>
                    )}
                    {classItem.students && (
                      <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">👥 {classItem.students} students</p>
                    )}
                  </>
                ) : (
                  classItem.instructor && (
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">👨‍🏫 {classItem.instructor}</p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OwnerDashboard({
  title,
  children,
}: OwnerDashboardProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user: User = JSON.parse(userData);
        setCurrentUser(user);
      } else {
        // If no user is logged in, redirect to login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // If there's an error, redirect to login
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user (shouldn't happen due to redirect, but just in case)
  if (!currentUser) {
    return null;
  }

  const isStudent: boolean = currentUser?.userType === 'student';

  return (
    <div>
      <div className="dark:bg-slate-700/70">
        {/* Only show sidebar if user is not a student */}
        {!isStudent && <Sidebar />}
        
        <main className={`${
          isStudent 
            ? '' // No padding for students (no sidebar)
            : 'md:ps-65 md:hs-overlay-minified:ps-13' // Normal sidebar padding for other users
        } transition-all duration-300 h-screen flex flex-col`}>
          <Header userRole={currentUser.userType} userData={currentUser} />
          <Chatbot />
          <div className="w-full h-full pt-16 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Show timetable summary cards if no children are provided */}
              {!children && <TimetableSummaryCards user={currentUser} />}
              
              {/* Pass user data to children components */}
              {children ? (
                React.cloneElement(children as React.ReactElement, { 
                  userData: currentUser, 
                  userRole: currentUser?.userType 
                })
              ) : (
                <Outlet context={{ userData: currentUser, userRole: currentUser?.userType }} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}