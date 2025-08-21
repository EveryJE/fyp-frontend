import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { GridPattern } from '~/components/magicui/grid-pattern';
import { cn } from '~/lib/utils';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'student'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        
        // Clear login error when user starts typing
        if (loginError) {
            setLoginError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');
        
        // Simulate API call
        setTimeout(() => {
            try {
                // Get users from localStorage
                const users = JSON.parse(localStorage.getItem('campusUsers') || '[]');
                
                // Find user with matching email, password, and user type
                const user = users.find(u => 
                    u.email === formData.email && 
                    u.password === formData.password && 
                    u.userType === formData.userType
                );

                if (user) {
                    // Store current user session
                    localStorage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        userType: user.userType,
                        level: user.level,
                        department: user.department,
                        loginTime: new Date().toISOString()
                    }));

                    console.log('Login successful:', user);
                    
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    // Check if email exists but password/userType is wrong
                    const emailExists = users.some(u => u.email === formData.email);
                    
                    if (emailExists) {
                        setLoginError('Invalid password or user type. Please check your credentials.');
                    } else {
                        setLoginError('No account found with this email. Please sign up first.');
                    }
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('Login error:', error);
                setLoginError('An error occurred during login. Please try again.');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="relative min-h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
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
            
            <div className="max-w-md w-full space-y-8 relative z-10">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center bg-teal-100 rounded-full">
                        <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-200">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
                        Access your campus navigation and schedule
                    </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* User Type Selection */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3 block">
                                I am a:
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="student"
                                        checked={formData.userType === 'student'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Student</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="teacher"
                                        checked={formData.userType === 'teacher'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Teacher</span>
                                </label>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Login Error */}
                        {loginError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                {loginError}
                            </div>
                        )}

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-slate-300">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                )}
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        {/* Sign up link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-500">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Back to home */}
                <div className="text-center">
                    <Link 
                        to="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Campus Navigation
                    </Link>
                </div>
            </div>
        </div>
    );
}