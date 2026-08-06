import { create } from 'zustand';

export type SystemRole = 'GUEST' | 'USER' | 'ORG_MEMBER' | 'ORG_ADMIN' | 'SYSTEM_ADMIN';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  systemRole: SystemRole;
}

interface AuthStoreState {
  isAuthenticated: boolean;
  user: UserSession | null;
  sessionKey: string | null;
  login: (user: UserSession, sessionKey: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  isAuthenticated: false,
  user: null,
  sessionKey: null,

  login: (user, sessionKey) =>
    set({
      isAuthenticated: true,
      user,
      sessionKey,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      sessionKey: null,
    }),
}));
