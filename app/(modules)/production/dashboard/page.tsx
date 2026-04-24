import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Activity, AlertTriangle, CheckCircle2, Clock, Settings2, TrendingUp, Zap } from "lucide-react";

// Mock del Server Action/Fetch (se reemplazará con Supabase real)
async function getDashboardData() {
  // Simula un delay de DB
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    kpis: {
      inProgress: 14,
      completed: 128,
      efficiency: 92.4, // %
      criticalMaterials: 3
    },
    recentOrders: [
      { id: "MO-0104", product: "Motor Ensamblado V8", status: "in_progress", progress: 65, dueDate: "2026-04-18" },
      { id: "MO-0105", product: "Chasis Tubular A2", status: "confirmed", progress: 0, dueDate: "2026-04-19" },
      { id: "MO-0103", product: "Panel de Aluminio", status: "done", progress: 100, dueDate: "2026-04-16" },
      { id: "MO-0106", product: "Sistema Eléctrico M1", status: "draft", progress: 0, dueDate: "2026-04-22" },
      { id: "MO-0102", product: "Batería Li-Ion 500Wh", status: "done", progress: 100, dueDate: "2026-04-15" },
    ]
  };
}

export default async function ProductionDashboard() {
  const data = await getDashboardData();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft": return <Badge variant="outline">Borrador</Badge>;
      case "confirmed": return <Badge status="info">Confirmada</Badge>;
      case "in_progress": return <Badge status="warning">En Progreso</Badge>;
      case "done": return <Badge status="success">Completada</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelada</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Producción</h1>
        <p className="text-muted-foreground">
          Visión general de las operaciones de manufactura y eficiencia del centro de trabajo.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes en Progreso</CardTitle>
            <Settings2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2 desde ayer
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Global (OEE)</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.efficiency}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +1.2% este mes
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-destructive/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiales Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.criticalMaterials}</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive font-medium">
              Requieren abastecimiento
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-green-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Completadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En los últimos 30 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recents Table */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-5 overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Órdenes Recientes</CardTitle>
            <CardDescription>
              Estado actual de las órdenes de fabricación activas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead className="text-right">Fecha Límite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{order.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{new Date(order.dueDate).toLocaleDateString('es-PE', { month: 'short', day: 'numeric'})}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Actividad</CardTitle>
            <CardDescription>Centros de trabajo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Línea de Ensamblaje A</p>
                  <p className="text-sm text-muted-foreground">Operando al 95% Capacidad</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">CNC Router 01</p>
                  <p className="text-sm text-muted-foreground">Mantenimiento preventivo</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Control de Calidad</p>
                  <p className="text-sm text-muted-foreground">O.F. 0102 Aprobada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}