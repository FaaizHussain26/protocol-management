import api, { setAuthToken, removeAuthToken } from "@/lib/axios"

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: string
  username: string
  email: string
  name: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  name: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post("/api/auth/login", credentials)
      const { user, token, refreshToken } = response.data

      // Store token automatically
      setAuthToken(token)

      if (refreshToken) {
        localStorage.setItem("refresh-token", refreshToken)
      }

      return { user, token, refreshToken }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post("/api/auth/register", userData)
      const { user, token, refreshToken } = response.data

      // Store token automatically
      setAuthToken(token)

      if (refreshToken) {
        localStorage.setItem("refresh-token", refreshToken)
      }

      return { user, token, refreshToken }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout")
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error)
    } finally {
      // Always remove tokens locally
      removeAuthToken()
      localStorage.removeItem("refresh-token")
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get("/api/auth/me")
      return response.data.user
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get current user")
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem("refresh-token")
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await api.post("/api/auth/refresh", { refreshToken })
      const { token } = response.data

      setAuthToken(token)
      return token
    } catch (error: any) {
      removeAuthToken()
      localStorage.removeItem("refresh-token")
      throw new Error(error.response?.data?.message || "Token refresh failed")
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password change failed")
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/api/auth/forgot-password", { email })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send reset email")
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post("/api/auth/reset-password", { token, newPassword })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed")
    }
  }
}

export const authService = new AuthService()
