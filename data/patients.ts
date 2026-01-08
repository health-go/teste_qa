export const PATIENT_MOCK_DATA = {
    PAC001: {
        name: "João Silva",
        age: 65,
        condition: "hipertensão",
    },
    PAC002: {
        name: "Maria Santos",
        age: 72,
        condition: "condição estável",
    },
    PAC003: {
        name: "Pedro Oliveira",
        age: 58,
        condition: "taquicardia",
    },
} as const

export type PatientId = keyof typeof PATIENT_MOCK_DATA
