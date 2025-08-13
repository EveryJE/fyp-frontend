import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Alert } from '~/components/ui/alert';
import { useAuth } from './auth-context';
import type { RegisterData, UserRole } from '~/types/auth';

interface RegisterFormProps {
    onSwitchToLogin?: () => void;
    onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSwitchToLogin,
    onSuccess
}) => {
    const { register, isLoading, error, clearError } = useAuth();
    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: 'student',
        studentId: '',
        lecturerId: '',
        department: '',
        course: '',
        year: undefined,
    });
    const [validationErrors, setValidationErrors] = useState<Partial<RegisterData>>({});

    const validateForm = (): boolean => {
        const errors: Partial<RegisterData> = {};

        // Basic validation
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.name.trim()) {
            errors.name = 'Full name is required';
        }

        // Role-specific validation
        if (formData.role === 'student') {
            if (!formData.studentId?.trim()) {
                errors.studentId = 'Student ID is required';
            }
            if (!formData.course?.trim()) {
                errors.course = 'Course is required';
            }
            if (!formData.year || formData.year < 1 || formData.year > 6) {
                errors.year = 'Please enter a valid year (1-6)';
            }
        }

        if (formData.role === 'lecturer') {
            if (!formData.lecturerId?.trim()) {
                errors.lecturerId = 'Lecturer ID is required';
            }
            if (!formData.department?.trim()) {
                errors.department = 'Department is required';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            return;
        }

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            onSuccess?.();
        } catch (error) {
            // Error is handled by the auth context
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? (value ? parseInt(value) : undefined) : value
        }));

        // Clear validation error when user starts typing
        if (validationErrors[name as keyof RegisterData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const renderRoleSpecificFields = () => {
        switch (formData.role) {
            case 'student':
                return (
                    <>
                        <div className="space-y-2">
                            <label htmlFor="studentId" className="text-sm font-medium">
                                Student ID
                            </label>
                            <Input
                                id="studentId"
                                name="studentId"
                                type="text"
                                placeholder="e.g., STU001"
                                value={formData.studentId}
                                onChange={handleInputChange}
                                className={validationErrors.studentId ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {validationErrors.studentId && (
                                <p className="text-sm text-red-500">{validationErrors.studentId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="course" className="text-sm font-medium">
                                Course
                            </label>
                            <select
                                id="course"
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.course ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                            >
                                <option value="">Select your course</option>
                                <option value="Computer Engineering">Computer Engineering</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Chemical Engineering">Chemical Engineering</option>
                                <option value="Industrial Engineering">Industrial Engineering</option>
                            </select>
                            {validationErrors.course && (
                                <p className="text-sm text-red-500">{validationErrors.course}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="year" className="text-sm font-medium">
                                Year
                            </label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year || ''}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                            >
                                <option value="">Select your year</option>
                                <option value={1}>Year 1</option>
                                <option value={2}>Year 2</option>
                                <option value={3}>Year 3</option>
                                <option value={4}>Year 4</option>
                                <option value={5}>Year 5</option>
                                <option value={6}>Year 6</option>
                            </select>
                            {validationErrors.year && (
                                <p className="text-sm text-red-500">{validationErrors.year}</p>
                            )}
                        </div>
                    </>
                );

            case 'lecturer':
                return (
                    <>
                        <div className="space-y-2">
                            <label htmlFor="lecturerId" className="text-sm font-medium">
                                Lecturer ID
                            </label>
                            <Input
                                id="lecturerId"
                                name="lecturerId"
                                type="text"
                                placeholder="e.g., LEC001"
                                value={formData.lecturerId}
                                onChange={handleInputChange}
                                className={validationErrors.lecturerId ? 'border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {validationErrors.lecturerId && (
                                <p className="text-sm text-red-500">{validationErrors.lecturerId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="department" className="text-sm font-medium">
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.department ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                            >
                                <option value="">Select your department</option>
                                <option value="Computer Engineering">Computer Engineering</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Civil Engineering">Civil Engineering</option>
                                <option value="Chemical Engineering">Chemical Engineering</option>
                                <option value="Industrial Engineering">Industrial Engineering</option>
                            </select>
                            {validationErrors.department && (
                                <p className="text-sm text-red-500">{validationErrors.department}</p>
                            )}
                        </div>
                    </>
                );

            case 'owner':
                return (
                    <div className="space-y-2">
                        <label htmlFor="department" className="text-sm font-medium">
                            Department (Optional)
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            <option value="">Select department (optional)</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Chemical Engineering">Chemical Engineering</option>
                            <option value="Industrial Engineering">Industrial Engineering</option>
                        </select>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                    Join our campus community and access personalized features
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            {error}
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={validationErrors.name ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {validationErrors.name && (
                            <p className="text-sm text-red-500">{validationErrors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={validationErrors.email ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {validationErrors.email && (
                            <p className="text-sm text-red-500">{validationErrors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="owner">Owner/Administrator</option>
                            <option value="guest">Guest</option>
                        </select>
                    </div>

                    {renderRoleSpecificFields()}

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={validationErrors.password ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {validationErrors.password && (
                            <p className="text-sm text-red-500">{validationErrors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={validationErrors.confirmPassword ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>

                    {onSwitchToLogin && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                    disabled={isLoading}
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};
