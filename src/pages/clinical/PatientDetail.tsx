import { useParams, useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, CheckCircle, AlertOctagon, Zap, Activity, Thermometer, Wind, BrainCircuit } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { SimulationScenario } from '../../types';

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, alerts, acknowledgeAlert, resolveAlert, escalateAlert, setPatientScenario } = useSimulation();

  const patient = patients.find(p => p.id === id);

  if (!patient) return <div className="p-10 text-center glass rounded-3xl m-10">Patient not found</div>;

  const patientAlerts = alerts.filter(a => a.patientId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const activeAlerts = patientAlerts.filter(a => a.status !== 'RESOLVED');

  // Prepare chart data
  const chartData = patient.history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
    ...h
  }));

  const handleScenarioChange = (scenario: SimulationScenario) => {
    setPatientScenario(patient.id, scenario);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm glass sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/clinical/dashboard')}
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 leading-tight">{patient.name}</h1>
                <Badge variant={patient.status === 'CRITICAL' ? 'danger' : patient.status === 'AT_RISK' ? 'warning' : 'success'} className="px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest leading-none">
                  {patient.status}
                </Badge>
              </div>
              <div className="flex gap-4 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                <span>Bed <span className="text-slate-900">{patient.bed.split('-').pop()}</span></span>
                <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5"></span>
                <span>{patient.age}Y <span className="text-slate-900">/ {patient.gender === 'M' ? 'Male' : 'Female'}</span></span>
                <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5"></span>
                <span>Ward <span className="text-slate-900">{patient.ward}</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Engine Context</p>
            <Badge variant="neutral" className="font-mono bg-slate-900 text-white rounded-lg px-3 py-1.5 border-none shadow-lg shadow-slate-200">{patient.activeScenario}</Badge>
          </div>
        </div>
      </div>

      {/* Live Vitals High-Contrast Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Heart Rate', value: patient.currentVitals.HR, unit: 'BPM', icon: Activity, color: patient.currentVitals.HR > 120 || patient.currentVitals.HR < 50 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50' },
          { label: 'SpO2 Level', value: patient.currentVitals.SpO2, unit: '%', icon: Wind, color: patient.currentVitals.SpO2 < 94 ? 'text-red-600 bg-red-50 animate-pulse-slow' : 'text-primary-600 bg-primary-50' },
          { label: 'Blood Pressure', value: `${patient.currentVitals.SBP}/${patient.currentVitals.DBP}`, unit: 'MMHG', icon: Activity, color: 'text-purple-600 bg-purple-50' },
          { label: 'Resp. Rate', value: patient.currentVitals.RR, unit: '/MIN', icon: Wind, color: 'text-clinical-600 bg-clinical-50' },
          { label: 'Body Temp', value: patient.currentVitals.Temp.toFixed(1), unit: '°C', icon: Thermometer, color: patient.currentVitals.Temp > 38 ? 'text-orange-600 bg-orange-50' : 'text-slate-900 bg-slate-50' },
        ].map((vital, idx) => (
          <Card key={idx} className="p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className={cn("inline-flex p-2 rounded-xl mb-4", vital.color)}>
              <vital.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{vital.label}</p>
            <p className={cn("text-4xl font-black font-mono tracking-tighter", vital.color.split(' ')[0])}>{vital.value}</p>
            <p className="text-xs font-bold text-slate-400 mt-2">{vital.unit}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content: Charts & Simulation */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900">Real-time Telemetry</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> HR
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> SpO2
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full mb-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0c8de3" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0c8de3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis yAxisId="left" hide domain={[40, 180]} />
                  <YAxis yAxisId="right" orientation="right" hide domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="HR" stroke="#ef4444" strokeWidth={3} fill="url(#colorHR)" isAnimationActive={false} />
                  <Area yAxisId="right" type="monotone" dataKey="SpO2" stroke="#0c8de3" strokeWidth={3} fill="url(#colorSpO2)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Systolic Pressure Trend</p>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[60, 200]} />
                    <Line type="monotone" dataKey="SBP" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Simulation Controls - Interactive Section */}
          <Card className="p-8 border-2 border-primary-100 bg-primary-50/20 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-200">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Physiological Scenarios</h3>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">Control Console</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { id: 'NORMAL', label: 'Stable Path', color: 'hover:bg-emerald-500 active:bg-emerald-600', activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' },
                { id: 'HYPOXIA_EVENT', label: 'Induce Hypoxia', color: 'hover:bg-primary-600 active:bg-primary-700', activeClass: 'bg-primary-600 text-white shadow-lg shadow-primary-200' },
                { id: 'CARDIAC_EVENT', label: 'Cardiac Stress', color: 'hover:bg-red-600 active:bg-red-700', activeClass: 'bg-red-600 text-white shadow-lg shadow-red-200' },
                { id: 'BRADYCARDIA_EVENT', label: 'Induce Brady', color: 'hover:bg-indigo-600 active:bg-indigo-700', activeClass: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' },
                { id: 'HYPERTENSION_EVENT', label: 'BP Spike', color: 'hover:bg-rose-600 active:bg-rose-700', activeClass: 'bg-rose-600 text-white shadow-lg shadow-rose-200' },
                { id: 'SEPSIS_ONSET', label: 'Infection Onset', color: 'hover:bg-orange-600 active:bg-orange-700', activeClass: 'bg-orange-600 text-white shadow-lg shadow-orange-200' },
                { id: 'RECOVERY', label: 'Start Healing', color: 'hover:bg-clinical-500 active:bg-clinical-600', activeClass: 'bg-clinical-500 text-white shadow-lg shadow-clinical-200' },
              ].map(scen => (
                <button
                  key={scen.id}
                  onClick={() => handleScenarioChange(scen.id as SimulationScenario)}
                  className={cn(
                    "group p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2",
                    patient.activeScenario === scen.id
                      ? scen.activeClass + " border-transparent"
                      : "bg-white text-slate-600 border-slate-200 hover:text-white " + scen.color
                  )}
                >
                  {scen.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-primary-100">
              <BrainCircuit className="w-5 h-5 text-primary-600 mt-1 shrink-0" />
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                The simulation engine will trend vitals towards the chosen clinical state over the next 10-30 seconds. Agents will monitor shifts and trigger alerts based on rate-of-change predictions.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar: Predictive Insights & Alert Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* NEW: Predictive Insights Card */}
          <Card className="p-6 bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <BrainCircuit className="w-5 h-5 text-primary-400" />
              <h3 className="font-black uppercase tracking-widest text-sm">Predictive Analysis</h3>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stability Index</span>
                  <span className="text-xs font-black text-emerald-400">92%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-2">Agent Observations</p>
                {activeAlerts.length > 0 ? (
                  activeAlerts.map(a => (
                    <div key={a.id} className="flex gap-3">
                      <div className={cn("w-1 h-8 rounded-full shrink-0", a.severity === 'CRITICAL' ? "bg-red-500" : "bg-amber-500")}></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-200 leading-tight uppercase tracking-wide">{a.type} Risk</p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-1">{a.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-1 h-8 rounded-full bg-slate-800"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Nominal trends detected</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="h-full flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-lg flex items-center justify-between">
                Alert Feed
                <Badge variant="danger" className="rounded-lg">{activeAlerts.length}</Badge>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px] custom-scrollbar">
              {activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                  <CheckCircle className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Patient Monitor Stable</p>
                </div>
              ) : (
                activeAlerts.map(alert => (
                  <div key={alert.id} className={cn(
                    "border rounded-2xl p-5 space-y-4 transition-all duration-300 animate-in slide-in-from-right-4",
                    alert.severity === 'CRITICAL' ? "bg-red-50/50 border-red-100" :
                      alert.severity === 'HIGH' ? "bg-amber-50/50 border-amber-100" : "bg-primary-50/50 border-primary-100"
                  )}>
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-full uppercase",
                        alert.severity === 'CRITICAL' ? "bg-red-500 text-white" : "bg-slate-900 text-white"
                      )}>{alert.type} Agent</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-700 leading-relaxed capitalize-first">
                      {alert.message}
                    </p>

                    <div className="flex gap-2">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id, 'Dr. Sarah Connor')}
                          className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status === 'ACKNOWLEDGED' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="flex-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Resolve
                        </button>
                      )}
                      <button
                        onClick={() => escalateAlert(alert.id)}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all active:scale-95"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Resolved Divider */}
              {patientAlerts.filter(a => a.status === 'RESOLVED').length > 0 && (
                <div className="pt-10">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-4">Resolved History</p>
                  <div className="space-y-3">
                    {patientAlerts.filter(a => a.status === 'RESOLVED').slice(0, 3).map(alert => (
                      <div key={alert.id} className="opacity-40 border border-slate-100 rounded-2xl p-4 text-xs bg-slate-50 flex justify-between items-center group hover:opacity-100 transition-opacity cursor-help">
                        <div>
                          <p className="font-bold text-slate-700">{alert.type}</p>
                          <p className="text-[10px] text-slate-400">{new Date(alert.resolvedAt!).toLocaleTimeString()}</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
