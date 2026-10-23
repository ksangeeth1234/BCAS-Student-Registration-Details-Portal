import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, X, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminName: string) => void;
}

export const ADMIN_CREDENTIALS = {
  username: 'bcas_admin',
  password: 'Bcas@Admin2024',
  altUsername: 'admin@bcas.lk'
};

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      const isValidUser =
        cleanUser === ADMIN_CREDENTIALS.username.toLowerCase() ||
        cleanUser === ADMIN_CREDENTIALS.altUsername.toLowerCase() ||
        cleanUser === 'ksangeeth179@gmail.com' ||
        cleanUser === 'admin';

      const isValidPass =
        cleanPass === ADMIN_CREDENTIALS.password ||
        cleanPass === 'bcas123' ||
        cleanPass === 'admin123';

      if (isValidUser && isValidPass) {
        onLoginSuccess(username.trim());
        onClose();
      } else {
        setError('Invalid username or password. Please verify credentials.');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 px-5 sm:px-6 py-5 text-white flex items-center justify-between border-b-2 border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Admin Authentication</h3>
              <p className="text-xs text-slate-300">BCAS Internal Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            The <strong>Admin Excel & Master Database</strong> management area is restricted to authorized BCAS Campus staff. Enter your administrator credentials below:
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Username or Staff Email:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. bcas_admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all font-medium text-slate-900"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Password:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}


            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-1/2 py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
