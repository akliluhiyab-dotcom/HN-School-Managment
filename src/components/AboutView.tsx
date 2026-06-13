/**
 * About Page View
 * Developed by Hiyabiel Aklilu & Noah
 */

import { School, Terminal, ShieldAlert, Award, Star, BookOpen, Layers } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 dark:bg-slate-950/40 text-slate-100 rounded-3xl p-8 relative overflow-hidden shadow-xl border border-white/5 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-blue-900/20 opacity-60"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-widest font-semibold block w-fit mb-4">
            Project Overview
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            About the Registration Platform
          </h1>
          {/* LOCATION 3/7: About page example text requested exactly */}
          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-sans">
            This School Registration Management System was designed to provide schools with a modern, secure, and efficient student registration and management solution.
          </p>
        </div>
      </div>

      {/* Systems Operations Spotlight Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department card 1 */}
        <div className="glass-card p-6 rounded-2xl border hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-display font-bold text-lg border border-blue-500/10">
              RO
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-lg">Registrar Office Desk</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Admissions & Records Management</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal">
            Oversees student document verification, grade level classifications, parent communications, and official student registry ledgers. Keeps all student databases fully indexed and up-to-date.
          </p>
          <div className="flex gap-2 mt-4">
            <span className="text-[10px] glass-pill border px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-mono">Academic Logs</span>
            <span className="text-[10px] glass-pill border px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-mono">ID Cards</span>
            <span className="text-[10px] glass-pill border px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-mono">Admissions</span>
          </div>
        </div>

        {/* Department card 2 */}
        <div className="glass-card p-6 rounded-2xl border hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-display font-bold text-lg border border-indigo-500/10">
              IT
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 text-lg">Systems & IT Operations</h3>
              <p className="text-xs text-indigo-650 dark:text-indigo-400 font-semibold uppercase tracking-wider">System Administration & Security Auditing</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal">
            Manages secure Express backend server, database persistence files, PBKDF2/SHA-256 session encryption protocols, network synchronization pipelines, and system configuration rules.
          </p>
          <div className="flex gap-2 mt-4">
            <span className="text-[10px] glass-pill border px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-mono">Database</span>
            <span className="text-[10px] glass-pill border px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-mono">SHA Encryption</span>
            <span className="text-[10px] glass-pill border px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 font-mono">File System</span>
          </div>
        </div>

      </div>

      {/* Systems Architecture Brief */}
      <div className="glass-panel p-6 rounded-2xl border">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
          <Layers className="h-5.5 w-5.5 text-blue-500" /> Technical Features & Systems Engineering
        </h2>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <div className="h-9 w-9 bg-blue-500/10 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/10">
              <Terminal className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-slate-805 dark:text-slate-200 text-sm">Server-Side JSON Database</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
              Implemented custom JSON state handling in Node.js Express server mapped to actual files inside `server-data/`, yielding resilient, lightning-fast persistence across client visits without cold start delays.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-9 w-9 bg-indigo-500/10 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/10">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-slate-805 dark:text-slate-200 text-sm">Admin SHA-256 Security</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
              Provides robust login authentication with PBKDF2/SHA-256 standard password hashing. Restricts structural school operations like delete student, edit records config to designated privileges.
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-9 w-9 bg-amber-500/10 dark:bg-amber-600/15 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center border border-amber-500/10">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-slate-805 dark:text-slate-200 text-sm">Production-Ready Reporting</h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
              Generates beautiful, optimized layout reports designed for PDF save and print. Includes structural Excel CSV catalog exports with custom tracking and official registrar receipts.
            </p>
          </div>

        </div>
      </div>

      {/* Quality Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 glass-card rounded-2xl border text-center sm:text-left gap-4">
        <div className="flex items-center gap-3">
          <Award className="h-10 w-10 text-amber-500 shrink-0" />
          <div>
            <h4 className="font-display font-bold text-slate-850 dark:text-slate-100">Official Release Certification</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verified as fully standards-compliant school administration software.</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
          <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
          <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
          <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
          <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
        </div>
      </div>

    </div>
  );
}
