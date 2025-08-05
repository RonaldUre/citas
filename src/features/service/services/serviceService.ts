// features/service/services/serviceService.ts
import { api } from '@/lib/axios'; // o donde tengas configurado tu cliente
import type { ServiceFormValues, ServiceResponse } from '../types/serviceTypes';

export const getServices = async (): Promise<ServiceResponse[]> => {
  const { data } = await api.get('/services');
  return data;
};

export const getServiceById = async (id: number): Promise<ServiceResponse> => {
  const { data } = await api.get(`/services/${id}`);
  return data;
};

export const createService = async (payload: ServiceFormValues): Promise<ServiceResponse> => {
  const { data } = await api.post('/services', payload);
  return data;
};

export const updateService = async (
  id: number,
  payload: ServiceFormValues
): Promise<ServiceResponse> => {
  const { data } = await api.put(`/services/${id}`, payload);
  return data;
};

export const deleteService = async (id: number): Promise<void> => {
  await api.delete(`/services/${id}`);
};
