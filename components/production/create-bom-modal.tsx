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

export function CreateBomModal() {
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
    const { data } = await supabase.from('products').select('id, name').order('name')
    setProducts(data || [])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const { data: orgs } = await supabase.from('organizations').select('id').limit(1)
    if (!orgs || orgs.length === 0) {
        alert("Primero debes crear una organización.")
        setLoading(false)
        return
    }

    const payload = {
      organization_id: orgs[0].id,
      product_id: formData.get("product_id"),
      name: formData.get("name"),
      version: 1,
      active: true
    }

    const { error } = await supabase.from("boms").insert([payload])

    if (error) {
      console.error("Error creating BOM:", error)
      alert("Error al crear BOM: " + error.message)
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
          <span className="hidden sm:inline">Nueva BOM</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Lista de Materiales (BOM)</DialogTitle>
            <DialogDescription>
              Vincula un producto terminado con sus componentes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product_id">Producto Terminado</Label>
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
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la BOM</Label>
              <Input id="name" name="name" placeholder="Ej: Receta Estándar v1" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-xl">
              {loading ? "Guardando..." : "Crear BOM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
