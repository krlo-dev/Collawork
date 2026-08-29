import type { ProfileUpdateInput, User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.detail ?? "Ha ocurrido un error");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function registerUser(name: string, email: string, password: string) {
  return request<{ access_token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email: string, password: string) {
  return request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMyProfile(token: string) {
  return request<User>("/users/me", {}, token);
}

export function getPublicProfile(id: number | string) {
  return request<User>(`/users/${id}`);
}

export function updateMyProfile(token: string, data: ProfileUpdateInput) {
  return request<User>("/users/me", { method: "PUT", body: JSON.stringify(data) }, token);
}

export function discoverUsers(params: { skill?: string; location?: string; q?: string }) {
  const search = new URLSearchParams();
  if (params.skill) search.set("skill", params.skill);
  if (params.location) search.set("location", params.location);
  if (params.q) search.set("q", params.q);
  const qs = search.toString();
  return request<User[]>(`/discovery${qs ? `?${qs}` : ""}`);
}
