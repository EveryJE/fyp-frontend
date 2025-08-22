import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { GridPattern } from '~/components/magicui/grid-pattern';
import { cn } from '~/lib/utils';

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'student',
        level: '',
        department: '',
        acceptTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear password error when user starts typing
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const validatePasswords = () => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswords()) {
            return;
        }

        if (!formData.acceptTerms) {
            alert('Please accept the terms and conditions');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            try {
                // Check if user already exists
                const existingUsers = JSON.parse(localStorage.getItem('campusUsers') || '[]');
                const userExists = existingUsers.some(user => user.email === formData.email);
                
                if (userExists) {
                    alert('An account with this email already exists. Please use a different email or sign in.');
                    setIsLoading(false);
                    return;
                }

                // Create user object (excluding confirmPassword for storage)
                const { confirmPassword, ...userData } = formData;
                const newUser = {
                    id: Date.now().toString(), // Simple ID generation
                    ...userData,
                    createdAt: new Date().toISOString()
                };

                // Add new user to existing users array
                existingUsers.push(newUser);
                localStorage.setItem('campusUsers', JSON.stringify(existingUsers));

                console.log('Sign up successful:', newUser);
                alert('Account created successfully! You can now sign in.');
                
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    userType: 'student',
                    level: '',
                    department: '',
                    acceptTerms: false
                });

                setIsLoading(false);
                
                // Redirect to login page after successful signup
                window.location.href = '/login';
                
            } catch (error) {
                console.error('Error saving user data:', error);
                alert('An error occurred while creating your account. Please try again.');
                setIsLoading(false);
            }
        }, 1500);
    };

    const departments = [
        'Computer Science',
        'Engineering', 
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Business Administration',
        'Liberal Arts',
        'Other'
    ];

    return (
        <div className="relative min-h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-slate-200">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
                        Join the campus navigation community
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

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
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

                        {/* Level Selection for Students */}
                        {formData.userType === 'student' && (
                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Level
                                </label>
                                <select
                                    id="level"
                                    name="level"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                    value={formData.level}
                                    onChange={handleChange}
                                >
                                    <option value="">Select your level</option>
                                    <option value="100">100 Level</option>
                                    <option value="200">200 Level</option>
                                    <option value="300">300 Level</option>
                                    <option value="400">400 Level</option>
                                </select>
                            </div>
                        )}

                        {/* Department */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select your department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
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
                                    autoComplete="new-password"
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
                            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-slate-200"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {showConfirmPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-slate-300">
                                I agree to the{' '}
                                <Link to="/terms" className="font-medium text-teal-600 hover:text-teal-500">
                                    Terms and Conditions
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="font-medium text-teal-600 hover:text-teal-500">
                                    Privacy Policy
                                </Link>
                            </label>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM9 12l2 2 4-4" />
                                    </svg>
                                )}
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>

                        {/* Sign in link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                                    Sign in here
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