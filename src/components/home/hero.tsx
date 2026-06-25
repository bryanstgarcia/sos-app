"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SearchType = "Nombre" | "CI"

export function Hero() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<SearchType>("Nombre")
  const [query, setQuery] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/desaparecidos?q=${encodeURIComponent(query.trim())}&tipo=${searchType}`)
  }

  return (
    <section className="flex items-center justify-center bg-muted px-4 py-20">
      <div className="w-full max-w-2xl flex flex-col gap-8 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            🚨 Encuentra a alguien
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Busca personas reportadas como desaparecidas tras los terremotos del 24 de junio de 2026.
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={searchType} onValueChange={(v) => setSearchType(v as SearchType)}>
              <SelectTrigger className="sm:w-44 h-10 p-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nombre">Nombre</SelectItem>
                <SelectItem value="CI">Cédula (CI)</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className="flex-1 h-10"
              placeholder={searchType === "Nombre" ? "Ej: María González" : "Ej: 12345678"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Término de búsqueda"
            />

            <Button type="submit" className="h-10" disabled={!query.trim()}>
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
