import React from 'react';
import { Shield, Printer, Mail } from 'lucide-react';

const Footer = ({ variant = 'default', className = '', ...props }) => {
  const currentYear = new Date().getFullYear();

  const variants = {
    default: (
      <footer 
        className={`mt-auto py-6 px-6 border-t border-slate-200 text-center ${className}`}
        {...props}
      >
        <p className="text-xs text-slate-500">
          © {currentYear} Emplora HR Performance Appraisal System. All rights
          reserved.
        </p>
      </footer>
    ),
    hrSystems: (
      <footer 
        className={`bg-white border-t border-slate-200 py-8 px-6 md:px-20 ${className}`}
        {...props}
      >
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-slate-500 text-sm">
              © {currentYear} HR Systems. Secure Data Environment.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              className="text-slate-500 hover:text-primary text-sm transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-slate-500 hover:text-primary text-sm transition-colors"
              href="#"
            >
              User Support
            </a>
          </div>
        </div>
      </footer>
    ),
    talentPulse: (
      <footer 
        className={`mt-8 border-t border-primary/5 py-8 px-4 md:px-10 text-center text-slate-400 text-xs ${className}`}
        {...props}
      >
        <p>© {currentYear} TalentPulse HR Management System. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Help Center
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Security
          </a>
        </div>
      </footer>
    ),
    performanceAppraisal: (
      <footer 
        className={`flex flex-col md:flex-row justify-between items-center py-8 border-t border-slate-200 dark:border-slate-800 gap-4 ${className}`}
        {...props}
      >
        <p className="text-slate-500 text-sm">
          © {currentYear} Performance Appraisal System. Finalized on Dec 14, 2023.
        </p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <Printer className="w-4 h-4" />
            Print Record
          </button>
          <button className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <Mail className="w-4 h-4" />
            Email Copy
          </button>
        </div>
      </footer>
    ),
    hrSolutions: (
      <footer 
        className={`mt-auto border-t border-slate-200 bg-white px-6 py-8 text-center ${className}`}
        {...props}
      >
        <p className="text-sm text-slate-500">
          © {currentYear} HR Solutions Inc. All performance records are confidential.
        </p>
      </footer>
    )
  };

  return variants[variant] || variants.default;
};

export default Footer;