// features/report/hooks/useReportExists.ts
import { useEffect, useState } from 'react'
import { existsReportsByAppointmentIds } from '../services/ReportService'

export const useReportExists = (appointmentIds: number[]) => {
  const [data, setData] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!appointmentIds.length) {
      setData({})
      return
    }
    setLoading(true)
    setError(null)
    existsReportsByAppointmentIds(appointmentIds)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [appointmentIds])

  return { data, loading, error }
}
