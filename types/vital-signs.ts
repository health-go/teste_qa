export interface VitalSigns {
    timestamp: string
    paciente_id: string
    paciente_nome: string
    paciente_cpf: string
    hr: number
    spo2: string
    pressao_sys: number
    pressao_dia: number
    temp: string
    resp_freq: number
    status: "NORMAL" | "ALERTA"
    idade?: number
    condicao?: string
}

export interface PatientMonitorCardProps {
    patient: VitalSigns
    onDownload: () => void
}

export interface PatientInfoPanelProps {
    patient: VitalSigns
    age: number
    showSensitiveData: boolean
    medicalCondition?: string
}

export interface PatientVitalChartProps {
    data: VitalSigns[]
}

export interface VitalSignWaveformProps {
    type: "ecg" | "pulse" | "pressure" | "temperature"
    color: "green" | "white" | "yellow"
}
