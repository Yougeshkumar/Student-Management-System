import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, X } from 'lucide-react';

const SemesterManager: React.FC = () => {
  const { semesters, addSemester } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [session, setSession] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session || !year) {
      setError('Both session and year are required.');
      return;
    }
    
    const semesterId = `${session}-${year}`;
    
    // Check if semester already exists
    if (semesters.some(s => s.id === semesterId)) {
      setError('This semester already exists.');
      return;
    }
    
    addSemester({ id: semesterId, name: `${session} ${year}` });
    setSession('');
    setYear('');
    setError('');
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Semesters</h2>
          <p className="text-gray-600">Add and view academic terms</p>
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
              <Plus size={16} className="mr-1" /> Add Semester
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Add New Semester</h3>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddSemester} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1">
                Session
              </label>
              <select
                id="session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="input"
                required
              >
                <option value="">Select Session</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="input"
                pattern="[0-9]{4}"
                title="Please enter a 4-digit year"
                required
              />
            </div>
            
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                Add Semester
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((semester) => (
          <div key={semester.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
            <h3 className="text-lg font-medium">{semester.name}</h3>
            <p className="text-sm text-gray-500 mt-1">ID: {semester.id}</p>
            
            <div className="mt-4">
              <SemesterStats semesterId={semester.id} />
            </div>
          </div>
        ))}
        
        {semesters.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No semesters found. Create your first semester.
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component to display semester statistics
const SemesterStats: React.FC<{ semesterId: string }> = ({ semesterId }) => {
  const { courses, enrollments } = useData();
  
  const semesterCourses = courses.filter(course => course.semesterId === semesterId);
  const courseIds = semesterCourses.map(course => course.id);
  const semesterEnrollments = enrollments.filter(enrollment => enrollment.semesterId === semesterId);
  
  // Count unique students
  const uniqueStudentIds = new Set(semesterEnrollments.map(e => e.studentId));
  
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-blue-50 p-2 rounded">
        <p className="text-xs text-blue-700">Courses</p>
        <p className="text-xl font-medium">{semesterCourses.length}</p>
      </div>
      
      <div className="bg-green-50 p-2 rounded">
        <p className="text-xs text-green-700">Students</p>
        <p className="text-xl font-medium">{uniqueStudentIds.size}</p>
      </div>
      
      <div className="bg-orange-50 p-2 rounded">
        <p className="text-xs text-orange-700">Enrollments</p>
        <p className="text-xl font-medium">{semesterEnrollments.length}</p>
      </div>
    </div>
  );
};

export default SemesterManager;