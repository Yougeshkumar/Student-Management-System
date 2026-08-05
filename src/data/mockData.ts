import { Teacher, Student, Semester, Course, Enrollment } from '../contexts/DataContext';

export const mockData = {
  teachers: [
    { id: 'T001', name: 'Dr. Smith' },
    { id: 'T002', name: 'Prof. Johnson' },
    { id: 'T003', name: 'Dr. Williams' },
  ] as Teacher[],
  
  students: [
    { id: 'S001', name: 'Alice Cooper' },
    { id: 'S002', name: 'Bob Dylan' },
    { id: 'S003', name: 'Charlie Brown' },
    { id: 'S004', name: 'Diana Ross' },
  ] as Student[],
  
  semesters: [
    { id: 'Spring-2023', name: 'Spring 2023' },
    { id: 'Fall-2023', name: 'Fall 2023' },
    { id: 'Spring-2024', name: 'Spring 2024' },
  ] as Semester[],
  
  courses: [
    { id: 'CS101', name: 'Introduction to Computer Science', semesterId: 'Spring-2023', teacherId: 'T001' },
    { id: 'MATH201', name: 'Advanced Mathematics', semesterId: 'Spring-2023', teacherId: 'T002' },
    { id: 'PHYS101', name: 'Physics I', semesterId: 'Fall-2023', teacherId: 'T003' },
    { id: 'CS201', name: 'Data Structures & Algorithms', semesterId: 'Fall-2023', teacherId: 'T001' },
  ] as Course[],
  
  enrollments: [
    { id: 'E001', courseId: 'CS101', studentId: 'S001', semesterId: 'Spring-2023', attendance: 12, quiz: 13, midterm: 25, final: 35 },
    { id: 'E002', courseId: 'MATH201', studentId: 'S001', semesterId: 'Spring-2023', attendance: 10, quiz: 14, midterm: 28, final: 36 },
    { id: 'E003', courseId: 'CS101', studentId: 'S002', semesterId: 'Spring-2023', attendance: 15, quiz: 15, midterm: 29, final: 38 },
    { id: 'E004', courseId: 'PHYS101', studentId: 'S002', semesterId: 'Fall-2023', attendance: 13, quiz: 12, midterm: 26, final: 37 },
    { id: 'E005', courseId: 'CS201', studentId: 'S003', semesterId: 'Fall-2023', attendance: 14, quiz: 13, midterm: 27, final: 32 },
    { id: 'E006', courseId: 'MATH201', studentId: 'S003', semesterId: 'Spring-2023', attendance: 11, quiz: 11, midterm: 22, final: 30 },
    { id: 'E007', courseId: 'CS201', studentId: 'S004', semesterId: 'Fall-2023', attendance: 15, quiz: 14, midterm: 28, final: 38 },
  ] as Enrollment[],
};

export const calculateGrade = (attendance: number, quiz: number, midterm: number, final: number): string => {
  const total = attendance + quiz + midterm + final;
  
  if (total >= 80) return 'A+';
  if (total >= 75) return 'A';
  if (total >= 70) return 'A-';
  if (total >= 65) return 'B+';
  if (total >= 60) return 'B';
  if (total >= 55) return 'B-';
  if (total >= 50) return 'C+';
  if (total >= 45) return 'C';
  if (total >= 40) return 'D';
  return 'F';
};

export const generateId = (prefix: string): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}${timestamp}${random}`;
};