/**
 * Admin / Registrar Dashboard
 * Developed by Hiyabiel Aklilu & Noah
 */

import React from 'react';
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  CalendarCheck, 
  TrendingUp, 
  BadgeAlert, 
  Clock, 
  CheckCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { Student, AttendanceSheet, Teacher } from '../types';

interface DashboardProps {
  students: Student[];
  teachers?: Teacher[];
  attendanceSheets: AttendanceSheet[];
  onNavigate: (view: string) => void;
  currentUser: { fullName: string; role: string; username: string } | null;
}

export default function Dashboard({ students, teachers = [], attendanceSheets, onNavigate, currentUser }: DashboardProps) {
  // Statistics
  const totalStudents = students.length;

  // Grade Counts
  const gradeDistribution: { [key: string]: number } = {};
  students.forEach((s) => {
    gradeDistribution[s.grade] = (gradeDistribution[s.grade] || 0) + 1;
  });

  const gradeList = [
    'Preschool',
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12'
  ];

  // Recent 5 registrations
  const recentRegistrations = [...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Attendance metrics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const attendanceTodaySheet = attendanceSheets.find((sheet) => sheet.date === todayDateStr);
  const yesterdayDateSheet = attendanceSheets[attendanceSheets.length - 1]; // Fallback to last saved sheet for display

  const activeSheet = attendanceTodaySheet || yesterdayDateSheet;
  
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let attendanceTotal = 0;
  let attendancePercent = 100;

  if (activeSheet && activeSheet.records.length > 0) {
    activeSheet.records.forEach((rec) => {
      attendanceTotal++;
      if (rec.status === 'Present') presentCount++;
      else if (rec.status === 'Absent') absentCount++;
      else if (rec.status === 'Late') lateCount++;
    });
    attendancePercent = Math.round(((presentCount + lateCount) / attendanceTotal) * 100) || 0;
  }

  // Registration Growth Trend (Mock simple representation based on this term)
  const registeredThisMonth = students.filter(s => {
    const d = new Date(s.createdAt);
    return d.getFullYear() === 2026 && d.getMonth() === 5; // June 2026
  }).length;

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border leading-relaxed">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Academic Operations Center
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{currentUser?.fullName || 'Registrar'}</span>. HN School Manager registers are active and secure.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs glass-pill p-3 rounded-xl border font-mono text-slate-600 dark:text-slate-300">
          <Clock className="h-4 w-4 text-blue-500 shrink-0" />
          <span>System Date: {new Date().toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Statistics Cards - Bento Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students Record */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">Total Enrolled</span>
            <h3 className="font-display text-3xl font-extrabold text-slate-850 dark:text-white font-mono">{totalStudents}</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-2">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" /> +{registeredThisMonth} Registered this month
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Attendance Rates */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">Attendance Rate</span>
            <h3 className="font-display text-3xl font-extrabold text-slate-855 dark:text-white font-mono">{attendancePercent}%</h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-2">
              Based on {activeSheet ? `Sheet: ${activeSheet.date}` : "No recorded data"}
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CalendarCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Grade Distribution Count summary */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">Active Faculty</span>
            <h3 className="font-display text-3xl font-extrabold text-slate-855 dark:text-white font-mono">
              {teachers.length}
            </h3>
            <span className="text-[10px] text-slate-505 dark:text-slate-400 block mt-2">
              {teachers.filter(t => t.status === 'Active').length} active class guides
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-450 rounded-xl">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="bg-gradient-to-br from-blue-600/75 to-indigo-700/75 text-white p-5 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/10 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-sm tracking-wide text-slate-100">School Quick Actions</h4>
            <p className="text-[10px] text-blue-105 opacity-80 mt-1">Direct admin routing trigger</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onNavigate('Register')}
              className="flex-1 py-1.5 px-2 bg-white text-blue-600 hover:text-blue-700 active:bg-blue-50 text-[11px] font-black rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <UserPlus className="h-3 w-3" /> Enroll
            </button>
            <button
              onClick={() => onNavigate('Attendance')}
              className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/10 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <CalendarCheck className="h-3 w-3" /> Attend
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Grade Levels Progress Map - 2 Columns */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border space-y-5">
          <div>
            <h3 className="font-display font-extrabold text-base text-slate-850 dark:text-slate-100">Grade Level Enrolment Map</h3>
            <p className="text-xs text-slate-400">Student metrics segmented by graduation catalog</p>
          </div>

          <div className="space-y-4 pt-1">
            {gradeList.map((g) => {
              const count = gradeDistribution[g] || 0;
              const percent = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
              return (
                <div key={g} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{g}</span>
                    <span className="text-slate-505 dark:text-slate-400 font-mono">{count} Students ({Math.round(percent)}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-200/50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-550" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-205/40 dark:border-white/10 mt-4 text-xs text-slate-500 dark:text-slate-405 flex items-center justify-between">
            <span>Minimum Class Size: 5</span>
            <button 
              onClick={() => onNavigate('Directory')} 
              className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Directory <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Recent Registrations Grid - 3 Columns */}
        <div className="lg:col-span-3 glass-card p-6 rounded-2xl border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-base text-slate-850 dark:text-slate-100">Recent Roll Registrations</h3>
              <p className="text-xs text-slate-400 font-sans">Latest students registered into system index</p>
            </div>
            <span className="text-[11px] glass-pill border px-2.5 py-1 rounded-full font-mono text-slate-500 dark:text-slate-300">
              Active Term
            </span>
          </div>

          <div className="divide-y divide-slate-200/40 dark:divide-slate-850">
            {recentRegistrations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No students enrolled in database system yet. Click Enroll Student to populate.
              </div>
            ) : (
              recentRegistrations.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 gap-2">
                  <div className="flex items-center gap-3">
                    {/* Compact Base64 or icon avatar for grid */}
                    {s.photoBase64 ? (
                      <img 
                        src={s.photoBase64} 
                        alt={s.fullName} 
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-slate-200/50 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 font-display font-bold text-xs select-none">
                        {s.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.fullName}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/20 dark:border-slate-700 px-1 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400">{s.id}</span>
                        <span>•</span>
                        <span>{s.grade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-slate-400">
                    <div className="font-mono text-slate-550 dark:text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] mt-0.5 text-slate-500">By: <span className="capitalize font-medium">{s.registeredBy}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Faculty Classroom Assignment Map */}
      <div className="glass-card p-6 rounded-2xl border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-extrabold text-base text-slate-850 dark:text-slate-100">Faculty Classroom Care Assignments</h3>
            <p className="text-xs text-slate-400">Current educator supervisions paired with active enrollments status</p>
          </div>
          <button 
            type="button"
            onClick={() => onNavigate('Faculty')}
            className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer animate-fade-in"
          >
            Manage Faculty <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {teachers.length === 0 ? (
            <div className="col-span-full py-6 text-center text-slate-450 italic text-xs">
              No faculty records currently registered.
            </div>
          ) : (
            teachers.map((t) => {
              const assignedStudents = students.filter(s => t.assignedGrades.includes(s.grade));
              return (
                <div key={t.id} className="p-4 bg-slate-100/35 dark:bg-slate-850/15 border border-slate-200/50 dark:border-white/5 rounded-xl flex flex-col justify-between hover:shadow-sm hover:border-slate-350 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 capitalize">{t.fullName}</h4>
                      <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        t.status === 'Active' ? 'bg-emerald-50 max-h-fit dark:bg-emerald-950/20 text-emerald-600 border-emerald-500/10' : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">{t.id} • {t.email}</p>
                    
                    <div className="mt-3">
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Assigned Levels</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {t.assignedGrades.map(g => (
                          <span key={g} className="px-1.5 py-0.2 bg-blue-500/5 border border-blue-500/10 rounded-lg text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-205/30 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-505 dark:text-slate-400">Supervised Scholars</span>
                    <span className="font-bold text-slate-850 dark:text-white font-mono bg-blue-550/10 text-blue-600 dark:text-blue-400 px-2.0 py-0.5 rounded-lg border border-blue-500/10">
                      {assignedStudents.length} Students
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Real-time Attendance Today Alert Banner */}
      {activeSheet && (
        <div className="p-4 bg-emerald-500/10 dark:bg-emerald-550/5 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans leading-relaxed">
          <div className="flex items-start md:items-center gap-3">
            <div className="p-2 bg-white/80 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-450 rounded-xl shadow-sm border border-emerald-500/20">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Daily Attendance Verified</h5>
              <p className="text-xs text-emerald-700 dark:text-emerald-400/90">
                Marked on date <span className="font-mono font-semibold">{activeSheet.date}</span>. Present: <span className="font-semibold">{presentCount}</span> | Late: <span className="font-semibold">{lateCount}</span> | Absent: <span className="font-semibold">{absentCount}</span>. Submitted by Registrar Staff member <span className="font-bold underline uppercase">{activeSheet.submittedBy}</span>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('Attendance')}
            className="text-xs bg-emerald-600/90 hover:bg-emerald-700 hover:text-white dark:bg-white/10 dark:hover:bg-white/20 text-slate-100 dark:text-white font-medium py-2 px-3 rounded-xl border border-emerald-500/20 dark:border-white/10 cursor-pointer transition-colors max-w-fit"
          >
            Manage Records
          </button>
        </div>
      )}

      {/* Footer - Professional Display */}
      <footer className="pt-6 mt-12 border-t border-slate-200/40 dark:border-slate-800/30 text-center text-xs text-slate-500 dark:text-slate-450 no-print font-sans flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Registrar Operations Team
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-550">
          HN School Manager Registrar Operations Portal • Certified Production Release v2.1
        </p>
      </footer>
    </div>
  );
}
