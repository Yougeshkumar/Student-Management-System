import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Search, UserPlus, X, Trash2 } from 'lucide-react';
import { calculateGrade } from '../../data/mockData';

const StudentManager: React.FC = () => {
  const { students, courses, enrollments, semesters, addStudent, deleteStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filteredStudents = students.filter(student => 
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStudentId || !newStudentName) {
      setError('Both ID and name are required.');
      return;
    }
    
    // Check if student ID already exists
    if (students.some(s => s.id === newStudentId)) {
      setError('A student with this ID already exists.');
      return;
    }
    
    addStudent({ id: newStudentId, name: newStudentName });
    setNewStudentId('');
    setNewStudentName('');
    setError('');
    setShowAddForm(false);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm(`Are you sure you want to delete student ${studentId}? This action cannot be undone.`)) {
      deleteStudent(studentId);
      setSelectedStudent(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Students</h2>
          <p className="text-gray-600">Add, view, and manage students</p>
        </div>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? (
            <>
              <X size={16} className="mr-1" /> Cancel
            </>
          ) : (
            <>
              <UserPlus size={16} className="mr-1" /> Add Student
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add New Student</h3>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                placeholder="e.g. S005"
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Full Name"
                className="input"
              />
            </div>
            
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                Add Student
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Students</h3>
          </div>
          <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <li 
                  key={student.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedStudent === student.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedStudent(student.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.id}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(student.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                No students found
              </li>
            )}
          </ul>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <StudentDetails studentId={selectedStudent} />
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>Select a student to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component to display student details
const StudentDetails: React.FC<{ studentId: string }> = ({ studentId }) => {
  const { students, courses, enrollments, semesters, teachers } = useData();
  
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <p className="text-red-500">Student not found</p>
      </div>
    );
  }
  
  const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium">{student.name} - {student.id}</h3>
      </div>
      
      <div className="p-4">
        <h4 className="font-medium mb-3">Enrolled Courses</h4>
        
        {studentEnrollments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Teacher</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {studentEnrollments.map((enrollment) => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  const semester = semesters.find(s => s.id === enrollment.semesterId);
                  const teacher = teachers.find(t => course && t.id === course.teacherId);
                  const grade = calculateGrade(
                    enrollment.attendance, 
                    enrollment.quiz, 
                    enrollment.midterm, 
                    enrollment.final
                  );
                  
                  return (
                    <tr key={enrollment.id} className="border-b">
                      <td>
                        <div className="font-medium">{course?.id}</div>
                        <div className="text-sm text-gray-500">{course?.name}</div>
                      </td>
                      <td>{semester?.name}</td>
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
        ) : (
          <div className="text-center py-4 text-gray-500">
            This student is not enrolled in any courses
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManager;