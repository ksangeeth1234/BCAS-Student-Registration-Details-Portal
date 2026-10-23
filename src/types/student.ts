export interface StudentRecord {
  // Exact 30 Master Excel columns
  id: string;
  leadId: string;
  Counsellor: string;
  StudentNumber: string;
  RegisteredDate: string;
  IntakeMonth: string;
  IntakeYear: string;
  StudentName: string;
  CounsellorsBranch: string;
  AcademicBranch: string;
  Course: string;
  PaymentPendingStatus: string;
  status: string;
  mode: string;
  courseType: string;
  mobile: string;
  email: string;
  batchName: string;
  address: string;
  nic: string;
  dob: string;
  citizenship: string;
  hasSpecialNeeds: string;
  specialNeedsReason: string;
  remark: string;
  parentName: string;
  parentMobile: string;
  qualifications: string;
  bundleCourseId: string;
  paymentType: string;

  // Metadata
  updatedAt?: string;
  lastUpdatedBy?: string;
}

export const MASTER_EXCEL_COLUMNS: (keyof StudentRecord)[] = [
  'id',
  'leadId',
  'Counsellor',
  'StudentNumber',
  'RegisteredDate',
  'IntakeMonth',
  'IntakeYear',
  'StudentName',
  'CounsellorsBranch',
  'AcademicBranch',
  'Course',
  'PaymentPendingStatus',
  'status',
  'mode',
  'courseType',
  'mobile',
  'email',
  'batchName',
  'address',
  'nic',
  'dob',
  'citizenship',
  'hasSpecialNeeds',
  'specialNeedsReason',
  'remark',
  'parentName',
  'parentMobile',
  'qualifications',
  'bundleCourseId',
  'paymentType'
];

export const FIELD_DISPLAY_LABELS: Record<keyof StudentRecord, string> = {
  id: 'Record ID',
  leadId: 'Lead ID',
  Counsellor: 'Counsellor',
  StudentNumber: 'Student Number',
  RegisteredDate: 'Registered Date',
  IntakeMonth: 'Intake Month',
  IntakeYear: 'Intake Year',
  StudentName: 'Student Name',
  CounsellorsBranch: "Counsellor's Branch",
  AcademicBranch: 'Academic Branch',
  Course: 'Course',
  PaymentPendingStatus: 'Payment Pending Status',
  status: 'Status',
  mode: 'Study Mode',
  courseType: 'Course Type',
  mobile: 'Mobile Number',
  email: 'Email Address',
  batchName: 'Batch Name',
  address: 'Address',
  nic: 'NIC / Passport No.',
  dob: 'Date of Birth',
  citizenship: 'Citizenship',
  hasSpecialNeeds: 'Has Special Needs',
  specialNeedsReason: 'Special Needs Details',
  remark: 'Remarks',
  parentName: 'Parent / Guardian Name',
  parentMobile: 'Parent / Guardian Mobile',
  qualifications: 'Prior Qualifications',
  bundleCourseId: 'Bundle Course ID',
  paymentType: 'Payment Scheme / Type',
  updatedAt: 'Last Updated',
  lastUpdatedBy: 'Last Updated By'
};

// Default permitted fields for student editing per requirement 7
export const DEFAULT_STUDENT_EDITABLE_FIELDS: (keyof StudentRecord)[] = [
  'mobile',
  'email',
  'address',
  'dob',
  'citizenship',
  'parentName',
  'parentMobile',
  'qualifications',
  'hasSpecialNeeds',
  'specialNeedsReason'
];

export interface AuditLogEntry {
  id?: string;
  studentNumber: string;
  studentName: string;
  editorEmail: string;
  editorType: 'student' | 'admin';
  timestamp: string;
  changedFields: Record<string, { from: string; to: string }>;
}

export interface WorkbookMeta {
  id?: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  totalRecords: number;
  activeSheet: string;
  sheetNames: string[];
}
