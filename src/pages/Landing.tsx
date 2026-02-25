import { Link } from 'react-router-dom';
import { Activity, HeartHandshake, ArrowRight, Shield, Zap, Users } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-clinical-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-200">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">SympSense <span className="text-primary-600">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Features</a>
          <a href="#technology" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Technology</a>
          <Link to="/clinical/login" className="text-sm font-semibold bg-white border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all">Sign In</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse-slow">
            <Zap className="w-3 h-3" /> Predictive Care is Here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Human Connection <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-clinical-600">AI Intelligence.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            The next generation of clinical decision support. Empowering medical teams with predictive alerts and connecting families with peace of mind.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link to="/clinical/login" className="group relative glass p-8 rounded-3xl card-hover overflow-hidden border-2 border-transparent hover:border-primary-200">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-100 rounded-full group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-primary-200 group-hover:rotate-6 transition-transform">
                <Activity className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Clinical Command Center</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                For physicians and nursing staff. Real-time vital sign monitoring with predictive alerting agents for early intervention.
              </p>
              <div className="flex items-center gap-2 text-primary-600 font-bold group-hover:gap-4 transition-all">
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>

          <Link to="/family/login" className="group relative glass p-8 rounded-3xl card-hover overflow-hidden border-2 border-transparent hover:border-clinical-200">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-clinical-100 rounded-full group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-clinical-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl shadow-clinical-200 group-hover:-rotate-6 transition-transform">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Family Connect Portal</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Simplified patient updates for families. Stay connected to your loved ones journey with clarity and compassion.
              </p>
              <div className="flex items-center gap-2 text-clinical-600 font-bold group-hover:gap-4 transition-all">
                View Status <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-clinical-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 text-center md:text-left pt-20">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto md:mx-0">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold">Predictive AI Agents</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Continuous monitoring of metabolic trends to predict clinical instability before traditional thresholds are breached.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto md:mx-0">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Secure Infrastructure</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Enterprise-grade encryption with HIPAA-compliant data handling for seamless and secure patient monitoring.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto md:mx-0">
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold">Family Integration</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Connecting families to the clinical journey with simplified, real-time updates and peace-of-mind alerts.</p>
          </div>
        </div>

        {/* Technology Section */}
        <div id="technology" className="mt-32 pt-20 border-t border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Precision Technology</h2>
            <p className="text-slate-500">Built on a foundation of medical-grade algorithms and real-time data streaming.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Real-time Vital Streaming', detail: '100ms latency' },
              { label: 'Clinical Agent Mesh', detail: '8+ Active Agents' },
              { label: 'Predictive Analytics', detail: 'ML-driven trends' },
              { label: 'Cloud-edge Sync', detail: '99.9% Up-time' }
            ].map((tech, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-2">{tech.detail}</p>
                <p className="text-sm font-bold text-slate-900">{tech.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">SympSense AI</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 SympSense AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-primary-600">Privacy</a>
            <a href="#" className="hover:text-primary-600">Terms</a>
            <a href="#" className="hover:text-primary-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

