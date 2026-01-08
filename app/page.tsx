"use client"

import { useState, useEffect } from "react"
import { PatientMonitorCard } from "@/components/patient-monitor-card"
import { Button } from "@/components/ui/button"
import { Download, Users } from "lucide-react"
import { CSVExportUtils } from "@/lib/csv-export-utils"

export default function MedicalMonitoringDashboard() {
  const [patients, setPatients] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const response = await fetch("/api/vital-signs")
        if (response.ok) {
          const result = await response.json()

          if (result.success && result.data && result.data.patients) {
            setPatients(result.data.patients)

            setIsConnected(true)
          } else {
            setIsConnected(false)
          }
        } else {
          setIsConnected(false)
        }
      } catch {
        setIsConnected(true)
      }
    }

    loadRealData()
    const interval = setInterval(loadRealData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDownloadData = (patientId: string) => {
    const patient = patients.find((p) => p.paciente_id === patientId)
    if (!patient) return
    CSVExportUtils.exportPatientData(patient)
  }

  const handleDownloadAllData = () => {
    if (patients.length === 0) return
    CSVExportUtils.exportAllPatientsData(patients)
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto text-white p-4">
      <div className="flex items-center justify-between p-4 mb-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl text-white">Multiparametric Monitoring</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-sm text-gray-300">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>

          <Button
            onClick={handleDownloadAllData}
            variant="outline"
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <PatientMonitorCard
              key={patient.paciente_id}
              patient={patient}
              onDownload={() => handleDownloadData(patient.paciente_id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Loading patient data...</div>
            <div className="text-gray-500 text-sm">Connecting to CSV files...</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 border-t pt-4">
        <div className="flex items-center gap-4">
          <span>Last Update: {lastUpdate ?? "--:--:--"}</span>
          <span>•</span>
          <span>{patients.length} Active Patients</span>
          <span>•</span>
          <span>Legal Basis: LGPD - Art. 7º, II</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>HBDF - Unidade de Terapia Intensiva</span>
        </div>
      </div>
    </div>
  )
}
