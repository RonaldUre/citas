export type UserRole = "ADMIN" | "PROFESSIONAL"

export interface UserResponse {
  id: number
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt?: string
  lastLogin?: string
}

// Para POST /users
export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string
}

// Para PUT /users/:id
export type UpdateUserDto = Partial<CreateUserDto>