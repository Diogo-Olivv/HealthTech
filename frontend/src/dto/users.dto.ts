export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  name: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  user: UserProfile;
};
