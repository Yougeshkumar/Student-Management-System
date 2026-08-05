import React, { useState } from 'react';
import { Users, GraduationCap, CalendarDays, BookOpen, Plus } from 'lucide-react';
import TeacherManager from './TeacherManager';
import StudentManager from './StudentManager';
import SemesterManager from './SemesterManager';
import CourseManager from './CourseManager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, courses, and semesters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div 
          className={`card cursor-pointer transition-all ${activeTab === 'teachers' ? 'border-2 border-blue-500 shadow-md' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('teachers')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-medium">Teachers</h3>
              <p className="text-sm text-gray-500">Manage faculty</p>
            </div>
          </div>
        </div>

        <div 
          className={`card cursor-pointer transition-all ${activeTab === 'students' ? 'border-2 border-blue-500 shadow-md' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('students')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="font-medium">Students</h3>
              <p className="text-sm text-gray-500">Manage students</p>
            </div>
          </div>
        </div>

        <div 
          className={`card cursor-pointer transition-all ${activeTab === 'semesters' ? 'border-2 border-blue-500 shadow-md' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('semesters')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <CalendarDays size={24} />
            </div>
            <div>
              <h3 className="font-medium">Semesters</h3>
              <p className="text-sm text-gray-500">Manage terms</p>
            </div>
          </div>
        </div>

        <div 
          className={`card cursor-pointer transition-all ${activeTab === 'courses' ? 'border-2 border-blue-500 shadow-md' : 'hover:shadow-md'}`}
          onClick={() => setActiveTab('courses')}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-medium">Courses</h3>
              <p className="text-sm text-gray-500">Manage curriculum</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 slide-in">
        {activeTab === 'teachers' && <TeacherManager />}
        {activeTab === 'students' && <StudentManager />}
        {activeTab === 'semesters' && <SemesterManager />}
        {activeTab === 'courses' && <CourseManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;