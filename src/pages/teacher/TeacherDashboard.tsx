import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Users } from 'lucide-react';
import MarksEditor from './MarksEditor';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrollments, semesters } = useData();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  if (!user) return null;

  // Get all courses taught by this teacher
  const teacherCourses = courses.filter(course => course.teacherId === user.id);
  
  // Get unique semesters for this teacher's courses
  const teacherSemesters = [...new Set(teacherCourses.map(course => course.semesterId))];
  
  // Filter courses by selected semester
  const filteredCourses = selectedSemester 
    ? teacherCourses.filter(course => course.semesterId === selectedSemester)
    : teacherCourses;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your courses and student grades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium">Semesters</h2>
            </div>
            <div className="p-2">
              <button
                className={`w-full text-left p-2 rounded-md mb-1 ${!selectedSemester ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setSelectedSemester(null);
                  setSelectedCourse(null);
                }}
              >
                All Semesters
              </button>
              
              {teacherSemesters.map(semesterId => {
                const semester = semesters.find(s => s.id === semesterId);
                return (
                  <button
                    key={semesterId}
                    className={`w-full text-left p-2 rounded-md mb-1 ${selectedSemester === semesterId ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedSemester(semesterId);
                      setSelectedCourse(null);
                    }}
                  >
                    {semester?.name}
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 border-t border-b border-gray-200">
              <h2 className="font-medium">Your Courses</h2>
            </div>
            <div className="p-2">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => {
                  const semester = semesters.find(s => s.id === course.semesterId);
                  // Count students enrolled in this course
                  const studentCount = enrollments.filter(
                    e => e.courseId === course.id && e.semesterId === course.semesterId
                  ).length;
                  
                  return (
                    <button
                      key={`${course.id}-${course.semesterId}`}
                      className={`w-full text-left p-2 rounded-md mb-1 ${selectedCourse === course.id && selectedSemester === course.semesterId ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedCourse(course.id);
                        setSelectedSemester(course.semesterId);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{course.name}</div>
                          <div className="text-sm text-gray-500">{course.id} • {semester?.name}</div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          {studentCount}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {selectedSemester ? 'No courses in this semester' : 'You are not teaching any courses'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedCourse && selectedSemester ? (
            <MarksEditor 
              courseId={selectedCourse} 
              semesterId={selectedSemester} 
            />
          ) : (
            <TeacherCourseOverview 
              courses={filteredCourses} 
              onSelectCourse={(courseId, semesterId) => {
                setSelectedCourse(courseId);
                setSelectedSemester(semesterId);
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface TeacherCourseOverviewProps {
  courses: Array<{
    id: string;
    name: string;
    semesterId: string;
    teacherId: string;
  }>;
  onSelectCourse: (courseId: string, semesterId: string) => void;
}

const TeacherCourseOverview: React.FC<TeacherCourseOverviewProps> = ({ courses, onSelectCourse }) => {
  const { semesters, enrollments } = useData();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium mb-4">Course Overview</h2>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => {
            const semester = semesters.find(s => s.id === course.semesterId);
            const courseEnrollments = enrollments.filter(
              e => e.courseId === course.id && e.semesterId === course.semesterId
            );
            
            return (
              <div 
                key={`${course.id}-${course.semesterId}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => onSelectCourse(course.id, course.semesterId)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{course.id} • {semester?.name}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                    <BookOpen size={20} />
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <Users size={18} className="mr-1" />
                    <span>{courseEnrollments.length} Students</span>
                  </div>
                  
                  <span className="text-sm text-blue-600">Manage Course →</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <BookOpen size={48} className="mx-auto mb-2 text-gray-400" />
          <p>You are not teaching any courses</p>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;