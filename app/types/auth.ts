export type UserRole = 'student' | 'lecturer' | 'owner' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string; // For students
  lecturerId?: string; // For lecturers
  department?: string;
  course?: string; // For students
  year?: number; // For students
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword?: string; // For form validation only
  name: string;
  role: UserRole;
  studentId?: string;
  lecturerId?: string;
  department?: string;
  course?: string;
  year?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: (name?: string) => void;
  clearError: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
