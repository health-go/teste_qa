import { LGPDUtils } from "./lgpd-utils"

export class CSVExportUtils {
  // Convert patient data to CSV format
  static convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return ""

    // Get headers from the first object
    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(",")

    // Convert data rows
    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape commas and quotes in CSV values
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    )

    return [csvHeaders, ...csvRows].join("\n")
  }

  static pseudonymizePatientData(patient: any): any {
    return {
      ...patient,
      paciente_id: LGPDUtils.hashPatientId(patient.paciente_id),
      paciente_nome: LGPDUtils.pseudonymizeName(patient.paciente_nome),
      paciente_cpf: LGPDUtils.maskCPF(patient.paciente_cpf),
    }
  }

  static async loadHistoricalData(patientId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/vital-signs/history?patientId=${patientId}`)
      if (response.ok) {
        const data = await response.json()
        return data.map((record: any) => this.pseudonymizePatientData(record))
      }
    } catch (error) {
      console.error("Error loading historical data:", error)
    }
    return []
  }

  // Download CSV file
  static downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  static async exportPatientData(patient: any, includeHistorical = true): Promise<void> {
    const pseudonymizedPatient = this.pseudonymizePatientData(patient)
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `data_${pseudonymizedPatient.paciente_id.substring(0, 8)}_${timestamp}.csv`

    let dataToExport = [pseudonymizedPatient]

    if (includeHistorical) {
      const historicalData = await this.loadHistoricalData(patient.paciente_id)
      if (historicalData.length > 0) {
        dataToExport = historicalData
      }
    }

    const csvContent = this.convertToCSV(dataToExport)
    this.downloadCSV(csvContent, filename)
  }

  static async exportAllPatientsData(patients: any[]): Promise<void> {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `all_patients_data_${timestamp}.csv`

    const allHistoricalData: any[] = []

    for (const patient of patients) {
      const historicalData = await this.loadHistoricalData(patient.paciente_id)
      allHistoricalData.push(...historicalData)
    }

    // Sort by timestamp
    allHistoricalData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const csvContent = this.convertToCSV(allHistoricalData)
    this.downloadCSV(csvContent, filename)

  }
}