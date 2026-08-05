import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft, Save } from 'lucide-react';
import { calculateGrade } from '../../data/mockData';

interface MarksEditorProps {
  courseId: string;
  semesterId: string;
}

const MarksEditor: React.FC<MarksEditorProps> = ({ courseId, semesterId }) => {
  const { courses, students, enrollments, updateEnrollment } = useData();
  const [marksData, setMarksData] = useState<{[key: string]: { attendance: number; quiz: number; midterm: number; final: number }}>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const course = courses.find(c => c.id === courseId);
  const courseEnrollments = enrollments.filter(e => e.courseId === courseId && e.semesterId === semesterId);
  
  // Initialize marks data
  useEffect(() => {
    const initialData: {[key: string]: { attendance: number; quiz: number; midterm: number; final: number }} = {};
    
    courseEnrollments.forEach(enrollment => {
      initialData[enrollment.id] = {
        attendance: enrollment.attendance,
        quiz: enrollment.quiz,
        midterm: enrollment.midterm,
        final: enrollment.final
      };
    });
    
    setMarksData(initialData);
  }, [courseEnrollments]);
  
  const handleUpdateMarks = (enrollmentId: string, field: 'attendance' | 'quiz' | 'midterm' | 'final', value: number) => {
    const maxValues = {
      attendance: 15,
      quiz: 15,
      midterm: 30,
      final: 40
    };
    
    // Ensure value is within valid range
    const validValue = Math.max(0, Math.min(value, maxValues[field]));
    
    setMarksData(prev => ({
      ...prev,
      [enrollmentId]: {
        ...prev[enrollmentId],
        [field]: validValue
      }
    }));
  };
  
  const handleSaveMarks = () => {
    Object.entries(marksData).forEach(([enrollmentId, marks]) => {
      updateEnrollment(enrollmentId, marks);
    });
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-medium">{course.name}</h2>
          <p className="text-sm text-gray-500">{course.id} • {semesterId}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Student Marks</h3>
          
          <button 
            className={`btn ${saveSuccess ? 'btn-secondary' : 'btn-primary'} flex items-center`}
            onClick={handleSaveMarks}
          >
            {saveSuccess ? (
              <>Saved Successfully</>
            ) : (
              <>
                <Save size={16} className="mr-1" /> Save Marks
              </>
            )}
          </button>
        </div>
        
        {courseEnrollments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Attendance (15)</th>
                  <th>Quiz (15)</th>
                  <th>Midterm (30)</th>
                  <th>Final (40)</th>
                  <th>Total (100)</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {courseEnrollments.map(enrollment => {
                  const student = students.find(s => s.id === enrollment.studentId);
                  const currentMarks = marksData[enrollment.id] || { attendance: 0, quiz: 0, midterm: 0, final: 0 };
                  const total = currentMarks.attendance + currentMarks.quiz + currentMarks.midterm + currentMarks.final;
                  const grade = calculateGrade(currentMarks.attendance, currentMarks.quiz, currentMarks.midterm, currentMarks.final);
                  
                  return (
                    <tr key={enrollment.id} className="border-b">
                      <td className="font-medium">{student?.id}</td>
                      <td>{student?.name}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={currentMarks.attendance}
                          onChange={(e) => handleUpdateMarks(enrollment.id, 'attendance', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={currentMarks.quiz}
                          onChange={(e) => handleUpdateMarks(enrollment.id, 'quiz', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={currentMarks.midterm}
                          onChange={(e) => handleUpdateMarks(enrollment.id, 'midterm', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={currentMarks.final}
                          onChange={(e) => handleUpdateMarks(enrollment.id, 'final', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="font-medium">{total}</td>
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
          <div className="text-center py-6 text-gray-500">
            No students enrolled in this course
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksEditor;