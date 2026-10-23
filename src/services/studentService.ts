import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import {
  StudentRecord,
  MASTER_EXCEL_COLUMNS,
  DEFAULT_STUDENT_EDITABLE_FIELDS,
  AuditLogEntry,
  WorkbookMeta
} from '../types/student';

const STUDENTS_COLLECTION = 'students';
const AUDIT_COLLECTION = 'auditLogs';
const WORKBOOKS_COLLECTION = 'workbooks';
const SETTINGS_COLLECTION = 'settings';

// Realistic sample records for BCAS Campus initial seeding if empty
export const SAMPLE_BCAS_RECORDS: StudentRecord[] = [
  {
    id: "BCAS-REC-1001",
    leadId: "LEAD-2024-901",
    Counsellor: "Dilini Senanayake",
    StudentNumber: "BCAS/COL/2024/0014",
    RegisteredDate: "2024-01-15",
    IntakeMonth: "February",
    IntakeYear: "2024",
    StudentName: "Mohamed Rilwan",
    CounsellorsBranch: "Colombo City Campus",
    AcademicBranch: "Colombo City Campus",
    Course: "BSc (Hons) in Software Engineering",
    PaymentPendingStatus: "Clear",
    status: "Active",
    mode: "Full Time",
    courseType: "Undergraduate Degree",
    mobile: "+94 77 123 4567",
    email: "m.rilwan@student.bcas.lk",
    batchName: "BSc-SE-2024-B1",
    address: "No. 45/2, Galle Road, Dehiwala, Colombo",
    nic: "200112403982",
    dob: "2001-05-18",
    citizenship: "Sri Lankan",
    hasSpecialNeeds: "No",
    specialNeedsReason: "",
    remark: "Submitted Advanced Level transcripts. Eligible for merit discount.",
    parentName: "Abdul Cader",
    parentMobile: "+94 71 889 9001",
    qualifications: "GCE Advanced Level (Physical Science) 2B 1C",
    bundleCourseId: "BC-IT-01",
    paymentType: "Semester Installments"
  },
  {
    id: "BCAS-REC-1002",
    leadId: "LEAD-2024-902",
    Counsellor: "Rukshan Fernando",
    StudentNumber: "BCAS/KND/2024/0052",
    RegisteredDate: "2024-02-01",
    IntakeMonth: "February",
    IntakeYear: "2024",
    StudentName: "Sanduni Madushani Jayawardena",
    CounsellorsBranch: "Kandy Campus",
    AcademicBranch: "Kandy Campus",
    Course: "Pearson BTEC HND in Biomedical Science",
    PaymentPendingStatus: "Pending 2nd Installment",
    status: "Active",
    mode: "Full Time",
    courseType: "Higher National Diploma",
    mobile: "+94 76 991 2234",
    email: "sanduni.j@student.bcas.lk",
    batchName: "HND-BIO-2024-B1",
    address: "12/A, Peradeniya Road, Kandy",
    nic: "200259801123",
    dob: "2002-11-24",
    citizenship: "Sri Lankan",
    hasSpecialNeeds: "No",
    specialNeedsReason: "",
    remark: "Requested lab schedule preference for weekday mornings.",
    parentName: "Nimal Jayawardena",
    parentMobile: "+94 77 443 2190",
    qualifications: "GCE Advanced Level (Bio Science) 3C passes",
    bundleCourseId: "BC-BIO-02",
    paymentType: "Installments"
  },
  {
    id: "BCAS-REC-1003",
    leadId: "LEAD-2024-903",
    Counsellor: "Kavinda Wickramasinghe",
    StudentNumber: "BCAS/COL/2024/0118",
    RegisteredDate: "2024-03-10",
    IntakeMonth: "March",
    IntakeYear: "2024",
    StudentName: "Kavindu Lakshitha Perera",
    CounsellorsBranch: "Colombo City Campus",
    AcademicBranch: "Colombo City Campus",
    Course: "BSc (Hons) in Cyber Security & Digital Forensics",
    PaymentPendingStatus: "Clear",
    status: "Active",
    mode: "Part Time / Weekend",
    courseType: "Undergraduate Degree",
    mobile: "+94 70 334 5566",
    email: "kavindu.perera@gmail.com",
    batchName: "BSc-CYB-2024-W1",
    address: "78, Templers Road, Mount Lavinia",
    nic: "199923801290",
    dob: "1999-08-14",
    citizenship: "Sri Lankan",
    hasSpecialNeeds: "No",
    specialNeedsReason: "",
    remark: "Working professional in IT networking.",
    parentName: "Sunil Perera",
    parentMobile: "+94 71 223 9988",
    qualifications: "Diploma in Information Technology, Pearson BTEC Level 5",
    bundleCourseId: "BC-CYB-01",
    paymentType: "Full Payment upfront"
  },
  {
    id: "BCAS-REC-1004",
    leadId: "LEAD-2024-904",
    Counsellor: "Fatima Zahra",
    StudentNumber: "BCAS/JAF/2024/0029",
    RegisteredDate: "2024-02-14",
    IntakeMonth: "March",
    IntakeYear: "2024",
    StudentName: "Thivanka Sivakumar",
    CounsellorsBranch: "Jaffna Campus",
    AcademicBranch: "Jaffna Campus",
    Course: "LLB (Hons) Law Programme",
    PaymentPendingStatus: "Clear",
    status: "Active",
    mode: "Full Time",
    courseType: "Law Degree",
    mobile: "+94 77 882 1199",
    email: "thivanka.siva@outlook.com",
    batchName: "LLB-2024-B1",
    address: "24, Hospital Road, Jaffna",
    nic: "200067809923",
    dob: "2000-03-29",
    citizenship: "Sri Lankan",
    hasSpecialNeeds: "Yes",
    specialNeedsReason: "Wheelchair ramp access required for second-floor lecture theatre",
    remark: "Notified administration regarding ground-floor lecture arrangements.",
    parentName: "K. Sivakumar",
    parentMobile: "+94 77 554 1122",
    qualifications: "GCE A/L Commerce 1A 2B",
    bundleCourseId: "BC-LAW-01",
    paymentType: "Annual Installments"
  },
  {
    id: "BCAS-REC-1005",
    leadId: "LEAD-2024-905",
    Counsellor: "Dilini Senanayake",
    StudentNumber: "BCAS/COL/2024/0205",
    RegisteredDate: "2024-04-02",
    IntakeMonth: "April",
    IntakeYear: "2024",
    StudentName: "Mohamed Rilwan",
    CounsellorsBranch: "Colombo City Campus",
    AcademicBranch: "Colombo City Campus",
    Course: "Pearson BTEC HND in Business Management",
    PaymentPendingStatus: "Clear",
    status: "Active",
    mode: "Part Time / Weekend",
    courseType: "Higher National Diploma",
    mobile: "+94 72 445 6789",
    email: "rilwan.biz@gmail.com",
    batchName: "HND-BM-2024-W1",
    address: "99/4, Moor Street, Colombo 12",
    nic: "199814502211",
    dob: "1998-07-22",
    citizenship: "Sri Lankan",
    hasSpecialNeeds: "No",
    specialNeedsReason: "",
    remark: "Different student from SE Mohamed Rilwan. Enrolled in Business HND.",
    parentName: "Farook Mohamed",
    parentMobile: "+94 77 334 1100",
    qualifications: "GCE A/L Commerce & Certificate in Digital Marketing",
    bundleCourseId: "BC-BM-01",
    paymentType: "Monthly Installments"
  },
  {
    id: "BCAS-REC-1006",
    leadId: "LEAD-2024-906",
    Counsellor: "Ashan Senaratne",
    StudentNumber: "BCAS/KLM/2024/0088",
    RegisteredDate: "2024-05-11",
    IntakeMonth: "June",
    IntakeYear: "2024",
    StudentName: "Ayesha Fathima Farvin",
    CounsellorsBranch: "Kalmunai Campus",
    AcademicBranch: "Kalmunai Campus",
    Course: "BSc (Hons) Nursing & Healthcare Management",
    PaymentPendingStatus: "Clear",
    status: "Active",
    mode: "Full Time",
    courseType: "Healthcare Degree",
    mobile: "+94 76 550 4321",
    email: "ayesha.farvin@yahoo.com",
    batchName: "BSc-NUR-2024-B1",
    address: "Main Street, Sainthamaruthu, Kalmunai",
    nic: "200277804412",
    dob: "2002-09-12",
    citizenship: "Sri Lankan",
    hasSpecialNeeds: "No",
    specialNeedsReason: "",
    remark: "Clinical practice hospital placement confirmed with Teaching Hospital Batticaloa.",
    parentName: "M.H. Farvin",
    parentMobile: "+94 77 662 3311",
    qualifications: "GCE Advanced Level Bio Science 2B 1C",
    bundleCourseId: "BC-HEA-01",
    paymentType: "Semester Installments"
  }
];

