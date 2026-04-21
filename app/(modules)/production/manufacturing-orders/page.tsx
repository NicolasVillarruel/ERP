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
import { CalendarClock, Filter, PlayCircle, Plus, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ManufacturingOrder } from "@/lib/types/database";

async function getManufacturingOrders() {
  const { data, error } = await supabase
    .from('manufacturing_orders')
    .select(`
      *,
      product:products(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching MOs:", error);
    return [];
  }
  
  return data || [];
}

export default async function ManufacturingOrdersPage() {
  const orders = await getManufacturingOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft": return <Badge variant="outline">Borrador</Badge>;
      case "confirmed": return <Badge className="bg-blue-500/10 text-blue-600 border-transparent">Confirmada</Badge>;
      case "in_progress": return <Badge className="bg-amber-500/10 text-amber-600 border-transparent">En Progreso</Badge>;
      case "done": return <Badge className="bg-green-500/10 text-green-600 border-transparent">Terminada</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelada</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes de Fabricación</h1>
          <p className="text-muted-foreground">Monitoreo y ejecución de lotes de producción.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Crear Orden</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 gap-4 flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
             {/* Quick Filters */}
            <div className="flex bg-muted/50 p-1 rounded-lg">
              <Button variant="ghost" size="sm" className="bg-background shadow-sm text-xs h-8">Todas</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs h-8 hover:text-foreground">En Progreso</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground text-xs h-8 hover:text-foreground">Retrasadas</Button>
            </div>
          </div>
          
          <div className="flex flex-1 sm:flex-none w-full sm:w-auto items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar MO-..." 
                className="w-full pl-9 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0 h-9">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CalendarClock className="h-12 w-12 mb-4 opacity-20" />
              <p>No se encontraron órdenes de fabricación.</p>
              <Button variant="link" className="mt-2">Crea tu primera orden</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Orden</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Progreso</TableHead>
                  <TableHead className="text-right">Planificado</TableHead>
                  <TableHead className="text-center">Prioridad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((mo: any) => {
                  const progressPct = mo.quantity_planned > 0 ? Math.round((mo.quantity_produced / mo.quantity_planned) * 100) : 0;
                  
                  return (
                    <TableRow key={mo.id}>
                      <TableCell className="font-semibold text-primary truncate max-w-[120px]" title={mo.id}>
                        {mo.id.split('-')[0]}...
                      </TableCell>
                      <TableCell>{mo.product?.name || "Desconocido"}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(mo.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-xs font-medium">{mo.quantity_produced} / {mo.quantity_planned}</span>
                          <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          {mo.planned_start ? new Date(mo.planned_start).toLocaleDateString('es-PE', { month: 'short', day: 'numeric'}) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {mo.priority === 1 ? (
                          <Badge variant="outline" className="border-red-500/50 text-red-600 bg-red-500/10">Alta</Badge>
                        ) : mo.priority === 2 ? (
                          <Badge variant="outline" className="border-amber-500/50 text-amber-600 bg-amber-500/10">Media</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Baja</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {mo.status === 'confirmed' ? (
                          <Button size="sm" className="h-8 gap-1 pl-2 pr-3">
                            <PlayCircle className="h-4 w-4" />
                            Iniciar
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-8 text-primary">Ver</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
