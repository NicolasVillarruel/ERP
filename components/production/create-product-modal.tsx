"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { getOrCreateOrganizationId } from "@/lib/get-or-create-org"
import { createProductionRecord } from "@/lib/actions/production"
import { useRouter } from "next/navigation"

export function CreateProductModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Fetch first organization_id
    // Fetch or create organization
    const orgId = await getOrCreateOrganizationId()
    if (!orgId) {
      alert("No se pudo obtener o crear la organización. Revisa los permisos de la base de datos.")
      setLoading(false)
      return
    }

    const payload = {
      organization_id: orgId,
      name: formData.get("name"),
      internal_code: formData.get("internal_code"),
      type: formData.get("type"),
      uom: formData.get("uom"),
      cost_standard: parseFloat(formData.get("cost_standard") as string) || 0,
      active: true
    }

    const { error } = await createProductionRecord("products", payload)

    if (error) {
      console.error("Error creating product:", error)
      alert("Error al crear producto: " + error)
    } else {
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0 gap-2 rounded-xl shadow-md">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Producto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Producto</DialogTitle>
            <DialogDescription>
              Añade un nuevo material o producto terminado al catálogo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" placeholder="Ej: Motor V8" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="internal_code">Código Interno</Label>
                <Input id="internal_code" name="internal_code" placeholder="PRD-001" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="uom">U. Medida</Label>
                <Input id="uom" name="uom" placeholder="unidad, kg, m" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Producto</Label>
              <Select name="type" defaultValue="finished">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">Materia Prima</SelectItem>
                  <SelectItem value="semi_finished">Semi-terminado</SelectItem>
                  <SelectItem value="finished">Producto Terminado</SelectItem>
                  <SelectItem value="service">Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost_standard">Costo Estándar ($)</Label>
              <Input id="cost_standard" name="cost_standard" type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-xl">
              {loading ? "Guardando..." : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
