import type { PublicUser } from "./public-user";

export type LoginResponse = {
  accessToken: string;
  user: PublicUser;
};
