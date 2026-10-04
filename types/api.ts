export type Student = {
  id: string | number;
  name: string;
  email: string;
  course?: string;
  year?: number;
  section?: string;
  address?: string;
  contact?: string;
};

export type Profile = {
  id?: string | number;
  name?: string;
  email?: string;
  section?: string;
  role?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

// The instructor's successful login response is not documented. The API helper
// accepts either common token key and optionally a user/profile object.
export type LoginResponse = {
  access_token?: string;
  token?: string;
  user?: Profile;
  profile?: Profile;
};

export type ApiErrorBody = {
  error?: { name?: string; message?: string };
  message?: string;
};
