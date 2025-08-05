// Tipos base del modelo
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

// Entidad relacionada
export type BasicUser = {
  id: number;
  name: string;
};

export type BasicClient = {
  id: number;
  name: string;
};

export type BasicService = {
  id: number;
  name: string;
};

// Respuesta completa de una cita (GET /appointments/:id)
export type AppointmentResponse = {
  id: number;
  date: string; // ISO format
  status: AppointmentStatus;
  tag?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  user: BasicUser;
  client: BasicClient;
  service?: BasicService;
};

// Resumen de cita sin relaciones (para listados simples)
export type Appointment = {
  id: number;
  date: string;
  status: AppointmentStatus;
  tag?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  clientId: number;
  serviceId?: number;
};

// Crear una cita
export type CreateAppointmentDTO = {
  date: string;
  status: AppointmentStatus;
  tag?: string;
  isRecurring?: boolean;
  userId: number;
  clientId: number;
  serviceId?: number;
};

// Actualizar una cita
export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;

// Paginación genérica
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
