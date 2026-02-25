import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const ClinicalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Premium Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200 group-hover:rotate-6 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">SympSense <span className="text-primary-600">AI</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/clinical/dashboard"
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  location.pathname.includes('dashboard')
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Ward Monitor
              </Link>
              {/* Other nav items can go here */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-primary-300 transition-colors">
                <User className="w-5 h-5 text-slate-500 group-hover:text-primary-600" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-black text-slate-900 leading-none">Dr. Sarah Connor</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Attending Physician</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
            </div>
            <button
              onClick={() => navigate('/')}
              className="ml-4 p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
