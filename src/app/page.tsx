"use client";

import { useState, useEffect } from "react";
import { ProtocolUpload } from "@/components/protocol-upload";
import { ProtocolsList } from "@/components/protocol-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  List,
  CheckCircle,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useProtocols } from "@/services/hooks/useProtocol";
import { Protocol } from "@/services/api/protocol.service";

export default function Home() {
  const { user, isLoadingUser, isAuthenticated, logout, isLoggingOut } =
    useAuth();
  // Remove the useState for protocols
  // const [protocols, setProtocols] = useState<any[]>([])

  // Add the useProtocols hook
  const { protocols, createProtocol, isCreatingProtocol } = useProtocols();
  const [activeTab, setActiveTab] = useState("upload");
  const router = useRouter();

  useEffect(() => {
    if (!isLoadingUser && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoadingUser, isAuthenticated, router]);

  // Replace handleProtocolUpload function
  const handleProtocolUpload = (protocolData: any) => {
    createProtocol(protocolData, {
      onSuccess: () => {
        setActiveTab("list");
      },
    });
  };

  // Remove the setProtocols([]) line from handleLogout function
  const handleLogout = () => {
    setActiveTab("upload");
    logout();
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Protocol Manager
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Logged In
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 bg-transparent"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Protocol Management System
          </h2>
          <p className="text-gray-600">
            Upload, manage, and track your research protocols
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Protocol
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Protocols List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Protocol</CardTitle>
                <CardDescription>
                  Fill in the protocol details below. Required fields are marked
                  with an asterisk (*).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProtocolUpload onUpload={handleProtocolUpload} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Protocols</CardTitle>
                <CardDescription>
                  View and manage all uploaded protocols. Agent verification
                  status is shown for each protocol.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProtocolsList protocols={protocols as Protocol[]} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
