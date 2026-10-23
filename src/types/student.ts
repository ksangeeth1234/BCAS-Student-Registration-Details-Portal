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

// Permitted fields for student self-editing per strict institutional policy:
// A: StudentName only
// B: All contact fields (mobile, email, address)
// C: NIC / Passport No & Date of Birth (qualifications view only)
// D: Parent / Guardian fields (parentName, parentMobile)
// E: Counsellor / Admin info is completely hidden from students
export const DEFAULT_STUDENT_EDITABLE_FIELDS: (keyof StudentRecord)[] = [
  'StudentName',
  'mobile',
  'email',
  'address',
  'nic',
  'dob',
  'parentName',
  'parentMobile'
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
