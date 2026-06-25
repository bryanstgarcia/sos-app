import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export function InfoSections() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex gap-3 flex-col">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              🆘 Reportar estado de una persona
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Indica si alguien está <strong>a salvo</strong> o{" "}
              <strong>necesita ayuda</strong>, sin necesidad de crear una cuenta.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 h-full">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Recomendaciones al reportar
            </p>
            <ul className="ext-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Incluye nombre completo y cédula (CI) si la conoces</li>
              <li>Indica el <strong>género</strong> de la persona</li>
              <li>
                Anota el <strong>estado</strong> (provincia) y la{" "}
                <strong>dirección</strong> donde fue vista por última vez
              </li>
              <li>
                Si la persona ya fue encontrada,{" "}
                <strong>actualiza el reporte</strong> para que otros sepan y
                los recursos se liberen
              </li>
            </ul>
          </CardContent>

          <CardFooter className="flex flex-col items-start justify-end gap-3">
            <p className="text-xs text-muted-foreground">
              Regístrate para que los familiares puedan contactarte directamente
              si tienes información relevante.
            </p>
            <Link href="/reportar" className={buttonVariants()}>
              Ir a Reportar
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex gap-3 flex-col">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              🔍 Reportar persona desaparecida
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Publica una alerta para que la comunidad pueda reconocer y
              localizar a una persona desaparecida.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Recomendaciones al publicar
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Sube una <strong>foto reciente y clara</strong></li>
              <li>
                Incluye <strong>cédula (CI)</strong> si la tienes — acelera la
                búsqueda considerablemente
              </li>
              <li>Indica el <strong>género</strong> de la persona</li>
              <li>
                Especifica el <strong>estado</strong> (provincia) y la{" "}
                <strong>dirección exacta</strong> del último avistamiento
              </li>
              <li>Describe marcas físicas o señas particulares</li>
              <li>
                Si la persona aparece,{" "}
                <strong>marca el reporte como resuelto</strong> para notificar
                a quienes están ayudando
              </li>
            </ul>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-3">
            <p className="text-xs text-muted-foreground">
              Crea una cuenta para recibir notificaciones si alguien reporta
              haber visto a la persona que buscas.
            </p>
            <Link href="/desaparecidos/nuevo" className={buttonVariants()}>
              Publicar desaparecido
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
