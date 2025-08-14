import { useEffect, useMemo, useState } from "react"
import { appointmentService } from "../../appointment/service/appointmentService"
import type { AppointmentResponse, PaginatedResponse } from "../../appointment/types/appointmentTypes"
import { CrudTable } from "@/components/shared/CrudTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useReportExists } from "@/features/report/hooks/useReportExists"
import { CreateReportModal } from "@/features/report/components/CreateReportModal"
import { ReportDetailModal } from "@/features/report/components/ReportDetailModal"
import { getLatestByAppointment } from "@/features/report/services/ReportService" // 👈 método para traer el último reporte por cita
import type { ReportDetail } from "@/features/report/types/report"

const PAGE_SIZE = 10

type ReportFilter = "all" | "with" | "without"

export function AppointmentListPage() {
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<PaginatedResponse<AppointmentResponse> | null>(null)
  const [reportFilter, setReportFilter] = useState<ReportFilter>("all")

  // modal crear reporte
  const [createOpen, setCreateOpen] = useState(false)
  const [apptForReport, setApptForReport] = useState<AppointmentResponse | null>(null)

  // modal ver reporte
  const [detailOpen, setDetailOpen] = useState(false)
  const [reportForDetail, setReportForDetail] = useState<ReportDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const res = await appointmentService.getAll({ page, limit: PAGE_SIZE })
      setData(res)
    } catch (err) {
      console.error(err)
      toast.error("Error al cargar las citas")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // IDs de la página actual para consultar existencia de reportes
  const pageAppointmentIds = useMemo(
    () => (data?.data ?? []).map((a) => a.id),
    [data]
  )

  // Mapa appointmentId -> boolean (al menos 1 reporte)
  const { data: reportMap, loading: loadingExists } = useReportExists(pageAppointmentIds)

  // Filtrado (dentro de la página actual)
  const filteredRows = useMemo(() => {
    const base = data?.data ?? []
    if (reportFilter === "all") return base
    if (!reportMap) return base
    return base.filter((a) => {
      const hasReport = !!reportMap[a.id]
      return reportFilter === "with" ? hasReport : !hasReport
    })
  }, [data, reportFilter, reportMap])

  const totalPages = useMemo(() => {
    const meta = data?.meta
    if (!meta) return 1
    return meta.totalPages ?? Math.max(1, Math.ceil(meta.total / meta.limit))
  }, [data])

  // Handlers
  const handleCreateReport = (appointment: AppointmentResponse) => {
    setApptForReport(appointment)
    setCreateOpen(true)
  }

  const handleViewReport = async (appointment: AppointmentResponse) => {
    try {
      setDetailLoading(true)
      // 👇 trae el último reporte de esa cita (necesita endpoint/método en service)
      const rep = await getLatestByAppointment(appointment.id)
      if (!rep) {
        toast.info("Esta cita no tiene reportes.")
        return
      }
      setReportForDetail(rep)
      setDetailOpen(true)
    } catch (e) {
      console.error(e)
      toast.error("No se pudo cargar el reporte")
    } finally {
      setDetailLoading(false)
    }
  }

  const renderDateTime = (iso: string | Date) => {
    const d = typeof iso === "string" ? new Date(iso) : iso
    return d.toLocaleString()
  }

  return (
    <div className="space-y-6 px-4 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Citas</h1>

        <div className="flex items-center gap-2">
          <Select
            value={reportFilter}
            onValueChange={(v) => setReportFilter(v as ReportFilter)}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filtrar por reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="with">Con reporte</SelectItem>
              <SelectItem value="without">Sin reporte</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchAppointments} disabled={isLoading}>
            Refrescar
          </Button>
        </div>
      </div>

      {/* Mobile - Cards */}
      <div className="space-y-4 md:hidden">
        {(filteredRows ?? []).map((a) => {
          const hasReport = !!reportMap?.[a.id]
          return (
            <Card key={a.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{renderDateTime(a.date)}</div>
                <Badge variant={hasReport ? "default" : "secondary"}>
                  {hasReport ? "Con reporte" : "Sin reporte"}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">Cliente: {a.client?.name ?? "—"}</div>
              <div className="text-sm text-muted-foreground">Profesional: {a.user?.name ?? "—"}</div>
              <div className="text-sm text-muted-foreground">Servicio: {a.service?.name ?? "—"}</div>
              <div className="text-sm">Estado: {a.status}</div>

              <div className="pt-2 flex gap-2 flex-wrap">
                {hasReport ? (
                  <Button size="sm" variant="outline" onClick={() => handleViewReport(a)} disabled={detailLoading}>
                    Ver reporte
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleCreateReport(a)}>
                    Crear reporte
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Desktop - Tabla */}
      <div className="hidden md:block">
        <CrudTable<AppointmentResponse>
          data={filteredRows}
          isLoading={isLoading || loadingExists}
          columns={[
            { header: "Fecha/Hora", render: (a) => renderDateTime(a.date) },
            { header: "Cliente", render: (a) => a.client?.name ?? "—" },
            { header: "Profesional", render: (a) => a.user?.name ?? "—" },
            { header: "Servicio", render: (a) => a.service?.name ?? "—" },
            { header: "Estado", render: (a) => a.status },
            {
              header: "Reporte",
              render: (a) => {
                const hasReport = !!reportMap?.[a.id]
                return (
                  <Badge variant={hasReport ? "default" : "secondary"}>
                    {hasReport ? "Con reporte" : "Sin reporte"}
                  </Badge>
                )
              },
            },
            {
              header: "Acción",
              render: (a) => {
                const hasReport = !!reportMap?.[a.id]
                return hasReport ? (
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(a)} disabled={detailLoading}>
                    Ver reporte
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleCreateReport(a)}>
                    Crear reporte
                  </Button>
                )
              },
            },
          ]}
        />
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Modal Crear Reporte */}
      {apptForReport && (
        <CreateReportModal
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          appointmentId={apptForReport.id}
          onCreated={fetchAppointments} // refetch para actualizar la tabla
          appointmentSummary={{
            client: apptForReport.client?.name,
            professional: apptForReport.user?.name,
            service: apptForReport.service?.name,
            date: apptForReport.date,
          }}
        />
      )}

      {/* Modal Detalle de Reporte */}
      <ReportDetailModal
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setReportForDetail(null)
        }}
        initialReport={reportForDetail ?? undefined}
      />
    </div>
  )
}
