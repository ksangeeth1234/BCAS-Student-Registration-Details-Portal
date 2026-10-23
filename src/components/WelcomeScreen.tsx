import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const BCAS_LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_vg_vDQDD_PZfMsdp6_TpUpq3Ze0QoKCUx_vNrId9hw6JUkrLtynoT1XX&s=10';

interface WelcomeScreenProps {
  onDismiss: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss }) => {
  const [fadeStage, setFadeStage] = useState<'enter' | 'reveal' | 'ready'>('enter');

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeStage('reveal'), 300);
    const timer2 = setTimeout(() => setFadeStage('ready'), 800);
    const autoAdvance = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(autoAdvance);
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden p-4">
      {/* Dark blue and red ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl -top-24 -left-24 animate-pulse pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] bg-red-600/15 rounded-full blur-3xl -bottom-24 -right-24 pointer-events-none" />

      <div className="relative max-w-lg w-full text-center flex flex-col items-center">
        
        {/* Animated BCAS Logo */}
        <div className={`transition-all duration-700 ease-out transform ${
          fadeStage !== 'enter' ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-6'
        }`}>
          <div className="relative inline-flex items-center justify-center w-28 h-28 mb-5 rounded-3xl bg-white p-3 shadow-2xl shadow-blue-950/60 border-2 border-red-500/40">
            <img
              src={BCAS_LOGO_URL}
              alt="BCAS Campus Official Logo"
              className="w-full h-full object-contain"
            />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Institution Branding */}
        <div className={`transition-all duration-700 delay-150 ease-out transform ${
          fadeStage === 'ready' || fadeStage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-xs uppercase tracking-widest text-red-400 font-extrabold mb-2">
            British College of Applied Studies
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Welcome to BCAS Student Registration Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-8 font-medium">
            Search your registration record, view all academic details, and update your information seamlessly.
          </p>
        </div>

        {/* Action Button & Loader */}
        <div className={`w-full max-w-xs transition-all duration-700 delay-300 ease-out ${
          fadeStage === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-5 overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-red-600 to-blue-400 h-full rounded-full transition-all duration-[2600ms] ease-linear w-full" />
          </div>

          <button
            onClick={onDismiss}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/40 transition-all duration-200 active:scale-98 cursor-pointer"
          >
            <span>Enter Portal</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
