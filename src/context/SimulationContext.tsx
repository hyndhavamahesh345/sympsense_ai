import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Patient, Alert, SimulationScenario, PatientStatus } from '../types';
import { generateVitals } from '../utils/helpers';

interface SimulationContextType {
  patients: Patient[];
  alerts: Alert[];
  acknowledgeAlert: (alertId: string, userId: string) => void;
  resolveAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  setPatientScenario: (patientId: string, scenario: SimulationScenario) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_PATIENTS: Patient[] = [
  // ICU WARD A
  {
    id: 'P001', name: 'Thomas Anderson', bed: 'ICU-A-01', ward: 'ICU Ward A', age: 62, gender: 'M', admissionDate: '2025-11-28',
    status: 'CRITICAL',
    activeScenario: 'CARDIAC_EVENT',
    currentVitals: { timestamp: '', HR: 145, SpO2: 96, SBP: 160, DBP: 95, RR: 22, Temp: 36.9, fall: false },
    history: []
  },
  {
    id: 'P002', name: 'Martha Stewart', bed: 'ICU-A-02', ward: 'ICU Ward A', age: 74, gender: 'F', admissionDate: '2025-11-29',
    status: 'STABLE',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 72, SpO2: 98, SBP: 120, DBP: 78, RR: 16, Temp: 37.0, fall: false },
    history: []
  },
  {
    id: 'P003', name: 'David Miller', bed: 'ICU-A-03', ward: 'ICU Ward A', age: 55, gender: 'M', admissionDate: '2025-11-30',
    status: 'AT_RISK',
    activeScenario: 'SEPSIS_ONSET',
    currentVitals: { timestamp: '', HR: 105, SpO2: 94, SBP: 100, DBP: 65, RR: 20, Temp: 38.4, fall: false },
    history: []
  },

