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
import { Filter, Plus, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types/database";

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "raw": return <Badge variant="outline" className="border-slate-500 text-slate-500">Materia Prima</Badge>;
      case "semi_finished": return <Badge variant="outline" className="border-accent text-accent">Semi-termiando</Badge>;
      case "finished": return <Badge variant="outline" className="border-primary text-primary">Terminado</Badge>;
      case "service": return <Badge variant="outline" className="border-purple-500 text-purple-500">Servicio</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Gestiona el maestro de materiales, componentes y productos terminados.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo Producto</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar por código o nombre..." 
                className="w-full sm:max-w-sm pl-9 h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Plus className="h-12 w-12 mb-4 opacity-20" />
              <p>No se encontraron productos en la base de datos.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Costo Std.</TableHead>
                  <TableHead>UM</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.internal_code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{getTypeBadge(p.type)}</TableCell>
                    <TableCell className="text-right">
                      ${p.cost_standard.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-muted-foreground uppercase text-xs">{p.uom}</TableCell>
                    <TableCell>
                      {p.active ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-transparent">Activo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-transparent">Inactivo</Badge>
                      )}
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
