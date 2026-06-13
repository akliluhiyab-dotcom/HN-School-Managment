/**
 * About and Login Portal View
 * Developed by Hiyabiel Aklilu & Noah
 */

import React, { useState } from 'react';
import { School, Lock, User, AlertCircle, Sparkles, UserPlus, CheckCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      if (!fullName.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
        setErrorMsg('Please fill in all register fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            fullName: fullName.trim(),
            password: password.trim(),
            role: 'Guest'
          })
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMsg(`Account registered! You can now log in using your credentials.`);
          setIsSignUp(false);
          // Pre-fill username for convenience
          setUsername(data.user.username);
          setPassword('');
          setConfirmPassword('');
        } else {
          setErrorMsg(data.error || 'Failed to sign up.');
        }
      } catch (err) {
        setErrorMsg('Connection failed. Please check if your server is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!username.trim() || !password.trim()) {
        setErrorMsg('Please enter both username and password.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
          })
        });

        const data = await response.json();

        if (response.ok) {
          onLoginSuccess(data.user);
        } else {
          setErrorMsg(data.error || 'Invalid credentials. Please try again.');
        }
      } catch (err) {
        setErrorMsg('Failed to connect to the authorization server. Check if backend is active.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setIsSignUp(false);
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg('');
    setSuccessMsg('');
    setUsername('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between glass-bg transition-colors duration-500 relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Upper Empty spacer or branding */}
      <div className="flex-grow flex items-center justify-center p-4 z-10">
        <div id="login_card" className="w-full max-w-md glass-panel shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-350">
          
          {/* Accent Header */}
          <div className="bg-slate-900/80 dark:bg-slate-950/40 text-slate-100 px-8 py-7 text-center relative overflow-hidden border-b border-white/5 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-transparent to-blue-800/20 opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/10 p-3 rounded-full mb-3 backdrop-blur-md">
                <School className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">HN SCHOOL MANAGER</h1>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest font-medium">Registration Management System</p>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {isSignUp ? 'New User Registration' : 'Administrative Portal Login'}
                </h2>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Back to Login' : 'Sign Up Instead'}
                </button>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-150 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2 animate-pulse">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50/70 dark:bg-rose-950/40 rounded-xl border border-rose-150 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-xs flex items-start gap-2 animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name Input for Registration */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Full Name / Registration Identity
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                      <Sparkles className="h-4.5 w-4.5 text-blue-400" />
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Hiyab"
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-slate-850 dark:text-slate-150 text-sm focus:outline-none glass-input"
                    />
                  </div>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isSignUp ? "Select a unique username" : "Enter username"}
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-slate-850 dark:text-slate-150 text-sm focus:outline-none glass-input"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-slate-850 dark:text-slate-150 text-sm focus:outline-none glass-input"
                  />
                </div>
              </div>

              {/* Confirm Password Input for Registration */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat selected password"
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-slate-850 dark:text-slate-150 text-sm focus:outline-none glass-input"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="login_submit_btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 disabled:hover:shadow-none flex justify-center items-center gap-1 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </span>
                ) : (
                  isSignUp ? 'Create & Register Account' : 'Authorize & Enter'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer - Professional Display */}
      <footer className="py-4 border-t border-slate-200/40 dark:border-slate-800/30 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md text-center text-xs text-slate-500 dark:text-slate-450 no-print z-10">
        <p className="font-sans">
          Authorized Registrar Operations Portal
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
          © 2026 HN School Manager. All school systems authenticated securely.
        </p>
      </footer>
    </div>
  );
}
