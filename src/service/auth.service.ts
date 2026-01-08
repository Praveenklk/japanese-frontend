import api from "../api/api";

/**
 * ===== Payload Types =====
 */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  email?: string;
}

/**
 * ===== AUTH SERVICES =====
 */

/**
 * REGISTER
 * POST /auth/register
 */
export const register = (payload: RegisterPayload) => {
  return api.post<AuthResponse>("/auth/register", payload);
};

/**
 * LOGIN
 * POST /auth/login
 */
export const login = (payload: LoginPayload) => {
  return api.post<AuthResponse>("/auth/login", payload);
};

/**
 * LOGOUT
 * POST /auth/logout
 */
export const logout = () => {
  return api.post<AuthResponse>("/auth/logout");
};
