// features/report/services/reportService.ts
import { api } from '@/lib/axios'
import type { Report, ReportDetail } from '../types/report'
import type { CreateReportFormValues, UpdateReportFormValues } from '../schemas/reportSchema'

export const getReports = async (): Promise<Report[]> => {
  const { data } = await api.get('/reports')
  return data
}

export const getReportById = async (id: number): Promise<ReportDetail> => {
  const { data } = await api.get(`/reports/${id}`)
  return data
}

export const createReport = async (payload: CreateReportFormValues): Promise<Report> => {
  const { data } = await api.post('/reports', payload)
  return data
}

export const updateReport = async (id: number, payload: UpdateReportFormValues): Promise<Report> => {
  const { data } = await api.put(`/reports/${id}`, payload)
  return data
}

export const deleteReport = async (id: number): Promise<void> => {
  await api.delete(`/reports/${id}`)
}

/** Batch: mapa appointmentId -> boolean (existe al menos 1 reporte) */
export const existsReportsByAppointmentIds = async (
  appointmentIds: number[]
): Promise<Record<number, boolean>> => {
  if (!appointmentIds.length) return {}
  const qs = appointmentIds.join(',')
  const { data } = await api.get(`/reports/exists?appointmentIds=${qs}`)
  return data
}

export const getLatestByAppointment = async (appointmentId: number): Promise<ReportDetail | null> => {
  const { data } = await api.get(`/reports/by-appointment/${appointmentId}/latest`) // 👈 path correcto
  return data ?? null
}