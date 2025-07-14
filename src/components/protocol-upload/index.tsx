"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";

interface ProtocolUploadProps {
  onUpload: (protocol: any) => void;
}

export function ProtocolUpload({ onUpload }: ProtocolUploadProps) {
  const [formData, setFormData] = useState({
    pi: "",
    indication: "",
    enrollmentStartDate: "",
    isUpdated: false,
    protocolId: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const principalInvestigators = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Emily Rodriguez",
    "Dr. David Thompson",
    "Dr. Lisa Wang",
  ];

  const indications = [
    "Oncology - Breast Cancer",
    "Oncology - Lung Cancer",
    "Cardiology - Heart Failure",
    "Neurology - Alzheimer's Disease",
    "Diabetes - Type 2",
    "Rheumatology - Rheumatoid Arthritis",
  ];

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.pi) newErrors.push("Principal Investigator is required");
    if (!formData.indication) newErrors.push("Indication is required");
    if (!formData.enrollmentStartDate)
      newErrors.push("Enrollment Start Date is required");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onUpload(formData);
      setFormData({
        pi: "",
        indication: "",
        enrollmentStartDate: "",
        isUpdated: false,
        protocolId: "",
      });
      setErrors([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pi">
            Principal Investigator (PI) <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.pi}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, pi: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Principal Investigator" />
            </SelectTrigger>
            <SelectContent>
              {principalInvestigators.map((pi) => (
                <SelectItem key={pi} value={pi}>
                  {pi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="indication">
            Indication <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.indication}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, indication: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Indication" />
            </SelectTrigger>
            <SelectContent>
              {indications.map((indication) => (
                <SelectItem key={indication} value={indication}>
                  {indication}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enrollmentStartDate">Enrollment Start Date</Label>
          <Input
            id="enrollmentStartDate"
            type="date"
            value={formData.enrollmentStartDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                enrollmentStartDate: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="protocolId">Protocol ID from Document</Label>
          <Input
            id="protocolId"
            type="text"
            placeholder="Enter protocol ID (if available)"
            value={formData.protocolId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, protocolId: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isUpdated"
          checked={formData.isUpdated}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isUpdated: checked as boolean }))
          }
        />
        <Label
          htmlFor="isUpdated"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Is It Updated <span className="text-red-500">*</span>
        </Label>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {formData.protocolId && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Protocol ID detected. Agent will verify if this protocol already
            exists in the system.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full">
        <Upload className="mr-2 h-4 w-4" />
        Upload Protocol
      </Button>
    </form>
  );
}
