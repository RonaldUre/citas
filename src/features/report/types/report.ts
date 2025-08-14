// src/types/report.ts

export interface Report {
  id: number;
  description: string;
  isForEventCancel: boolean;
  hasRecovery: boolean;
  createdAt: string; // Date ISO string desde el backend
  appointmentId: number;
  createdById: number;
}

export interface ReportDetail extends Omit<Report, 'createdById'> {
  createdBy: {
    id: number;
    name: string;
  } | null;
  appointment: {
    id: number;
    date: string; // ISO string
    status: string;
  } | null;
}