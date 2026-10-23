import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Database,
  Layers,
  History,
  Shield,
  Search,
  RefreshCw,
  Eye,
  FileCheck,
  Check,
  Filter
} from 'lucide-react';
import {
  StudentRecord,
  MASTER_EXCEL_COLUMNS,
  FIELD_DISPLAY_LABELS,
  DEFAULT_STUDENT_EDITABLE_FIELDS,
  WorkbookMeta,
  AuditLogEntry
} from '../types/student';
import {
  parseExcelWorkbook,
  importRecordsToDatabase,
  exportStudentsToExcel,
  saveEditableFieldsConfig
} from '../services/studentService';

interface AdminPortalProps {
  allRecords: StudentRecord[];
  activeWorkbook: WorkbookMeta | null;
  auditLogs: AuditLogEntry[];
  editableFields: (keyof StudentRecord)[];
  onRefreshData: () => Promise<void>;
  onUpdateEditableFields: (fields: (keyof StudentRecord)[]) => void;
  adminEmail: string;
  onSelectStudentRecord?: (student: StudentRecord) => void;
  onAdminLogout?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  allRecords,
  activeWorkbook,
  auditLogs,
  editableFields,
  onRefreshData,
  onUpdateEditableFields,
  adminEmail,
  onSelectStudentRecord,
  onAdminLogout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'import' | 'records' | 'permissions' | 'audit'>('records');

