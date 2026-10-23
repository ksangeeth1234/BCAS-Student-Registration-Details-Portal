import React, { useState } from 'react';
import {
  StudentRecord,
  FIELD_DISPLAY_LABELS
} from '../types/student';
import {
  X,
  Save,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  HeartHandshake,
  User,
  Info,
  BookOpen,
  Building,
  CreditCard,
  FileText,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface StudentEditModalProps {
  student: StudentRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFields: Partial<StudentRecord>) => Promise<void>;
  editableFieldKeys?: (keyof StudentRecord)[];
  isAdmin?: boolean;
  isFullAdminEdit?: boolean;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
  isAdmin = false,
  isFullAdminEdit = false
}) => {
  const canEditAll = Boolean(isAdmin || isFullAdminEdit);

  const [formData, setFormData] = useState<StudentRecord>({
    id: student.id || '',
    leadId: student.leadId || '',
    Counsellor: student.Counsellor || '',
    StudentNumber: student.StudentNumber || '',
    RegisteredDate: student.RegisteredDate || '',
    IntakeMonth: student.IntakeMonth || '',
    IntakeYear: student.IntakeYear || '',
    StudentName: student.StudentName || '',
    CounsellorsBranch: student.CounsellorsBranch || '',
    AcademicBranch: student.AcademicBranch || '',
    Course: student.Course || '',
    PaymentPendingStatus: student.PaymentPendingStatus || 'Clear',
    status: student.status || 'Active',
    mode: student.mode || 'Full Time',
    courseType: student.courseType || '',
    mobile: student.mobile || '',
    email: student.email || '',
    batchName: student.batchName || '',
    address: student.address || '',
    nic: student.nic || '',
    dob: student.dob || '',
    citizenship: student.citizenship || 'Sri Lankan',
    hasSpecialNeeds: student.hasSpecialNeeds || 'No',
    specialNeedsReason: student.specialNeedsReason || '',
    remark: student.remark || '',
    parentName: student.parentName || '',
    parentMobile: student.parentMobile || '',
    qualifications: student.qualifications || '',
    bundleCourseId: student.bundleCourseId || '',
    paymentType: student.paymentType || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.StudentName || !formData.StudentName.trim()) {
      newErrors.StudentName = 'Student name cannot be empty.';
    }

    if (!formData.StudentNumber || !formData.StudentNumber.trim()) {
      newErrors.StudentNumber = 'Student Number is required.';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.mobile || formData.mobile.trim().length < 8) {
      newErrors.mobile = 'Mobile contact number is required.';
    }

    if (formData.hasSpecialNeeds === 'Yes' && (!formData.specialNeedsReason || !formData.specialNeedsReason.trim())) {
      newErrors.specialNeedsReason = 'Please specify your special accommodations.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    if (validate()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(formData);
      setShowConfirmDialog(false);
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.');
      setShowConfirmDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-3 sm:my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header (Dark Blue & Crimson Red Theme) */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-4 sm:px-6 py-4 text-white flex items-center justify-between shrink-0 border-b border-red-600/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-red-400" />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-sm sm:text-base truncate">
                Edit Student Registration Details
              </h2>
              <p className="text-[11px] text-slate-300 truncate">
                {student.StudentName} • <span className="font-mono text-red-300">{student.StudentNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-blue-50 border-b border-blue-200 text-xs flex items-center gap-2 text-blue-950 font-medium shrink-0">
          <Info className="w-4 h-4 text-blue-800 shrink-0" />
          <span>
            {canEditAll
              ? "Administrator Mode: You can view and edit all 30 registration columns. Changes are saved immediately to the central BCAS database."
              : "Student Access: You can edit your Student Name, Contact Information, NIC / Date of Birth, and Parent / Guardian details. Academic records and qualifications are view-only."}
          </span>
        </div>

        {saveError && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Save Failed</p>
              <p>{saveError}</p>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleInitialSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">

          {/* Section A: Academic & Student Information */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs sm:text-sm font-bold text-blue-950">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>A. Academic & Student Information</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                canEditAll 
                  ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                {canEditAll ? 'Admin: All Editable' : 'Student Name Editable • Academic Locked'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.StudentName} <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-red-600 font-semibold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Final for Certificate Award</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.StudentName}
                  onChange={(e) => setFormData({ ...formData, StudentName: e.target.value })}
                  placeholder="Enter full legal name as per NIC / Passport"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600 font-bold text-slate-900 shadow-2xs"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This exact name will be printed on your BCAS award certificate.
                </p>
                {errors.StudentName && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{errors.StudentName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.StudentNumber} <span className="text-red-500">*</span></span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  required
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.StudentNumber}
                  onChange={(e) => setFormData({ ...formData, StudentNumber: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-bold text-blue-950 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
                {errors.StudentNumber && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.StudentNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.Course}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.Course}
                  onChange={(e) => setFormData({ ...formData, Course: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.AcademicBranch}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.AcademicBranch}
                  onChange={(e) => setFormData({ ...formData, AcademicBranch: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.status}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <select
                  disabled={!canEditAll}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Completed">Completed</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.mode}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <select
                  disabled={!canEditAll}
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.RegisteredDate}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="date"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.RegisteredDate}
                  onChange={(e) => setFormData({ ...formData, RegisteredDate: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.IntakeMonth}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.IntakeMonth}
                  onChange={(e) => setFormData({ ...formData, IntakeMonth: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.IntakeYear}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.IntakeYear}
                  onChange={(e) => setFormData({ ...formData, IntakeYear: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.courseType}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.courseType}
                  onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.batchName}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section B: Contact Information (All data inside B can edit) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs sm:text-sm font-bold text-blue-950">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                <span>B. Contact Information</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                All Editable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {FIELD_DISPLAY_LABELS.mobile} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border ${
                    errors.mobile ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
                {errors.mobile && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {FIELD_DISPLAY_LABELS.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@bcas.lk"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-red-600`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {FIELD_DISPLAY_LABELS.address}
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Permanent residential address"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>

          {/* Section C: Personal Information (NIC & DOB editable, Qualifications view-only) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs sm:text-sm font-bold text-blue-950">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                <span>C. Personal Information</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                canEditAll 
                  ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {canEditAll ? 'Admin: All Editable' : 'NIC & DOB Editable • Qualifications View Only'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.nic}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Editable</span>
                </label>
                <input
                  type="text"
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  placeholder="NIC / Passport No"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.dob}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Editable</span>
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.citizenship}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.citizenship}
                  onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                  placeholder="e.g. Sri Lankan"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.hasSpecialNeeds}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <select
                  disabled={!canEditAll}
                  value={formData.hasSpecialNeeds}
                  onChange={(e) => setFormData({ ...formData, hasSpecialNeeds: e.target.value })}
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.specialNeedsReason}</span>
                  {!canEditAll && <span className="text-[10px] text-slate-400 font-normal">(View Only)</span>}
                </label>
                <input
                  type="text"
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.specialNeedsReason}
                  onChange={(e) => setFormData({ ...formData, specialNeedsReason: e.target.value })}
                  placeholder="Details of special accommodations"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>

              {/* Prior Qualifications - STRICTLY VIEW ONLY FOR STUDENTS PER USER PROMPT */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{FIELD_DISPLAY_LABELS.qualifications}</span>
                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    {canEditAll ? 'Admin Editable' : 'View Only (Institutional Record)'}
                  </span>
                </label>
                <textarea
                  rows={2}
                  disabled={!canEditAll}
                  readOnly={!canEditAll}
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  placeholder="Prior educational achievements, GCE O/L, GCE A/L, diplomas"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 ${
                    !canEditAll ? 'bg-slate-100 text-slate-600 cursor-not-allowed font-medium' : 'bg-white focus:outline-none focus:ring-2 focus:ring-red-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section D: Parent / Guardian Information (Can edit and view) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs sm:text-sm font-bold text-blue-950">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-red-600" />
                <span>D. Parent or Guardian Information</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                All Editable & Viewable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {FIELD_DISPLAY_LABELS.parentName}
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Parent or guardian full name"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {FIELD_DISPLAY_LABELS.parentMobile}
                </label>
                <input
                  type="tel"
                  value={formData.parentMobile}
                  onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                  placeholder="+94 77 999 8888"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>

          {/* Section E: Counsellor & Additional Information (ADMIN ONLY - HIDDEN FROM STUDENTS PER PROMPT) */}
          {canEditAll && (
            <div className="space-y-3.5 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs sm:text-sm font-bold text-blue-950">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>E. Counsellor, Payment & Administrative Information</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  Admin Exclusive Access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {FIELD_DISPLAY_LABELS.Counsellor}
                  </label>
                  <input
                    type="text"
                    value={formData.Counsellor}
                    onChange={(e) => setFormData({ ...formData, Counsellor: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {FIELD_DISPLAY_LABELS.CounsellorsBranch}
                  </label>
                  <input
                    type="text"
                    value={formData.CounsellorsBranch}
                    onChange={(e) => setFormData({ ...formData, CounsellorsBranch: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {FIELD_DISPLAY_LABELS.PaymentPendingStatus}
                  </label>
                  <select
                    value={formData.PaymentPendingStatus}
                    onChange={(e) => setFormData({ ...formData, PaymentPendingStatus: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="Clear">Clear</option>
                    <option value="Pending 1st Installment">Pending 1st Installment</option>
                    <option value="Pending 2nd Installment">Pending 2nd Installment</option>
                    <option value="Pending 3rd Installment">Pending 3rd Installment</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {FIELD_DISPLAY_LABELS.paymentType}
                  </label>
                  <input
                    type="text"
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {FIELD_DISPLAY_LABELS.remark}
                  </label>
                  <input
                    type="text"
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section F: Technical IDs (ADMIN ONLY - HIDDEN FROM STUDENTS) */}
          {canEditAll && (
            <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Layers className="w-4 h-4 text-blue-900" />
                <span>F. Master Excel Internal Identifiers (Admin Only)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">id (Record ID)</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">leadId</label>
                  <input
                    type="text"
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">bundleCourseId</label>
                  <input
                    type="text"
                    value={formData.bundleCourseId}
                    onChange={(e) => setFormData({ ...formData, bundleCourseId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Modal Action Buttons Footer */}
        <div className="p-3 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInitialSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes Permanently</span>
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Save className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-center text-slate-900 mb-1.5">
                Confirm Registration Details Update
              </h3>
              <p className="text-xs text-slate-600 text-center leading-relaxed mb-5">
                Save modifications for <strong className="text-slate-800">{formData.StudentName}</strong> (<span className="font-mono text-red-600 font-bold">{formData.StudentNumber}</span>)? Changes will be permanently stored in the live BCAS database.
              </p>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleConfirmSave}
                  className="w-1/2 py-2.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirm & Save</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
