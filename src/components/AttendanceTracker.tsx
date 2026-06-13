/**
 * Attendance Tracker Form Component
 * Developed by Hiyabiel Aklilu & Noah
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Save, 
  User, 
  Search, 
  ClipboardCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceSheet } from '../types';

interface AttendanceTrackerProps {
  students: Student[];
  attendanceSheets: AttendanceSheet[];
  onRefreshDB: () => void;
  currentUser: { username: string; fullName: string; role: string } | null;
}

export default function AttendanceTracker({ 
  students, 
  attendanceSheets, 
  onRefreshDB, 
  currentUser 
}: AttendanceTrackerProps) {
  
  // Local Date Choice State (defaults to today, June 12, 2026)
  const [selectedDate, setSelectedDate] = useState('2026-06-12');
  
  // Maps target studentId to their attendance record
  const [recordsMap, setRecordsMap] = useState<{ [studentId: string]: AttendanceRecord }>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Load existing records for chosen date
  useEffect(() => {
    const historicalSheet = attendanceSheets.find((sheet) => sheet.date === selectedDate);
    const newMap: { [studentId: string]: AttendanceRecord } = {};

    students.forEach((student) => {
      // Find matching record on this date
      const matchedRecord = historicalSheet?.records.find((r) => r.studentId === student.id);
      
      newMap[student.id] = {
        studentId: student.id,
        status: matchedRecord ? matchedRecord.status : 'Present', // Default to present
        remarks: matchedRecord?.remarks || ''
      };
    });

    setRecordsMap(newMap);
    setSubmitError('');
    setSubmitSuccess('');
  }, [selectedDate, attendanceSheets, students]);

  // Adjust Status Choice
  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setRecordsMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  // Adjust Remarks
  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRecordsMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  // Shortcut: Mark All Present
  const handleMarkAllPresent = () => {
    const updatedMap = { ...recordsMap };
    students.forEach((student) => {
      if (updatedMap[student.id]) {
        updatedMap[student.id] = {
          ...updatedMap[student.id],
          status: 'Present'
        };
      }
    });
    setRecordsMap(updatedMap);
  };

  // Shortcut: Mark All Absent
  const handleMarkAllAbsent = () => {
    const updatedMap = { ...recordsMap };
    students.forEach((student) => {
      if (updatedMap[student.id]) {
        updatedMap[student.id] = {
          ...updatedMap[student.id],
          status: 'Absent'
        };
      }
    });
    setRecordsMap(updatedMap);
  };

  // Submit Sheet
  const handleSaveSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    try {
      const recordsArray = Object.values(recordsMap);
      
      const payload = {
        date: selectedDate,
        records: recordsArray,
        submittedBy: currentUser?.username || 'system'
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'Guest',
          'X-User-Name': currentUser?.username || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(`Attendance sheet for date ${selectedDate} filed successfully in registry database.`);
        onRefreshDB();
      } else {
        setSubmitError(data.error || 'Failed to submit attendance sheet.');
      }
    } catch (err) {
      setSubmitError('System failed to reach backend operations server database.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter students showing in search grid
  const filteredStudents = students.filter((s) => {
    return s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.grade.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate statistics for currently mapped state
  const total = students.length;
  let present = 0;
  let absent = 0;
  let late = 0;

  (Object.values(recordsMap) as AttendanceRecord[]).forEach((r) => {
    if (r.status === 'Present') present++;
    else if (r.status === 'Absent') absent++;
    else if (r.status === 'Late') late++;
  });

  const ratePercent = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      
      {/* Upper Control Grid Card */}
      <div className="glass-panel p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 leading-relaxed shadow-md">
        
        {/* Left header */}
        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-xl text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="h-5.5 w-5.5 text-blue-505" /> Active Register Attendance
          </h2>
          <p className="text-xs text-slate-400">
            Submit daily status sheets to the school data vault
          </p>
        </div>

        {/* Control Date Selector and Shortcuts */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-405 block">Marking Journal Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-3 py-1.5 focus:ring-blue-500/25 glass-input cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex glass-pill p-1 rounded-xl border gap-2 text-xs font-medium h-fit mt-5">
            <button
              onClick={handleMarkAllPresent}
              className="py-1.5 px-3 hover:bg-white/10 dark:hover:bg-slate-700/50 rounded-lg text-blue-650 dark:text-blue-400 cursor-pointer transition-colors"
            >
              All Present
            </button>
            <button
              onClick={handleMarkAllAbsent}
              className="py-1.5 px-3 hover:bg-white/10 dark:hover:bg-slate-700/50 rounded-lg text-rose-600 dark:text-rose-400 cursor-pointer transition-colors"
            >
              All Absent
            </button>
          </div>
        </div>

      </div>

      {/* Visual Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total registry count */}
        <div className="glass-card p-4 rounded-xl border shadow-sm text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Scholars</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white font-mono">{total}</span>
        </div>

        {/* Present stats state */}
        <div className="glass-card p-4 rounded-xl border shadow-sm text-center space-y-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Marked Present</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{present}</span>
        </div>

        {/* Late stats state */}
        <div className="glass-card p-4 rounded-xl border shadow-sm text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">Marked Late</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">{late}</span>
        </div>

        {/* Attendance Percentage rating */}
        <div className="bg-blue-600/10 dark:bg-blue-500/10 border border-blue-550/20 p-4 rounded-xl text-center space-y-1 shadow-sm leading-none flex flex-col justify-center">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block font-display mb-1">Target Rate</span>
          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">{ratePercent}%</span>
        </div>

      </div>

      {/* Grid listing student names to mark */}
      <div className="glass-panel rounded-2xl border overflow-hidden">
        
        {/* Simple inline Search */}
        <div className="p-4 bg-slate-900/25 dark:bg-slate-950/20 border-b border-slate-200/40 dark:border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or grade..."
              className="w-full pl-8 pr-3 py-1.5 text-slate-805 dark:text-slate-200 text-xs focus:outline-none glass-input"
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Filtered: {filteredStudents.length} of {total} records
          </span>
        </div>

        {/* Attendance Entries Grid Form */}
        <form onSubmit={handleSaveSheet}>
          <div className="divide-y divide-slate-200/40 dark:divide-white/5">
            {filteredStudents.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                No matching active school records discovered.
              </div>
            ) : (
              filteredStudents.map((student) => {
                const mapRecord = recordsMap[student.id] || { studentId: student.id, status: 'Present', remarks: '' };
                return (
                  <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Scholar Identity Brief */}
                    <div className="flex items-center gap-3 w-full sm:w-64 shrink-0">
                      {student.photoBase64 ? (
                        <img 
                          src={student.photoBase64} 
                          alt={student.fullName} 
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full object-cover border border-slate-200/30"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-200/50 dark:bg-white/5 flex items-center justify-center text-slate-500 font-display font-bold text-xs uppercase shadow-xs">
                          {student.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">{student.fullName}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-mono">
                          <span>{student.id}</span>
                          <span>•</span>
                          <span>{student.grade}</span>
                        </div>
                      </div>
                    </div>

                    {/* Marking radio controls */}
                    <div className="flex items-center gap-2">
                      
                      {/* Present selector */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 border transition-all ${
                          mapRecord.status === 'Present'
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                            : 'border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Present
                      </button>

                      {/* Late selector */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Late')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 border transition-all ${
                          mapRecord.status === 'Late'
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                            : 'border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" /> Late
                      </button>

                      {/* Absent selector */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 border transition-all ${
                          mapRecord.status === 'Absent'
                            ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-450 font-bold shadow-sm'
                            : 'border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <XCircle className="h-3.5 w-3.5 shrink-0" /> Absent
                      </button>

                    </div>

                    {/* Custom Remarks remarks message */}
                    <div className="flex-1 max-w-sm">
                      <input
                        type="text"
                        value={mapRecord.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Add remarks (e.g. sick leave, late bus)..."
                        className="w-full text-slate-805 dark:text-slate-200 text-xs focus:outline-none glass-input px-2.5 py-1.5"
                      />
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Action Save Bar */}
          <div className="p-5 bg-slate-900/15 dark:bg-slate-950/25 border-t border-slate-200/40 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans rounded-b-2xl">
            
            {/* Action status notifications */}
            <div className="text-xs">
              {submitError && (
                <p className="text-rose-500 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" /> {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-emerald-500 font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="h-4 w-4" /> {submitSuccess}
                </p>
              )}
              {!submitError && !submitSuccess && (
                <p className="text-slate-400 font-medium">
                  Click 'Save Daily Attendance Sheet' to lock choices into historical ledger files.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || total === 0}
              className="py-2.5 px-6 bg-blue-650 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" /> {isSubmitting ? 'Filing Entry...' : 'Save Daily Attendance Sheet'}
            </button>

          </div>
        </form>

      </div>

    </div>
  );
}
