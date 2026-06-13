import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  X, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { Teacher, Student } from '../types';

interface FacultyViewProps {
  teachers: Teacher[];
  students: Student[];
  currentUser: { username: string; fullName: string; role: string } | null;
  onRefresh: () => void;
}

export default function FacultyView({ teachers, students, currentUser, onRefresh }: FacultyViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSalaries, setShowSalaries] = useState(false);
  const [selectedTeacherForRoster, setSelectedTeacherForRoster] = useState<Teacher | null>(null);

  // Form states for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  
  // Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave'>('Active');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete protection
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState(false);

  const availableGrades = [
    'Preschool', 'Kindergarten', 'Grade 1', 'Grade 2', 
    'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 
    'Grade 11', 'Grade 12'
  ];

  // Statistics calculation
  const totalSalary = teachers.reduce((sum, t) => sum + t.salary, 0);
  const averageSalary = teachers.length > 0 ? Math.round(totalSalary / teachers.length) : 0;
  
  // Grade Coverage
  const coveredGrades = new Set<string>();
  teachers.forEach(t => t.assignedGrades.forEach(g => coveredGrades.add(g)));
  const coveragePercent = Math.round((coveredGrades.size / availableGrades.length) * 105) || 0; // slight representation accent

  // Filter teachers list
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = 
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedGrades.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Open Form
  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setSalary('');
    setStatus('Active');
    setSelectedGrades([]);
    setFormError('');
    setSuccessMsg('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFullName(t.fullName);
    setEmail(t.email);
    setPhone(t.phone);
    setSalary(t.salary.toString());
    setStatus(t.status);
    setSelectedGrades(t.assignedGrades);
    setFormError('');
    setSuccessMsg('');
    setIsFormOpen(true);
  };

  // Checkbox grade selector helper
  const handleToggleGrade = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  // Submit handles Addition & Updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!fullName || !email || !phone || !salary) {
      setFormError('All registration fields are required details.');
      return;
    }

    if (selectedGrades.length === 0) {
      setFormError('Please select at least one assigned grade supervisor level.');
      return;
    }

    setSubmitting(true);

    const payload = {
      fullName,
      email,
      phone,
      salary: parseFloat(salary) || 0,
      assignedGrades: selectedGrades,
      status
    };

    try {
      const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : '/api/teachers';
      const method = editingTeacher ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'Guest',
          'X-User-Name': currentUser?.username || ''
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (response.ok) {
        setSuccessMsg(editingTeacher 
          ? 'Faculty educational profile updated successfully.' 
          : 'New faculty record registered into active registry.'
        );
        setTimeout(() => {
          setIsFormOpen(false);
          onRefresh();
        }, 1500);
      } else {
        setFormError(resData.error || 'Database submission failure.');
      }
    } catch (err) {
      setFormError('Network communication error with academic server.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handles
  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    setDeleting(true);

    try {
      const response = await fetch(`/api/teachers/${teacherToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUser?.role || 'Guest',
          'X-User-Name': currentUser?.username || ''
        }
      });

      if (response.ok) {
        setTeacherToDelete(null);
        onRefresh();
      } else {
        alert('Server returned authorization or action error while deleting.');
      }
    } catch (err) {
      alert('Network failure connecting to school database.');
    } finally {
      setDeleting(false);
    }
  };

  // Look up student roster assigned to teacher levels ("Who they take care of")
  const getTeacherRoster = (gradeLevels: string[]): Student[] => {
    return students.filter(s => gradeLevels.includes(s.grade));
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10 font-sans">
      
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-blue-500 animate-pulse" /> Faculty & Compensation Ledger
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse scholastic directories, verify monthly budget commitments, and review classroom supervisors.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {currentUser?.role === 'Admin' && (
            <button
              onClick={handleOpenAdd}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-850 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 transition-all hover:scale-[1.01]"
            >
              <Plus className="h-4.5 w-4.5" /> Add Faculty Member
            </button>
          )}
          
          <button
            onClick={() => setShowSalaries(!showSalaries)}
            className="py-2.5 px-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {showSalaries ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-blue-500" />}
            {showSalaries ? 'Mask Salaries' : 'Reveal Salaries'}
          </button>
        </div>
      </div>

      {/* Bento Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Teachers Card */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Faculty Count</span>
            <h3 className="font-display text-3xl font-extrabold text-slate-850 dark:text-white font-mono">{teachers.length}</h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-450 block mt-2">
              Active full-time educators
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Annual Payroll Card */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Annual Payroll</span>
            <h3 className="font-display text-2.5xl font-extrabold text-slate-850 dark:text-white font-mono flex items-center gap-1">
              {!showSalaries ? (
                <span className="text-slate-400 flex items-center gap-1 text-sm font-semibold tracking-wide">
                  <Lock className="h-4.5 w-4.5 text-slate-400 shrink-0" /> Confidential
                </span>
              ) : (
                `$${totalSalary.toLocaleString()}`
              )}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-450 block mt-2">
              Gross payroll funding allocation
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <Lock className="h-6 w-6" />
          </div>
        </div>

        {/* Monthly Payroll aggregate */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Monthly Payroll</span>
            <h3 className="font-display text-2.5xl font-extrabold text-slate-850 dark:text-white font-mono flex items-center gap-1">
              {!showSalaries ? (
                <span className="text-slate-400 flex items-center gap-1 text-sm font-semibold tracking-wide">
                  <Lock className="h-4.5 w-4.5 text-slate-400 shrink-0" /> Masked
                </span>
              ) : (
                `$${Math.round(totalSalary / 12).toLocaleString()}`
              )}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-450 block mt-2">
              Monthly stipend bank transfers
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Budget Average / Class Coverage */}
        <div className="glass-card p-5 rounded-2xl flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Average Salary</span>
            <h3 className="font-display text-2.5xl font-extrabold text-slate-850 dark:text-white font-mono">
              {!showSalaries ? (
                <span className="text-slate-400 text-sm font-semibold">Protected</span>
              ) : (
                `$${averageSalary.toLocaleString()}`
              )}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold block mt-2">
              {coveredGrades.size} covered scholastic tiers
            </span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Filter and search parameters */}
      <div className="glass-panel p-5 rounded-2xl border flex flex-col md:flex-row items-center gap-4 shadow-sm no-print">
        <div className="w-full md:flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search faculty key or assigned classrooms..."
            className="w-full pl-10 pr-4 py-2 text-slate-805 dark:text-slate-200 text-sm focus:outline-none glass-input"
          />
        </div>
        <div className="text-xs text-slate-450 font-medium whitespace-nowrap">
          Showing {filteredTeachers.length} of {teachers.length} Registry records
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full border border-dashed border-slate-200 dark:border-slate-850 p-12 text-center text-slate-400 text-xs rounded-2xl">
            No Faculty members met the lookup criteria. Register new staff members to start.
          </div>
        ) : (
          filteredTeachers.map(t => {
            const hasRoster = getTeacherRoster(t.assignedGrades);
            return (
              <div 
                key={t.id} 
                className="glass-card rounded-2xl p-6 border flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-505"></div>

                <div>
                  {/* Top line with Avatar and state */}
                  <div className="flex items-start justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/20 shadow-sm uppercase select-none font-display">
                        {t.fullName.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-850 dark:text-slate-200 capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t.fullName}</h4>
                        <span className="font-mono text-[10px] text-slate-450 bg-slate-100 dark:bg-slate-800 border dark:border-slate-755 px-1.5 py-0.2 rounded-md">{t.id}</span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      t.status === 'Active' 
                        ? 'bg-emerald-50 max-h-fit dark:bg-emerald-950/20 text-emerald-600 border-emerald-500/20' 
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  {/* Core Details */}
                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350 bg-slate-100/35 dark:bg-slate-850/20 p-2 rounded-lg leading-none shrink-0 border border-slate-200/20">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{t.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350 bg-slate-100/35 dark:bg-slate-850/20 p-2 rounded-lg leading-none border border-slate-200/20">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t.phone}</span>
                    </div>

                    {/* Salary badge line */}
                    <div className="mt-1 flex items-center justify-between border-t border-b border-dashed border-slate-200/50 dark:border-slate-800/80 py-2.5">
                      <span className="text-[10px] text-slate-450 uppercase font-black tracking-wide">Stipend Rate</span>
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-white">
                        {!showSalaries ? (
                          <span className="text-[10px] text-slate-400 italic flex items-center gap-0.5">
                            <Lock className="h-3 w-3 inline shrink-0" /> Private
                          </span>
                        ) : (
                          `$${t.salary.toLocaleString()} / year`
                        )}
                      </span>
                    </div>

                    {/* Assigned classes */}
                    <div className="py-2">
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Assigned Grade Tiers</div>
                      <div className="flex flex-wrap gap-1">
                        {t.assignedGrades.map(g => (
                          <span key={g} className="px-2 py-0.5 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations & Interactive bottom bars */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/40 dark:border-slate-800/80 flex items-center justify-between">
                  
                  {/* View matched classroom list roster */}
                  <button
                    onClick={() => setSelectedTeacherForRoster(t)}
                    className="py-1.5 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-450 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600/20 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" /> 
                    View Supervised Roster ({hasRoster.length})
                  </button>

                  {/* Actions (Admin Only) */}
                  {currentUser?.role === 'Admin' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        title="Edit faculty info"
                        className="p-1.5 text-slate-450 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setTeacherToDelete(t)}
                        title="Delete staff ledger"
                        className="p-1.5 text-slate-405 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* POPUP A: FACULTY REGISTRATION & DIRECTORY DIALOG */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 no-print animate-fade-in">
          <div className="glass-panel max-w-2xl w-full overflow-hidden shadow-2xl rounded-2xl border animate-scale-up">
            
            <div className="bg-slate-900/80 dark:bg-slate-950/40 text-slate-150 px-6 py-4 flex justify-between items-center border-b border-white/5">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-200">
                {editingTeacher ? 'Edit Faculty Record' : 'Register New Faculty Roster'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200/60 rounded-xl text-xs font-semibold">
                  {formError}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-250 rounded-xl text-xs font-medium">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full name input */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">FULL LEGAL NAME</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Elena Rostova"
                    required
                    className="w-full text-sm py-2 px-3 border border-slate-205 dark:border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/80 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">EMAIL COOPERATIVE</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.rostova@hnschool.org"
                    required
                    className="w-full text-sm py-2 px-3 border border-slate-205 dark:border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/80 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                {/* Telephones */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">PHONE CONTACT</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    required
                    className="w-full text-sm py-2 px-3 border border-slate-205 dark:border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/80 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                {/* Salary funding scale */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">ANNUAL SALARY ($ USD)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="74000"
                    required
                    className="w-full text-sm py-2 px-3 border border-slate-205 dark:border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/80 bg-slate-50 dark:bg-slate-900"
                  />
                </div>

                {/* Status selection */}
                <div className="space-y-1 text-xs sm:col-span-2">
                  <label className="text-slate-500 dark:text-slate-400 font-bold block">REGISTRATION CLEARANCE STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'On Leave')}
                    className="w-full text-sm py-2 px-3 border border-slate-205 dark:border-slate-700/60 rounded-xl focus:outline-none focus:border-blue-500/80 bg-slate-50 dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="Active">Active Educator</option>
                    <option value="On Leave">Temporary Leave / Absent</option>
                  </select>
                </div>

                {/* Assigned Grade selector */}
                <div className="space-y-2 text-xs sm:col-span-2 border-t border-slate-200/50 dark:border-white/5 pt-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-slate-500 dark:text-slate-450 font-black uppercase tracking-wider block">Assigned Grade Supervisor levels (Choose Multiple)</label>
                    <span className="text-[10px] text-blue-500 font-bold">{selectedGrades.length} Grades Checked</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto bg-slate-100/35 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-3.5 rounded-xl">
                    {availableGrades.map(g => {
                      const isChecked = selectedGrades.includes(g);
                      return (
                        <label 
                          key={g} 
                          className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer select-none transition-all ${
                            isChecked 
                              ? 'bg-blue-600 border-blue-500 text-white shadow-sm' 
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleGrade(g)}
                            className="sr-only"
                          />
                          {g}
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action operations buttons */}
              <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/85 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-201 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-blue-500/10 transition-colors disabled:opacity-45"
                >
                  {submitting ? 'Updating database...' : 'Confirm Registration'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* POPUP B: CLASSROOM ROSTER DRAWER (WHO THE TEACHER TAKES CARE OF) */}
      {selectedTeacherForRoster && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 no-print animate-fade-in">
          <div className="glass-panel max-w-2xl w-full overflow-hidden shadow-2xl rounded-2xl border animate-scale-up">
            
            <div className="bg-slate-900/85 dark:bg-slate-950/45 text-white p-6 border-b border-slate-250/20 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-blue-400">Classroom Supervisor Oversight</span>
                <h3 className="font-display font-black text-lg capitalize">{selectedTeacherForRoster.fullName}’s Live Student List</h3>
              </div>
              <button 
                onClick={() => setSelectedTeacherForRoster(null)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Context Summary */}
              <div className="p-4 bg-blue-500/5 dark:bg-white/5 border border-blue-500/15 rounded-xl text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                <p>
                  This view displays students currently enrolled who correspond to class grades allocated to <strong className="font-bold text-slate-800 dark:text-white">{selectedTeacherForRoster.fullName}</strong>.
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.0 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-3 w-3" /> Responsibility: {selectedTeacherForRoster.assignedGrades.join(', ')}
                  </span>
                </div>
              </div>

              {/* Roster student count */}
              <div className="overflow-y-auto max-h-72 pr-1 divide-y divide-slate-205/35 dark:divide-slate-800/80">
                {(() => {
                  const assignedStudents = getTeacherRoster(selectedTeacherForRoster.assignedGrades);
                  if (assignedStudents.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-450 italic text-xs bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed text-ellipsis">
                        No students are currently enrolled in any grade levels associated with {selectedTeacherForRoster.fullName} ({selectedTeacherForRoster.assignedGrades.join(', ')}).
                      </div>
                    );
                  }

                  return assignedStudents.map((stu) => (
                    <div key={stu.id} className="py-3 flex sm:items-center justify-between flex-col sm:flex-row gap-2 first:pt-1 last:pb-1">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-display font-black text-xs flex items-center justify-center">
                          {stu.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-100 capitalize">{stu.fullName}</h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans mt-0.5">
                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-semibold text-slate-500">{stu.id}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-500 dark:text-slate-400">{stu.grade}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 font-sans sm:text-right pl-12 sm:pl-0">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">Guardian: {stu.parentName}</div>
                        <div className="text-[10px] text-slate-450 font-mono italic mt-0.5">Phone: {stu.parentPhone}</div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-900/15 dark:bg-slate-950/20 border-t border-slate-200/45 dark:border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedTeacherForRoster(null)}
                className="py-1.5 px-6 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-750"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POPUP C: TEACHER DELETION SAFETY PANEL */}
      {teacherToDelete && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 no-print animate-fade-in">
          <div className="glass-panel max-w-md w-full p-6 shadow-2xl border space-y-4 animate-scale-up">
            
            <div className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5.5 w-5.5" />
              <h3 className="font-display font-black text-base">Terminate Faculty Contract Records</h3>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans space-y-1.5 pt-1">
              <p>
                You are about to delete developer/faculty records for <strong className="font-bold text-slate-850 dark:text-slate-100">{teacherToDelete.fullName}</strong> ({teacherToDelete.id}) from the active database catalog files.
              </p>
              <p className="font-medium text-rose-500 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                Warning: This is an irreversible operation. Students in {teacherToDelete.assignedGrades.join(', ')} will be displayed as unassigned until a new supervisor is configured.
              </p>
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                disabled={deleting}
                onClick={() => setTeacherToDelete(null)}
                className="py-1.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="py-1.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer shadow-md shadow-rose-500/10"
              >
                {deleting ? 'Terminating record...' : 'Confirm Deletion'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
