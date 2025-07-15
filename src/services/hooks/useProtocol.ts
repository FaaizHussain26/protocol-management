"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { protocolService, type CreateProtocolData, type UpdateProtocolData } from "@/services/api/protocol.service"

export function useProtocols() {
  const queryClient = useQueryClient()

  // Get all protocols
  const {
    data: protocols = [],
    isLoading: isLoadingProtocols,
    error: protocolsError,
  } = useQuery({
    queryKey: ["protocols"],
    queryFn: protocolService.getProtocols,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Create protocol mutation
  const createProtocolMutation = useMutation({
    mutationFn: (data: CreateProtocolData) => protocolService.createProtocol(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] })
    },
  })

  // Update protocol mutation
  const updateProtocolMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProtocolData }) => protocolService.updateProtocol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] })
    },
  })

  // Delete protocol mutation
  const deleteProtocolMutation = useMutation({
    mutationFn: (id: string) => protocolService.deleteProtocol(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] })
    },
  })

  // Verify protocol mutation
  const verifyProtocolMutation = useMutation({
    mutationFn: (id: string) => protocolService.verifyProtocol(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] })
    },
  })

  // Check duplicate protocol
  const checkDuplicateMutation = useMutation({
    mutationFn: (protocolId: string) => protocolService.checkDuplicateProtocol(protocolId),
  })

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => protocolService.uploadProtocolDocument(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["protocols"] })
    },
  })

  return {
    // Data
    protocols,
    isLoadingProtocols,
    protocolsError: protocolsError?.message,

    // Create
    createProtocol: createProtocolMutation.mutate,
    isCreatingProtocol: createProtocolMutation.isPending,
    createProtocolError: createProtocolMutation.error?.message,

    // Update
    updateProtocol: updateProtocolMutation.mutate,
    isUpdatingProtocol: updateProtocolMutation.isPending,
    updateProtocolError: updateProtocolMutation.error?.message,

    // Delete
    deleteProtocol: deleteProtocolMutation.mutate,
    isDeletingProtocol: deleteProtocolMutation.isPending,
    deleteProtocolError: deleteProtocolMutation.error?.message,

    // Verify
    verifyProtocol: verifyProtocolMutation.mutate,
    isVerifyingProtocol: verifyProtocolMutation.isPending,
    verifyProtocolError: verifyProtocolMutation.error?.message,

    // Check duplicate
    checkDuplicate: checkDuplicateMutation.mutate,
    isCheckingDuplicate: checkDuplicateMutation.isPending,
    duplicateCheckResult: checkDuplicateMutation.data,
    duplicateCheckError: checkDuplicateMutation.error?.message,

    // Upload document
    uploadDocument: uploadDocumentMutation.mutate,
    isUploadingDocument: uploadDocumentMutation.isPending,
    uploadDocumentError: uploadDocumentMutation.error?.message,
  }
}
