/**
 * School Registration Management System - Primary App Entry Point
 * Designed and Developed by Hiyabiel Aklilu & Noah
 */

import React, { useState, useEffect } from 'react';
import { 
  School, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  Info, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Database,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  Sparkles,
  CheckCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';

// Subcomponents
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';
import StudentDirectory from './components/StudentDirectory';
import StudentForm from './components/StudentForm';
import AttendanceTracker from './components/AttendanceTracker';
import AboutView from './components/AboutView';
import FacultyView from './components/FacultyView';

// Types
import { Student, AttendanceSheet, User as UserType, Teacher } from './types';

export default function App() {
  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  // Navigation tabs state
  const [currentTab, setCurrentTab] = useState('Dashboard');

  // Database lists
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [attendanceSheets, setAttendanceSheets] = useState<AttendanceSheet[]>([]);
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Editing state carrier
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Dark Mode state (Pre-seeded with light mode off-white theme by default)
  const [darkMode, setDarkMode] = useState(false);

  // Mobile sidebar drawer slider
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Status notification overlays inside App
  const [appAlert, setAppAlert] = useState<{ type: 'success' | 'err'; message: string } | null>(null);

  // Guest screen active state
  const [guestSubView, setGuestSubView] = useState<'welcome' | 'apply' | 'success'>('welcome');

  // 1. Fetch Students and Attendance on Mount or Refresh
  const syncDatabase = async () => {
    if (!currentUser || currentUser.role === 'Guest') return;
    setIsDataLoading(true);
    try {
      // Sync Students Catalog List
      const sResponse = await fetch('/api/students', {
        headers: {
          'X-User-Role': currentUser.role,
          'X-User-Name': currentUser.username
        }
      });
      if (sResponse.ok) {
        const sData = await sResponse.json();
        setStudentsList(sData);
      }

      // Sync Attendance Journal Sheets
      const aResponse = await fetch('/api/attendance', {
        headers: {
          'X-User-Role': currentUser.role,
          'X-User-Name': currentUser.username
        }
      });
      if (aResponse.ok) {
        const aData = await aResponse.json();
        setAttendanceSheets(aData);
      }

      // Sync Teachers (Faculty) Catalog List
      const tResponse = await fetch('/api/teachers', {
        headers: {
          'X-User-Role': currentUser.role,
          'X-User-Name': currentUser.username
        }
      });
      if (tResponse.ok) {
        const tData = await tResponse.json();
        setTeachersList(tData);
      }
    } catch (err) {
      console.error('Failure syncing with registration databases:', err);
      triggerAppAlert('err', 'System failure connecting to backend database logs.');
    } finally {
      setIsDataLoading(false);
    }
  };

  // Run synchronization upon successful login
  useEffect(() => {
    if (currentUser) {
      syncDatabase();
    }
  }, [currentUser]);

  // Dark Mode HTML Injector Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Trigger brief floating notifications
  const triggerAppAlert = (type: 'success' | 'err', message: string) => {
    setAppAlert({ type, message });
    setTimeout(() => {
      setAppAlert(null);
    }, 4000);
  };

  // Database Reset handler (Eases demonstration purposes)
  const handleRollbackDB = async () => {
    if (currentUser?.role !== 'Admin') {
      triggerAppAlert('err', 'Access Denied: Only Admin accounts can rollback/reset databases.');
      return;
    }

    if (!window.confirm('Are you sure you want to reset the HN School Manager database to original records? This deletes custom registrations added in this session.')) {
      return;
    }

    try {
      const resp = await fetch('/api/db/reset', {
        method: 'POST',
        headers: {
          'X-User-Role': currentUser.role,
          'X-User-Name': currentUser.username
        }
      });
      if (resp.ok) {
        triggerAppAlert('success', 'Database cleared and successfully re-seeded, compiling fresh assets.');
        syncDatabase();
        setCurrentTab('Dashboard');
      } else {
        triggerAppAlert('err', 'Reset operation failed on backend.');
      }
    } catch (err) {
      console.error(err);
      triggerAppAlert('err', 'Failed to reach reset API.');
    }
  };

  // Secure deletion pipeline
  const handleDeleteStudent = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser.role,
          'X-User-Name': currentUser.username
        }
      });
      if (response.ok) {
        triggerAppAlert('success', `Student registration ${id} deleted successfully from records.`);
        syncDatabase();
        return true;
      } else {
        const errData = await response.json();
        triggerAppAlert('err', errData.error || 'Server rejected delete operation.');
        return false;
      }
    } catch (err) {
      console.error(err);
      triggerAppAlert('err', 'Failed to submit delete command to network.');
      return false;
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('Dashboard');
    setStudentsList([]);
    setAttendanceSheets([]);
    triggerAppAlert('success', 'Session terminated safely. Safeguarding operations.');
  };

  // Redirect to login if user not authenticated
  if (!currentUser) {
    return <LoginView onLoginSuccess={(u) => {
      setCurrentUser(u);
      triggerAppAlert('success', `Session initialized. Role: ${u.role}`);
    }} />;
  }

  // Guard: Restrict Guest Users from seeing student directories or dashboard telemetry
  if (currentUser.role === 'Guest') {
    return (
      <div className="min-h-screen flex flex-col justify-between glass-bg transition-colors duration-500 relative overflow-hidden text-slate-800 dark:text-slate-100 font-sans">
        
        {/* Decorative Blur Orbs */}
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-rose-500/5 dark:bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Floating System Notification Card */}
        {appAlert && (
          <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md flex items-center gap-3 animate-slide-up max-w-sm max-h-fit no-print">
            <div className="h-5 w-5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-450 rounded-full flex items-center justify-center font-bold">!</div>
            <span className="text-xs font-semibold">{appAlert.message}</span>
          </div>
        )}

        {/* Upper Empty spacer or branding */}
        <div className="flex-grow flex items-center justify-center p-4 z-10 w-full animate-fade-in">
          {guestSubView === 'welcome' && (
            <div className="w-full max-w-lg glass-panel shadow-2xl rounded-2xl overflow-hidden transform transition-all border border-rose-500/20">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-indigo-950 to-slate-900 px-8 py-8 text-center text-white border-b border-indigo-900/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-blue-500/10 p-3 rounded-full mb-3 backdrop-blur-md border border-blue-500/20">
                    <School className="h-8 w-8 text-blue-400 animate-pulse" />
                  </div>
                  <h1 className="font-display text-2xl font-black tracking-widest text-white">HN SCHOOL MANAGER</h1>
                  <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest font-semibold">PRE-REGISTRATION & ADMISSION PORTAL</p>
                </div>
              </div>

              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <h2 className="font-display text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Register To Attend HN School
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Welcome back, <strong className="font-semibold text-slate-800 dark:text-white">{currentUser.fullName}</strong>. You are currently authenticated with <strong className="font-semibold text-blue-600 dark:text-blue-400">Guest</strong> clearance status.
                  </p>
                  <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-500/20 rounded-xl text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed space-y-2">
                    <p className="font-bold text-blue-800 dark:text-blue-400">Join Our Active Scholastic Registry</p>
                    <p>
                      To shield the absolute privacy of our existing children (medical registries, home locations, fee receipts), other student directories are accessible only to Head Registrar <strong className="font-bold">Hiyab</strong>.
                    </p>
                    <p>
                      However, you can pre-register your own details to attend HN School! Use our secure online form below to lodge your registration directly.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/40 dark:border-slate-800/80 pt-4 space-y-3">
                  <div className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex justify-between">
                      <span>Authenticated ID:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{currentUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Access Status:</span>
                      <span className="font-bold text-rose-500 uppercase">Classified / Restricted List</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  <button
                    onClick={() => setGuestSubView('apply')}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <UserPlus className="h-4.5 w-4.5 text-blue-100 animate-pulse" /> Apply / Register My Name to Attend
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-755 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" /> Sign Out / Terminate Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {guestSubView === 'apply' && (
            <div className="w-full max-w-4xl glass-panel shadow-2xl rounded-2xl overflow-hidden transform transition-all border border-blue-500/20 p-6 md:p-8 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/35 dark:border-slate-800/60 pb-4">
                <div>
                  <h1 className="font-display text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-amber-500 animate-bounce" /> Prospective Registration form
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">Please fill your student and parent details. Data fields are handled with full encryption protection layers.</p>
                </div>
                <button
                  onClick={() => setGuestSubView('welcome')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Back to Portal Panel
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-2 rounded-xl">
                <StudentForm 
                  editingStudent={null}
                  onCancel={() => setGuestSubView('welcome')}
                  onSaveCompleted={() => {
                    triggerAppAlert('success', 'Your pre-registration has been successfully filed with the school manager database.');
                    setGuestSubView('success');
                  }}
                  currentUser={currentUser}
                />
              </div>
            </div>
          )}

          {guestSubView === 'success' && (
            <div className="w-full max-w-lg glass-panel shadow-2xl rounded-2xl overflow-hidden transform transition-all border border-emerald-500/20">
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 px-8 py-8 text-center text-white border-b border-emerald-900/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-emerald-500/15 p-3 rounded-full mb-3 backdrop-blur-md border border-emerald-500/20 animate-bounce">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h1 className="font-display text-2xl font-black tracking-widest text-white">REGISTRATION FILED</h1>
                  <p className="text-xs text-emerald-250 mt-1 uppercase tracking-widest font-semibold">APPLICATION DIRECTLY UPLOADED</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-3 font-sans">
                  <h2 className="font-display text-lg font-bold text-slate-850 dark:text-slate-100 text-center">
                    Congratulations, Your Submission Was Received!
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                    The registration application has been submitted to HN School.
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed text-center border-t border-slate-200/40 dark:border-slate-800/80 pt-4 font-medium italic">
                    For utmost kid-protection guidelines, student directory indexes are private and strictly blocked from Guest visibility. This guarantees the secure protection of all scholars. Owner Hiyab has been alerted of your upload and will view your record on the primary Admin panel for approval!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setGuestSubView('apply')}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-750 cursor-pointer text-slate-100 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all"
                  >
                    <UserPlus className="h-4 w-4" /> Register Another Name
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 cursor-pointer text-slate-100 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" /> Safe Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-4 border-t border-slate-200/40 dark:border-slate-800/30 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md text-center text-xs text-slate-500 dark:text-slate-450 no-print z-10">
          <p>© 2026 HN School Manager. Active encryption layers safeguarding student records.</p>
        </footer>
      </div>
    );
  }

  // Define sidebar navigation directories
  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Directory', icon: Users },
    { name: 'Faculty', icon: GraduationCap },
    { name: 'Register', icon: UserPlus },
    { name: 'Attendance', icon: CalendarCheck },
    { name: 'About', icon: Info }
  ];

  return (
    <div className="min-h-screen glass-bg text-slate-800 dark:text-slate-100 flex font-sans transition-colors duration-500 relative overflow-hidden">
      
      {/* Ambient Decorative Glowing Orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Floating System Notification Card */}
      {appAlert && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md flex items-center gap-3 animate-slide-up max-w-sm max-h-fit no-print">
          {appAlert.type === 'success' ? (
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
          ) : (
            <div className="h-5 w-5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-450 rounded-full flex items-center justify-center font-bold">!</div>
          )}
          <span className="text-xs font-semibold">{appAlert.message}</span>
        </div>
      )}

      {/* DESKTOP PERMANENT NAVIGATION SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 glass-sidebar text-slate-700 dark:text-slate-300 shrink-0 z-10 no-print">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-200/40 dark:border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            <School className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm tracking-widest text-slate-800 dark:text-slate-100 block uppercase">HN SCHOOL MANAGER</h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-450 uppercase tracking-widest font-semibold block mt-0.5">Registrar RMS</span>
          </div>
        </div>

        {/* Dynamic Navigation Menu list */}
        <nav className="flex-1 p-4 space-y-1.5 pt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setEditingStudent(null);
                  setCurrentTab(item.name);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 font-bold text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.name === 'Register' ? 'Enrol Scholar' : `${item.name}`}
              </button>
            );
          })}
        </nav>

        {/* Sandbox utility - Database Reset button (Visible to Admin only) */}
        {currentUser?.role === 'Admin' && (
          <div className="p-4 border-t border-slate-200/40 dark:border-white/10 space-y-2">
            <button
              onClick={handleRollbackDB}
              className="w-full py-2 bg-slate-100/50 dark:bg-slate-800/40 hover:bg-slate-200/50 dark:hover:bg-slate-750/50 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl text-[10px] font-mono tracking-wider uppercase block text-center cursor-pointer flex items-center justify-center gap-1.5 transition-all border border-slate-200/40 dark:border-white/10"
              title="Reset databases to original records setup"
            >
              <Database className="h-3.5 w-3.5" /> Rollback DB
            </button>
          </div>
        )}

        {/* Authenticated User Status Footer block inside Sidebar */}
        <div className="p-4 border-t border-slate-200/40 dark:border-white/10 bg-slate-100/30 dark:bg-slate-950/40 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 flex items-center justify-center text-slate-850 dark:text-slate-100 font-display font-medium text-xs select-none">
              {currentUser.fullName.substring(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.fullName}</h4>
              <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 border border-slate-300/30 dark:border-slate-700 px-1.5 py-0.2 rounded-full inline-block text-slate-600 dark:text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-450 rounded-lg cursor-pointer transition-colors"
              title="Terminate Admin Session"
            >
              <LogOut className="h-4.5 w-4.5 text-rose-500" />
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE HEADER BAR & HAMBURGER DRAWER */}
      <div className="md:hidden no-print z-30">
        {/* Mobile Header top trigger */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/40 dark:border-slate-800/80 backdrop-blur-xl text-slate-800 dark:text-white px-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <School className="h-5.5 w-5.5 text-blue-500" />
            <h1 className="font-display font-black text-xs tracking-wider block text-slate-800 dark:text-white">HN SCHOOL RMS</h1>
          </div>
          
          <div className="flex items-center gap-2">
            
            {/* Theme switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md z-20 flex flex-col justify-between">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setEditingStudent(null);
                      setCurrentTab(item.name);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-550/20'
                        : 'text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-white/5'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name === 'Register' ? 'Enrol Scholar' : item.name}
                  </button>
                );
              })}
              
              {/* Reset database on mobile */}
              {currentUser.role === 'Admin' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleRollbackDB();
                  }}
                  className="w-full py-3 rounded-xl text-left text-xs font-mono tracking-wider font-bold text-amber-500 bg-amber-550/5 dark:bg-slate-900 border border-amber-500/20 px-4 mt-4 flex items-center gap-2"
                >
                  <Database className="h-4 w-4" /> Reset Database
                </button>
              )}
            </nav>

            {/* Mobile Footer Status */}
            <div className="p-4 bg-white/80 dark:bg-slate-900 border-t border-slate-200/40 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-850 dark:text-white text-sm">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 uppercase font-semibold">{currentUser.role} Account</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="py-1.5 px-3 bg-rose-550/10 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-wider font-sans border border-rose-500/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CORE WORKSPACE PANEL CONTAINING CONTENT VIEWS */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto z-10 relative">
        
        {/* Top Floating App Utility Bar on high-resolution displays */}
        <div className="hidden md:flex items-center justify-end gap-3 mb-6 no-print">
          
          {/* Synchronizer state */}
          {isDataLoading && (
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin text-blue-500" /> Synchronizing school ledger...
            </span>
          )}

          {/* Quick Security Badge */}
          <div className="px-3 py-1 bg-white/65 dark:bg-slate-800/60 border border-slate-200/40 dark:border-white/10 backdrop-blur-md rounded-xl text-[10px] text-slate-600 dark:text-slate-400 font-semibold font-sans uppercase flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-blue-500" /> Secure Terminal: {currentUser.role}
          </div>

          {/* Dark Mode toggle trigger */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 bg-white/65 dark:bg-slate-800/60 border border-slate-200/40 dark:border-white/10 backdrop-blur-md hover:border-blue-500/40 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 shadow-sm cursor-pointer transition-all"
            title={darkMode ? 'Switch layout to Light Theme' : "Switch layout to Dark eye-safe twilight Theme"}
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
          </button>
        </div>

        {/* ROUTER CONTENT MAP */}
        <div className="pb-12">
          {editingStudent ? (
            <StudentForm
              editingStudent={editingStudent}
              currentUser={currentUser}
              onCancel={() => setEditingStudent(null)}
              onSaveCompleted={() => {
                setEditingStudent(null);
                syncDatabase();
                setCurrentTab('Directory');
              }}
            />
          ) : currentTab === 'Dashboard' ? (
            <Dashboard 
              students={studentsList}
              teachers={teachersList}
              attendanceSheets={attendanceSheets}
              onNavigate={(tab) => setCurrentTab(tab)}
              currentUser={currentUser}
            />
          ) : currentTab === 'Directory' ? (
            <StudentDirectory
              students={studentsList}
              teachers={teachersList}
              currentUser={currentUser}
              onEditStudent={(student) => setEditingStudent(student)}
              onAddNewStudent={() => setCurrentTab('Register')}
              onDeleteStudent={handleDeleteStudent}
            />
          ) : currentTab === 'Faculty' ? (
            <FacultyView
              teachers={teachersList}
              students={studentsList}
              currentUser={currentUser}
              onRefresh={syncDatabase}
            />
          ) : currentTab === 'Register' ? (
            <StudentForm
              currentUser={currentUser}
              onCancel={() => setCurrentTab('Dashboard')}
              onSaveCompleted={() => {
                syncDatabase();
                setCurrentTab('Directory');
              }}
            />
          ) : currentTab === 'Attendance' ? (
            <AttendanceTracker
              students={studentsList}
              attendanceSheets={attendanceSheets}
              currentUser={currentUser}
              onRefreshDB={syncDatabase}
            />
          ) : (
            <AboutView />
          )}
        </div>

      </main>

    </div>
  );
}
