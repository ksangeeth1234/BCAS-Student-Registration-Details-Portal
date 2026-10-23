import React from 'react';
import { Award, AlertTriangle, CheckCircle2, Edit3, X, ShieldAlert } from 'lucide-react';
import { StudentRecord } from '../types/student';

interface CertificateNameModalProps {
  student: StudentRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCorrect: () => void;
  onStartNameEdit: () => void;
}

export const CertificateNameModal: React.FC<CertificateNameModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirmCorrect,
  onStartNameEdit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-red-600 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 px-5 sm:px-6 py-4 text-white flex items-center justify-between border-b-2 border-red-600">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight">
                Award Certificate Name Confirmation
              </h3>
              <p className="text-[11px] text-red-200 font-medium">
                Final Official Graduation Document Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-4">
          
          {/* Important Notice Callout */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-950 text-xs sm:text-sm leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-red-700 font-extrabold text-xs sm:text-sm mb-1 uppercase tracking-wider">
                Please confirm that your name is 100% correct
              </strong>
              <span>
                This is the <strong>final legal name</strong> that will be printed on the certificate you are awarded. If it does not match your official National Identity Card (NIC) or Passport, <strong>please change it now to your proper name</strong>.
              </span>
            </div>
          </div>

          {/* Current Registered Name Box */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border-2 border-slate-200 text-center space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              Currently Registered Student Name
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight break-words px-2 py-1 bg-white rounded-lg border border-slate-300">
              {student.StudentName || 'NO NAME RECORDED'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold pt-1">
              <span>Reg No: <strong className="font-mono text-red-600">{student.StudentNumber}</strong></span>
              <span>•</span>
              <span className="truncate max-w-xs">{student.Course || 'Academic Programme'}</span>
            </div>
          </div>

          {/* Guidelines hint */}
          <p className="text-[11px] text-slate-500 text-center leading-relaxed px-1">
            Ensure proper spelling, correct initials, and correct sequence of names. Once certificates are printed for graduation, modifications require formal re-issuance fees.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            
            {/* Primary Action 1: Change to proper name */}
            <button
              type="button"
              onClick={onStartNameEdit}
              className="w-full sm:w-1/2 py-3 px-4 text-xs sm:text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Change / Correct Name</span>
            </button>

            {/* Primary Action 2: Confirm name is correct */}
            <button
              type="button"
              onClick={onConfirmCorrect}
              className="w-full sm:w-1/2 py-3 px-4 text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Yes, My Name is Correct</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
