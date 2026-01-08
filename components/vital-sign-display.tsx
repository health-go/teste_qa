"use client"

import { VitalSignWaveform } from "@/components/vital-sign-waveform"

interface VitalSignDisplayProps {
    label: string
    value: string | number
    type: "ecg" | "pulse" | "pressure" | "temperature"
    unit?: string
    alertCondition?: boolean
    isAlert?: boolean
}

export function VitalSignDisplay({
    label,
    value,
    type,
    unit,
    alertCondition = false,
    isAlert = false
}: VitalSignDisplayProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <div className={`mb-1 ${alertCondition ? "text-yellow-400" : "text-green-400"}`}>
                    {isAlert ? "ALERT" : label}
                </div>
                <div className={`text-5xl ${alertCondition ? "text-yellow-400" : "text-green-400"}`}>
                    {value}{unit && ` ${unit}`}
                </div>
            </div>

            <div className="w-full h-16">
                <VitalSignWaveform
                    type={type}
                    color={alertCondition ? "yellow" : "green"}
                />
            </div>
        </div>
    )
}
