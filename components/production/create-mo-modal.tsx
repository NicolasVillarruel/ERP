"use client"

import { useState, useEffect } from "react"
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
import { useRouter } from "next/navigation"

export function CreateMoModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    if (open) {
      fetchProducts()
    }
  }, [open])

  const fetchProducts = async () => {
    const { data } = await (supabase as any).from('products').select('id, name').order('name')
    setProducts(data || [])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const { data: orgs } = await (supabase as any).from('organizations').select('id').limit(1)
    if (!orgs || orgs.length === 0) {
        alert("Primero debes crear una organización.")
        setLoading(false)
        return
    }

    const payload = {
      organization_id: orgs[0].id,
      product_id: formData.get("product_id"),
      quantity_planned: parseFloat(formData.get("quantity") as string),
      quantity_produced: 0,
      status: "draft",
      priority: parseInt(formData.get("priority") as string),
      planned_start: new Date().toISOString()
    }

    const { error } = await (supabase as any).from("manufacturing_orders").insert([payload])

    if (error) {
      console.error("Error creating MO:", error)
      alert("Error al crear Orden: " + error.message)
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
          <span className="hidden sm:inline">Crear Orden</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva Orden de Fabricación</DialogTitle>
            <DialogDescription>
              Planifica la producción de un lote de productos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product_id">Producto a Fabricar</Label>
              <Select name="product_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input id="quantity" name="quantity" type="number" placeholder="100" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select name="priority" defaultValue="2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alta</SelectItem>
                    <SelectItem value="2">Media</SelectItem>
                    <SelectItem value="3">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-xl">
              {loading ? "Planificando..." : "Crear Orden de Fabricación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
