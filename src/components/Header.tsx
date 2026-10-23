import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  LogIn,
  LogOut,
  Database,
  User,
  Lock,
  Sparkles
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

const BCAS_LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_vg_vDQDD_PZfMsdp6_TpUpq3Ze0QoKCUx_vNrId9hw6JUkrLtynoT1XX&s=10';

interface HeaderProps {
  currentTab: 'search' | 'admin';
  setCurrentTab: (tab: 'search' | 'admin') => void;
  user: FirebaseUser | null;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onResetSearch: () => void;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  user,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  onResetSearch,
  totalRecordsCount
}) => {
  const handleAdminTabClick = () => {
    if (isAdminLoggedIn || user) {
      setCurrentTab('admin');
    } else {
      onOpenAdminLogin();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo only (no duplicate BCAS CAMPUS texture) */}
          <div 
            onClick={onResetSearch}
            className="flex items-center cursor-pointer group shrink-0"
            title="Return to Student Search"
          >
            <div className="h-10 sm:h-12 py-0.5 flex items-center justify-center group-hover:opacity-90 transition-opacity">
              <img
                src={BCAS_LOGO_URL}
                alt="BCAS Campus Logo"
                className="h-9 sm:h-11 w-auto max-w-[200px] sm:max-w-[260px] object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Firestore DB status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Database Online</span>
              <span className="text-blue-900 font-mono font-bold bg-white px-1.5 py-0.5 rounded text-[10px] border border-blue-200">
                {totalRecordsCount} records
              </span>
            </div>

            {/* View Switcher: Student Search vs Admin Excel (Protected by Admin credentials) */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrentTab('search')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentTab === 'search'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-950'
                }`}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Search</span>
              </button>

              <button
                onClick={handleAdminTabClick}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-950'
                }`}
                title={isAdminLoggedIn || user ? "Admin Excel Database Management" : "Password Required - Click to Unlock"}
              >
                {isAdminLoggedIn || user ? (
                  <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                )}
                <span>Admin Excel</span>
                {totalRecordsCount > 0 && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded font-mono hidden sm:inline ${
                    currentTab === 'admin' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'
                  }`}>
                    {totalRecordsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Admin session badge & Logout */}
            {isAdminLoggedIn || user ? (
              <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-slate-200">
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-950 border border-blue-200">
                  <ShieldCheck className="w-3 h-3 text-red-600" />
                  <span>Admin Active</span>
                </span>
                <button
                  onClick={onAdminLogout}
                  title="Sign out of Admin"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-red-200 hover:border-red-300 bg-red-50/70 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                title="Enter Administrator username & password"
              >
                <Lock className="w-3 h-3 text-red-600" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
