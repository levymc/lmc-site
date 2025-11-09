import type { AuthResponse } from "@lmc/types";

export class LoginResponseDto implements AuthResponse {
  token!: string;
  user!: {
    id: string;
    name: string;
    email: string;
  };
}
