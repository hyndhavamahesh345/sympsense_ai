import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Vitals, SimulationScenario } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to clamp values within physiological limits
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

// Advanced Generator: Uses trends based on the active scenario
export const generateVitals = (prev: Vitals, scenario: SimulationScenario): Vitals => {
  const now = new Date();

  // 1. Base fluctuation (natural noise)
  let hrChange = (Math.random() - 0.5) * 2;
  let spo2Change = (Math.random() - 0.5) * 1;
  let sbpChange = (Math.random() - 0.5) * 2;

  // 2. Scenario-based forcing functions (The "Trend")
  switch (scenario) {
    case 'HYPOXIA_EVENT':
      // SpO2 drops rapidly, HR increases slightly (compensation)
      spo2Change -= 0.8;
      hrChange += 0.5;
      break;

    case 'CARDIAC_EVENT':
      // Dangerous Tachypnea/Tachycardia spike
      hrChange += 3.0;
      sbpChange -= 1.0;
      break;

    case 'BRADYCARDIA_EVENT':
      // HR drops significantly
      hrChange -= 2.0;
      sbpChange -= 0.5;
      break;

    case 'HYPERTENSION_EVENT':
      // BP spikes dangerously
      sbpChange += 2.5;
      hrChange += 0.5;
      break;

    case 'SEPSIS_ONSET':
      // Temp rises faster, HR follows
      hrChange += 0.4;
      sbpChange -= 0.3;
      break;

    case 'RECOVERY':
      // Return to normal ranges faster
      if (prev.SpO2 < 98) spo2Change += 1.0;
      if (prev.HR > 80) hrChange -= 1.5;
      if (prev.HR < 65) hrChange += 1.5;
      if (prev.SBP < 115) sbpChange += 1.5;
      if (prev.SBP > 125) sbpChange -= 1.5;
      break;

    case 'NORMAL':
    default:
      // Tend towards stability
      if (prev.SpO2 < 96) spo2Change += 0.5;
      if (prev.SpO2 > 99) spo2Change -= 0.5;
      break;
  }

  // 3. Calculate new values with clamping
  const newHR = clamp(prev.HR + hrChange, 30, 200);
  const newSpO2 = clamp(prev.SpO2 + spo2Change, 60, 100);
  const newSBP = clamp(prev.SBP + sbpChange, 50, 220);
  const newDBP = clamp(newSBP * 0.65 + (Math.random() - 0.5) * 2, 40, 130); // DBP linked to SBP roughly

  // Temp logic
  const tempChange = (Math.random() - 0.5) * 0.1;
  let adjustedTempChange = tempChange;
  if (scenario === 'SEPSIS_ONSET') adjustedTempChange += 0.05;
  if (scenario === 'RECOVERY' && prev.Temp > 37) adjustedTempChange -= 0.1;
  const newTemp = clamp(prev.Temp + adjustedTempChange, 35, 42);

  return {
    timestamp: now.toISOString(),
    HR: Math.round(newHR),
    SpO2: Math.round(newSpO2),
    SBP: Math.round(newSBP),
    DBP: Math.round(newDBP),
    RR: Math.round(clamp(prev.RR + (Math.random() - 0.5), 8, 40)),
    Temp: Number(newTemp.toFixed(1)),
    fall: scenario === 'NORMAL' && Math.random() > 0.999, // Very rare fall in normal
  };
};
