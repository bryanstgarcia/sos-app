import { useMutation } from "@tanstack/react-query"

export type TipoReporte = "desaparecido" | "a_salvo" | "encontrado_no_identificado"
export type Condicion = "estable" | "herido" | "grave" | "fallecido"
export type Genero = "masculino" | "femenino" | "otro" | "desconocido"

export interface PersonaFormData {
  nombre: string
  segundoNombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  cedula: string
  genero: Genero | ""
  ultimoParadero: string
  nota: string
  tipoReporte: TipoReporte | ""
  condicion: Condicion | ""
}

export interface ReportanteFormData {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  cedula: string
}

export interface ReportPayload {
  persona: PersonaFormData
  reportante: ReportanteFormData
}

export interface ReportResult {
  referenceNumber: string
  submittedAt: string
}

async function submitReport(payload: ReportPayload): Promise<ReportResult> {
  await new Promise((res) => setTimeout(res, 1200))

  const id = Math.floor(Math.random() * 90000) + 10000
  return {
    referenceNumber: `VEN-2026-${String(id).padStart(5, "0")}`,
    submittedAt: new Date().toISOString(),
  }
}

export function useSubmitReport() {
  return useMutation({ mutationFn: submitReport })
}
