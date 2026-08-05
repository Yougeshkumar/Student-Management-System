import React, { useState } from 'react';
import { useData, Teacher } from '../../contexts/DataContext';
import { Search, Plus, UserPlus, X } from 'lucide-react';

const TeacherManager: React.FC = () => {
  const { teachers, addTeacher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacherId, setNewTeacherId] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [error, setError] = useState('');

  const filteredTeachers = teachers.filter(teacher => 
    teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeacherId || !newTeacherName) {
      setError('Both ID and name are required.');
      return;
    }
    
    // Check if teacher ID already exists
    if (teachers.some(t => t.id === newTeacherId)) {
      setError('A teacher with this ID already exists.');
      return;
    }
    
    addTeacher({ id: newTeacherId, name: newTeacherName });
    setNewTeacherId('');
    setNewTeacherName('');
    setError('');
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Teachers</h2>
          <p className="text-gray-600">Add and view faculty members</p>
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
              <UserPlus size={16} className="mr-1" /> Add Teacher
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add New Teacher</h3>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
                Teacher ID
              </label>
              <input
                type="text"
                id="teacherId"
                value={newTeacherId}
                onChange={(e) => setNewTeacherId(e.target.value)}
                placeholder="e.g. T005"
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Name
              </label>
              <input
                type="text"
                id="teacherName"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="Full Name"
                className="input"
              />
            </div>
            
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                Add Teacher
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
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input"
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b">
                  <td className="font-medium">{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>
                    <TeacherCourses teacherId={teacher.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper component to display courses assigned to a teacher
const TeacherCourses: React.FC<{ teacherId: string }> = ({ teacherId }) => {
  const { courses } = useData();
  const teacherCourses = courses.filter(course => course.teacherId === teacherId);
  
  if (teacherCourses.length === 0) {
    return <span className="text-gray-400 italic">No courses assigned</span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1">
      {teacherCourses.map(course => (
        <span key={course.id} className="badge badge-blue">
          {course.id}
        </span>
      ))}
    </div>
  );
};

export default TeacherManager;