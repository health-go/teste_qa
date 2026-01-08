"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

import { VitalSigns, PatientVitalChartProps } from "@/types/vital-signs"

export function PatientVitalChart({ data }: PatientVitalChartProps) {
  const parseTimestamp = (timeString: string) => {
    const today = new Date()
    const [time, milliseconds] = timeString.split(".")
    const [hours, minutes, seconds] = time.split(":").map(Number)

    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds,
      Number(milliseconds) * 10,
    )
    return date
  }

  const filterFirstOccurrencePerSecond = (data: VitalSigns[]) => {
    const seenSeconds = new Set<string>()
    return data.filter((item) => {
      const parsedTime = parseTimestamp(item.timestamp)
      const secondKey = parsedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      if (seenSeconds.has(secondKey)) {
        return false
      }
      seenSeconds.add(secondKey)
      return true
    })
  }

  const filteredData = filterFirstOccurrencePerSecond(data)
  const chartData = filteredData.map((item) => ({
    time: parseTimestamp(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    hr: item.hr,
    spo2: Number.parseFloat(item.spo2),
    sys: item.pressao_sys,
    dia: item.pressao_dia,
    temp: Number.parseFloat(item.temp),
  }))

  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
  }


  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const reversedPayload = [...payload].reverse();

      return (
        <div className="custom-tooltipp bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="label">{label}</p>
          {reversedPayload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };


  return (
    <div className="space-y-6">
      {/* Heart Rate Chart */}
      <div>
        <h3 className="text-lg text-white mb-4">Heart Rate (bpm)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[60, 120]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  color: "#F3F4F6",
                }}
              />
              <Line type="monotone" dataKey="hr" stroke="#22C55E" strokeWidth={2} dot={{ fill: "#22C55E", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blood Pressure Chart */}
      <div>
        <h3 className="text-lg text-white mb-4">Blood Pressure (mmHg)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={12} domain={[70, 160]} />
              <Tooltip
                content={<CustomTooltip />}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="dia"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", r: 3 }}
                name="Diastolic"
              />
              <Line
                type="monotone"
                dataKey="sys"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", r: 3 }}
                name="Systolic"
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SpO2 and Temperature Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg text-white mb-4">SpO₂ (%)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} domain={[90, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                  }}
                />
                <Line type="monotone" dataKey="spo2" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg text-white mb-4">Temperature (°C)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} domain={[35, 39]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                  }}
                />
                <Line type="monotone" dataKey="temp" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
