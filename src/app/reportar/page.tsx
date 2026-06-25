import type { Metadata } from "next"
import { ReportForm } from "@/components/reportar/report-form"

export const metadata: Metadata = {
  title: "Reportar persona — Venezuela SOS",
  description: "Reporta a una persona desaparecida, a salvo, o encontrada sin identificar.",
}

export default function ReportarPage() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <ReportForm />
    </section>
  )
}
