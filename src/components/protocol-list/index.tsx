"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Protocol } from "@/services/api/protocol.service";
import { CheckCircle, Clock, AlertTriangle, Eye, Bot } from "lucide-react";


interface ProtocolsListProps {
  protocols: Protocol[];
}

export function ProtocolsList({ protocols }: ProtocolsListProps) {
  const getStatusBadge = (status: string, agentVerified: boolean) => {
    switch (status) {
      case "uploaded":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Uploaded
          </Badge>
        );
      case "verification-pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Agent Verifying
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "duplicate":
        return (
          <Badge
            variant="secondary"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Duplicate Found
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (protocols.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No protocols uploaded yet
        </h3>
        <p className="text-gray-500">
          Upload your first protocol to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {protocols.map((protocol) => (
        <Card key={protocol.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{protocol.indication}</CardTitle>
                <CardDescription className="mt-1">
                  PI: {protocol.pi} • Uploaded:{" "}
                  {new Date(protocol.uploadDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(protocol.status, protocol.agentVerified)}
                {protocol.protocolId && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    ID: {protocol.protocolId}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  Enrollment Start:
                </span>
                <p className="text-gray-900">
                  {protocol.enrollmentStartDate || "Not specified"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Updated:</span>
                <p className="text-gray-900">
                  {protocol.isUpdated ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <p className="text-gray-900 capitalize">
                  {protocol.status.replace("-", " ")}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Agent Check:</span>
                <p className="text-gray-900">
                  {protocol.protocolId ? "Required" : "Not needed"}
                </p>
              </div>
            </div>

            {protocol.protocolId &&
              protocol.status === "verification-pending" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      Agent is verifying if protocol ID "{protocol.protocolId}"
                      already exists in the system...
                    </span>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
