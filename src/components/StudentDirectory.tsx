/**
 * Student Directory & Record Management
 * Developed by Hiyabiel Aklilu & Noah
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  X,
  CreditCard,
  Plus
} from 'lucide-react';
import { Student, Teacher } from '../types';

interface StudentDirectoryProps {
  students: Student[];
  teachers?: Teacher[];
  onEditStudent: (student: Student) => void;
  onAddNewStudent: () => void;
  onDeleteStudent: (id: string) => Promise<boolean>;
  currentUser: { username: string; fullName: string; role: string } | null;
}

export default function StudentDirectory({ 
  students, 
  teachers = [],
  onEditStudent, 
  onAddNewStudent,
  onDeleteStudent, 
  currentUser 
}: StudentDirectoryProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');

  // Interactive Detailed Popups
  const [activeDetailsStudent, setActiveDetailsStudent] = useState<Student | null>(null);
  const [printReceiptStudent, setPrintReceiptStudent] = useState<Student | null>(null);
  const [printReportStudent, setPrintReportStudent] = useState<Student | null>(null);

  // Deletion confirmation
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Filtering Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'All Grades' || s.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  // Export to Excel-compatible CSV format
  const handleExportCSV = () => {
    if (students.length === 0) return;

    // Headers
    const headers = [
      'Student ID', 'Full Name', 'Date of Birth', 'Gender', 'Grade', 
      'Parent Name', 'Parent Contact', 'Email Address', 'Home Address', 
      'Emergency Contact', 'Registered Date', 'Registered By'
    ];

    // Map rows cleanly, escaping fields containing commas
    const rows = students.map((s) => [
      s.id,
      `"${s.fullName.replace(/"/g, '""')}"`,
      s.dob,
      s.gender,
      s.grade,
      `"${s.parentName.replace(/"/g, '""')}"`,
      `"${s.parentPhone}"`,
      s.email,
      `"${s.address.replace(/"/g, '""')}"`,
      `"${s.emergencyContact.replace(/"/g, '""')}"`,
      new Date(s.createdAt).toLocaleDateString(),
      s.registeredBy
    ]);

    // Build standard CSV content with BOM so MS Excel reads unicode accurately
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create standard browser download trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HN_School_Manager_Student_Directory_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Secure deletion handler
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    // Safety check roles (Admin only)
    if (currentUser?.role !== 'Admin') {
      setDeleteError('Security Authorization Failed: Only Admin privileges can delete registrations.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    const success = await onDeleteStudent(studentToDelete.id);
    setIsDeleting(false);

    if (success) {
      setStudentToDelete(null);
    } else {
      setDeleteError('Server failed to delete student record.');
    }
  };

  // Trigger Standard printable layout PDF
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* Search and Filters Header bar */}
      <div className="glass-panel p-5 rounded-2xl border flex flex-col md:flex-row items-center gap-4 no-print shadow-md">
        
        {/* Search Search input */}
        <div className="w-full md:flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by full name, ID, or Parent/Guardian..."
            className="w-full pl-10 pr-4 py-2 text-slate-805 dark:text-slate-200 text-sm focus:outline-none glass-input"
          />
        </div>

        {/* Filters and export button group */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          
          {/* Grade selection */}
          <div className="relative flex-1 sm:flex-none">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Filter className="h-3.5 w-3.5" />
            </span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-3 py-2 text-slate-755 dark:text-slate-205 text-xs focus:outline-none glass-input cursor-pointer"
            >
              <option value="All Grades">All Grade Tiers</option>
              <option value="Preschool">Preschool</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9 (Freshman)</option>
              <option value="Grade 10">Grade 10 (Sophomore)</option>
              <option value="Grade 11">Grade 11 (Junior)</option>
              <option value="Grade 12">Grade 12 (Senior)</option>
            </select>
          </div>

          {/* Excel CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export full catalog to Excel CSV"
            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-450 border border-blue-500/20 rounded-xl cursor-pointer transition-colors flex items-center justify-center"
          >
            <FileSpreadsheet className="h-5 w-5" />
          </button>

          {/* Quick Enrol Button */}
          <button
            onClick={onAddNewStudent}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
          >
            <Plus className="h-4 w-4" /> Enroll Student
          </button>

        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="glass-panel rounded-2xl border overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Headers */}
            <thead>
              <tr className="bg-slate-900/40 dark:bg-slate-950/20 border-b border-slate-200/40 dark:border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4.5 px-6">Scholar Profile</th>
                <th className="py-4.5 px-4">Student ID</th>
                <th className="py-4.5 px-4">Grade</th>
                <th className="py-4.5 px-4">Assigned Educator</th>
                <th className="py-4.5 px-4">Guardian Contact</th>
                <th className="py-4.5 px-4">Date Registered</th>
                <th className="py-4.5 px-6 text-right">Operations</th>
              </tr>
            </thead>

            {/* Content list */}
            <tbody className="divide-y divide-slate-200/40 dark:divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No active scholar records match the search parameters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr 
                    key={s.id} 
                    className="hover:bg-white/15 dark:hover:bg-white/5 transition-colors text-sm text-slate-700 dark:text-slate-350 cursor-pointer align-middle group"
                    onClick={() => setActiveDetailsStudent(s)}
                  >
                    
                    {/* Character Name + Avatar */}
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {s.photoBase64 ? (
                          <img 
                            src={s.photoBase64} 
                            alt={s.fullName} 
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-full object-cover border border-slate-100 dark:border-slate-650"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200/50 dark:bg-white/5 flex items-center justify-center text-slate-505 dark:text-slate-400 font-display font-black text-xs uppercase shadow-sm">
                            {s.fullName.substring(0,2)}
                          </div>
                        )}
                        <div>
                          <span className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{s.fullName}</span>
                          <span className="text-xs text-slate-400 font-normal">{s.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {s.id}
                    </td>

                    {/* Grade Level */}
                    <td className="py-4 px-4 font-medium">
                      <span className="px-2.5 py-1 glass-pill border text-slate-750 dark:text-slate-300 rounded-lg text-xs leading-none">
                        {s.grade}
                      </span>
                    </td>

                    {/* Assigned Educator */}
                    <td className="py-4 px-4">
                      {(() => {
                        const educator = teachers.find((t) => t.assignedGrades.includes(s.grade));
                        return educator ? (
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{educator.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unassigned</span>
                        );
                      })()}
                    </td>

                    {/* Parent Name / Contact */}
                    <td className="py-4 px-4">
                      <div className="text-xs">
                        <span className="font-semibold block text-slate-800 dark:text-slate-300">{s.parentName}</span>
                        <span className="text-slate-400 block font-mono">{s.parentPhone}</span>
                      </div>
                    </td>

                    {/* Date Registered */}
                    <td className="py-4 px-4 text-xs text-slate-400 font-mono">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    {/* Custom actionable Buttons */}
                    <td 
                      className="py-4 px-6 text-right"
                      onClick={(e) => e.stopPropagation()} // Stop row trigger popup clicks
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Receipt Icon */}
                        <button
                          onClick={() => setPrintReceiptStudent(s)}
                          title="Generate Official Tuition/Registration Receipt"
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-450 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-lg cursor-pointer transition-colors"
                        >
                          <CreditCard className="h-4 w-4" />
                        </button>

                        {/* PDF Student Report Certificate */}
                        <button
                          onClick={() => setPrintReportStudent(s)}
                          title="Generate Beautiful PDF Student Report"
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-450 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-lg cursor-pointer transition-colors"
                        >
                          <Printer className="h-4 w-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditStudent(s)}
                          title="Modify Student Record"
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-450 hover:text-amber-500 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Delete Button (Restricted by Role on Click) */}
                        <button
                          onClick={() => {
                            if (currentUser?.role !== 'Admin') {
                              alert('Security Flag: Only users with Admin privilege can delete records.');
                              return;
                            }
                            setStudentToDelete(s);
                            setDeleteError('');
                          }}
                          title="Delete Registration File"
                          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* POPUP A: DETAILED STUDENT PROFILE VIEWER MODAL */}
      {activeDetailsStudent && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 no-print animate-fade-in">
          <div className="glass-panel max-w-lg w-full overflow-hidden shadow-2xl rounded-2xl border animate-scale-up">
            
            {/* Modal Mini Banner */}
            <div className="bg-slate-900/80 dark:bg-slate-950/40 text-slate-100 px-6 py-4 flex justify-between items-center border-b border-white/5">
              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-200">Scholar Registration File</h3>
              <button 
                onClick={() => setActiveDetailsStudent(null)} 
                className="text-slate-405 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Header profile */}
              <div className="flex items-center gap-4">
                {activeDetailsStudent.photoBase64 ? (
                  <img 
                    src={activeDetailsStudent.photoBase64} 
                    alt={activeDetailsStudent.fullName} 
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-xl object-cover border-2 border-blue-500 shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-slate-200/50 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 font-display font-black text-xl">
                    {activeDetailsStudent.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white capitalize leading-snug">
                    {activeDetailsStudent.fullName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                      {activeDetailsStudent.id}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{activeDetailsStudent.grade}</span>
                  </div>
                </div>
              </div>

              {/* Data list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                
                <div className="space-y-1 bg-slate-100/50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-200/30 dark:border-white/5">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Date of Birth</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{activeDetailsStudent.dob}</span>
                </div>

                <div className="space-y-1 bg-slate-100/50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-200/30 dark:border-white/5">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Gender Specified</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{activeDetailsStudent.gender}</span>
                </div>

                <div className="space-y-1 bg-slate-100/50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-200/30 dark:border-white/5">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Email Address</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium block overflow-hidden text-ellipsis">{activeDetailsStudent.email}</span>
                </div>

                <div className="space-y-1 bg-slate-100/50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-200/30 dark:border-white/5 font-sans">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Parent Contact Phone</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{activeDetailsStudent.parentPhone}</span>
                </div>

                <div className="space-y-1 bg-slate-100/50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-200/30 dark:border-white/5 col-span-1 sm:col-span-2 font-sans">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Assigned Classroom Teacher</span>
                  {(() => {
                    const educator = teachers.find((t) => t.assignedGrades.includes(activeDetailsStudent.grade));
                    return educator ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-0.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-xs capitalize">{educator.fullName}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-405 font-mono">{educator.email} • {educator.phone}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px] block mt-0.5">Unassigned grade supervisor.</span>
                    );
                  })()}
                </div>

              </div>

              {/* Detailed fullwidth items */}
              <div className="space-y-3 font-sans text-xs">
                
                <div className="bg-slate-100/50 dark:bg-white/5 p-3 rounded-lg border border-slate-200/30 dark:border-white/5">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Primary Guardian</span>
                  <span className="text-slate-805 dark:text-slate-200 font-semibold text-sm">{activeDetailsStudent.parentName}</span>
                </div>

                <div className="bg-slate-100/50 dark:bg-white/5 p-3 rounded-lg border border-slate-200/30 dark:border-white/5">
                  <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px]">Home Address</span>
                  <span className="text-slate-805 dark:text-slate-200 leading-relaxed font-semibold">{activeDetailsStudent.address}</span>
                </div>

                <div className="bg-rose-500/10 dark:bg-rose-950/15 border border-rose-550/20 p-3 rounded-lg">
                  <span className="text-rose-500 block font-bold uppercase tracking-wider text-[9px]">Emergency Contact Disclosures</span>
                  <span className="text-slate-805 dark:text-slate-200 font-semibold text-xs leading-relaxed block mt-0.5">{activeDetailsStudent.emergencyContact}</span>
                </div>
              </div>

              {/* History footprint */}
              <div className="pt-2 border-t border-slate-200/40 dark:border-white/5 text-[10px] text-slate-400 font-mono flex justify-between">
                <span>Created Date: {new Date(activeDetailsStudent.createdAt).toLocaleString()}</span>
                <span>By Operator: <span className="uppercase font-semibold text-slate-500">{activeDetailsStudent.registeredBy}</span></span>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 bg-slate-900/15 dark:bg-slate-950/25 border-t border-slate-200/40 dark:border-white/5 flex justify-end gap-2.5 rounded-b-2xl">
              <button
                onClick={() => {
                  setPrintReportStudent(activeDetailsStudent);
                  setActiveDetailsStudent(null);
                }}
                className="py-1.5 px-3 border border-slate-200/50 dark:border-slate-700 rounded-lg hvr-glass text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" /> Printable Report
              </button>
              <button
                onClick={() => onEditStudent(activeDetailsStudent)}
                className="py-1.5 px-4 bg-blue-650 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
              >
                <Edit className="h-3.5 w-3.5" /> Modify Record
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP B: SECURE DELETION COMFIRMATION MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 no-print animate-fade-in">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 animate-scale-up">
            
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="font-display font-extrabold text-base">Authorize Student Record Deletion</h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
              You are about to irreversibly purge the scholar file for <span className="font-bold text-slate-800 dark:text-slate-200">{studentToDelete.fullName}</span> (Student ID: <span className="font-mono bg-rose-500/15 dark:bg-rose-950/30 px-1 rounded text-rose-500 font-semibold">{studentToDelete.id}</span>). Doing so will remove their registration card from directories.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-500/10 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 text-xs font-semibold rounded-lg border border-rose-500/20">
                {deleteError}
              </div>
            )}

            <div className="pt-2 border-t border-slate-200/40 dark:border-white/5 flex justify-end gap-2.5 font-sans animate-fade-in">
              <button
                onClick={() => setStudentToDelete(null)}
                className="py-2 px-4 border border-slate-200/50 dark:border-slate-700 text-slate-600 dark:text-slate-350 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="py-2 px-5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {isDeleting ? 'Deleting File...' : 'Purge Record'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP C: PRINTABLE OFFICIAL PDF REGISTRATION REPORT - LOCATION 6/7 */}
      {printReportStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative border-4 border-double border-slate-300 animate-scale-up">
            
            {/* Top Close trigger for interactive sandbox usage */}
            <div className="absolute top-4 right-4 flex gap-2 no-print">
              <button
                onClick={handleTriggerPrint}
                className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Trigger Browser Print (PDF)
              </button>
              <button
                onClick={() => setPrintReportStudent(null)}
                className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-705 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Printable Container wrapper - TARGETED BY CSS @media print */}
            <div className="print-container space-y-6 p-2 font-sans">
              
              {/* Receipt Header Banner */}
              <div className="text-center border-b-2 border-slate-800 pb-5">
                <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900">HN SCHOOL MANAGER</h1>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-medium font-mono mt-0.5">Office of the Registrar Dean • Scholar Dossier</p>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">Date Generated: {new Date().toLocaleString()}</div>
              </div>

              {/* Watermarked Title */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h2 className="font-display font-bold text-base text-slate-800 text-center uppercase tracking-wide">
                  Official Academic Registration Certificate
                </h2>
              </div>

              {/* Grid content detailing everything */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs leading-relaxed pt-2">
                
                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Scholar Name</span>
                  <span className="text-slate-800 font-bold text-sm">{printReportStudent.fullName}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Student Database ID</span>
                  <span className="text-slate-800 font-mono font-bold text-sm block tracking-widest">{printReportStudent.id}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Grade Level Track</span>
                  <span className="text-slate-800 font-semibold">{printReportStudent.grade}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Date of Birth</span>
                  <span className="text-slate-800 font-semibold">{printReportStudent.dob}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Gender Selected</span>
                  <span className="text-slate-800 font-semibold">{printReportStudent.gender}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Parent Guardian Name</span>
                  <span className="text-slate-800 font-semibold">{printReportStudent.parentName}</span>
                </div>

                <div className="pb-1 border-b border-slate-100 col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Home Physical Address Address</span>
                  <span className="text-slate-800 font-medium">{printReportStudent.address}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Official Billing Email</span>
                  <span className="text-indigo-650 font-semibold">{printReportStudent.email}</span>
                </div>

                <div className="pb-1 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Guardian Primary Phone</span>
                  <span className="text-slate-800 font-mono font-medium">{printReportStudent.parentPhone}</span>
                </div>

                <div className="p-3 bg-rose-50 border border-slate-250 rounded col-span-2 text-[11px] leading-relaxed">
                  <span className="text-rose-600 block font-bold uppercase tracking-wider text-[9px] mb-0.5">Emergency Safety Protocol Disclosure</span>
                  <span className="text-slate-700 font-semibold">{printReportStudent.emergencyContact}</span>
                </div>

              </div>

              {/* Institutional Endorsements */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-6">
                  <div className="h-0.5 bg-slate-300 w-full"></div>
                  <div>
                    <span className="block font-bold text-slate-800">Admissions Registrar</span>
                    <span className="text-[10px] text-slate-400">Office of the Registrar</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="h-0.5 bg-slate-300 w-full"></div>
                  <div>
                    <span className="block font-bold text-slate-800">School Principal</span>
                    <span className="text-[10px] text-slate-400">HN School Manager Admin</span>
                  </div>
                </div>
              </div>

              {/* Core certification watermark tag / Footer */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                <p>Status: <span className="text-emerald-600 font-bold">● REGISTERED & VERIFIED</span></p>
                <p className="font-medium text-slate-650">
                  Official Registrar Document
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* POPUP D: PRINTABLE OFFICIAL FEE REGISTRATION RECEIPT - LOCATION 7/7 */}
      {printReceiptStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-scale-up">
            
            {/* Top Close trigger for interactive sandbox usage */}
            <div className="absolute top-4 right-4 flex gap-2 no-print">
              <button
                onClick={handleTriggerPrint}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Receipt (PDF)
              </button>
              <button
                onClick={() => setPrintReceiptStudent(null)}
                className="p-1.5 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Printable Container wrapper - TARGETED BY CSS @media print */}
            <div className="print-container space-y-6 p-2 font-sans text-xs">
              
              {/* Institution Seal Header */}
              <div className="text-center border-b border-dashed border-slate-350 pb-4">
                <h2 className="font-display font-extrabold text-xl text-slate-900 italic tracking-tight">HN SCHOOL MANAGER</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold tracking-widest font-mono">Operations Division Receipt Voucher</p>
                <span className="text-[10px] text-slate-400 block mt-1">Invoice Seq: HN-2026-FEE-{printReceiptStudent.id.substring(9)}</span>
              </div>

              {/* Invoice Meta */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px]">
                <div>
                  <span className="block text-slate-450 text-[10px] uppercase">Transaction Date</span>
                  <span className="text-slate-800 font-bold">{new Date(printReceiptStudent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-450 text-[10px] uppercase">Registrar Operator</span>
                  <span className="text-slate-800 font-bold capitalize">{printReceiptStudent.registeredBy}</span>
                </div>
              </div>

              {/* Scholar Details brief */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Enrolee details</span>
                <div className="p-3 border border-slate-150 rounded-lg">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="text-slate-450">Scholar Name:</td>
                        <td className="text-right font-bold text-slate-800">{printReceiptStudent.fullName}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-450">Student ID Code:</td>
                        <td className="text-right font-mono font-bold text-slate-800">{printReceiptStudent.id}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-450">Grade Track:</td>
                        <td className="text-right font-bold text-emerald-600">{printReceiptStudent.grade}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Fee Table Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registrar Billing Assessment</span>
                
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-450">
                      <th className="py-1">Description / Item</th>
                      <th className="py-1 text-right">Cost (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 text-slate-650">Term Matriculation & Registration Fee</td>
                      <td className="py-2 text-right font-semibold font-mono text-slate-855">$150.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-655">Operational Technology Facilities Assessment</td>
                      <td className="py-2 text-right font-semibold font-mono text-slate-855">$50.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-655">Student Insurance & Administrative Safety Bond</td>
                      <td className="py-2 text-right font-semibold font-mono text-slate-855">$25.00</td>
                    </tr>
                    <tr className="border-t border-slate-350 font-bold bg-slate-50">
                      <td className="py-2.5 px-1 uppercase text-slate-800">Total Cleared Assessment</td>
                      <td className="py-2.5 px-1 text-right font-mono text-sm text-emerald-608">$225.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-2 bg-emerald-50 text-emerald-800 uppercase font-bold text-[10px] rounded border border-emerald-110/60 block text-center tracking-wider">
                PAYMENT STATUS: SECURELY ACQUITTED IN FULL
              </div>

              {/* Administrative signatures block */}
              <div className="pt-4 flex items-center justify-between border-t border-dashed border-slate-350 text-[10px] text-slate-400 font-sans">
                <p className="font-semibold text-slate-650">
                  Authorized Registrar Staff
                </p>
                <p>© HN School Manager Registrar Desk</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
