import { DailyRecord, MedicationLog, SafetyPlan } from '../types';
import { DEFAULT_SAFETY_PLAN } from '../constants';

const STORAGE_KEY_RECORDS = 'flux_records';
const STORAGE_KEY_MEDS = 'flux_meds';
const STORAGE_KEY_SAFETY = 'flux_safety';

export const saveRecord = (record: DailyRecord): void => {
  const existing = getRecords();
  const index = existing.findIndex(r => r.date === record.date);
  
  if (index >= 0) {
    existing[index] = record;
  } else {
    existing.push(record);
  }
  
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));
};

export const getRecords = (): DailyRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY_RECORDS);
  return data ? JSON.parse(data) : [];
};

export const getTodayRecord = (): DailyRecord | null => {
  const today = new Date().toISOString().split('T')[0];
  const records = getRecords();
  return records.find(r => r.date === today) || null;
};

export const logMedication = (med: MedicationLog): void => {
  const existing = getMedications();
  existing.push(med);
  localStorage.setItem(STORAGE_KEY_MEDS, JSON.stringify(existing));
};

export const getMedications = (): MedicationLog[] => {
  const data = localStorage.getItem(STORAGE_KEY_MEDS);
  return data ? JSON.parse(data) : [];
};

export const getSafetyPlan = (): SafetyPlan => {
  const data = localStorage.getItem(STORAGE_KEY_SAFETY);
  return data ? JSON.parse(data) : DEFAULT_SAFETY_PLAN;
};

export const saveSafetyPlan = (plan: SafetyPlan): void => {
  localStorage.setItem(STORAGE_KEY_SAFETY, JSON.stringify(plan));
};
