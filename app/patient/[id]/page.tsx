"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Shield, TrendingUp, Clock, Eye, EyeOff, Users } from "lucide-react"
import { PatientVitalChart } from "@/components/patient-vital-chart"
import { PatientInfoPanel } from "@/components/patient-info-panel"
import { LGPDCompliance } from "@/lib/lgpd-utils"
import { parseTimestamp } from "@/lib/date-utils"
import { VitalSigns } from "@/types/vital-signs"
import { VitalSignDisplay } from "@/components/vital-sign-display"

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [currentVitals, setCurrentVitals] = useState<VitalSigns | null>(null)
  const [historicalData, setHistoricalData] = useState<VitalSigns[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [patientMockData, setPatientMockData] = useState<{ age: number; condition: string } | null>(null)

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const currentResponse = await fetch("/api/vital-signs")
        if (currentResponse.ok) {
          const response = await currentResponse.json()

          if (response.success && response.data && response.data.patients) {
            const patient = response.data.patients.find((p: VitalSigns) => p.paciente_id === patientId)

            if (patient) {
              setCurrentVitals(patient)
              setPatientMockData({
                age: patient.idade || 0,
                condition: patient.condicao || "Not specified",
              })

              const historyResponse = await fetch(`/api/vital-signs/history?patientId=${patientId}`)
              if (historyResponse.ok) {
                const historical = await historyResponse.json()
                setHistoricalData(historical)
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading patient data:", error)
      }
      setIsLoading(false)
    }
    loadPatientData()
  }, [patientId])

  const handleToggleSensitiveData = () => {
    setShowSensitiveData(!showSensitiveData)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p>Loading patient data...</p>
        </div>
      </div>
    )
  }

  if (!currentVitals) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Patient not found</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const displayData = showSensitiveData ? currentVitals : LGPDCompliance.anonymizePatientData(currentVitals)
  const isAlert = currentVitals.status === "ALERTA"
  const age = patientMockData?.age || 0

  return (
    <div className="min-h-screen max-w-4xl mx-auto text-white p-6">
      <div className="flex items-center gap-2 mb-4 border-0 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4">
            <h1 className="text-4xl text-white">{displayData.paciente_nome}</h1>
            <Button
              variant="ghost"
              size="default"
              onClick={handleToggleSensitiveData}
              className="text-gray-400 hover:text-white"
              title={showSensitiveData ? "Hide protected data" : "Show protected data"}
            >
              {showSensitiveData ? (
                <span className="flex items-center gap-2">
                  <EyeOff className="h-20 w-20" />
                  Hide Data
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Eye className="h-20 w-20" />
                  Show Data
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAlert ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-600 rounded">
              <span className="text-xs font-semibold text-yellow-100">ALERT</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-600 rounded">
              <span className="text-xs font-semibold text-green-100">NORMAL</span>
            </div>
          )}
        </div>
      </div>

      <Card className="bg-blue-900 border-blue-800 p-2 rounded-b-md mb-6">
        <div className="flex gap-2 items-center justify-center">
          <Shield className="h-4 w-4 text-blue-400" />
          <div className="font-semibold text-blue-100">LGPD Protection -</div>
          <div className="text-sm text-blue-200">
            Patient data is protected under LGPD Art. 7º, II. Access is logged for audit purposes.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Patient Info Panel */}
        <div className="">
          <PatientInfoPanel
            patient={displayData}
            age={age}
            showSensitiveData={showSensitiveData}
            medicalCondition={patientMockData?.condition}
          />
        </div>

        {/* Main Monitoring Area */}
        <div className="space-y-6">
          {/* Current Vital Signs */}
          <Card className="p-6 bg-transparent border-0 rounded-none">
            <div className="flex-col items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-400" />
                <h2 className="text-2xl text-white">Current Vital Signs</h2>
              </div>
              <div className="text-sm text-gray-400 px-7">
                Last updated:{" "}
                {currentVitals.timestamp
                  ? parseTimestamp(currentVitals.timestamp).toLocaleTimeString("en-US", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                  : "No time available"}
              </div>

            </div>

            <div className="space-y-6 mt-6">

              <VitalSignDisplay
                label="HR"
                value={currentVitals.hr}
                type="ecg"
                alertCondition={isAlert && currentVitals.hr > 100}
                isAlert={isAlert}
              />

              <VitalSignDisplay
                label="SpO₂"
                value={currentVitals.spo2}
                type="pulse"
                alertCondition={isAlert && Number(currentVitals.spo2) < 95}
                isAlert={isAlert}
              />

              <VitalSignDisplay
                label="SYS/DIA"
                value={`${currentVitals.pressao_sys}/${currentVitals.pressao_dia}`}
                type="pressure"
                alertCondition={isAlert && currentVitals.pressao_sys > 140}
                isAlert={isAlert}
              />

              <VitalSignDisplay
                label="°C"
                value={currentVitals.temp}
                type="temperature"
                alertCondition={isAlert && Number(currentVitals.temp) > 37}
                isAlert={isAlert}
              />
            </div>
          </Card>
        </div>
      </div >

      <Card className="bg-transparent p-6 border-0 border-t rounded-none">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <h2 className="text-2xl text-white">Last Trends</h2>
        </div>
        <PatientVitalChart data={historicalData} />
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-400 border-t pt-4">
        <div className="flex items-center gap-4">
          <span>Multiparametric Monitoring</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>HBDF - Unidade de Terapia Intensiva</span>
        </div>
      </div>
    </div >
  )
}
