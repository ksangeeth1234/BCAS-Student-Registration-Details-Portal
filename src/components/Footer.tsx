import React from 'react';
import { Shield, Building, Phone, Mail, Globe } from 'lucide-react';

const BCAS_LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_vg_vDQDD_PZfMsdp6_TpUpq3Ze0QoKCUx_vNrId9hw6JUkrLtynoT1XX&s=10';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 text-sm">
          
          {/* Column 1: Institution Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <img
                src={BCAS_LOGO_URL}
                alt="BCAS Logo"
                className="w-7 h-7 object-contain rounded"
              />
              <span className="text-blue-950 font-black text-base">
                BCAS Campus <span className="text-red-600 font-bold">Sri Lanka</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              British College of Applied Studies — Premier tertiary education provider offering UK Degree programmes, Higher National Diplomas, and specialized career pathways.
            </p>
          </div>

          {/* Column 2: Campuses */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-950 font-bold text-sm">
              <Building className="w-4 h-4 text-red-600" />
              <span>Campus Branches</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Colombo City Campus • Kandy Campus • Kalmunai Campus • Jaffna Campus • Kurunegala Branch
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Hotline: +94 11 255 9900 | info@bcas.lk
            </p>
          </div>

          {/* Column 3: Data Safety & System Notice */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-950 font-bold text-sm">
              <Shield className="w-4 h-4 text-red-600" />
              <span>Student Registration Services</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This portal allows students to view their complete registration records and update any inaccurate details directly. All changes are saved permanently to the central database.
            </p>
          </div>

        </div>

        {/* Footer Bottom Bar with mandatory PicoZen attribution */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} BCAS Campus. All rights reserved.
          </div>
          
          <div className="font-semibold text-slate-700 flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
            <span>Developed by</span>
            <span className="text-red-600 font-extrabold tracking-wide">PicoZen</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
