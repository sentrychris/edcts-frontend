import { Commander } from "./Commander";

export interface AuthorizationServerInformation {
  authorization_url: string;
  code_verifier: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  commander: Commander;
  frontier_user: {
    frontier_id: string;
    created_at: string;
    updated_at: string;
  }
}

export type SessionUser = Omit<AuthUser, "id" | "frontier_user">;

export interface AuthSession {
  user: SessionUser;
  expires: string;
}