/**
 * Student Registration Form (Enrollment & Editing)
 * Developed by Hiyabiel Aklilu & Noah
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Calendar, 
  Users, 
  GraduationCap, 
  Contact, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Upload, 
  X, 
  CheckCircle,
  AlertCircle,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Student } from '../types';

interface StudentFormProps {
  editingStudent?: Student | null; // If editing, pre-fill
  onCancel: () => void;
  onSaveCompleted: () => void;
  currentUser: { username: string; fullName: string; role: string } | null;
}

export default function StudentForm({ editingStudent, onCancel, onSaveCompleted, currentUser }: StudentFormProps) {
  // Direct States
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [grade, setGrade] = useState('Kindergarten');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);

  // Status indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // File drag state
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize editing data if provided
  useEffect(() => {
    if (editingStudent) {
      setFullName(editingStudent.fullName);
      setDob(editingStudent.dob);
      setGender(editingStudent.gender);
      setGrade(editingStudent.grade);
      setParentName(editingStudent.parentName);
      setParentPhone(editingStudent.parentPhone);
      setEmail(editingStudent.email);
      setAddress(editingStudent.address);
      setEmergencyContact(editingStudent.emergencyContact);
      setPhotoBase64(editingStudent.photoBase64);
    } else {
      // Clear values if adding new
      setFullName('');
      setDob('');
      setGender('Male');
      setGrade('Kindergarten');
      setParentName('');
      setParentPhone('');
      setEmail('');
      setAddress('');
      setEmergencyContact('');
      setPhotoBase64(undefined);
    }
    setErrorMsg('');
    setSuccessMsg('');
    setValidationErrors({});
  }, [editingStudent]);

  // Image reading Base64 helper
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file type. Please upload a profile image file (JPEG, PNG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // limit 2MB
      setErrorMsg('Profile photo must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoBase64(reader.result);
        setErrorMsg('');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error reading uploaded image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoBase64(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Validations
  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!dob) errs.dob = 'Date of Birth is required';
    if (!parentName.trim()) errs.parentName = 'Parent/Guardian Name is required';
    
    // Parent Contact Validation
    const trimmedPhone = parentPhone.trim();
    if (!trimmedPhone) {
      errs.parentPhone = 'Parent contact number is required';
    } else if (trimmedPhone.length < 7) {
      errs.parentPhone = 'Please enter a valid phone number';
    }

    // Email validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!address.trim()) errs.address = 'Home address is required';
    if (!emergencyContact.trim()) errs.emergencyContact = 'Emergency name & contact details are required';

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) {
      setErrorMsg('Enrollment failed. Please correct the highlighted input validation errors.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName,
        dob,
        gender,
        grade,
        parentName,
        parentPhone,
        email,
        address,
        emergencyContact,
        photoBase64,
        registeredBy: currentUser?.username || 'admin'
      };

      const url = editingStudent 
        ? `/api/students/${editingStudent.id}`
        : '/api/students';
      
      const method = editingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'Guest',
          'X-User-Name': currentUser?.username || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(editingStudent 
          ? `Student ${editingStudent.id} modified successfully.` 
          : `Student ${data.student.id} registered into the school directory.`
        );
        setTimeout(() => {
          onSaveCompleted();
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Server error. Action failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to communicate with school server database.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl max-w-4xl mx-auto z-10 relative overflow-hidden animate-fade-in">
      
      {/* Header Bar */}
      <div className="bg-slate-900/80 dark:bg-slate-950/40 text-slate-100 px-6 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="font-display font-extrabold text-lg text-white">
              {editingStudent ? 'Modify Register Record' : 'Enroll New Scholar'}
            </h2>
            <p className="text-xs text-slate-300 opacity-80">
              {editingStudent ? `Updating records config for ${editingStudent.id}` : 'Student database ID will be auto-generated upon submit'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Cancel / Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Banner Messages */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-990/40 rounded-xl text-emerald-800 dark:text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Student Profile Photo Upload Drag & Drop */}
          <div className="md:col-span-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Student Photo
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`h-68 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer relative overflow-hidden transition-all ${
                photoBase64 
                  ? 'border-emerald-500 bg-slate-50 dark:bg-slate-700/20' 
                  : isDragActive 
                    ? 'border-indigo-500 bg-indigo-50/10' 
                    : 'border-slate-200 dark:border-slate-655 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              {photoBase64 ? (
                <>
                  <img 
                    src={photoBase64} 
                    alt="Preview" 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full shadow-md z-10 transition-colors"
                    title="Remove Photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-[10px] text-white px-2 py-0.5 rounded font-mono z-10">
                    File Saved in Register
                  </div>
                </>
              ) : (
                <div className="space-y-3 flex flex-col items-center text-slate-400">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-full border border-slate-100 dark:border-slate-600">
                    <Upload className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Drag Profile Photo here
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      or click to browse local files
                    </p>
                  </div>
                  <span className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-750 px-2 py-0.5 rounded font-mono">
                    MAX SIZE 2MB
                  </span>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChangeFile}
                className="hidden"
              />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed">
              * Recommended: JPG or PNG formats on clean white backgrounds. Files are scaled automatically client-side.
            </p>
          </div>

          {/* Column 2 & 3: Detailed Fields */}
          <div className="md:col-span-2 space-y-5">
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 dark:border-slate-700 pb-1">
              Part A: Personal Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g., Johnathan Doe"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                      validationErrors.fullName ? 'border-rose-450 focus:ring-rose-500/10' : ''
                    }`}
                  />
                </div>
                {validationErrors.fullName && (
                  <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.fullName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                      validationErrors.dob ? 'border-rose-450 focus:ring-rose-500/10' : ''
                    }`}
                  />
                </div>
                {validationErrors.dob && (
                  <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.dob}</p>
                )}
              </div>

              {/* Gender Radio Choice */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Gender Selection
                </label>
                <div className="flex glass-pill p-1 border rounded-xl gap-2 text-xs">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-1.5 rounded-lg text-center font-medium cursor-pointer transition-colors ${
                        gender === g 
                          ? 'bg-blue-600/25 dark:bg-blue-500/25 border border-blue-500/30 text-blue-700 dark:text-white font-semibold' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Class dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Grade Enrollment <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-slate-850 dark:text-slate-200 text-sm focus:outline-none glass-input cursor-pointer"
                  >
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
              </div>

            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 dark:border-slate-700 pt-3 pb-1">
              Part B: Contact & Guardianship Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Parent/Guardian Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Parent / Guardian Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Contact className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="E.g., Margaret Doe"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                      validationErrors.parentName ? 'border-rose-450 focus:ring-rose-500/10' : ''
                    }`}
                  />
                </div>
                {validationErrors.parentName && (
                  <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.parentName}</p>
                )}
              </div>

              {/* Parent Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Parent Contact Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="E.g., 555-019-2834"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                      validationErrors.parentPhone ? 'border-rose-450 focus:ring-rose-500/10' : ''
                    }`}
                  />
                </div>
                {validationErrors.parentPhone && (
                  <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.parentPhone}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                      validationErrors.email ? 'border-rose-440 focus:ring-rose-500/10' : ''
                    }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.email}</p>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Emergency Contact Details <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <ShieldAlert className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="E.g., Uncle James - 555-901-2918"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                      validationErrors.emergencyContact ? 'border-rose-455 focus:ring-rose-500/10' : ''
                    }`}
                  />
                </div>
                {validationErrors.emergencyContact && (
                  <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.emergencyContact}</p>
                )}
              </div>

            </div>

            {/* Home Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                Home Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-2 left-0 pl-3 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street details, Apt #, City, State ZIP"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none glass-input ${
                    validationErrors.address ? 'border-rose-450 focus:ring-rose-500/10' : ''
                  }`}
                />
              </div>
              {validationErrors.address && (
                <p className="text-[10px] text-rose-500 font-semibold">{validationErrors.address}</p>
              )}
            </div>

          </div>

        </div>

        {/* Action button bar */}
        <div className="pt-6 border-t border-slate-200/40 dark:border-slate-805/40 flex justify-end gap-3 font-sans">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-200/50 dark:border-slate-700 hover:bg-white/10 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
          
          <button
            id="student_submit_btn"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-650 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving Scholar...</span>
            ) : (
              <>
                <Save className="h-4 w-4" /> {editingStudent ? 'Update Database Record' : 'Complete Registration'}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
