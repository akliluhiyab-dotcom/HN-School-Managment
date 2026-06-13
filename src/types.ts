/**
 * School Registration Management System Types
 * Developed by Hiyabiel Aklilu & Noah
 */

export interface User {
  username: string;
  fullName: string;
  role: 'Admin' | 'Staff' | 'Guest';
}

export interface Student {
  id: string; // Auto-generated e.g., STU-2026-1001
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  grade: string;
  parentName: string;
  parentPhone: string;
  email: string;
  address: string;
  emergencyContact: string; // emerg name + emerg phone
  photoBase64?: string; // Optional student profile photo
  createdAt: string;
  registeredBy: string;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface AttendanceSheet {
  date: string; // YYYY-MM-DD
  records: AttendanceRecord[];
  submittedBy: string;
  submittedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  byGrade: { [key: string]: number };
  recentRegistrations: Student[];
  attendanceToday: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
}

export interface Teacher {
  id: string; // TCH-2026-XXXX
  fullName: string;
  email: string;
  phone: string;
  salary: number;
  assignedGrades: string[]; // e.g. ['Kindergarten']
  status: 'Active' | 'On Leave';
  createdAt: string;
}
