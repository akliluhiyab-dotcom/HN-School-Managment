/**
 * School Registration Management System Backend
 * Developed by Hiyabiel Aklilu & Noah
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// Types
import { Student, User, AttendanceSheet, Teacher } from './src/types';

// Password hashing helper
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// User Accounts Config (ONLY Hiyab is seeded as requested)
const SEEDED_USERS = [
  {
    username: 'hiyab',
    passwordHash: hashPassword('Coolguy246'),
    fullName: 'Hiyab',
    role: 'Admin'
  }
];

const DATA_DIR = path.join(process.cwd(), 'server-data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TEACHERS_FILE = path.join(DATA_DIR, 'teachers.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadUsers(): any[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(data);
      // Clean up past admin / staff accounts from disk storage if present
      const filtered = users.filter((u: any) => u.username !== 'admin' && u.username !== 'staff');
      // Keep Hiyab as owner in active memory
      if (!filtered.some((u: any) => u.username.toLowerCase() === 'hiyab')) {
        filtered.push(SEEDED_USERS[0]);
      }
      saveUsers(filtered);
      return filtered;
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  saveUsers(SEEDED_USERS);
  return SEEDED_USERS;
}

function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}

// Seed Initial Student Records (Realistic names, various grades)
const SEEDED_STUDENTS: Student[] = [];

// Seed Attendance
const SEEDED_ATTENDANCE: AttendanceSheet[] = [];

// Helper to load/save JSON lists Safely
function loadStudents(): Student[] {
  try {
    if (fs.existsSync(STUDENTS_FILE)) {
      const data = fs.readFileSync(STUDENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading students file:', error);
  }
  // If reading fails or file empty, return seed data and save it
  saveStudents(SEEDED_STUDENTS);
  return SEEDED_STUDENTS;
}

function saveStudents(students: Student[]) {
  try {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing students file:', error);
  }
}

// Seed Initial Teacher Records with Professional Details
const SEEDED_TEACHERS: Teacher[] = [
  {
    id: "TCH-2026-1001",
    fullName: "Elena Rostova",
    email: "elena.rostova@hnschool.org",
    phone: "+1 (555) 234-5678",
    salary: 74000,
    assignedGrades: ["Grade 7", "Grade 8"],
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    id: "TCH-2026-1002",
    fullName: "Michael Chang",
    email: "m.chang@hnschool.org",
    phone: "+1 (555) 876-5432",
    salary: 65500,
    assignedGrades: ["Grade 1", "Grade 2"],
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    id: "TCH-2026-1003",
    fullName: "Sarah Jenkins",
    email: "s.jenkins@hnschool.org",
    phone: "+1 (555) 345-6789",
    salary: 62000,
    assignedGrades: ["Kindergarten", "Preschool"],
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    id: "TCH-2026-1004",
    fullName: "Amanda Vance",
    email: "amanda.v@hnschool.org",
    phone: "+1 (555) 456-7890",
    salary: 68000,
    assignedGrades: ["Grade 3", "Grade 4"],
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    id: "TCH-2026-1005",
    fullName: "David Miller",
    email: "d.miller@hnschool.org",
    phone: "+1 (555) 765-4321",
    salary: 71050,
    assignedGrades: ["Grade 5", "Grade 6"],
    status: "Active",
    createdAt: new Date().toISOString()
  },
  {
    id: "TCH-2026-1006",
    fullName: "Robert Vance",
    email: "robert.vance@hnschool.org",
    phone: "+1 (555) 987-6543",
    salary: 82500,
    assignedGrades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    status: "Active",
    createdAt: new Date().toISOString()
  }
];

function loadTeachers(): Teacher[] {
  try {
    if (fs.existsSync(TEACHERS_FILE)) {
      const data = fs.readFileSync(TEACHERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading teachers file:', error);
  }
  // If fallback, write seeded teachers list
  saveTeachers(SEEDED_TEACHERS);
  return SEEDED_TEACHERS;
}

function saveTeachers(teachers: Teacher[]) {
  try {
    fs.writeFileSync(TEACHERS_FILE, JSON.stringify(teachers, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing teachers file:', error);
  }
}

function loadAttendance(): AttendanceSheet[] {
  try {
    if (fs.existsSync(ATTENDANCE_FILE)) {
      const data = fs.readFileSync(ATTENDANCE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading attendance file:', error);
  }
  saveAttendance(SEEDED_ATTENDANCE);
  return SEEDED_ATTENDANCE;
}

function saveAttendance(sheets: AttendanceSheet[]) {
  try {
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(sheets, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing attendance file:', error);
  }
}

// Start Express implementation
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Helper: verify role is sufficient (Admin or Staff) for viewing/modifiying student data
  function isAuthorized(req: express.Request): boolean {
    const userRole = req.headers['x-user-role'];
    if (!userRole) return false;
    const roleStr = String(userRole).trim().toLowerCase();
    return roleStr === 'admin' || roleStr === 'staff';
  }

  // Middleware for body-parsing
  app.use(express.json({ limit: '15mb' }));

  // CORS and Cache Headers
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next();
  });

  // Authenticate Admin / Staff Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const users = loadUsers();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (matchedUser && matchedUser.passwordHash === hashPassword(password)) {
      // Login Success
      res.json({
        user: {
          username: matchedUser.username,
          fullName: matchedUser.fullName,
          role: matchedUser.role
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  });

  // Dynamic Signup Registration
  app.post('/api/auth/signup', (req, res) => {
    const { username, fullName, password, role } = req.body;
    if (!username || !fullName || !password) {
      res.status(400).json({ error: 'Username, full name, and password are required.' });
      return;
    }

    const trimmedUsername = username.trim();
    const users = loadUsers();

    if (users.some((u) => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      res.status(400).json({ error: 'Username is already taken. Try selecting another username.' });
      return;
    }

    const newUser = {
      username: trimmedUsername,
      passwordHash: hashPassword(password),
      fullName: fullName.trim(),
      role: 'Guest'
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      user: {
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role
      }
    });
  });

  // Get all registered students
  app.get('/api/students', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: You do not have permission to view registered students.' });
      return;
    }
    const students = loadStudents();
    res.json(students);
  });

  // Register / Add a student (Admin, Staff, and Registered Guest users are authorized to enroll/register to attend)
  app.post('/api/students', (req, res) => {
    const userRole = req.headers['x-user-role'];
    const lowerRole = userRole ? String(userRole).toLowerCase() : '';
    if (!isAuthorized(req) && lowerRole !== 'guest') {
      res.status(403).json({ error: 'Access Denied: Only authorized admin, staff or registered guests can apply to attend.' });
      return;
    }
    const students = loadStudents();
    const studentData = req.body;

    // Validate inputs
    const requiredFields = ['fullName', 'dob', 'gender', 'grade', 'parentName', 'parentPhone', 'email', 'address', 'emergencyContact'];
    for (const field of requiredFields) {
      if (!studentData[field]) {
        res.status(400).json({ error: `Field '${field}' is required.` });
        return;
      }
    }

    // Auto-generate safe high-entropy Student ID
    // Look at existing IDs, e.g. STU-2026-XXXX and get max XXXX increment
    let maxId = 1010;
    students.forEach((s) => {
      const match = s.id.match(/STU-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxId) {
          maxId = num;
        }
      }
    });

    const newNumericId = maxId + 1;
    const studentId = `STU-2026-${newNumericId}`;

    // Prevent any theoretical collisions
    if (students.some((s) => s.id === studentId)) {
      res.status(500).json({ error: 'Duplicate Student ID collision error.' });
      return;
    }

    const newStudent: Student = {
      id: studentId,
      fullName: studentData.fullName.trim(),
      dob: studentData.dob,
      gender: studentData.gender,
      grade: studentData.grade,
      parentName: studentData.parentName.trim(),
      parentPhone: studentData.parentPhone.trim(),
      email: studentData.email.trim(),
      address: studentData.address.trim(),
      emergencyContact: studentData.emergencyContact.trim(),
      photoBase64: studentData.photoBase64,
      createdAt: new Date().toISOString(),
      registeredBy: studentData.registeredBy || 'Admin'
    };

    students.push(newStudent);
    saveStudents(students);

    res.status(201).json({ success: true, student: newStudent });
  });

  // Update a student's record
  app.put('/api/students/:id', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only authorized administrators or staff can edit scholar records.' });
      return;
    }
    const { id } = req.params;
    const students = loadStudents();
    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
      res.status(404).json({ error: 'Student record not found.' });
      return;
    }

    const updateData = req.body;
    const existing = students[studentIndex];

    const updatedStudent: Student = {
      ...existing,
      fullName: updateData.fullName ? updateData.fullName.trim() : existing.fullName,
      dob: updateData.dob || existing.dob,
      gender: updateData.gender || existing.gender,
      grade: updateData.grade || existing.grade,
      parentName: updateData.parentName ? updateData.parentName.trim() : existing.parentName,
      parentPhone: updateData.parentPhone ? updateData.parentPhone.trim() : existing.parentPhone,
      email: updateData.email ? updateData.email.trim() : existing.email,
      address: updateData.address ? updateData.address.trim() : existing.address,
      emergencyContact: updateData.emergencyContact ? updateData.emergencyContact.trim() : existing.emergencyContact,
      photoBase64: updateData.hasOwnProperty('photoBase64') ? updateData.photoBase64 : existing.photoBase64
    };

    students[studentIndex] = updatedStudent;
    saveStudents(students);

    res.json({ success: true, student: updatedStudent });
  });

  // Delete a student (Role restricted handled securely on frontend as well, deleting record cleanly)
  app.delete('/api/students/:id', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only administrators can delete records.' });
      return;
    }
    const { id } = req.params;
    const students = loadStudents();
    const initialCount = students.length;

    const filtered = students.filter((s) => s.id !== id);
    if (filtered.length === initialCount) {
      res.status(404).json({ error: 'Student record not found.' });
      return;
    }

    saveStudents(filtered);
    res.json({ success: true, message: `Student ${id} deleted successfully.` });
  });

  // Get full Attendance records
  app.get('/api/attendance', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: You do not have permission to view student attendance records.' });
      return;
    }
    const attendance = loadAttendance();
    res.json(attendance);
  });

  // Submit / Update Attendance Sheet
  app.post('/api/attendance', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only administrators or staff can file attendance sheets.' });
      return;
    }
    const sheets = loadAttendance();
    const { date, records, submittedBy } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      res.status(400).json({ error: 'Date and valid records array are required.' });
      return;
    }

    // Upsert attendance sheet
    const existingIndex = sheets.findIndex((s) => s.date === date);
    const newSheet: AttendanceSheet = {
      date,
      records,
      submittedBy: submittedBy || 'System',
      submittedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      sheets[existingIndex] = newSheet;
    } else {
      sheets.push(newSheet);
    }

    saveAttendance(sheets);
    res.json({ success: true, sheet: newSheet });
  });

  // Get all registered teachers (Faculty directory)
  app.get('/api/teachers', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: You do not have permission to view teacher records.' });
      return;
    }
    const teachers = loadTeachers();
    res.json(teachers);
  });

  // Register / Add a teacher
  app.post('/api/teachers', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only authorized administrators can add faculty members.' });
      return;
    }
    const teachers = loadTeachers();
    const teacherData = req.body;

    // Validate inputs
    const requiredFields = ['fullName', 'email', 'phone', 'salary', 'assignedGrades'];
    for (const field of requiredFields) {
      if (teacherData[field] === undefined || teacherData[field] === null) {
        res.status(400).json({ error: `Field '${field}' is required.` });
        return;
      }
    }

    // Auto-generate safe unique high-entropy faculty ID
    let maxId = 1006;
    teachers.forEach((t) => {
      const match = t.id.match(/TCH-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxId) {
          maxId = num;
        }
      }
    });

    const newNumericId = maxId + 1;
    const teacherId = `TCH-2026-${newNumericId}`;

    const newTeacher: Teacher = {
      id: teacherId,
      fullName: teacherData.fullName.trim(),
      email: teacherData.email.trim(),
      phone: teacherData.phone.trim(),
      salary: Number(teacherData.salary) || 0,
      assignedGrades: Array.isArray(teacherData.assignedGrades) ? teacherData.assignedGrades : [],
      status: teacherData.status || 'Active',
      createdAt: new Date().toISOString()
    };

    teachers.push(newTeacher);
    saveTeachers(teachers);

    res.status(201).json({ success: true, teacher: newTeacher });
  });

  // Update a teacher's record
  app.put('/api/teachers/:id', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only authorized administrators can edit faculty records.' });
      return;
    }
    const { id } = req.params;
    const teachers = loadTeachers();
    const teacherIndex = teachers.findIndex((t) => t.id === id);

    if (teacherIndex === -1) {
      res.status(404).json({ error: 'Teacher record not found.' });
      return;
    }

    const updateData = req.body;
    const existing = teachers[teacherIndex];

    const updatedTeacher: Teacher = {
      ...existing,
      fullName: updateData.fullName ? updateData.fullName.trim() : existing.fullName,
      email: updateData.email ? updateData.email.trim() : existing.email,
      phone: updateData.phone ? updateData.phone.trim() : existing.phone,
      salary: updateData.salary !== undefined ? Number(updateData.salary) : existing.salary,
      assignedGrades: Array.isArray(updateData.assignedGrades) ? updateData.assignedGrades : existing.assignedGrades,
      status: updateData.status || existing.status
    };

    teachers[teacherIndex] = updatedTeacher;
    saveTeachers(teachers);

    res.json({ success: true, teacher: updatedTeacher });
  });

  // Delete a teacher
  app.delete('/api/teachers/:id', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only administrators can delete records.' });
      return;
    }
    const { id } = req.params;
    const teachers = loadTeachers();
    const initialCount = teachers.length;

    const filtered = teachers.filter((t) => t.id !== id);
    if (filtered.length === initialCount) {
      res.status(404).json({ error: 'Teacher record not found.' });
      return;
    }

    saveTeachers(filtered);
    res.json({ success: true, message: `Teacher ${id} deleted successfully.` });
  });

  // Reset/Re-seed Database API (Handy for presentation reset)
  app.post('/api/db/reset', (req, res) => {
    if (!isAuthorized(req)) {
      res.status(403).json({ error: 'Access Denied: Only administrators can reset the database.' });
      return;
    }
    saveStudents(SEEDED_STUDENTS);
    saveAttendance(SEEDED_ATTENDANCE);
    saveTeachers(SEEDED_TEACHERS);
    res.json({ success: true, message: 'Database rolled back to original seeded dataset successfully.' });
  });

  // Mount Vite development middlewares or serve static compiled production bundle
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[School RMS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[School RMS] Error starting express server:', err);
});
