import React from 'react';
import {
  StudentRecord,
  FIELD_DISPLAY_LABELS
} from '../types/student';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Building,
  CreditCard,
  HeartHandshake,
  FileText,
  Edit3,
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  Layers,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

const BCAS_LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_vg_vDQDD_PZfMsdp6_TpUpq3Ze0QoKCUx_vNrId9hw6JUkrLtynoT1XX&s=10';

interface StudentProfileProps {
  student: StudentRecord;
  onBackToSearch: () => void;
  onStartEdit: (isFullAdminEdit?: boolean) => void;
  isSaving?: boolean;
  isAdmin?: boolean;
  onPromptAdminLogin?: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onBackToSearch,
  onStartEdit,
  isSaving = false,
  isAdmin = false,
  onPromptAdminLogin
}) => {

  const renderBadge = (statusStr: string) => {
    const isSuccess = ['Active', 'Clear', 'Full Time', 'Completed'].includes(statusStr);
    const isWarning = ['Pending', 'Pending 2nd Installment', 'Part Time'].some(p => statusStr.includes(p));
    
    if (isSuccess) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {statusStr}
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          {statusStr}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
        {statusStr}
      </span>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 animate-in fade-in duration-300">
      
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-950 bg-white hover:bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all shadow-2xs w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Back to Search</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {student.updatedAt && (
            <div className="text-[11px] text-slate-400 flex items-center gap-1 hidden md:flex font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Saved: {new Date(student.updatedAt).toLocaleDateString()}</span>
            </div>
          )}

          {/* Edit All Details Button - Privileges granted to student per prompt */}
          <button
            onClick={() => onStartEdit(true)}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-red-600/25 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-white" />
            <span>Edit Registration Details</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Card (Dark Blue & Crimson Red branding with BCAS Logo) */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-slate-950/20 mb-6 border-2 border-slate-800 relative overflow-hidden">
        {/* Subtle red accent glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1.5 shadow-md border border-slate-200 flex items-center justify-center shrink-0">
              <img
                src={BCAS_LOGO_URL}
                alt="BCAS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white">
                  Registered Student
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/15 text-blue-100 border border-white/20">
                  {student.AcademicBranch || 'BCAS Campus'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-0.5 break-words">
                {student.StudentName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2">
                {student.Course || 'Academic Programme'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col items-start md:items-end gap-0.5 shrink-0">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-red-300 font-bold">
              Student Registration No.
            </span>
            <span className="font-mono text-base sm:text-xl font-bold text-white tracking-wide break-all">
              {student.StudentNumber}
            </span>
            <span className="text-[11px] text-slate-300 font-medium mt-0.5">
              Intake: {student.IntakeMonth} {student.IntakeYear}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Name Notice Alert Banner */}
      <div className="bg-gradient-to-r from-red-50 via-white to-blue-50 border-2 border-red-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-blue-950 text-xs sm:text-sm">
              Official Award Certificate Name Notice
            </h4>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              Please confirm that <strong>"{student.StudentName}"</strong> is correct. This is the <strong>final name printed on the certificate you are awarded</strong>. If not, please change to your proper name.
            </p>
          </div>
        </div>
        <button
          onClick={() => onStartEdit(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shrink-0 transition-all shadow-xs cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Change / Correct Name</span>
        </button>
      </div>

      {/* Grid of All 6 Sections (Displaying all 30 Master Excel Columns) */}
      <div className="space-y-4 sm:space-y-6">

        {/* Section A: Student Information */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-blue-950">
                  A. Student & Academic Information
                </h2>
                <p className="text-[11px] text-slate-500">
                  Official enrollment, course allocation, and academic branch
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isAdmin 
                  ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                {isAdmin ? 'Admin: Full Access' : 'Name Editable • Academic Locked'}
              </span>
              <button
                onClick={() => onStartEdit(isAdmin)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.StudentName}</div>
              <div className="font-bold text-slate-900 break-words">{student.StudentName || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.StudentNumber}</div>
              <div className="font-mono font-bold text-blue-950 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-200 break-all">
                {student.StudentNumber || '—'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.RegisteredDate}</div>
              <div className="text-slate-800">{student.RegisteredDate || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Intake Period</div>
              <div className="text-slate-800 font-medium">{student.IntakeMonth} {student.IntakeYear}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.Course}</div>
              <div className="font-bold text-blue-950 break-words">{student.Course || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.courseType}</div>
              <div className="text-slate-800">{student.courseType || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.batchName}</div>
              <div className="text-slate-800 font-medium">{student.batchName || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.AcademicBranch}</div>
              <div className="text-slate-800 font-medium">{student.AcademicBranch || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.status}</div>
              <div>{renderBadge(student.status || 'Active')}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.mode}</div>
              <div>{renderBadge(student.mode || 'Full Time')}</div>
            </div>
          </div>
        </section>

        {/* Section B: Contact Information */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-blue-950">
                  B. Contact Information
                </h2>
                <p className="text-[11px] text-slate-500">
                  Primary mobile number, student email, and residential address
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                All Editable
              </span>
              <button
                onClick={() => onStartEdit(isAdmin)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>{FIELD_DISPLAY_LABELS.mobile}</span>
              </div>
              <div className="font-bold text-slate-900">{student.mobile || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-600" />
                <span>{FIELD_DISPLAY_LABELS.email}</span>
              </div>
              <div className="font-bold text-blue-950 break-all">{student.email || '—'}</div>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>{FIELD_DISPLAY_LABELS.address}</span>
              </div>
              <div className="text-slate-800 leading-snug break-words">{student.address || '—'}</div>
            </div>
          </div>
        </section>

        {/* Section C: Personal Information */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-blue-950">
                  C. Personal Information
                </h2>
                <p className="text-[11px] text-slate-500">
                  National Identity, Date of birth, Nationality, and Prior Qualifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isAdmin 
                  ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                {isAdmin ? 'Admin: Full Access' : 'NIC & DOB Editable • Qualifications Locked'}
              </span>
              <button
                onClick={() => onStartEdit(isAdmin)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.nic}</div>
              <div className="font-mono font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block break-all">
                {student.nic || '—'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.dob}</div>
              <div className="text-slate-800 font-medium">{student.dob || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.citizenship}</div>
              <div className="text-slate-800 font-medium">{student.citizenship || 'Sri Lankan'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.hasSpecialNeeds}</div>
              <div>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                  student.hasSpecialNeeds === 'Yes' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                }`}>
                  {student.hasSpecialNeeds || 'No'}
                </span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.specialNeedsReason}</div>
              <div className="text-slate-700 italic break-words">
                {student.specialNeedsReason || 'None recorded'}
              </div>
            </div>
            <div className="sm:col-span-3">
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-600" />
                <span>{FIELD_DISPLAY_LABELS.qualifications}</span>
                {!isAdmin && (
                  <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>
                )}
              </div>
              <div className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 break-words leading-relaxed font-medium">
                {student.qualifications || 'No qualifications listed'}
              </div>
            </div>
          </div>
        </section>

        {/* Section D: Parent or Guardian Information */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-blue-950">
                  D. Parent or Guardian Information
                </h2>
                <p className="text-[11px] text-slate-500">
                  Next of kin and emergency family contact details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                All Editable
              </span>
              <button
                onClick={() => onStartEdit(isAdmin)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.parentName}</div>
              <div className="font-bold text-slate-900 break-words">{student.parentName || '—'}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>{FIELD_DISPLAY_LABELS.parentMobile}</span>
              </div>
              <div className="font-bold text-slate-900">{student.parentMobile || '—'}</div>
            </div>
          </div>
        </section>

        {/* Section E: Counsellor & Additional Details (Admin Only - Hidden from Students per institutional policy) */}
        {isAdmin && (
          <section className="bg-white rounded-2xl border border-blue-200 shadow-xs p-4 sm:p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-100">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-blue-950">
                      E. Counsellor & Additional Information
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                      Admin Only View
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Assigned counsellor, payment scheme, and administrative remarks
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStartEdit(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs sm:text-sm">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.Counsellor}</div>
                <div className="text-slate-900 font-bold">{student.Counsellor || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.CounsellorsBranch}</div>
                <div className="text-slate-800 font-medium">{student.CounsellorsBranch || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.PaymentPendingStatus}</div>
                <div>{renderBadge(student.PaymentPendingStatus || 'Clear')}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.paymentType}</div>
                <div className="text-slate-800 font-medium">{student.paymentType || '—'}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{FIELD_DISPLAY_LABELS.remark}</div>
                <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs break-words font-medium">
                  {student.remark || 'No administrative remarks recorded.'}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section F: Technical IDs (Admin Only - Hidden from Students) */}
        {isAdmin && (
          <section className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-blue-950">
                      F. System Identifiers & Record Metadata
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
                      Admin Only View
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Underlying record identifiers from the Master Excel workbook
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStartEdit(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Record ID (id)</span>
                <span className="font-mono text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 inline-block break-all font-semibold">
                  {student.id || '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Lead ID (leadId)</span>
                <span className="font-mono text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 inline-block break-all font-semibold">
                  {student.leadId || '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Bundle Course ID</span>
                <span className="font-mono text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 inline-block break-all font-semibold">
                  {student.bundleCourseId || '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Last Editor</span>
                <span className="text-slate-700 truncate block font-medium">
                  {student.lastUpdatedBy || 'System / Excel'}
                </span>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Bottom Action Footer */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50/80 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="text-xs sm:text-sm text-blue-950 font-bold mb-0.5">
            {isAdmin ? 'Administrator Mode Active' : 'Need to update your registration details?'}
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            {isAdmin
              ? 'You have complete administrative access to view and edit all 30 Master Excel columns.'
              : 'You can update your Student Name, Contact Information, NIC / Date of Birth, and Parent / Guardian details.'}
          </p>
        </div>

        <button
          onClick={() => onStartEdit(isAdmin)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-white" />
          <span>{isAdmin ? 'Edit All Details (Admin)' : 'Edit Registration Details'}</span>
        </button>
      </div>

    </div>
  );
};
