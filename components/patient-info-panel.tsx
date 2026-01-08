"use client"

import { Card } from "@/components/ui/card"
import { User, FileText, Shield } from "lucide-react"
import { LGPDCompliance } from "@/lib/lgpd-utils"
import { PatientInfoPanelProps } from "@/types/vital-signs"

export function PatientInfoPanel({ patient, age, showSensitiveData, medicalCondition }: PatientInfoPanelProps) {
  const displayData = showSensitiveData ? patient : LGPDCompliance.anonymizePatientData(patient)

  const conditions = medicalCondition ? [medicalCondition] : ["Não informado"]

  return (
    <div className="gap-4 space-y-6">
      <Card className="p-6 border-0 border-r rounded-none bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl text-white">Patient Information</h2>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-blue-300">{showSensitiveData ? "Full Data" : "Protected"}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Full Name</label>

            <div className="flex items-center gap-2 py-2 px-4 bg-accent rounded">
              <p className="text-white font-medium">{displayData.paciente_nome}</p>
              <Shield className="h-4 w-4 text-blue-400 ml-auto" />
            </div>
          </div>

          <div>
            <label className="gap-1 text-sm text-gray-400">Patient ID</label>
            <div className="flex items-center gap-2 py-2 px-4 bg-accent rounded">
              <p className="text-white font-medium">{showSensitiveData ? patient.paciente_id : "******"}</p>
              <Shield className="h-4 w-4 text-blue-400 ml-auto" />
            </div>
          </div>
          <div>
            <label className="px-1 text-sm text-gray-400">CPF</label>
            <div className="flex items-center gap-2 py-2 px-4 bg-accent rounded">
              <p className="text-white font-medium">{displayData.paciente_cpf}</p>
              <Shield className="h-4 w-4 text-blue-400 ml-auto" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Age</label>
            <div className="flex items-center gap-2 py-2 px-4 bg-accent rounded">
              <p className="text-white font-medium">{age} years</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-red-400" />
          <h2 className="text-xl font-semibold text-white">Medical Conditions</h2>
        </div>
        <div>
          {showSensitiveData ? (
            conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-accent rounded">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-white">{condition}</span>
                <Shield className="h-4 w-4 text-red-400 ml-auto" />
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 py-2 px-4 bg-accent rounded">
              <span className="text-gray-400">*** *** ***</span>
              <Shield className="h-4 w-4 text-red-400 ml-auto" />
            </div>
          )}
        </div>

      </Card>
    </div >
  )
}
