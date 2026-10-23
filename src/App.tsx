/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, testConnection } from './firebase/config';
import { StudentRecord, WorkbookMeta, AuditLogEntry, DEFAULT_STUDENT_EDITABLE_FIELDS } from './types/student';
import {
  fetchAllStudents,
  updateStudentRecord,
  fetchActiveWorkbookMeta,
  fetchAuditLogs,
  fetchEditableFieldsConfig
} from './services/studentService';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StudentSearch } from './components/StudentSearch';
import { StudentProfile } from './components/StudentProfile';
import { StudentEditModal } from './components/StudentEditModal';
import { IdentityConfirmationModal } from './components/IdentityConfirmationModal';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CertificateNameModal } from './components/CertificateNameModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentTab, setCurrentTab] = useState<'search' | 'admin'>('search');

  // Password-protected Admin Session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('bcas_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isFullAdminEdit, setIsFullAdminEdit] = useState(false);
  const [showCertificateNameModal, setShowCertificateNameModal] = useState(false);

  // Database records and metadata
  const [allStudents, setAllStudents] = useState<StudentRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [activeWorkbook, setActiveWorkbook] = useState<WorkbookMeta | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [editableFields, setEditableFields] = useState<(keyof StudentRecord)[]>(DEFAULT_STUDENT_EDITABLE_FIELDS);

  // Student view flow
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [pendingVerificationStudent, setPendingVerificationStudent] = useState<StudentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Auth & Initial load
  useEffect(() => {
    // 1. Verify Firestore connectivity per guidelines
    testConnection();

    // 2. Auth state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // 3. Load initial student records & metadata
    loadInitialData();

    return () => unsubscribe();
  }, []);

  const loadInitialData = async () => {
    setIsLoadingRecords(true);
    try {
      const students = await fetchAllStudents(true);
      if (students && students.length > 0) {
        setAllStudents(students);
      }
    } catch (err) {
      console.warn('Initial student fetch error:', err);
    }

    try {
      const [wb, logs, fields] = await Promise.allSettled([
        fetchActiveWorkbookMeta(),
        fetchAuditLogs(),
        fetchEditableFieldsConfig()
      ]);

      if (wb.status === 'fulfilled' && wb.value) setActiveWorkbook(wb.value);
      if (logs.status === 'fulfilled' && logs.value) setAuditLogs(logs.value);
      if (fields.status === 'fulfilled' && fields.value) setEditableFields(fields.value);
    } catch (err) {
      console.warn('Initial metadata warning:', err);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleAdminLoginSuccess = (adminName: string) => {
    localStorage.setItem('bcas_admin_auth', 'true');
    setIsAdminLoggedIn(true);
    setCurrentTab('admin');
    showToast('success', `Welcome, ${adminName}! Full access to Admin Excel & student editing unlocked.`);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('bcas_admin_auth');
    setIsAdminLoggedIn(false);
    setCurrentTab('search');
    showToast('success', 'Logged out of administrator mode.');
  };

  const handleSelectStudent = (student: StudentRecord) => {
    setSelectedStudent(student);
    setShowCertificateNameModal(true);
  };

  const handleVerifiedStudent = () => {
    if (pendingVerificationStudent) {
      setSelectedStudent(pendingVerificationStudent);
      setPendingVerificationStudent(null);
      setShowCertificateNameModal(true);
    }
  };

  const handleSaveStudentDetails = async (updatedFields: Partial<StudentRecord>) => {
    if (!selectedStudent) return;
    setIsSavingChanges(true);

    try {
      const editorEmail = isAdminLoggedIn
        ? 'bcas_admin_user'
        : (currentUser?.email || 'student_self_verified');
      const editorType = (isAdminLoggedIn || currentUser) ? 'admin' : 'student';

      const updated = await updateStudentRecord(
        selectedStudent,
        updatedFields,
        editorEmail,
        editorType
      );

      // Update active profile
      setSelectedStudent(updated);

      // Refresh list & audit logs
      const updatedList = allStudents.map(s => 
        s.StudentNumber === updated.StudentNumber ? updated : s
      );
      setAllStudents(updatedList);

      const refreshedLogs = await fetchAuditLogs();
      setAuditLogs(refreshedLogs);

      showToast('success', 'Student details permanently saved and updated in the database!');
    } catch (err) {
      console.error('Error saving student updates:', err);
      showToast('error', 'Failed to save changes permanently. Please try again.');
      throw err;
    } finally {
      setIsSavingChanges(false);
    }
  };

  const isEffectiveAdmin = isAdminLoggedIn || Boolean(currentUser);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-red-600 selection:text-white">
      
      {/* 1. Animated Welcome Screen per Requirement 11 */}
      {showWelcome && (
        <WelcomeScreen onDismiss={() => setShowWelcome(false)} />
      )}

      {/* 2. Top Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={currentUser}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onResetSearch={() => {
          setSelectedStudent(null);
          setCurrentTab('search');
        }}
        totalRecordsCount={allStudents.length}
      />

      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-20 sm:top-24 right-3 sm:right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm sm:max-w-md">
          <div className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold border ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/20'
              : 'bg-red-900 text-white border-red-700 shadow-red-950/20'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
            )}
            <span className="leading-snug">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Loading Skeleton if records are loading */}
        {isLoadingRecords && allStudents.length === 0 ? (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs sm:text-sm font-semibold text-blue-950">
              Connecting to BCAS Master Database...
            </p>
          </div>
        ) : (
          <>
            {/* View 1: Student Search & Profile */}
            {currentTab === 'search' && (
              <>
                {!selectedStudent ? (
                  <StudentSearch
                    allRecords={allStudents}
                    onSelectStudent={handleSelectStudent}
                    isLoadingRecords={isLoadingRecords}
                  />
                ) : (
                  <StudentProfile
                    student={selectedStudent}
                    onBackToSearch={() => setSelectedStudent(null)}
                    onStartEdit={(fullAdmin) => {
                      setIsFullAdminEdit(Boolean(fullAdmin));
                      setIsEditModalOpen(true);
                    }}
                    isSaving={isSavingChanges}
                    isAdmin={isEffectiveAdmin}
                    onPromptAdminLogin={() => setIsAdminLoginOpen(true)}
                  />
                )}
              </>
            )}

            {/* View 2: Master Excel Administration Portal */}
            {currentTab === 'admin' && (
              <AdminPortal
                allRecords={allStudents}
                activeWorkbook={activeWorkbook}
                auditLogs={auditLogs}
                editableFields={editableFields}
                onRefreshData={loadInitialData}
                onUpdateEditableFields={(fields) => setEditableFields(fields)}
                adminEmail={currentUser?.email || 'bcas_admin'}
                onSelectStudentRecord={(student) => {
                  handleSelectStudent(student);
                  setCurrentTab('search');
                }}
                onAdminLogout={handleAdminLogout}
              />
            )}
          </>
        )}

      </main>

      {/* Modals */}
      
      {/* 1. Award Certificate Name Confirmation Modal (pops up first when opening student record) */}
      {selectedStudent && showCertificateNameModal && (
        <CertificateNameModal
          student={selectedStudent}
          isOpen={showCertificateNameModal}
          onClose={() => setShowCertificateNameModal(false)}
          onConfirmCorrect={() => setShowCertificateNameModal(false)}
          onStartNameEdit={() => {
            setShowCertificateNameModal(false);
            setIsFullAdminEdit(true);
            setIsEditModalOpen(true);
          }}
        />
      )}

      {/* 2. Identity Confirmation Modal for student privacy (if triggered) */}
      {pendingVerificationStudent && (
        <IdentityConfirmationModal
          student={pendingVerificationStudent}
          isOpen={Boolean(pendingVerificationStudent)}
          onClose={() => setPendingVerificationStudent(null)}
          onVerified={handleVerifiedStudent}
          isStaff={isEffectiveAdmin}
        />
      )}

      {/* B. Student Edit Modal (Supports full 30 fields edit) */}
      {selectedStudent && isEditModalOpen && (
        <StudentEditModal
          student={selectedStudent}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setIsFullAdminEdit(false);
          }}
          onSave={handleSaveStudentDetails}
          editableFieldKeys={editableFields}
          isAdmin={isEffectiveAdmin || isFullAdminEdit}
          isFullAdminEdit={isFullAdminEdit}
        />
      )}

      {/* C. Admin Password Authentication Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* 3. Footer with "Developed by PicoZen" */}
      <Footer />

    </div>
  );
}
