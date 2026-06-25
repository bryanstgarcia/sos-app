"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2Icon,
  CircleCheckIcon,
  TriangleAlertIcon,
  InfoIcon,
  CheckIcon,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useSubmitReport } from "@/lib/queries/reports"
import type {
  PersonaFormData,
  ReportanteFormData,
  TipoReporte,
  Condicion,
  Genero,
} from "@/lib/queries/reports"

const emptyPersona: PersonaFormData = {
  nombre: "",
  segundoNombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  cedula: "",
  genero: "",
  ultimoParadero: "",
  nota: "",
  tipoReporte: "",
  condicion: "",
}

const emptyReportante: ReportanteFormData = {
  nombre: "",
  apellido: "",
  telefono: "",
  correo: "",
  cedula: "",
}

function validateReportante(
  data: ReportanteFormData
): Partial<Record<keyof ReportanteFormData, string>> {
  const errors: Partial<Record<keyof ReportanteFormData, string>> = {}
  if (
    data.correo.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)
  ) {
    errors.correo = "El correo electrónico no es válido"
  }
  return errors
}

export function ReportForm() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | "success">(1)
  const [persona, setPersona] = useState<PersonaFormData>({ ...emptyPersona })
  const [reportante, setReportante] = useState<ReportanteFormData>({ ...emptyReportante })
  const [errorsReportante, setErrorsReportante] = useState<
    Partial<Record<keyof ReportanteFormData, string>>
  >({})
  const mutation = useSubmitReport()

  function handlePersonaChange(field: keyof PersonaFormData, value: string) {
    setPersona((prev) => ({ ...prev, [field]: value }))
  }

  function handleReportanteChange(field: keyof ReportanteFormData, value: string) {
    setReportante((prev) => ({ ...prev, [field]: value }))
    if (errorsReportante[field]) {
      setErrorsReportante((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function handleNextStep(e: React.FormEvent) {
    e.preventDefault()
    setStep(2)
  }

  function handleBack() {
    setStep(1)
    setErrorsReportante({})
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validateReportante(reportante)
    if (Object.keys(errors).length > 0) {
      setErrorsReportante(errors)
      return
    }
    mutation.mutate(
      { persona, reportante },
      { onSuccess: () => setStep("success") }
    )
  }

  const showCondicion = persona.tipoReporte === "encontrado_no_identificado"
  const isFallecido = persona.condicion === "fallecido"

  return (
    <Card>
      {step !== "success" && (
        <CardHeader>
          <StepIndicator step={step} />
          <CardTitle className="text-xl">
            {step === 1 ? "Datos de la persona" : "Tus datos de contacto"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Completa la información que tengas disponible. Todos los campos son opcionales."
              : "Ingresa cómo podemos contactarte si hay novedades sobre el reporte."}
          </CardDescription>
        </CardHeader>
      )}

      {step === 1 && (
        <form onSubmit={handleNextStep}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: María"
                  value={persona.nombre}
                  onChange={(e) => handlePersonaChange("nombre", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="segundoNombre">Segundo nombre</Label>
                <Input
                  id="segundoNombre"
                  placeholder="Ej: Alejandra"
                  value={persona.segundoNombre}
                  onChange={(e) => handlePersonaChange("segundoNombre", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="apellidoPaterno">Apellido paterno</Label>
                <Input
                  id="apellidoPaterno"
                  placeholder="Ej: González"
                  value={persona.apellidoPaterno}
                  onChange={(e) => handlePersonaChange("apellidoPaterno", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="apellidoMaterno">Apellido materno</Label>
                <Input
                  id="apellidoMaterno"
                  placeholder="Ej: Martínez"
                  value={persona.apellidoMaterno}
                  onChange={(e) => handlePersonaChange("apellidoMaterno", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cedula">Cédula de identidad</Label>
                <Input
                  id="cedula"
                  placeholder="Ej: 12345678"
                  value={persona.cedula}
                  onChange={(e) => handlePersonaChange("cedula", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="genero">Género</Label>
                <Select
                  value={persona.genero}
                  onValueChange={(v) => handlePersonaChange("genero", v as Genero)}
                >
                  <SelectTrigger id="genero" className="w-full">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="desconocido">Desconocido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tipoReporte">Tipo de reporte</Label>
              <Select
                value={persona.tipoReporte}
                onValueChange={(v) => {
                  handlePersonaChange("tipoReporte", v as TipoReporte)
                  if (v !== "encontrado_no_identificado") {
                    handlePersonaChange("condicion", "")
                  }
                }}
              >
                <SelectTrigger id="tipoReporte" className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de reporte..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desaparecido">Desaparecido</SelectItem>
                  <SelectItem value="a_salvo">Está a salvo</SelectItem>
                  <SelectItem value="encontrado_no_identificado">
                    Encontrado sin identificar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showCondicion && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="condicion">Condición de la persona</Label>
                <Select
                  value={persona.condicion}
                  onValueChange={(v) => handlePersonaChange("condicion", v as Condicion)}
                >
                  <SelectTrigger id="condicion" className="w-full">
                    <SelectValue placeholder="Selecciona la condición..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estable">Estable</SelectItem>
                    <SelectItem value="herido">Herido</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                    <SelectItem value="fallecido">Fallecido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ultimoParadero">Último paradero conocido</Label>
              <Input
                id="ultimoParadero"
                placeholder="Ej: Av. Libertador, Caracas"
                value={persona.ultimoParadero}
                onChange={(e) => handlePersonaChange("ultimoParadero", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nota">Nota adicional</Label>
              <Textarea
                id="nota"
                placeholder="Describe cualquier detalle que pueda ayudar a identificar a la persona..."
                value={persona.nota}
                onChange={(e) => handlePersonaChange("nota", e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">
              Siguiente
            </Button>
          </CardFooter>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            {isFallecido && (
              <Alert>
                <InfoIcon className="size-4" />
                <AlertTitle>Estás reportando un fallecimiento</AlertTitle>
                <AlertDescription>
                  Si tienes disponible tu cédula de identidad, te recomendamos incluirla
                  para facilitar el proceso de verificación.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reportanteNombre">Tu nombre</Label>
                <Input
                  id="reportanteNombre"
                  placeholder="Ej: Carlos"
                  value={reportante.nombre}
                  onChange={(e) => handleReportanteChange("nombre", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="reportanteApellido">Tu apellido</Label>
                <Input
                  id="reportanteApellido"
                  placeholder="Ej: Rodríguez"
                  value={reportante.apellido}
                  onChange={(e) => handleReportanteChange("apellido", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono">Número de teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: +58 412 1234567"
                value={reportante.telefono}
                onChange={(e) => handleReportanteChange("telefono", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: correo@ejemplo.com"
                value={reportante.correo}
                onChange={(e) => handleReportanteChange("correo", e.target.value)}
                aria-invalid={!!errorsReportante.correo}
                aria-describedby={errorsReportante.correo ? "correo-error" : undefined}
              />
              {errorsReportante.correo && (
                <p id="correo-error" className="text-xs text-destructive">
                  {errorsReportante.correo}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reportanteCedula">Tu cédula de identidad</Label>
              <Input
                id="reportanteCedula"
                placeholder="Ej: 12345678"
                value={reportante.cedula}
                onChange={(e) => handleReportanteChange("cedula", e.target.value)}
              />
            </div>

            {mutation.isError && (
              <Alert variant="destructive">
                <TriangleAlertIcon className="size-4" />
                <AlertTitle>Error al enviar el reporte</AlertTitle>
                <AlertDescription>
                  Ocurrió un problema al enviar tu reporte. Por favor intenta de nuevo.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={mutation.isPending}
            >
              Volver
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2Icon className="size-4 animate-spin" />}
              {mutation.isPending ? "Enviando..." : "Enviar reporte"}
            </Button>
          </CardFooter>
        </form>
      )}

      {step === "success" && (
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CircleCheckIcon className="size-8 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Reporte enviado</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Tu reporte ha sido recibido. Guarda este número de referencia para hacer
              seguimiento.
            </p>
            <p className="text-2xl font-mono font-bold tracking-wide mt-2">
              {mutation.data?.referenceNumber}
            </p>
            <p className="text-xs text-muted-foreground">
              Enviado el{" "}
              {mutation.data?.submittedAt
                ? new Date(mutation.data.submittedAt).toLocaleString("es-VE")
                : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => router.push("/")}>
              Volver al inicio
            </Button>
            <Button
              onClick={() => {
                setStep(1)
                setPersona({ ...emptyPersona })
                setReportante({ ...emptyReportante })
                setErrorsReportante({})
                mutation.reset()
              }}
            >
              Hacer otro reporte
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function StepIndicator({ step }: { step: 1 | 2 | "success" }) {
  const step1Done = step === 2 || step === "success"
  const step2Done = step === "success"
  const step2Active = step === 2

  return (
    <div className="flex items-center gap-2 mb-2">
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          step1Done
            ? "bg-primary text-primary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {step1Done ? <CheckIcon className="size-3" /> : "1"}
      </div>
      <span
        className={cn(
          "text-xs",
          !step1Done ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        Datos de la persona
      </span>

      <div className="flex-1 h-px bg-border mx-1" />

      <span
        className={cn(
          "text-xs",
          step2Active ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        Datos del reportante
      </span>
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          step2Done
            ? "bg-primary text-primary-foreground"
            : step2Active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {step2Done ? <CheckIcon className="size-3" /> : "2"}
      </div>
    </div>
  )
}
