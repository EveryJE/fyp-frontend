import React, { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useAuth } from './auth-context';

interface AuthPageProps {
    onSuccess?: () => void;
    defaultMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({
    onSuccess,
    defaultMode = 'login'
}) => {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const { isAuthenticated, user, continueAsGuest } = useAuth();

    // If user is already authenticated, show success or redirect
    if (isAuthenticated && user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-green-600">
                            Welcome back, {user.name}!
                        </CardTitle>
                        <CardDescription>
                            You are successfully logged in as a {user.role}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button
                            onClick={onSuccess}
                            className="w-full"
                        >
                            Continue to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                {/* Mode Toggle */}
                <div className="mb-6">
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'login'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'register'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Form */}
                {mode === 'login' ? (
                    <LoginForm
                        onSwitchToRegister={() => setMode('register')}
                        onSuccess={onSuccess}
                    />
                ) : (
                    <RegisterForm
                        onSwitchToLogin={() => setMode('login')}
                        onSuccess={onSuccess}
                    />
                )}

                {/* Guest Access Option */}
                <div className="mt-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                Or continue as
                            </span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                continueAsGuest();
                                onSuccess?.();
                            }}
                            className="w-full"
                        >
                            Continue as Guest
                        </Button>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                            Guests can access basic features like directions and public events
                        </p>
                    </div>
                </div>

                {/* Features Preview */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        What you can do:
                    </h3>
                    <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Get directions to any location on campus</li>
                        <li>• Check lecturer availability</li>
                        <li>• View campus activities and events</li>
                        <li>• Access personalized timetables (when logged in)</li>
                        <li>• Manage schedules (lecturers only)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
