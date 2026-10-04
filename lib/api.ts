import { API_BASE_URL } from '@/constants/api';
import type { ApiErrorBody, LoginRequest, LoginResponse, Profile, Student } from '@/types/api';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function errorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const body = payload as ApiErrorBody;
    const message = body.error?.message ?? body.message;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return `The request failed (HTTP ${status}).`;
}

async function requestJson<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the service. Check your connection and try again.');
  }

  const payload = await readJson(response);
  if (!response.ok) throw new ApiError(errorMessage(payload, response.status), response.status);
  if (payload === null) throw new Error('The service returned an empty or invalid JSON response.');
  return payload as T;
}

export async function signInRequest(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    return await requestJson<LoginResponse>('/login', undefined, {
      method: 'POST',
      // Ask Postman Mock to select the saved success/error example by exact body.
      // No credentials are embedded here; they always come from the sign-in form.
      headers: { 'x-mock-match-request-body': 'true' },
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error(
        'Invalid email or password, or no saved Postman login example matches this request. Check the credentials and the POST /login example body.',
      );
    }
    throw error;
  }
}

export function getStudents(token: string): Promise<Student[]> {
  return requestJson<Student[]>('/students', token);
}

export function getStudent(token: string, id: string): Promise<Student> {
  return requestJson<Student>(`/students/${encodeURIComponent(id)}`, token);
}

export function getProfile(token: string): Promise<Profile> {
  return requestJson<Profile>('/profile', token);
}

export function extractLoginToken(response: LoginResponse): string | null {
  const token = response.access_token ?? response.token;
  return typeof token === 'string' && token.trim().length > 0 ? token : null;
}
