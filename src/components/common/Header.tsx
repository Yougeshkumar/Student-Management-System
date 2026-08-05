import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={28} />
            <h1 className="text-2xl font-bold">Student Management System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="opacity-75">Logged in as: </span>
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded-full text-xs">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            
            <button 
              onClick={logout}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-900 rounded-md text-sm transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;