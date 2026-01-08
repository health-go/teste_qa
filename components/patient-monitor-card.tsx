"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { PatientMonitorCardProps } from "@/types/vital-signs"
import { VitalSignDisplay } from "@/components/vital-sign-display"
import { PATIENT_MOCK_DATA } from "@/data/patients"

export function PatientMonitorCard({ patient, onDownload }: PatientMonitorCardProps) {
  const router = useRouter()
  const isAlert = patient.status === "ALERTA"
  const age = patient.idade ?? PATIENT_MOCK_DATA[patient.paciente_id as keyof typeof PATIENT_MOCK_DATA]?.age ?? 0
  const displayData = patient

  const handleDownloadClick = () => {
    onDownload()
  }

  const handleViewDetails = () => {
    router.push(`/patient/${patient.paciente_id}`)
  }

  return (
    <Card className="bg-transparentrelative overflow-hidden rounded-none border-0 border-r last:border-r-0">

      <div className="flex w-full items-center gap-4">
        <div className="text-2xl text-white">{displayData.paciente_nome}</div>
        <div className="text-gray-400">{age}</div>
        <div className={`rounded text-xs px-2 py-1 font-semibold ${isAlert ? "bg-yellow-600 text-yellow-100" : "bg-green-600 text-green-100"}`}>
          {isAlert ? "ALERT" : patient.status}
        </div>
      </div>

      <div className="space-y-6">
        <VitalSignDisplay
          label="HR"
          value={patient.hr}
          type="ecg"
          alertCondition={isAlert && patient.hr > 100}
          isAlert={isAlert}
        />

        <VitalSignDisplay
          label="SpO₂"
          value={patient.spo2}
          type="pulse"
          alertCondition={isAlert && Number(patient.spo2) < 95}
          isAlert={isAlert}
        />

        <VitalSignDisplay
          label="SYS/DIA"
          value={`${patient.pressao_sys}/${patient.pressao_dia}`}
          type="pressure"
          alertCondition={isAlert && patient.pressao_sys > 140}
          isAlert={isAlert}
        />

        <VitalSignDisplay
          label="°C"
          value={patient.temp}
          type="temperature"
          alertCondition={isAlert && Number(patient.temp) > 37}
          isAlert={isAlert}
        />
      </div>

      <div className="flex gap-2 mt-6">
        <Button onClick={handleViewDetails} variant="outline" size="sm" className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
          <ExternalLink className="h-4 w-4 mr-2" /> View Details
        </Button>
        <Button onClick={handleDownloadClick} variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
