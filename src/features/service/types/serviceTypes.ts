// features/service/types/serviceTypes.ts

export type ServiceResponse = {
  id: number;
  name: string;
  description?: string;
  duration: number; // en minutos
  price?: number;
  createdAt: string; // ISO string desde el backend
};

// Este tipo lo usarás en formularios (crear y editar)
export type ServiceFormValues = {
  name: string;
  description?: string;
  duration: number;
  price?: number;
};
