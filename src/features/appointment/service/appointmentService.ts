import { api } from '@/lib/axios'
import type {
  AppointmentStatus,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  AppointmentResponse,
  PaginatedResponse,
} from "../types/appointmentTypes";

type GetAppointmentsParams = {
  page?: number;
  limit?: number;
  userId?: number;
  clientId?: number;
  status?: AppointmentStatus;
  from?: string; // ISO string
  to?: string;   // ISO string
};

export const appointmentService = {
  // 🔹 GET /appointments?page=&limit=&userId=&clientId=&status=&from=&to=
  async getAll(params?: GetAppointmentsParams): Promise<PaginatedResponse<AppointmentResponse>> {
    const { data } = await api.get("/appointments", { params });
    return data;
  },

  // 🔹 GET /appointments/:id
  async getById(id: number): Promise<AppointmentResponse> {
    const { data } = await api.get(`/appointments/${id}`);
    return data;
  },

  // 🔹 POST /appointments
  async create(appointment: CreateAppointmentDTO): Promise<AppointmentResponse> {
    const { data } = await api.post("/appointments", appointment);
    return data;
  },

  // 🔹 PUT /appointments/:id
  async update(id: number, appointment: UpdateAppointmentDTO): Promise<AppointmentResponse> {
    const { data } = await api.put(`/appointments/${id}`, appointment);
    return data;
  },

  // 🔹 DELETE /appointments/:id
  async remove(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },
};