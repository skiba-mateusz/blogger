import z from "zod";
import { api, handleAxiosError } from "@/lib/api-client";
import type { User } from "@/types/api";

export const loginUserRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerUserRequestSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginUserRequest = z.infer<typeof loginUserRequestSchema>;
export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;

export async function login(request: LoginUserRequest) {
  try {
    await api.post("/auth/login", request);
  } catch (err) {
    const message = handleAxiosError(err);
    throw new Error(message);
  }
}

export async function register(request: RegisterUserRequest): Promise<User> {
  try {
    const { data } = await api.post("/auth/register", request);
    return data;
  } catch (err) {
    const message = handleAxiosError(err);
    throw new Error(message);
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const { data } = await api.get("/users/current");
    return data;
  } catch (err) {
    const message = handleAxiosError(err);
    throw new Error(message);
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    const message = handleAxiosError(err);
    throw new Error(message);
  }
}
