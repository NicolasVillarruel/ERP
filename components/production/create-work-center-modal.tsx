"use client"

import { useState } from "react"
import { Factory, Plus } from "lucide-react"
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

export function CreateWorkCenterModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const orgId = await getOrCreateOrganizationId()
    if (!orgId) {
      alert("No se pudo obtener o crear la organización.")
      setLoading(false)
      return
    }

    const payload = {
      organization_id: orgId,
      name: formData.get("name"),
      type: formData.get("type"),
      attributes: {
        status: "idle",
        oee: 0,
        utilization: 0
      }
    }

    const { error } = await createProductionRecord("work_centers", payload)

    if (error) {
      console.error("Error creating work center:", error)
      alert("Error al crear centro de trabajo: " + error)
    } else {
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl shadow-md">
          <Factory className="h-4 w-4" />
          Configurar Centro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Añadir Centro de Trabajo</DialogTitle>
            <DialogDescription>
              Registra una nueva máquina o estación de trabajo en la planta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Centro</Label>
              <Input id="name" name="name" placeholder="Ej: Línea de Ensamblaje A" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="machine">Máquina</SelectItem>
                  <SelectItem value="labor">Mano de Obra</SelectItem>
                  <SelectItem value="assembly">Ensamblaje</SelectItem>
                  <SelectItem value="quality">Control de Calidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-xl">
              {loading ? "Guardando..." : "Crear Centro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
