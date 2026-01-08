import crypto from "crypto"

export class LGPDCompliance {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  private static readonly ALGORITHM = "aes-256-gcm"

  static anonymizePatientData(data: any) {
    return {
      ...data,
      paciente_nome: this.pseudonymizeName(data.paciente_nome),
      paciente_cpf: this.maskCPF(data.paciente_cpf),
      paciente_id: this.hashPatientId(data.paciente_id),
      hr: data.hr,
      spo2: data.spo2,
      pressao_sys: data.pressao_sys,
      pressao_dia: data.pressao_dia,
      temp: data.temp,
      resp_freq: data.resp_freq,
      status: data.status,
      timestamp: data.timestamp,
    }
  }

  static pseudonymizeName(fullName: string): string {


    const parts = fullName
      .trim()
      .split(" ")
      .filter((part) => part.length > 0)
    if (parts.length === 0) return "***"

    return parts
      .map((part) => {
        const initial = part.charAt(0).toUpperCase()
        const asterisks = "*".repeat(Math.max(3, part.length - 1))
        return initial + asterisks
      })
      .join(" ")
  }

  static maskCPF(cpf: string): string {
    if (!cpf || cpf.length < 2) return "***.***.***-**"

    // Remove any formatting first
    const cleanCPF = cpf.replace(/\D/g, "")
    if (cleanCPF.length < 2) return "***.***.***-**"

    const firstThreeDigits = cleanCPF.slice(0, 3)
    return `${firstThreeDigits}.***.***-**`
  }

  static hashPatientId(patientId: string): string {
    if (!patientId) return "UNKNOWN"

    return crypto
      .createHash("sha256")
      .update(patientId + this.ENCRYPTION_KEY) // Add salt with encryption key
      .digest("hex")
      .substring(0, 8) // Use first 8 characters for display
      .toUpperCase()
  }
}

export { LGPDCompliance as LGPDUtils }
