import api from "@/lib/axios"

export interface Protocol {
  id: string
  pi: string
  indication: string
  enrollmentStartDate: string
  isUpdated: boolean
  protocolId?: string
  uploadDate: string
  status: "uploaded" | "verification-pending" | "verified" | "duplicate"
  agentVerified: boolean
  userId: string
}

export interface CreateProtocolData {
  pi: string
  indication: string
  enrollmentStartDate: string
  isUpdated: boolean
  protocolId?: string
}

export interface UpdateProtocolData extends Partial<CreateProtocolData> {
  status?: Protocol["status"]
  agentVerified?: boolean
}

class ProtocolService {
  async createProtocol(data: CreateProtocolData): Promise<Protocol> {
    try {
      const response = await api.post("/api/protocols", data)
      return response.data.protocol
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create protocol")
    }
  }

  async getProtocols(): Promise<Protocol[]> {
    try {
      const response = await api.get("/api/protocols")
      return response.data.protocols
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch protocols")
    }
  }

  async getProtocol(id: string): Promise<Protocol> {
    try {
      const response = await api.get(`/api/protocols/${id}`)
      return response.data.protocol
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch protocol")
    }
  }

  async updateProtocol(id: string, data: UpdateProtocolData): Promise<Protocol> {
    try {
      const response = await api.put(`/api/protocols/${id}`, data)
      return response.data.protocol
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update protocol")
    }
  }

  async deleteProtocol(id: string): Promise<void> {
    try {
      await api.delete(`/api/protocols/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete protocol")
    }
  }

  async verifyProtocol(id: string): Promise<Protocol> {
    try {
      const response = await api.post(`/api/protocols/${id}/verify`)
      return response.data.protocol
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to verify protocol")
    }
  }

  async checkDuplicateProtocol(protocolId: string): Promise<{ isDuplicate: boolean; existingProtocol?: Protocol }> {
    try {
      const response = await api.get(`/api/protocols/check-duplicate/${protocolId}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to check for duplicates")
    }
  }

  async uploadProtocolDocument(id: string, file: File): Promise<{ documentUrl: string }> {
    try {
      const formData = new FormData()
      formData.append("document", file)

      const response = await api.post(`/api/protocols/${id}/upload-document`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload document")
    }
  }
}

export const protocolService = new ProtocolService()
