import { api } from '@/lib/axios'
import type { CreateUserDto, UpdateUserDto, UserResponse } from "../types/userTypes"

const ENDPOINT = "/users"

export const getUsers = async (): Promise<UserResponse[]> => {
  const res = await api.get<UserResponse[]>(ENDPOINT)
  return res.data
}

export const getUserById = async (id: number): Promise<UserResponse> => {
  const res = await api.get<UserResponse>(`${ENDPOINT}/${id}`)
  return res.data
}

export const createUser = async (data: CreateUserDto): Promise<UserResponse> => {
  const res = await api.post<UserResponse>(ENDPOINT, data)
  return res.data
}

export const updateUser = async (
  id: number,
  data: UpdateUserDto
): Promise<UserResponse> => {
  const res = await api.put<UserResponse>(`${ENDPOINT}/${id}`, data)
  return res.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${ENDPOINT}/${id}`)
}