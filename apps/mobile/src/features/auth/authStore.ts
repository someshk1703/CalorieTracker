import { create } from "zustand";

export interface AuthUser {
  id: string;
  displayName: string;
  token: string;
}

export interface AuthState {
  user: AuthUser | null;
  hasCompletedOnboarding: boolean;
  setUser: (user: AuthUser | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user }),
  setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding })
}));

export function getInitialRouteForAuthState(
  user: AuthUser | null,
  hasCompletedOnboarding: boolean
): "/sign-in" | "/onboarding" | "/(tabs)" {
  if (!user) {
    return "/sign-in";
  }

  if (!hasCompletedOnboarding) {
    return "/onboarding";
  }

  return "/(tabs)";
}