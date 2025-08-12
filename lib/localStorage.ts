"use client";

export interface ApplicationData {
  applicant?: {
    firstName: string;
    lastName: string;
    dob: string;
    phone: string;
    email: string;
    language?: string;
  };
  housing?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    monthlyRent: number;
    monthsBehind: number;
    landlordName?: string;
    landlordPhone?: string;
  };
  household?: {
    size: number;
    members?: Array<{
      relation: string;
      ageRange: string;
      incomeBand: string;
    }>;
  };
  eligibility?: {
    hardship: boolean;
    typedSignature: string;
    signedAtISO: string;
  };
  prompt?: string;
  dynamicSpec?: any;
  dynamicAnswers?: Record<string, unknown>;
}

const STORAGE_KEY = "era-demo-application";

export function saveToLocalStorage(data: Partial<ApplicationData>) {
  if (typeof window === "undefined") return;
  
  const existing = getFromLocalStorage();
  const updated = { ...existing, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getFromLocalStorage(): ApplicationData {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function clearLocalStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}