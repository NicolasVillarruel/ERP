"use client"

import { FileBarChart, Download, Printer, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export function ReportModal() {
  const handlePrint = () => {
    window.print();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 shrink-0 rounded-xl border-primary/20 hover:border-primary/50 text-primary">
          <FileBarChart className="h-4 w-4" />
          Generar Reporte
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Centro de Reportes</DialogTitle>
          <DialogDescription>
            Genera y exporta informes de producción en tiempo real.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-6">
          <div className="grid grid-cols-1 gap-3">
            <Card className="hover:bg-accent/50 cursor-pointer transition-colors border-dashed" onClick={handlePrint}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Printer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Vista de Impresión</p>
                  <p className="text-xs text-muted-foreground">Optimizado para PDF y papel</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent/50 cursor-pointer transition-colors border-dashed">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Download className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Exportar Excel (CSV)</p>
                  <p className="text-xs text-muted-foreground">Data cruda para análisis externo</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent/50 cursor-pointer transition-colors border-dashed">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Compartir Enlace</p>
                  <p className="text-xs text-muted-foreground">Vínculo público temporal</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="w-full rounded-xl">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