// In-memory cache for fast search across loaded workbook records
let cachedRecords: StudentRecord[] = [];
let isCacheLoaded = false;

export async function fetchAllStudents(forceRefresh = false): Promise<StudentRecord[]> {
  if (isCacheLoaded && !forceRefresh && cachedRecords.length > 0) {
    return cachedRecords;
  }

  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(studentsRef);

    if (snapshot.empty) {
      // Seed with initial realistic records if database has no records yet
      console.log('No student records found in Firestore. Seeding default BCAS records...');
      for (const rec of SAMPLE_BCAS_RECORDS) {
        try {
          const docRef = doc(db, STUDENTS_COLLECTION, rec.StudentNumber.replace(/[\/\\]/g, '_'));
          await setDoc(docRef, {
            ...rec,
            updatedAt: new Date().toISOString(),
            lastUpdatedBy: 'system_init'
          });
        } catch (seedErr) {
          console.warn('Seeding note:', seedErr);
        }
      }
      cachedRecords = [...SAMPLE_BCAS_RECORDS];
      isCacheLoaded = true;
      return cachedRecords;
    }

    const records: StudentRecord[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as StudentRecord;
      records.push(data);
    });

    cachedRecords = records;
    isCacheLoaded = true;
    return cachedRecords;
  } catch (error) {
    console.error('Failed to fetch from Firestore, falling back to local memory:', error);
    if (cachedRecords.length === 0) {
      cachedRecords = [...SAMPLE_BCAS_RECORDS];
      isCacheLoaded = true;
    }
    return cachedRecords;
  }
}