  // Excel upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsedWorkbook, setParsedWorkbook] = useState<{
    file: File;
    sheetNames: string[];
    sheetsData: Record<string, StudentRecord[]>;
  } | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);
  const [importResult, setImportResult] = useState<{ imported: number; duplicates: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Records preview table filters
  const [previewFilter, setPreviewFilter] = useState('');
  const [previewBranch, setPreviewBranch] = useState('all');
  const [previewPage, setPreviewPage] = useState(1);
  const pageSize = 12;

  // Permissions state
  const [selectedEditableFields, setSelectedEditableFields] = useState<(keyof StudentRecord)[]>(editableFields);
  const [permissionsSavedNotice, setPermissionsSavedNotice] = useState(false);

  // File drop handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setImportResult(null);
    setIsParsingFile(true);

    try {
      const { sheetNames, sheetsData } = await parseExcelWorkbook(file);
      setParsedWorkbook({
        file,
        sheetNames,
        sheetsData
      });
      setSelectedSheet(sheetNames[0] || '');
    } catch (err) {
      console.error('Excel parse error:', err);
      setUploadError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!parsedWorkbook || !selectedSheet) return;

    const sheetRecords = parsedWorkbook.sheetsData[selectedSheet] || [];
    if (sheetRecords.length === 0) {
      setUploadError('The selected worksheet contains no valid student records.');
      return;
    }

    setImportProgress({ current: 0, total: sheetRecords.length });

    const meta: WorkbookMeta = {
      fileName: parsedWorkbook.file.name,
      fileSize: `${Math.round(parsedWorkbook.file.size / 1024)} KB`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: adminEmail || 'Admin Staff',
      totalRecords: sheetRecords.length,
      activeSheet: selectedSheet,
      sheetNames: parsedWorkbook.sheetNames
    };

    try {
      const result = await importRecordsToDatabase(
        sheetRecords,
        meta,
        true,
        (current, total) => setImportProgress({ current, total })
      );

      setImportResult({
        imported: result.importedCount,
        duplicates: result.duplicatesDetected
      });
      await onRefreshData();
    } catch (err) {
      console.error('Import error:', err);
      setUploadError('Failed to import records to Firestore database.');
    } finally {
      setImportProgress(null);
    }
  };

  const handleExportLiveExcel = () => {
    const filename = `BCAS_Master_Database_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportStudentsToExcel(allRecords, filename);
  };

  const handleSavePermissions = async () => {
    await saveEditableFieldsConfig(selectedEditableFields, adminEmail);
    onUpdateEditableFields(selectedEditableFields);
    setPermissionsSavedNotice(true);
    setTimeout(() => setPermissionsSavedNotice(false), 3000);
  };

  const toggleFieldPermission = (field: keyof StudentRecord) => {
    // Prohibit editing StudentNumber or record ID
    if (field === 'StudentNumber' || field === 'id' || field === 'leadId') return;

    if (selectedEditableFields.includes(field)) {
      setSelectedEditableFields(selectedEditableFields.filter(f => f !== field));
    } else {
      setSelectedEditableFields([...selectedEditableFields, field]);
    }
  };

  // Filtered records for inspection
  const filteredRecords = allRecords.filter(r => {
    const matchSearch = previewFilter
      ? (r.StudentName + ' ' + r.StudentNumber + ' ' + r.Course).toLowerCase().includes(previewFilter.toLowerCase())
      : true;
    const matchBranch = previewBranch === 'all' || r.AcademicBranch === previewBranch;
    return matchSearch && matchBranch;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const pagedRecords = filteredRecords.slice((previewPage - 1) * pageSize, previewPage * pageSize);

  const uniqueBranches = Array.from(new Set(allRecords.map(r => r.AcademicBranch).filter(Boolean)));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-1">
            <Database className="w-4 h-4" />
            <span>Master Excel Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            BCAS Database Management & Workbooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Import, replace, or export Master Excel records and manage student-editable permissions.
          </p>
        </div>

        {/* Action: Export live Excel button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportLiveExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all active:scale-98 cursor-pointer"
            title="Download current live database as Excel spreadsheet"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Currently Loaded Workbook Status Card per Requirement 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-950 border border-blue-100 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Currently Active Master Database</div>
            <div className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{activeWorkbook?.fileName || 'BCAS_Master_Excel_2024.xlsx'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Worksheet: <span className="font-semibold text-blue-950">{activeWorkbook?.activeSheet || 'Primary Sheet'}</span> • Loaded records: <span className="font-bold text-red-600">{allRecords.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefreshData()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-900" />
            <span>Sync Firestore</span>
          </button>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('import')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'import'
              ? 'border-red-600 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Master Excel</span>
        </button>

        <button
          onClick={() => setActiveSubTab('records')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'records'
              ? 'border-red-600 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Browse All Records ({allRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'permissions'
              ? 'border-red-600 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Field Permissions</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'audit'
              ? 'border-red-600 text-blue-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Subtab 1: Master Excel Upload & Replacement */}
      {activeSubTab === 'import' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Upload or Replace Master Excel Workbook
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Select an .xlsx or .xls file containing BCAS student records. The system preserves all 30 column structures, allows worksheet selection, filters duplicates, and updates persistent storage.
            </p>

            {/* Drag and Drop / Click File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-50/50 hover:bg-red-50/20 transition-all duration-200 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Choose Excel Workbook or Drag & Drop here
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Supports Microsoft Excel files (.xlsx, .xls) with multiple worksheets
              </p>
              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Browse Files
              </button>
            </div>

            {isParsingFile && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-blue-950 text-xs border border-blue-100">
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>Reading worksheets and parsing columns...</span>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Workbook Parsed: Worksheet Selector & Preview */}
            {parsedWorkbook && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500">Selected File</div>
                    <div className="font-bold text-slate-900 text-sm">{parsedWorkbook.file.name}</div>
                  </div>

                  {/* Worksheet selection dropdown per Requirement 3 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                      Select Worksheet:
                    </label>
                    <select
                      value={selectedSheet}
                      onChange={(e) => setSelectedSheet(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      {parsedWorkbook.sheetNames.map((sheet) => (
                        <option key={sheet} value={sheet}>
                          {sheet} ({(parsedWorkbook.sheetsData[sheet] || []).length} rows)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live parsed rows sample preview */}
                {parsedWorkbook.sheetsData[selectedSheet] && parsedWorkbook.sheetsData[selectedSheet].length > 0 && (
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                      <span>Previewing first {Math.min(5, parsedWorkbook.sheetsData[selectedSheet].length)} rows of {parsedWorkbook.sheetsData[selectedSheet].length} records from sheet "{selectedSheet}":</span>
                      <span className="text-[11px] text-blue-950 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Ready to import</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3">Student Number</th>
                            <th className="py-2 px-3">Student Name</th>
                            <th className="py-2 px-3">Course</th>
                            <th className="py-2 px-3">Branch</th>
                            <th className="py-2 px-3">Intake</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedWorkbook.sheetsData[selectedSheet].slice(0, 5).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono font-bold text-red-700">{row.StudentNumber || '—'}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900">{row.StudentName || '—'}</td>
                              <td className="py-2 px-3 text-slate-600 max-w-xs truncate">{row.Course || '—'}</td>
                              <td className="py-2 px-3 text-slate-600">{row.AcademicBranch || '—'}</td>
                              <td className="py-2 px-3 text-slate-600">{row.IntakeMonth} {row.IntakeYear}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sheet preview summary & Import CTA */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Detected <strong className="text-blue-950 font-bold">{(parsedWorkbook.sheetsData[selectedSheet] || []).length}</strong> student records ready to store in Firestore database.
                    </span>
                  </div>

                  <button
                    onClick={handleExecuteImport}
                    disabled={Boolean(importProgress) || (parsedWorkbook.sheetsData[selectedSheet] || []).length === 0}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/25 disabled:opacity-50 transition-all active:scale-98 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import {(parsedWorkbook.sheetsData[selectedSheet] || []).length} Records into Live Database</span>
                  </button>
                </div>

                {/* Progress bar per Requirement 11 */}
                {importProgress && (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-blue-950">
                      <span>Importing records to persistent storage...</span>
                      <span>{importProgress.current} / {importProgress.total}</span>
                    </div>
                    <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full transition-all duration-150"
                        style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Import Result Notification */}
                {importResult && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Import Successful!</p>
                      <p className="mt-0.5">
                        Successfully stored <strong>{importResult.imported}</strong> student records into the persistent Firestore database.
                        {importResult.duplicates > 0 && ` (${importResult.duplicates} duplicate rows were filtered automatically).`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Subtab 2: Records Preview & Search Table */}
      {activeSubTab === 'records' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Loaded Student Database ({filteredRecords.length} records)
              </h2>
              <p className="text-xs text-slate-500">
                Direct view of the 30 Master Excel columns currently persisted in the central database.
              </p>
            </div>

            {/* Quick search and branch filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by name, number, course..."
                  value={previewFilter}
                  onChange={(e) => { setPreviewFilter(e.target.value); setPreviewPage(1); }}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 w-56 font-medium text-slate-900"
                />
              </div>

              <select
                value={previewBranch}
                onChange={(e) => { setPreviewBranch(e.target.value); setPreviewPage(1); }}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-slate-900"
              >
                <option value="all">All Branches</option>
                {uniqueBranches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Student Number</th>
                  <th className="py-3 px-3.5">Student Name</th>
                  <th className="py-3 px-3.5">Academic Branch</th>
                  <th className="py-3 px-3.5">Course</th>
                  <th className="py-3 px-3.5">Intake</th>
                  <th className="py-3 px-3.5">Mobile</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Payment</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedRecords.length > 0 ? (
                  pagedRecords.map((rec, i) => (
                    <tr key={`${rec.StudentNumber}-${i}`} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-red-600 whitespace-nowrap">
                        {rec.StudentNumber}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {rec.StudentName}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {rec.AcademicBranch}
                      </td>
                      <td className="py-3 px-3.5 text-slate-800 max-w-xs truncate" title={rec.Course}>
                        {rec.Course}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {rec.IntakeMonth} {rec.IntakeYear}
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {rec.mobile}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {rec.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          rec.PaymentPendingStatus === 'Clear' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {rec.PaymentPendingStatus || 'Clear'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => onSelectStudentRecord?.(rec)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No student records match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing {filteredRecords.length === 0 ? 0 : (previewPage - 1) * pageSize + 1} to {Math.min(previewPage * pageSize, filteredRecords.length)} of {filteredRecords.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={previewPage === 1}
                onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800 px-2">
                Page {previewPage} of {totalPages}
              </span>
              <button
                disabled={previewPage >= totalPages}
                onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 3: Field Permissions Configuration per Requirement 7 */}
      {activeSubTab === 'permissions' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Configure Student-Editable Fields
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle which Master Excel fields students are allowed to edit through the portal. Administrative identifiers remain strictly read-only.
              </p>
            </div>

            <button
              onClick={handleSavePermissions}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Permissions Config</span>
            </button>
          </div>

          {permissionsSavedNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Field permissions updated successfully! Students can now only edit the checked fields.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MASTER_EXCEL_COLUMNS.map((col) => {
              const isLocked = ['StudentNumber', 'id', 'leadId'].includes(col);
              const isChecked = selectedEditableFields.includes(col);

              return (
                <div
                  key={col}
                  onClick={() => !isLocked && toggleFieldPermission(col)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isLocked
                      ? 'bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed'
                      : isChecked
                      ? 'bg-blue-50/60 border-blue-300 text-blue-950 shadow-2xs font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">
                      {FIELD_DISPLAY_LABELS[col] || col}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {col} {isLocked ? '(System Locked)' : ''}
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isLocked}
                    onChange={() => {}}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 accent-red-600"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 4: Audit Trail per Requirement 9 */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Audit Trail of Student Record Modifications
            </h2>
            <p className="text-xs text-slate-500">
              Real-time log of every update made by students or administrators, timestamped with before & after values.
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.length > 0 ? (
              auditLogs.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {log.studentNumber}
                      </span>
                      <span className="font-bold text-slate-800">
                        {log.studentName}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        {log.editorType}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-blue-900" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Changes diff */}
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(log.changedFields || {}).map(([field, delta]) => (
                      <div key={field} className="bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                        <span className="font-bold text-slate-700 block mb-0.5">
                          {FIELD_DISPLAY_LABELS[field as keyof StudentRecord] || field}:
                        </span>
                        <div className="text-red-700 line-through truncate">
                          "{delta.from || 'empty'}"
                        </div>
                        <div className="text-emerald-700 font-semibold truncate">
                          → "{delta.to}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No audit records yet. Edits made by students will appear here automatically.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
