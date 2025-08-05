import { api } from '@/lib/axios'
import { type PaginatedResponse } from '@/types/pagination'

export interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  notes?: string
  createdAt: string
}

export interface CreateClientPayload {
  name: string
  email?: string
  phone?: string
  notes?: string
}

export type UpdateClientPayload = Partial<CreateClientPayload>

export interface Appointment {
  id: number
  date: string
  time: string
  // Agrega más campos si tu modelo lo tiene
}

export const getClients = (page = 1, limit = 10) =>
  api.get<PaginatedResponse<Client>>('/clients', {
    params: { page, limit },
  })

export const getClient = (id: number) =>
  api.get<Client>(`/clients/${id}`)

export const createClient = (data: CreateClientPayload) =>
  api.post<Client>('/clients', data)

export const updateClient = (id: number, data: UpdateClientPayload) =>
  api.put<Client>(`/clients/${id}`, data)

export const deleteClient = (id: number) =>
  api.delete(`/clients/${id}`)

export const getClientAppointments = (id: number) =>
  api.get<Appointment[]>(`/clients/${id}/appointments`)

export const getAllClients = () =>
  api.get<Client[]>('/clients/all')