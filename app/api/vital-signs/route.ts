import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import { PATIENT_MOCK_DATA } from "@/data/patients"

// In a real implementation, this would send to web server
// await fetch('http://localhost:3000/api/vital-signs', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(data)
// });

// CVS local files simulation
const CSV_FILES = [
  { path: "data/dados_pac001.csv", id: "PAC001" },
  { path: "data/dados_pac002.csv", id: "PAC002" },
  { path: "data/dados_pac003.csv", id: "PAC003" },
]

const patientData: { [key: string]: any[] } = {}
const patientCurrentIndex: { [key: string]: number } = {}
let simulationStartTime = 0
const DATA_INTERVAL = 200 // 200ms = 5Hz

// CSV Parsing and Loading
function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const record: any = {}

    headers.forEach((header, index) => {
      const value = values[index]?.trim() || ""

      // Numberic conversion
      if (header === "hr" || header === "pressao_sys" || header === "pressao_dia" || header === "resp_freq") {
        record[header] = Number.parseFloat(value) || 0
      } else if (header === "spo2" || header === "temp") {
        record[header] = value
      } else {
        record[header] = value
      }
    })

    return record
  })
}

async function loadCSVData() {
  if (Object.keys(patientData).length > 0) {
    return patientData
  }

  try {
    for (const file of CSV_FILES) {
      try {
        const fullPath = join(process.cwd(), file.path)
        const csvText = readFileSync(fullPath, "utf-8")
        const parsedData = parseCSV(csvText)

        patientData[file.id] = parsedData
        patientCurrentIndex[file.id] = 0 // index inicial

      } catch (fileError) {
        console.error(`CSV loadin error for file: ${file.path}`, fileError)
        continue
      }
    }

    simulationStartTime = Date.now()
    return patientData
  } catch (error) {
    console.error("CSV loading error:", error)
    return {}
  }
}

function getCurrentVitalSigns() {
  const now = Date.now()
  const elapsedTime = now - simulationStartTime

  const currentDataPoint = Math.floor(elapsedTime / DATA_INTERVAL)

  const patients = []

  for (const patientId of Object.keys(patientData)) {
    const data = patientData[patientId]
    if (data && data.length > 0) {
      const currentIndex = currentDataPoint % data.length
      const record = data[currentIndex]

      const mockData = PATIENT_MOCK_DATA[patientId as keyof typeof PATIENT_MOCK_DATA]

      patients.push({
        paciente_id: record.paciente_id,
        paciente_nome: record.paciente_nome,
        paciente_cpf: record.paciente_cpf,
        hr: record.hr,
        spo2: record.spo2,
        pressao_sys: record.pressao_sys,
        pressao_dia: record.pressao_dia,
        temp: record.temp,
        resp_freq: record.resp_freq,
        status: record.status || "NORMAL",
        idade: mockData?.age || null,
        condicao: mockData?.condition || null,
        timestamp: record.timestamp,
      })
    }
  }

  return {
    timestamp: new Date().toISOString(),
    patients: patients,
    simulationInfo: {
      elapsedTime: Math.floor(elapsedTime / 1000),
      currentDataPoint: currentDataPoint,
      dataRate: "5Hz (200ms interval)",
    },
  }
}

export async function GET() {
  try {
    // Carregar dados CSV se necessário
    await loadCSVData()

    const vitalSigns = getCurrentVitalSigns()

    if (!vitalSigns.patients || vitalSigns.patients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "CSV files not found or no patient data available",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: vitalSigns,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Vitals signs API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server internal error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {

    return NextResponse.json({
      success: true,
      message: "Received data successfully",
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Processing data failed",
      },
      { status: 500 },
    )
  }
}
