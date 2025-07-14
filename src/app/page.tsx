"use client";

import { useState } from "react";
import { LoginForm } from "@/components/login-form";
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
import { FileText, Upload, List, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [protocols, setProtocols] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("upload");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleProtocolUpload = (protocol: any) => {
    const newProtocol = {
      ...protocol,
      id: Date.now(),
      uploadDate: new Date().toISOString(),
      status: protocol.protocolId ? "verification-pending" : "uploaded",
      agentVerified: false,
    };
    setProtocols((prev) => [...prev, newProtocol]);
    setActiveTab("list");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProtocols([]);
    setActiveTab("upload");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Protocol Manager
            </h1>
            <p className="text-gray-600">
              Secure protocol upload and management system
            </p>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
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
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
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
                <ProtocolsList protocols={protocols} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