// Normalize strings for searching: trims, collapses repeated whitespace, lowercases
export function normalizeSearchTerm(term: string): string {
  return term.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function searchStudentsInMemory(records: StudentRecord[], queryStr: string): StudentRecord[] {
  const normalized = normalizeSearchTerm(queryStr);
  if (!normalized) return [];

  return records.filter(record => {
    const nameMatch = normalizeSearchTerm(record.StudentName || '').includes(normalized);
    const numberMatch = normalizeSearchTerm(record.StudentNumber || '').includes(normalized);
    return nameMatch || numberMatch;
  });
}

// Update permitted student details permanently in Firestore
export async function updateStudentRecord(
  originalRecord: StudentRecord,
  updates: Partial<StudentRecord>,
  editorEmail: string = 'student_self',
  editorType: 'student' | 'admin' = 'student'
): Promise<StudentRecord> {
  const docId = originalRecord.StudentNumber.replace(/[\/\\]/g, '_');
  const studentDocRef = doc(db, STUDENTS_COLLECTION, docId);

  // Compute changed fields for audit log
  const changedFields: Record<string, { from: string; to: string }> = {};
  for (const key of Object.keys(updates) as (keyof StudentRecord)[]) {
    const oldVal = String(originalRecord[key] ?? '');
    const newVal = String(updates[key] ?? '');
    if (oldVal !== newVal) {
      changedFields[key] = { from: oldVal, to: newVal };
    }
  }

  const updatedRecord: StudentRecord = {
    ...originalRecord,
    ...updates,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: editorEmail
  };

  try {
    await updateDoc(studentDocRef, {
      ...updates,
      updatedAt: updatedRecord.updatedAt,
      lastUpdatedBy: updatedRecord.lastUpdatedBy
    });
  } catch (error) {
    // If updateDoc fails (e.g., doc didn't exist with exact ID), try setDoc
    try {
      await setDoc(studentDocRef, updatedRecord, { merge: true });
    } catch (setErr) {
      handleFirestoreError(setErr, OperationType.UPDATE, `${STUDENTS_COLLECTION}/${docId}`);
    }
  }

  // Update in-memory cache
  const idx = cachedRecords.findIndex(r => r.StudentNumber === originalRecord.StudentNumber);
  if (idx !== -1) {
    cachedRecords[idx] = updatedRecord;
  } else {
    cachedRecords.push(updatedRecord);
  }

  // Write audit trail entry
  if (Object.keys(changedFields).length > 0) {
    try {
      const auditRef = collection(db, AUDIT_COLLECTION);
      await addDoc(auditRef, {
        studentNumber: originalRecord.StudentNumber,
        studentName: originalRecord.StudentName,
        editorEmail,
        editorType,
        timestamp: new Date().toISOString(),
        changedFields: JSON.stringify(changedFields)
      });
    } catch (auditErr) {
      console.warn('Could not save audit log to Firestore:', auditErr);
    }
  }

  return updatedRecord;
}

// Read and parse an Excel workbook (.xlsx / .xls) with multiple worksheets
export async function parseExcelWorkbook(
  file: File
): Promise<{ sheetNames: string[]; sheetsData: Record<string, StudentRecord[]> }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        const sheetsData: Record<string, StudentRecord[]> = {};

        sheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          const records: StudentRecord[] = [];

          rawRows.forEach((row, index) => {
            // Filter out completely blank rows
            const hasAnyData = Object.values(row).some(v => String(v ?? '').trim().length > 0);
            if (!hasAnyData) return;

            // Flexible helper to match column names even if casing or spaces vary
            const getVal = (exactKey: string, ...aliases: string[]): string => {
              if (row[exactKey] !== undefined && row[exactKey] !== null) return String(row[exactKey]).trim();
              for (const a of aliases) {
                if (row[a] !== undefined && row[a] !== null) return String(row[a]).trim();
              }
              const clean = (s: string) => s.toLowerCase().replace(/[\s_\-\.\/]/g, '');
              const target = clean(exactKey);
              for (const [k, v] of Object.entries(row)) {
                if (clean(k) === target && v !== undefined && v !== null) {
                  return String(v).trim();
                }
              }
              return '';
            };

            // Map each column strictly preserving the 30 Master Excel column names
            const studentRecord: StudentRecord = {
              id: getVal('id', 'ID', 'RecID', 'RecordID') || `REC-${index + 1}`,
              leadId: getVal('leadId', 'LeadId', 'Lead_Id', 'lead_id'),
              Counsellor: getVal('Counsellor', 'counsellor', 'Counselor'),
              StudentNumber: getVal('StudentNumber', 'studentNumber', 'Student Number', 'student_number', 'StudentNo', 'Student_ID'),
              RegisteredDate: getVal('RegisteredDate', 'registeredDate', 'Registered Date', 'RegDate'),
              IntakeMonth: getVal('IntakeMonth', 'intakeMonth', 'Intake Month', 'Month'),
              IntakeYear: getVal('IntakeYear', 'intakeYear', 'Intake Year', 'Year'),
              StudentName: getVal('StudentName', 'studentName', 'Student Name', 'student_name', 'Name', 'FullName'),
              CounsellorsBranch: getVal('CounsellorsBranch', 'counsellorsBranch', "Counsellor's Branch", 'CounsellorBranch'),
              AcademicBranch: getVal('AcademicBranch', 'academicBranch', 'Academic Branch', 'Branch', 'Campus'),
              Course: getVal('Course', 'course', 'CourseName', 'Programme'),
              PaymentPendingStatus: getVal('PaymentPendingStatus', 'paymentPendingStatus', 'Payment Pending Status', 'PaymentStatus') || 'Clear',
              status: getVal('status', 'Status', 'EnrollmentStatus') || 'Active',
              mode: getVal('mode', 'Mode', 'StudyMode') || 'Full Time',
              courseType: getVal('courseType', 'CourseType', 'Course Type'),
              mobile: getVal('mobile', 'Mobile', 'MobileNumber', 'Phone', 'Contact'),
              email: getVal('email', 'Email', 'EmailAddress'),
              batchName: getVal('batchName', 'BatchName', 'Batch Name', 'Batch'),
              address: getVal('address', 'Address', 'PermanentAddress'),
              nic: getVal('nic', 'NIC', 'NICNumber', 'Passport', 'IDNumber'),
              dob: getVal('dob', 'DOB', 'DateOfBirth', 'BirthDate'),
              citizenship: getVal('citizenship', 'Citizenship', 'Nationality') || 'Sri Lankan',
              hasSpecialNeeds: getVal('hasSpecialNeeds', 'HasSpecialNeeds', 'SpecialNeeds') || 'No',
              specialNeedsReason: getVal('specialNeedsReason', 'SpecialNeedsReason', 'Special Needs Reason'),
              remark: getVal('remark', 'Remark', 'Remarks', 'Notes'),
              parentName: getVal('parentName', 'ParentName', 'Parent Name', 'GuardianName'),
              parentMobile: getVal('parentMobile', 'ParentMobile', 'Parent Mobile', 'GuardianMobile'),
              qualifications: getVal('qualifications', 'Qualifications', 'PriorQualifications'),
              bundleCourseId: getVal('bundleCourseId', 'BundleCourseId', 'Bundle Course ID'),
              paymentType: getVal('paymentType', 'PaymentType', 'Payment Type', 'PaymentScheme')
            };

            // Only push if it has at least a name or student number
            if (studentRecord.StudentName || studentRecord.StudentNumber) {
              records.push(studentRecord);
            }
          });

          sheetsData[sheetName] = records;
        });

        resolve({ sheetNames, sheetsData });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Bulk import Master Excel records to Firestore
