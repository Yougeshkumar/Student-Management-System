import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Search, Plus, X, UserPlus } from 'lucide-react';
import { generateId } from '../../data/mockData';

const CourseManager: React.FC = () => {
  const { courses, semesters, teachers, students, enrollments, addCourse, addEnrollment, updateCourse } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollError, setEnrollError] = useState('');

  const filteredCourses = courses.filter(course => 
    course.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCourseId || !newCourseName || !selectedSemesterId || !selectedTeacherId) {
      setError('All fields are required.');
      return;
    }
    
    // Check if course ID already exists
    if (courses.some(c => c.id === newCourseId)) {
      setError('A course with this ID already exists.');
      return;
    }
    
    addCourse({
      id: newCourseId,
      name: newCourseName,
      semesterId: selectedSemesterId,
      teacherId: selectedTeacherId
    });
    
    setNewCourseId('');
    setNewCourseName('');
    setSelectedSemesterId('');
    setSelectedTeacherId('');
    setError('');
    setShowAddForm(false);
  };

  const handleUpdateTeacher = (courseId: string, teacherId: string) => {
    if (!teacherId) {
      return;
    }
    
    updateCourse(courseId, { teacherId });
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse || !enrollStudentId) {
      setEnrollError('Please select a student.');
      return;
    }
    
    const course = courses.find(c => c.id === selectedCourse);
    
    if (!course) {
      setEnrollError('Course not found.');
      return;
    }
    
    // Check if student exists
    const student = students.find(s => s.id === enrollStudentId);
    
    if (!student) {
      setEnrollError('Student not found.');
      return;
    }
    
    // Check if student is already enrolled in this course
    const alreadyEnrolled = enrollments.some(
      e => e.courseId === selectedCourse && 
           e.studentId === enrollStudentId && 
           e.semesterId === course.semesterId
    );
    
    if (alreadyEnrolled) {
      setEnrollError('Student is already enrolled in this course.');
      return;
    }
    
    addEnrollment({
      id: generateId('E'),
      courseId: selectedCourse,
      studentId: enrollStudentId,
      semesterId: course.semesterId,
      attendance: 0,
      quiz: 0,
      midterm: 0,
      final: 0
    });
    
    setEnrollStudentId('');
    setEnrollError('');
    setShowEnrollForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Courses</h2>
          <p className="text-gray-600">Add, view, and manage courses</p>
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
              <Plus size={16} className="mr-1" /> Add Course
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add New Course</h3>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                Course ID
              </label>
              <input
                type="text"
                id="courseId"
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                placeholder="e.g. CS101"
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Course Name"
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                id="semester"
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                className="input"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
                Teacher
              </label>
              <select
                id="teacher"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="input"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary w-full md:w-auto">
                Add Course
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
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium">Courses</h3>
          </div>
          <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => {
                const semester = semesters.find(s => s.id === course.semesterId);
                return (
                  <li 
                    key={course.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedCourse === course.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{course.name}</p>
                        <span className="badge badge-blue">{course.id}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{semester?.name}</p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-4 text-center text-gray-500">
                No courses found
              </li>
            )}
          </ul>
        </div>

        {/* Course Details */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <CourseDetails 
              courseId={selectedCourse} 
              onEnroll={() => setShowEnrollForm(true)}
              showEnrollForm={showEnrollForm}
              onCancelEnroll={() => setShowEnrollForm(false)}
              enrollStudentId={enrollStudentId}
              setEnrollStudentId={setEnrollStudentId}
              handleEnrollStudent={handleEnrollStudent}
              enrollError={enrollError}
              onUpdateTeacher={handleUpdateTeacher}
            />
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>Select a course to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component to display course details
interface CourseDetailsProps {
  courseId: string;
  onEnroll: () => void;
  showEnrollForm: boolean;
  onCancelEnroll: () => void;
  enrollStudentId: string;
  setEnrollStudentId: (id: string) => void;
  handleEnrollStudent: (e: React.FormEvent) => void;
  enrollError: string;
  onUpdateTeacher: (courseId: string, teacherId: string) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ 
  courseId, 
  onEnroll,
  showEnrollForm,
  onCancelEnroll,
  enrollStudentId,
  setEnrollStudentId,
  handleEnrollStudent,
  enrollError,
  onUpdateTeacher
}) => {
  const { courses, semesters, teachers, students, enrollments } = useData();
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <p className="text-red-500">Course not found</p>
      </div>
    );
  }
  
  const semester = semesters.find(s => s.id === course.semesterId);
  const teacher = teachers.find(t => t.id === course.teacherId);
  const courseEnrollments = enrollments.filter(e => e.courseId === courseId && e.semesterId === course.semesterId);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{course.name} ({course.id})</h3>
          <span className="badge badge-blue">{semester?.name}</span>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Instructor</p>
            <p className="font-medium">{teacher?.name} ({teacher?.id})</p>
          </div>
          
          <button 
            className="btn btn-outline text-sm"
            onClick={() => setShowTeacherForm(!showTeacherForm)}
          >
            Change Teacher
          </button>
        </div>
        
        {showTeacherForm && (
          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex gap-2">
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="input"
              >
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.id})
                  </option>
                ))}
              </select>
              
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onUpdateTeacher(courseId, selectedTeacherId);
                  setShowTeacherForm(false);
                }}
                disabled={!selectedTeacherId}
              >
                Update
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={() => setShowTeacherForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium">Enrolled Students ({courseEnrollments.length})</h4>
          
          <button 
            className="btn btn-primary flex items-center"
            onClick={onEnroll}
          >
            <UserPlus size={16} className="mr-1" /> Enroll Student
          </button>
        </div>
        
        {showEnrollForm && (
          <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium">Enroll New Student</h5>
              <button 
                className="text-blue-600 hover:text-blue-800"
                onClick={onCancelEnroll}
              >
                <X size={16} />
              </button>
            </div>
            
            {enrollError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-200 text-red-600 rounded text-sm">
                {enrollError}
              </div>
            )}
            
            <form onSubmit={handleEnrollStudent} className="flex gap-2">
              <select
                value={enrollStudentId}
                onChange={(e) => setEnrollStudentId(e.target.value)}
                className="input flex-grow"
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.id})
                  </option>
                ))}
              </select>
              
              <button 
                type="submit" 
                className="btn btn-primary whitespace-nowrap"
              >
                Enroll
              </button>
            </form>
          </div>
        )}
        
        {courseEnrollments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {courseEnrollments.map((enrollment) => {
                  const student = students.find(s => s.id === enrollment.studentId);
                  
                  return (
                    <tr key={enrollment.id} className="border-b">
                      <td className="font-medium">{student?.id}</td>
                      <td>{student?.name}</td>
                      <td>
                        <div className="text-xs space-y-1">
                          <div>Attendance: <span className="font-medium">{enrollment.attendance}/15</span></div>
                          <div>Quiz: <span className="font-medium">{enrollment.quiz}/15</span></div>
                          <div>Midterm: <span className="font-medium">{enrollment.midterm}/30</span></div>
                          <div>Final: <span className="font-medium">{enrollment.final}/40</span></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No students enrolled in this course
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;