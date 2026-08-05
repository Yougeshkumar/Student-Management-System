import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockData } from '../data/mockData';

interface DataContextType {
  teachers: Teacher[];
  students: Student[];
  semesters: Semester[];
  courses: Course[];
  enrollments: Enrollment[];
  addTeacher: (teacher: Teacher) => void;
  addStudent: (student: Student) => void;
  addSemester: (semester: Semester) => void;
  addCourse: (course: Course) => void;
  addEnrollment: (enrollment: Enrollment) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  updateEnrollment: (enrollmentId: string, enrollment: Partial<Enrollment>) => void;
  deleteStudent: (id: string) => void;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface Semester {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  semesterId: string;
  teacherId: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  semesterId: string;
  attendance: number;
  quiz: number;
  midterm: number;
  final: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [teachers, setTeachers] = useState<Teacher[]>(mockData.teachers);
  const [students, setStudents] = useState<Student[]>(mockData.students);
  const [semesters, setSemesters] = useState<Semester[]>(mockData.semesters);
  const [courses, setCourses] = useState<Course[]>(mockData.courses);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockData.enrollments);

  const addTeacher = (teacher: Teacher) => {
    setTeachers(prev => [...prev, teacher]);
  };

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const addSemester = (semester: Semester) => {
    setSemesters(prev => [...prev, semester]);
  };

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const addEnrollment = (enrollment: Enrollment) => {
    setEnrollments(prev => [...prev, enrollment]);
  };

  const updateTeacher = (id: string, teacher: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...teacher } : t));
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...student } : s));
  };

  const updateCourse = (id: string, course: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...course } : c));
  };

  const updateEnrollment = (enrollmentId: string, enrollment: Partial<Enrollment>) => {
    setEnrollments(prev => prev.map(e => e.id === enrollmentId ? { ...e, ...enrollment } : e));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Also delete all enrollments for this student
    setEnrollments(prev => prev.filter(e => e.studentId !== id));
  };

  return (
    <DataContext.Provider value={{
      teachers,
      students,
      semesters,
      courses,
      enrollments,
      addTeacher,
      addStudent,
      addSemester,
      addCourse,
      addEnrollment,
      updateTeacher,
      updateStudent,
      updateCourse,
      updateEnrollment,
      deleteStudent
    }}>
      {children}
    </DataContext.Provider>
  );
};