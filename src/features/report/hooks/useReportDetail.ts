// features/report/hooks/useReportDetail.ts
import { useEffect, useState } from 'react'
import { getReportById } from '../services/ReportService'
import type { ReportDetail } from '../types/report'

export const useReportDetail = (reportId?: number) => {
  const [data, setData] = useState<ReportDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!reportId) return
    setLoading(true)
    setError(null)
    getReportById(reportId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [reportId])

  return { data, loading, error }
}
