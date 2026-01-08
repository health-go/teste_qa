import { type NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import { CSV_FILE_MAP } from "@/data/csv-files"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    //search path on map
    const csvFile = CSV_FILE_MAP[patientId]
    if (!csvFile) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // CSV Reading
    const csvPath = join(process.cwd(), csvFile) // já inclui "data/..."
    const csvContent = readFileSync(csvPath, "utf-8")

    // CSV Parsing
    const lines = csvContent.trim().split("\n")
    const headers = lines[0].split(",")

    const historicalData = lines.slice(1).map((line) => {
      const values = line.split(",")
      const record: Record<string, string | number> = {}

      headers.forEach((header, index) => {
        const cleanHeader = header.trim()
        let value: string | number = values[index]?.trim() || ""

        // Numeric conversion
        if (["hr", "pressao_sys", "pressao_dia", "resp_freq"].includes(cleanHeader)) {
          value = Number.parseFloat(value as string) || 0
        }

        record[cleanHeader] = value
      })

      return record
    })

    return NextResponse.json(historicalData)
  } catch (error) {
    console.error("Error loading historical data:", error)
    return NextResponse.json({ error: "Failed to load historical data" }, { status: 500 })
  }
}
