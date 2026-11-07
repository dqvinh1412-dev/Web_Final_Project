import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
import type { User } from '../types/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isHydrating: boolean
  setSession: (user: User, accessToken: string) => void
  clearSession: () => void
  logout: () => Promise<void>
  hydrateSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrating: false,

      setSession: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isHydrating: false,
        }),

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isHydrating: false,
        }),

      logout: async () => {
        const currentToken = get().accessToken
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isHydrating: false,
        })
        await authService.logout(currentToken)
      },

      hydrateSession: async () => {
        const { accessToken, user } = get()
        if (!accessToken) {
          set({ user: null, isAuthenticated: false, isHydrating: false })
          return
        }
        if (user) {
          set({ isAuthenticated: true, isHydrating: false })
          return
        }

        set({ isHydrating: true })
        try {
          const resolvedUser = await authService.getCurrentUser(accessToken)
          set({
            user: resolvedUser,
            accessToken,
            isAuthenticated: true,
            isHydrating: false,
          })
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isHydrating: false,
          })
        }
      },
    }),
    {
      name: 'wnd-auth-session',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