export async function importRecordsToDatabase(
  records: StudentRecord[],
  workbookMeta: WorkbookMeta,
  replaceExisting: boolean = true,
  onProgress?: (processed: number, total: number) => void
): Promise<{ importedCount: number; duplicatesDetected: number }> {
  let importedCount = 0;
  let duplicatesDetected = 0;
  const seenStudentNumbers = new Set<string>();

  // Filter internal duplicates in uploaded file
  const uniqueRecords: StudentRecord[] = [];
  for (const rec of records) {
    const key = rec.StudentNumber.trim().toUpperCase();
    if (seenStudentNumbers.has(key)) {
      duplicatesDetected++;
    } else {
      seenStudentNumbers.add(key);
      uniqueRecords.push(rec);
    }
  }

  const total = uniqueRecords.length;

  for (let i = 0; i < uniqueRecords.length; i++) {
    const rec = uniqueRecords[i];
    const cleanNum = String(rec.StudentNumber || '').trim();
    const docId = cleanNum ? cleanNum.replace(/[\/\\]/g, '_') : `REC_${i + 1}`;
    const docRef = doc(db, STUDENTS_COLLECTION, docId);

    try {
      await setDoc(docRef, {
        ...rec,
        StudentNumber: cleanNum || rec.StudentNumber,
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: workbookMeta.uploadedBy || 'admin_excel_import'
      });
      importedCount++;
    } catch (e) {
      console.error(`Failed to import record ${rec.StudentNumber}:`, e);
    }

    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  // Update workbook meta
  try {
    const wbRef = doc(db, WORKBOOKS_COLLECTION, 'current_workbook');
    await setDoc(wbRef, {
      ...workbookMeta,
      totalRecords: importedCount,
      uploadedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Could not save workbook metadata:', err);
  }

  // Invalidate and reload cache
  await fetchAllStudents(true);

  return { importedCount, duplicatesDetected };
}

// Export current student data back to Excel (.xlsx) with all 30 exact columns
export function exportStudentsToExcel(records: StudentRecord[], filename: string = 'BCAS_Master_Student_Database.xlsx') {
  const exportRows = records.map(record => {
    const row: Record<string, string> = {};
    for (const col of MASTER_EXCEL_COLUMNS) {
      row[col] = String(record[col] ?? '');
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: MASTER_EXCEL_COLUMNS as string[] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Student Database');

  XLSX.writeFile(workbook, filename);
}

// Fetch recent audit logs for administrators
export async function fetchAuditLogs(limitCount: number = 30): Promise<AuditLogEntry[]> {
  try {
    const auditRef = collection(db, AUDIT_COLLECTION);
    const q = query(auditRef, limit(limitCount));
    const snapshot = await getDocs(q);
    const logs: AuditLogEntry[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        studentNumber: data.studentNumber || '',
        studentName: data.studentName || '',
        editorEmail: data.editorEmail || '',
        editorType: data.editorType || 'student',
        timestamp: data.timestamp || '',
        changedFields: typeof data.changedFields === 'string' ? JSON.parse(data.changedFields) : (data.changedFields || {})
      });
    });
    // Sort latest first
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  } catch (error) {
    console.warn('Could not fetch audit logs:', error);
    return [];
  }
}

// Fetch active workbook metadata
export async function fetchActiveWorkbookMeta(): Promise<WorkbookMeta | null> {
  try {
    const wbRef = collection(db, WORKBOOKS_COLLECTION);
    const snapshot = await getDocs(wbRef);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as WorkbookMeta;
      return data;
    }
  } catch (error) {
    console.warn('Could not fetch workbook meta:', error);
  }
  return {
    fileName: 'BCAS_Master_Excel_2024.xlsx',
    fileSize: '480 KB',
    uploadedAt: 'Active Live Database',
    uploadedBy: 'System Administrator',
    totalRecords: cachedRecords.length || SAMPLE_BCAS_RECORDS.length,
    activeSheet: 'All_Campuses_Students',
    sheetNames: ['All_Campuses_Students', 'Colombo_Campus', 'Kandy_Campus']
  };
}

// Fetch editable fields settings
export async function fetchEditableFieldsConfig(): Promise<(keyof StudentRecord)[]> {
  try {
    const setRef = collection(db, SETTINGS_COLLECTION);
    const snapshot = await getDocs(setRef);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      if (data.editableFields) {
        return JSON.parse(data.editableFields);
      }
    }
  } catch (err) {
    console.warn('Using default editable fields config:', err);
  }
  return DEFAULT_STUDENT_EDITABLE_FIELDS;
}

// Update editable fields settings
export async function saveEditableFieldsConfig(fields: (keyof StudentRecord)[], adminEmail: string) {
  try {
    const setRef = doc(db, SETTINGS_COLLECTION, 'student_permissions');
    await setDoc(setRef, {
      editableFields: JSON.stringify(fields),
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail
    });
  } catch (err) {
    console.warn('Could not persist field permissions to Firestore:', err);
  }
}
