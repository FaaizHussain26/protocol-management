import api from "@/lib/axios"

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

class ApiService {
  // Generic GET request
  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await api.get(endpoint)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `GET ${endpoint} failed`)
    }
  }

  // Generic POST request
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.post(endpoint, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `POST ${endpoint} failed`)
    }
  }

  // Generic PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await api.put(endpoint, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `PUT ${endpoint} failed`)
    }
  }

  // Generic DELETE request
  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await api.delete(endpoint)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `DELETE ${endpoint} failed`)
    }
  }

  // Upload file
  async uploadFile<T = any>(endpoint: string, file: File, fieldName = "file"): Promise<T> {
    try {
      const formData = new FormData()
      formData.append(fieldName, file)

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `File upload to ${endpoint} failed`)
    }
  }
}

export const apiService = new ApiService()
