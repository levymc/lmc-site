export type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: UserProfile;
};
