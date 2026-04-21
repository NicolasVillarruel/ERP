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
import { ChevronRight, Filter, Network, Plus, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getBoms() {
  const { data, error } = await supabase
    .from('boms')
    .select(`
      *,
      product:products(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching BOMs:", error);
    return [];
  }
  
  return data || [];
}

export default async function BomsPage() {
  const boms = await getBoms();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listas de Materiales (BOM)</h1>
          <p className="text-muted-foreground">Gestiona recetas, componentes y secuencias de fabricación.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva BOM</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar por producto o nombre de BOM..." 
                className="w-full sm:max-w-sm pl-9 h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="gap-2 shrink-0">
                <Network className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">Vista de Árbol</span>
              </Button>
              <Button variant="outline" className="gap-2 shrink-0">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {boms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Network className="h-12 w-12 mb-4 opacity-20" />
              <p>No se encontraron listas de materiales.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Producto Terminado</TableHead>
                  <TableHead>Nombre BOM</TableHead>
                  <TableHead className="text-center">Versión</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boms.map((b: any) => (
                  <TableRow key={b.id} className="group">
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{b.product?.name || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">{b.name || "Sin nombre"}</TableCell>
                    <TableCell className="text-center">v{b.version}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">-</Badge>
                    </TableCell>
                    <TableCell>
                      {b.active ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-transparent">Activa</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-transparent">Obsoleta</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary">Ver Detalle</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
