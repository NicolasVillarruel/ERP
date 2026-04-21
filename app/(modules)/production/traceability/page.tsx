import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowRight, 
  Boxes, 
  FileSearch, 
  History, 
  Layers, 
  QrCode, 
  Search, 
  Tag 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getTraceabilityLogs() {
  const { data, error } = await supabase
    .from('production_moves')
    .select(`
      *,
      product:products(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching traceability logs:", error);
    return [];
  }
  
  return data || [];
}

export default async function TraceabilityPage() {
  const logs = await getTraceabilityLogs();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trazabilidad de Lotes</h1>
          <p className="text-muted-foreground">Genealogía de productos y seguimiento de movimientos de materiales.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
            <QrCode className="h-4 w-4" />
            Escanear Código
          </Button>
          <Button size="sm" className="gap-2">
            <FileSearch className="h-4 w-4" />
            Reporte de Auditoría
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-primary/[0.01] border-dashed border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Buscar Lote o Serial</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Ej: LT-2026-04..." 
                  className="w-full pl-9 h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Filtrar por Origen</label>
              <select className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none">
                <option>Todos los orígenes</option>
                <option>Línea de Ensamblaje A</option>
                <option>Almacén Central</option>
                <option>Proveedor Externo</option>
              </select>
            </div>
            <Button className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-md">
              Rastrear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Log Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle>Movimientos Recientes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mb-4 opacity-20" />
                <p>No se encontraron registros de trazabilidad.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote / Serial</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Fecha / Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log.id} className="group cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-xs font-bold">{log.lot_number || "S/L"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{log.product?.name || "N/A"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString('es-PE')}</TableCell>
                      <TableCell>
                         {log.move_type === 'produce' ? (
                          <Badge className="bg-green-500/10 text-green-600 border-transparent text-[10px]">PRODUCIDO</Badge>
                        ) : log.move_type === 'consume' ? (
                          <Badge className="bg-blue-500/10 text-blue-600 border-transparent text-[10px]">CONSUMIDO</Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-transparent text-[10px]">MERMA</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 group-hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Selected Lot Detail (Genealogy Explorer View) */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/[0.02] border-b">
            <CardTitle className="text-lg">Explorador de Genealogía</CardTitle>
            <CardDescription>
              {(logs as any[]).length > 0 ? `Lote ${(logs as any[])[0].lot_number}` : 'Seleccione un lote'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              
              {/* Visual Tree-ish structure */}
              <div className="relative pl-6 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-primary/20 border-l border-dashed" />
                
                {/* Nodes */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background">
                    <Boxes className="h-3 w-3" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-primary">Producto Terminado</p>
                    <p className="text-sm font-semibold">{(logs as any[])[0]?.product?.name || "Ejemplo Motor V8"}</p>
                    <p className="text-[10px] text-muted-foreground">O.F. {(logs as any[])[0]?.mo_id?.split('-')[0] || "MO-0104"} | {(logs as any[])[0] ? new Date((logs as any[])[0].created_at).toLocaleDateString() : '18/04/2026'}</p>
                  </div>
                </div>

                <div className="relative">
                   <div className="absolute -left-[23px] top-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white ring-4 ring-background">
                    <Layers className="h-3 w-3" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase text-accent">Componentes Vinculados</p>
                    <div className="space-y-2">
                      {["Bloque Motor V8 (Lot: BL-554)", "Culata Derecha (Lot: CY-882)"].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg text-[11px] font-medium border border-muted-foreground/10 hover:border-primary/30 transition-colors">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t">
                 <Button className="w-full gap-2 rounded-xl h-10 shadow-sm" variant="outline">
                   <FileSearch className="h-4 w-4" />
                   Ver Certificado de Calidad
                 </Button>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
