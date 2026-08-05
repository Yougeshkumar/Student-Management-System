import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'admin' | 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (id: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data
const MOCK_USERS = {
  admin: { id: 'admin', name: 'Administrator', password: 'gehu@123', role: 'admin' as UserRole },
  teachers: [
    { id: 'T001', name: 'Dr. Smith', password: 'password', role: 'teacher' as UserRole },
    { id: 'T002', name: 'Prof. Johnson', password: 'password', role: 'teacher' as UserRole },
  ],
  students: [
    { id: 'S001', name: 'Alice Cooper', password: 'password', role: 'student' as UserRole },
    { id: 'S002', name: 'Bob Dylan', password: 'password', role: 'student' as UserRole },
  ]
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (id: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (role === 'admin' && id === 'admin' && password === 'gehu@123') {
      setUser({ id, name: 'Administrator', role });
      return true;
    } else if (role === 'teacher') {
      const teacher = MOCK_USERS.teachers.find(t => t.id === id);
      if (teacher && password === 'password') {
        setUser({ id, name: teacher.name, role });
        return true;
      }
    } else if (role === 'student') {
      const student = MOCK_USERS.students.find(s => s.id === id);
      if (student && password === 'password') {
        setUser({ id, name: student.name, role });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};