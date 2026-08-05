import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Calendar, GraduationCap, Award } from 'lucide-react';
import { calculateGrade } from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrollments, teachers, semesters } = useData();
  
  if (!user) return null;
  
  const studentEnrollments = enrollments.filter(e => e.studentId === user.id);
  
  // Calculate GPA (simple implementation)
  const calculateGPA = () => {
    if (studentEnrollments.length === 0) return 0;
    
    let totalPoints = 0;
    
    studentEnrollments.forEach(enrollment => {
      const grade = calculateGrade(
        enrollment.attendance,
        enrollment.quiz,
        enrollment.midterm,
        enrollment.final
      );
      
      // Convert letter grade to GPA points
      switch(grade) {
        case 'A+': totalPoints += 4.0; break;
        case 'A': totalPoints += 4.0; break;
        case 'A-': totalPoints += 3.7; break;
        case 'B+': totalPoints += 3.3; break;
        case 'B': totalPoints += 3.0; break;
        case 'B-': totalPoints += 2.7; break;
        case 'C+': totalPoints += 2.3; break;
        case 'C': totalPoints += 2.0; break;
        case 'D': totalPoints += 1.0; break;
        case 'F': totalPoints += 0.0; break;
        default: totalPoints += 0.0;
      }
    });
    
    return (totalPoints / studentEnrollments.length).toFixed(2);
  };
  
  // Get unique semesters for this student
  const studentSemesters = [...new Set(studentEnrollments.map(e => e.semesterId))];
  
  // Count courses by semester
  const coursesBySemester = studentSemesters.map(semesterId => {
    const semesterEnrollments = studentEnrollments.filter(e => e.semesterId === semesterId);
    return {
      semesterId,
      count: semesterEnrollments.length
    };
  });

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600">View your courses and academic records</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Courses</p>
              <p className="text-2xl font-bold">{studentEnrollments.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <BookOpen size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">GPA</p>
              <p className="text-2xl font-bold">{calculateGPA()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Award size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Semesters</p>
              <p className="text-2xl font-bold">{studentSemesters.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Calendar size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Current Status</p>
              <p className="text-2xl font-bold">Active</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <GraduationCap size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Your Courses</h2>
        
        {studentSemesters.length > 0 ? (
          <div className="space-y-6">
            {studentSemesters.map(semesterId => {
              const semester = semesters.find(s => s.id === semesterId);
              const semesterEnrollments = studentEnrollments.filter(e => e.semesterId === semesterId);
              
              return (
                <div key={semesterId}>
                  <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b">
                    {semester?.name}
                  </h3>
                  
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Teacher</th>
                          <th>Marks</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterEnrollments.map(enrollment => {
                          const course = courses.find(c => c.id === enrollment.courseId);
                          const teacher = course ? teachers.find(t => t.id === course.teacherId) : null;
                          const grade = calculateGrade(
                            enrollment.attendance,
                            enrollment.quiz,
                            enrollment.midterm,
                            enrollment.final
                          );
                          
                          return (
                            <tr key={enrollment.id} className="border-b">
                              <td>
                                <div className="font-medium">{course?.name}</div>
                                <div className="text-sm text-gray-500">{course?.id}</div>
                              </td>
                              <td>{teacher?.name}</td>
                              <td>
                                <div className="text-xs space-y-1">
                                  <div>Attendance: <span className="font-medium">{enrollment.attendance}/15</span></div>
                                  <div>Quiz: <span className="font-medium">{enrollment.quiz}/15</span></div>
                                  <div>Midterm: <span className="font-medium">{enrollment.midterm}/30</span></div>
                                  <div>Final: <span className="font-medium">{enrollment.final}/40</span></div>
                                  <div className="font-medium pt-1">
                                    Total: {enrollment.attendance + enrollment.quiz + enrollment.midterm + enrollment.final}/100
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${
                                  grade === 'F' ? 'badge-red' : 
                                  (grade.startsWith('A') ? 'badge-green' : 
                                  (grade.startsWith('B') ? 'badge-blue' : 'badge-orange'))
                                }`}>
                                  {grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p>You are not enrolled in any courses</p>
          </div>
        )}
      </div>

      {/* Performance Chart - Simplified version */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Academic Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Courses by Semester</h3>
            <div className="space-y-4">
              {coursesBySemester.map(item => {
                const semester = semesters.find(s => s.id === item.semesterId);
                
                return (
                  <div key={item.semesterId}>
                    <div className="flex justify-between items-center mb-1">
                      <span>{semester?.name}</span>
                      <span className="font-medium">{item.count} courses</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, item.count * 20)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              {coursesBySemester.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Grade Distribution</h3>
            
            <GradeDistribution enrollments={studentEnrollments} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface GradeDistributionProps {
  enrollments: Array<{
    id: string;
    courseId: string;
    studentId: string;
    semesterId: string;
    attendance: number;
    quiz: number;
    midterm: number;
    final: number;
  }>;
}

const GradeDistribution: React.FC<GradeDistributionProps> = ({ enrollments }) => {
  // Count grades
  const gradeCounts: Record<string, number> = {
    'A+': 0, 'A': 0, 'A-': 0,
    'B+': 0, 'B': 0, 'B-': 0,
    'C+': 0, 'C': 0, 'D': 0, 'F': 0
  };
  
  enrollments.forEach(enrollment => {
    const grade = calculateGrade(
      enrollment.attendance,
      enrollment.quiz,
      enrollment.midterm,
      enrollment.final
    );
    
    if (gradeCounts[grade] !== undefined) {
      gradeCounts[grade]++;
    }
  });
  
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No data available
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {Object.entries(gradeCounts).map(([grade, count]) => {
        if (count === 0) return null;
        
        const percentage = Math.round((count / enrollments.length) * 100);
        
        let colorClass = '';
        if (grade.startsWith('A')) colorClass = 'bg-green-500';
        else if (grade.startsWith('B')) colorClass = 'bg-blue-500';
        else if (grade.startsWith('C')) colorClass = 'bg-orange-500';
        else if (grade === 'D') colorClass = 'bg-orange-700';
        else if (grade === 'F') colorClass = 'bg-red-500';
        
        return (
          <div key={grade}>
            <div className="flex justify-between items-center mb-1">
              <span>Grade {grade}</span>
              <span className="font-medium">{count} courses ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${colorClass} h-2 rounded-full`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentDashboard;