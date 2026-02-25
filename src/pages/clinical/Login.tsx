import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

export const ClinicalLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/clinical/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-clinical-500"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-clinical-500/5 rounded-full blur-3xl"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="bg-primary-600 p-3 rounded-2xl inline-block mb-6 shadow-xl shadow-primary-200 animate-float">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Clinical <span className="text-primary-600">Portal</span></h1>
          <p className="text-slate-500 mt-2 font-medium">SympSense AI Decision Support</p>
        </div>

        <div className="glass rounded-3xl shadow-2xl shadow-primary-900/5 border border-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="w-24 h-24 text-primary-900" />
          </div>

          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            Staff Authentication
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hospital Credentials</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="email"
                  autoFocus
                  defaultValue="dr.sarah.connor@hospital.org"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-semibold text-slate-700"
                  placeholder="name@hospital.org"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-semibold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary py-4 rounded-2xl shadow-xl shadow-primary-200 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : 'Access Command Center'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-slate-300">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Access</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <p className="mt-6 text-center text-xs font-bold text-slate-400">
            Forgot credentials? <a href="#" className="text-primary-600 hover:underline">Contact IT Support</a>
          </p>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          SympSense Secure Gateway v2.4a
        </p>
      </div>
    </div>
  );
};
