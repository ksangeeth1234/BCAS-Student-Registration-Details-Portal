import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, KeyRound, Calendar } from 'lucide-react';
import { StudentRecord } from '../types/student';

interface IdentityConfirmationModalProps {
  student: StudentRecord;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  isStaff: boolean;
}

export const IdentityConfirmationModal: React.FC<IdentityConfirmationModalProps> = ({
  student,
  isOpen,
  onClose,
  onVerified,
  isStaff
}) => {
  const [authMethod, setAuthMethod] = useState<'dob' | 'nic'>('dob');
  const [dobInput, setDobInput] = useState('');
  const [nicInput, setNicInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      if (authMethod === 'dob') {
        const studentDob = (student.dob || '').trim();
        const enteredDob = dobInput.trim();
        // Check exact date or format variations
        if (studentDob && enteredDob && (studentDob === enteredDob || studentDob.replace(/[-/]/g, '') === enteredDob.replace(/[-/]/g, ''))) {
          onVerified();
          return;
        }
      } else {
        const studentNic = (student.nic || '').trim().toLowerCase();
        const enteredNic = nicInput.trim().toLowerCase();
        // Check if student's NIC ends with or equals the entered digits
        if (studentNic && enteredNic && (studentNic.endsWith(enteredNic) || studentNic === enteredNic)) {
          onVerified();
          return;
        }
      }

      setErrorMessage('The entered information does not match the registration record. Please verify and try again.');
    }, 400);
  };

  const handleStaffBypass = () => {
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 px-6 py-5 text-white flex items-center justify-between border-b-2 border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Student Identity Confirmation</h3>
              <p className="text-xs text-slate-300">BCAS Student Privacy Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-5 bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-900">
            <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>{student.StudentName}</span>
              <span className="font-mono text-red-700 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                {student.StudentNumber}
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              {student.Course} • {student.AcademicBranch}
            </p>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            To prevent unauthorized viewing of contact details and personal records, please confirm one of your registered identifiers:
          </p>

          {/* Selector: DOB vs NIC */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => { setAuthMethod('dob'); setErrorMessage(''); }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'dob'
                  ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Date of Birth</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('nic'); setErrorMessage(''); }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'nic'
                  ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-red-600" />
              <span>NIC / Passport</span>
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {authMethod === 'dob' ? (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Enter Registered Date of Birth:
                </label>
                <input
                  type="date"
                  required
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all font-medium text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Select your date of birth as registered with BCAS Campus admissions
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Last 4 digits of NIC or Passport:
                </label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  placeholder="e.g. 3982 or full NIC"
                  value={nicInput}
                  onChange={(e) => setNicInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all font-mono font-medium text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Enter the last 4 characters or full NIC recorded at admission
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-1/2 py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm & View</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Staff Verification Shortcut if authorized staff is viewing */}
          {isStaff && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleStaffBypass}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
              >
                Authorized Staff: Open record directly
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
