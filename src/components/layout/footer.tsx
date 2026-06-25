import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1 max-w-sm">
          <p className="font-semibold text-sm">🇻🇪 Venezuela SOS</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Plataforma de emergencia creada tras los terremotos del 24 de junio de 2026.
            Reporta, busca y coordina ayuda de forma rápida y sin necesidad de registro.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            ⚠️ La información puede no estar verificada. Contrasta con fuentes oficiales.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contribuir</p>
          <Link
            href="https://github.com/bryanstgarcia/venezuela-sos-app"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Contribuir en GitHub
          </Link>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-5xl px-4 py-3 text-xs text-muted-foreground">
          © 2026 Venezuela SOS — Software libre, uso humanitario.
        </p>
      </div>
    </footer>
  )
}
