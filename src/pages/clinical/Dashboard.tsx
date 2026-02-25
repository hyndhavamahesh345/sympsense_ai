import { useState, useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Heart, Activity, Wind, Thermometer, AlertTriangle, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/helpers';

export const Dashboard = () => {
  const { patients, alerts } = useSimulation();
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState<string>('All Wards');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');

  const wards = useMemo(() => ['All Wards', ...Array.from(new Set(patients.map(p => p.ward)))], [patients]);

  const filteredPatients = patients.filter(p => {
    const matchesWard = selectedWard === 'All Wards' || p.ward === selectedWard;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.bed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWard && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm glass">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            Ward Monitor
            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time patient telemetry and AI predictive analysis.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-64 transition-all"
            />
          </div>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            {wards.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Patient Grid */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatients.length === 0 ? (
              <div className="col-span-full py-20 text-center glass rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                No patients found matching your filters.
              </div>
            ) : (
              filteredPatients.map(patient => (
                <Card
                  key={patient.id}
                  onClick={() => navigate(`/clinical/patient/${patient.id}`)}
                  className="group cursor-pointer hover:border-primary-400 transition-all duration-300 border-l-4 relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl"
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    patient.status === 'CRITICAL' ? 'bg-red-500' :
                      patient.status === 'AT_RISK' ? 'bg-amber-500' : 'bg-clinical-500'
                  )} />

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Bed {patient.bed.split('-').pop()}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-xs font-medium text-slate-500">{patient.ward}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">{patient.name}</h3>
                      </div>
                      <Badge variant={
                        patient.status === 'CRITICAL' ? 'danger' :
                          patient.status === 'AT_RISK' ? 'warning' : 'success'
                      } className="rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                        {patient.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HR</p>
                          <p className="text-xl font-black text-slate-900 leading-none">{patient.currentVitals.HR}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                          <Wind className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SpO2</p>
                          <p className={cn("text-xl font-black leading-none", patient.currentVitals.SpO2 < 94 ? "text-red-600 animate-pulse" : "text-slate-900")}>
                            {patient.currentVitals.SpO2}<span className="text-sm font-normal">%</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">BP</p>
                          <p className="text-xl font-black text-slate-900 leading-none">{patient.currentVitals.SBP}/{patient.currentVitals.DBP}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                          <Thermometer className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Temp</p>
                          <p className="text-xl font-black text-slate-900 leading-none">{patient.currentVitals.Temp.toFixed(1)}<span className="text-sm font-normal">°C</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {activeAlerts.filter(a => a.patientId === patient.id).map(alert => (
                          <div
                            key={alert.id}
                            className={cn(
                              "w-3 h-3 rounded-full border-2 border-white ring-2",
                              alert.severity === 'CRITICAL' ? "bg-red-500 ring-red-100 animate-pulse" :
                                alert.severity === 'HIGH' ? "bg-amber-500 ring-amber-100" : "bg-blue-500 ring-blue-100"
                            )}
                            title={alert.type}
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-primary-600 group-hover:gap-2 transition-all flex items-center gap-1 group-hover:translate-x-1">
                        Review Patient <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Alert Stream */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-slate-900 rounded-3xl shadow-2xl p-6 h-full border border-slate-800 flex flex-col min-h-[600px] sticky top-[100px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Critical Feed
              </h2>
              <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-1 rounded-full border border-red-500/20">{activeAlerts.length} Active</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                  <Activity className="w-10 h-10 mb-4 opacity-20" />
                  <p className="text-sm uppercase tracking-widest font-bold">Scanning Ward...</p>
                  <p className="text-[10px] opacity-40">System state nominal</p>
                </div>
              ) : (
                activeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => navigate(`/clinical/patient/${alert.patientId}`)}
                    className={cn(
                      "group p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                      alert.severity === 'CRITICAL' ? "bg-red-500/5 border-red-500/30 hover:bg-red-500/10" :
                        alert.severity === 'HIGH' ? "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10" : "bg-primary-500/5 border-primary-500/30 hover:bg-primary-500/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-full uppercase",
                        alert.severity === 'CRITICAL' ? "bg-red-500 text-white" :
                          alert.severity === 'HIGH' ? "bg-amber-500 text-black" : "bg-primary-500 text-white"
                      )}>{alert.type}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white text-xs font-bold mb-3">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 bg-white/5 px-2 py-1 rounded">
                        BED {patients.find(p => p.id === alert.patientId)?.bed.split('-').pop()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div>
                  <p className="text-[10px] font-black text-white leading-tight">Predictive Engines Online</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Analyzing 1,240 data points/sec</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

