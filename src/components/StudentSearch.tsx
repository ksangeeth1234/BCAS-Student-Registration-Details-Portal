import React, { useState, useEffect, useMemo } from 'react';
import { Search, UserCheck, Calendar, BookOpen, MapPin, ArrowRight, Sparkles, AlertCircle, Building2, Layers } from 'lucide-react';
import { StudentRecord } from '../types/student';
import { searchStudentsInMemory, normalizeSearchTerm } from '../services/studentService';

interface StudentSearchProps {
  allRecords: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  isLoadingRecords: boolean;
}

export const StudentSearch: React.FC<StudentSearchProps> = ({
  allRecords,
  onSelectStudent,
  isLoadingRecords
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce input to fulfill requirement
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDebouncedTerm('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const searchResults = useMemo(() => {
    if (!debouncedTerm) return [];
    return searchStudentsInMemory(allRecords, debouncedTerm);
  }, [allRecords, debouncedTerm]);

  const hasSearched = debouncedTerm.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      
      {/* Title & Subtitle per Requirement 4 */}
      <div className="text-center mb-5 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-950 text-[11px] sm:text-xs font-bold mb-2.5 border border-blue-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-red-600" />
          <span>Official Registration Portal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 tracking-tight mb-2 sm:mb-3">
          BCAS Student Registration Details
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-normal px-2">
          Search for your student record and review your registration information.
        </p>
      </div>

      {/* Prominent Search Input Box */}
      <div className="relative mb-5 sm:mb-8">
        <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-blue-950/5 border-2 border-slate-300 hover:border-blue-900 focus-within:border-blue-900 focus-within:ring-4 focus-within:ring-blue-900/10 transition-all duration-200">
          <div className="pl-3.5 sm:pl-5 pr-1.5 text-blue-950">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter your full name or student number"
            className="w-full py-3.5 sm:py-4 px-2 text-sm sm:text-lg text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mr-2 sm:mr-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-xs hover:bg-slate-100 cursor-pointer"
            >
              Clear
            </button>
          )}

          {/* Search loading spinner */}
          {(isSearching || isLoadingRecords) && (
            <div className="mr-3 sm:mr-5 flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-blue-950 bg-blue-50 px-2 sm:px-3 py-1.5 rounded-xl border border-blue-100 shrink-0">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Searching...</span>
            </div>
          )}
        </div>

        {/* Quick hint pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3 px-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Try searching:</span>
          <button
            onClick={() => setSearchTerm('Mohamed Rilwan')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
          >
            "Mohamed Rilwan" (Multiple matches test)
          </button>
          <button
            onClick={() => setSearchTerm('BCAS/COL/2024/0014')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
          >
            "BCAS/COL/2024/0014"
          </button>
          <button
            onClick={() => setSearchTerm('Sanduni')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors cursor-pointer"
          >
            "Sanduni"
          </button>
        </div>
      </div>

      {/* State 1: Clear Empty State before user starts searching */}
      {!hasSearched && !isSearching && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-center shadow-xs">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-950 flex items-center justify-center mx-auto mb-3.5 border border-blue-200 shadow-inner">
            <UserCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-950" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
            Ready to find your registration record
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
            Type your full name as registered during admission or your BCAS Student Number (e.g. <span className="font-mono text-red-600 font-bold">BCAS/COL/2024/0014</span>) in the search box above.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-blue-950 mb-1">1. Search Record</div>
              <span>Find your student profile across loaded BCAS Master Excel records.</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-blue-950 mb-1">2. Review Details</div>
              <span>Inspect all academic, contact, and enrollment information.</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-blue-950 mb-1">3. Update Details</div>
              <span>Edit any registration details and save permanently to the database.</span>
            </div>
          </div>
        </div>
      )}

      {/* State 2: No records found */}
      {hasSearched && !isSearching && searchResults.length === 0 && (
        <div className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
            No matching student records found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
            We couldn't find any student registration matching <span className="font-bold text-slate-800">"{debouncedTerm}"</span> in the loaded database records.
          </p>
          <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-4 max-w-md mx-auto text-left space-y-2 border border-slate-200">
            <p className="font-bold text-slate-800">Database Info:</p>
            <p>• The database currently contains <strong className="text-blue-950">{allRecords.length} student records</strong>.</p>
            <p>• Check spelling of your name or try searching your first name only.</p>
            <p>• Verify your Student Number format (e.g. BCAS/COL/2024/0014).</p>
            <p>• If you recently uploaded an Excel workbook, open the <strong>"Admin Excel"</strong> tab above to confirm that records were imported into the live database.</p>
          </div>
        </div>
      )}

      {/* State 3: Disambiguation Results List */}
      {hasSearched && searchResults.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3.5 px-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Found <span className="text-red-600 font-extrabold">{searchResults.length}</span> matching {searchResults.length === 1 ? 'student record' : 'student records'}
            </p>
            {searchResults.length > 1 && (
              <span className="text-[11px] text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold border border-blue-200 w-fit">
                Multiple records found — select your profile below
              </span>
            )}
          </div>

          <div className="space-y-3">
            {searchResults.map((student, idx) => (
              <div
                key={`${student.StudentNumber}-${idx}`}
                onClick={() => onSelectStudent(student)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-red-500 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-950 transition-colors">
                      {student.StudentName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
                      {student.StudentNumber}
                    </span>
                    {student.batchName && (
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {student.batchName}
                      </span>
                    )}
                  </div>

                  {/* Safe identifying details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <span className="truncate">{student.Course || 'Course Enrolled'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{student.AcademicBranch || 'Campus Branch'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Intake: {student.IntakeMonth} {student.IntakeYear}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-center shrink-0">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