  // ICU WARD B
  {
    id: 'P004', name: 'Sarah Connor', bed: 'ICU-B-01', ward: 'ICU Ward B', age: 45, gender: 'F', admissionDate: '2025-11-30',
    status: 'CRITICAL',
    activeScenario: 'HYPOXIA_EVENT',
    currentVitals: { timestamp: '', HR: 115, SpO2: 82, SBP: 130, DBP: 85, RR: 28, Temp: 37.2, fall: false },
    history: []
  },
  {
    id: 'P005', name: 'Robert Chen', bed: 'ICU-B-02', ward: 'ICU Ward B', age: 68, gender: 'M', admissionDate: '2025-11-30',
    status: 'STABLE',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 68, SpO2: 97, SBP: 125, DBP: 82, RR: 18, Temp: 36.8, fall: false },
    history: []
  },

  // GENERAL WARD
  {
    id: 'P006', name: 'James Bond', bed: 'GW-101', ward: 'General Ward 1', age: 38, gender: 'M', admissionDate: '2025-12-01',
    status: 'STABLE',
    activeScenario: 'RECOVERY',
    currentVitals: { timestamp: '', HR: 65, SpO2: 99, SBP: 118, DBP: 76, RR: 14, Temp: 36.7, fall: false },
    history: []
  },
  {
    id: 'P007', name: 'Lucy Liu', bed: 'GW-102', ward: 'General Ward 1', age: 29, gender: 'F', admissionDate: '2025-12-01',
    status: 'STABLE',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 70, SpO2: 100, SBP: 110, DBP: 70, RR: 12, Temp: 36.8, fall: false },
    history: []
  },
  {
    id: 'P008', name: 'Morgan Freeman', bed: 'GW-103', ward: 'General Ward 1', age: 80, gender: 'M', admissionDate: '2025-12-02',
    status: 'AT_RISK',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 85, SpO2: 93, SBP: 140, DBP: 90, RR: 19, Temp: 37.1, fall: false },
    history: []
  }
];

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // SIMULATION LOOP (The "Backend" + "Agents")
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => {
        return prevPatients.map(p => {
          // 1. Generate new vitals based on SCENARIO
          const newVitals = generateVitals(p.currentVitals, p.activeScenario);

          // 2. Update History (Keep last 60 points = 1 min for demo)
          const newHistory = [...p.history, newVitals].slice(-60);

          // 3. Predictive Analysis (The "Intelligence" Layer)
          const recentHistory = p.history.slice(-10); // Last 10 points

          if (recentHistory.length >= 5) {
            const first = recentHistory[0];
            const last = newVitals;

            // Calculate Rates of Change (units per 10s roughly)
            const spo2Rate = last.SpO2 - first.SpO2;
            const sbpRate = last.SBP - first.SBP;
            const hrRate = last.HR - first.HR;

            // PREDICTIVE AGENT 1: Desaturation Risk
            // If SpO2 is dropping > 2% in 10s and is already below 96%
            if (spo2Rate <= -2 && last.SpO2 < 96) {
              triggerAlert(p.id, 'Hypoxia', 'HIGH', `PREDICTIVE: Rapid desaturation detected (${spo2Rate}% drop). Probable hypoxia onset.`);
            }

            // PREDICTIVE AGENT 2: Shock/Hemodynamic Risk
            // Falling BP combined with Rising HR is a classic sign of compensated shock
            if (sbpRate <= -8 && hrRate >= 8) {
              triggerAlert(p.id, 'Shock', 'CRITICAL', `PREDICTIVE: Hemodynamic collapse risk. Rising HR with falling BP detected.`);
            }

            // PREDICTIVE AGENT 3: Tachycardia Trend
            if (hrRate >= 15 && last.HR > 100) {
              triggerAlert(p.id, 'Cardiac', 'MEDIUM', `PREDICTIVE: Significant heart rate upward trend (+${hrRate} bpm).`);
            }

            // NEW PREDICTIVE AGENT 4: Fever-Resp Correlation
            // Rising temp with rising RR often precedes pulmonary decompensation
            const tempRate = last.Temp - first.Temp;
            const rrRate = last.RR - first.RR;
            if (tempRate > 0.3 && rrRate >= 4) {
              triggerAlert(p.id, 'Septic', 'HIGH', `PREDICTIVE: Rising febrile-respiratory trend. Possible secondary infection.`);
            }
          }

          // 4. Reactive Agents (Logic Checks)
          let newStatus: PatientStatus = 'STABLE';
          let isCritical = false;

          // Hypoxia Agent
          if (newVitals.SpO2 < 88) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Hypoxia', 'CRITICAL', `Critical Desaturation: SpO2 ${newVitals.SpO2}%`);
          } else if (newVitals.SpO2 < 94) {
            if (!isCritical) newStatus = 'AT_RISK';
            if (Math.random() > 0.98) triggerAlert(p.id, 'Hypoxia', 'MEDIUM', `SpO2 level low: ${newVitals.SpO2}%`);
          }

          // Cardiac Agent (Tachycardia / Bradycardia)
          if (newVitals.HR > 140) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Cardiac', 'CRITICAL', `Critical Tachycardia: HR ${newVitals.HR}`);
          } else if (newVitals.HR < 45) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Bradycardia', 'CRITICAL', `Critical Bradycardia: HR ${newVitals.HR}`);
          } else if (newVitals.HR > 110 || newVitals.HR < 55) {
            if (!isCritical) newStatus = 'AT_RISK';
          }

          // Blood Pressure Agent (Hypertension / Hypotension)
          if (newVitals.SBP > 180) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Hypertension', 'CRITICAL', `Hypertensive Crisis: SBP ${newVitals.SBP} mmHg`);
          } else if (newVitals.SBP < 90) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Shock', 'CRITICAL', `Critical Hypotension: SBP ${newVitals.SBP} mmHg`);
          } else if (newVitals.SBP > 150 || newVitals.SBP < 100) {
            if (!isCritical) newStatus = 'AT_RISK';
          }

          // Thermal Agent (Fever / Sepsis / Hypothermia)
          if (newVitals.Temp > 40.0) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Hyperthermia', 'CRITICAL', `Critical Hyperpyrexia: Temp ${newVitals.Temp}°C`);
          } else if (newVitals.Temp < 35.5) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Hypothermia', 'CRITICAL', `Hypothermia Warning: Temp ${newVitals.Temp}°C`);
          } else if (newVitals.Temp > 38.8 && newVitals.HR > 110) {
            if (!isCritical) newStatus = 'CRITICAL';
            triggerAlert(p.id, 'Sepsis', 'CRITICAL', `Sepsis Alert: Hyperthermia (${newVitals.Temp}°C) with Tachycardia.`);
          } else if (newVitals.Temp > 38.0) {
            if (!isCritical) newStatus = 'AT_RISK';
          }

          // Respiratory Distress Agent
          if (newVitals.RR > 32 || newVitals.RR < 8) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Respiratory', 'CRITICAL', `Ventilatory Failure Risk: RR ${newVitals.RR}`);
          } else if (newVitals.RR > 24) {
            if (!isCritical) newStatus = 'AT_RISK';
            triggerAlert(p.id, 'Respiratory', 'HIGH', `Tachypnea detected: RR ${newVitals.RR}`);
          }

          // Fall Agent
          if (newVitals.fall) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Fall', 'CRITICAL', 'Patient fall detected!');
          }

          return {
            ...p,
            currentVitals: newVitals,
            history: newHistory,
            status: newStatus
          };
        });
      });
    }, 1000); // 1 second tick


    return () => clearInterval(interval);
  }, []);

  const triggerAlert = (patientId: string, type: Alert['type'], severity: Alert['severity'], message: string) => {
    setAlerts(prev => {
      const severityValues: Record<Alert['severity'], number> = {
        'CRITICAL': 3,
        'HIGH': 2,
        'MEDIUM': 1,
        'LOW': 0
      };

      const existing = prev.find(a => a.patientId === patientId && a.type === type && a.status !== 'RESOLVED');

      if (existing) {
        // Upgrade severity if new one is higher
        if (severityValues[severity] > severityValues[existing.severity]) {
          return prev.map(a => a.id === existing.id ? { ...a, severity, message, timestamp: new Date().toISOString() } : a);
        }
        return prev;
      }

      const newAlert: Alert = {
        id: Math.random().toString(36).slice(2, 11),
        patientId,
        type,
        severity,
        message,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
      };
      return [newAlert, ...prev];
    });
  };

  const acknowledgeAlert = (alertId: string, userId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: userId } : a));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a));
  };

  const escalateAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ESCALATED' } : a));
  };

  const setPatientScenario = (patientId: string, scenario: SimulationScenario) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, activeScenario: scenario } : p));
  };

  return (
    <SimulationContext.Provider value={{ patients, alerts, acknowledgeAlert, resolveAlert, escalateAlert, setPatientScenario }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
