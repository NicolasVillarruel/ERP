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
  Activity, 
  AlertCircle, 
  Clock, 
  MoreHorizontal, 
  PauseCircle, 
  PlayCircle,
  CheckCircle2,
  Factory
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { CreateWorkCenterModal } from "@/components/production/create-work-center-modal";
import { ReportModal } from "@/components/production/report-modal";
import { FilterDialog } from "@/components/production/filter-dialog";

export const dynamic = 'force-dynamic'

async function getWorkCenters() {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('work_centers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching work centers:", error);
    return [];
  }
  
  console.log(`Fetched ${data?.length || 0} work centers for display.`);
  
  // Mix DB data with UI metrics (OEE/Status would normally come from an IoT integration or real-time table)
  return (data || []).map((wc: any) => ({
    ...wc,
    status: (wc.attributes as any)?.status || "idle",
    oee: (wc.attributes as any)?.oee || 0,
    utilization: (wc.attributes as any)?.utilization || 0,
    currentOrder: (wc.attributes as any)?.currentOrder || null,
    lastMaintenance: (wc.attributes as any)?.lastMaintenance || new Date().toISOString()
  }));
}

export default async function WorkCentersPage() {
  const workCenters = await getWorkCenters();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running": return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1.5"><PlayCircle className="h-3 w-3" /> Operando</Badge>;
      case "idle": return <Badge variant="secondary" className="gap-1.5"><PauseCircle className="h-3 w-3" /> Inactivo</Badge>;
      case "maintenance": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5"><AlertCircle className="h-3 w-3" /> Mantenimiento</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centros de Trabajo</h1>
          <p className="text-muted-foreground">Monitoreo de disponibilidad y rendimiento en tiempo real.</p>
        </div>
        <div className="flex gap-2">
          <ReportModal />
          <CreateWorkCenterModal />
        </div>
      </div>

      {/* KPI Overviews */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/[0.03] border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibilidad Media</p>
                <div className="text-2xl font-bold mt-1">86.4%</div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '86.4%' }} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/[0.03] border-green-500/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rendimiento Total</p>
                <div className="text-2xl font-bold mt-1">92.1%</div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
             <div className="mt-4 h-1.5 w-full bg-green-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '92.1%' }} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/[0.03] border-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calidad Promedio</p>
                <div className="text-2xl font-bold mt-1">99.2%</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
            </div>
             <div className="mt-4 h-1.5 w-full bg-accent/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: '99.2%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {workCenters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border border-dashed">
          <Factory className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No hay centros de trabajo configurados.</p>
          <Button variant="link">Añadir centro manual</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {workCenters.map((wc) => (
            <Card key={wc.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-4 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{wc.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">{wc.type || 'General'}</Badge>
                    </div>
                    <CardDescription className="font-mono text-xs">{wc.code || wc.id.split('-')[0]}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-3">
                       <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Estado Actual</p>
                          {getStatusBadge(wc.status)}
                       </div>
                       {wc.currentOrder && (
                         <div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Orden en Curso</p>
                           <p className="text-sm font-semibold text-primary">{wc.currentOrder}</p>
                         </div>
                       )}
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold tracking-tighter">{wc.oee}<span className="text-sm font-medium text-muted-foreground ml-0.5">%</span></p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">OEE Actual</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Carga de Trabajo</span>
                        <span>{wc.utilization}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            wc.utilization > 90 ? 'bg-destructive' : 
                            wc.utilization > 70 ? 'bg-primary' : 'bg-green-500'
                          }`} 
                          style={{ width: `${wc.utilization}%` }} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Mant. el {new Date(wc.lastMaintenance).toLocaleDateString('es-PE')}</span>
                      </div>
                      <Button variant="link" size="sm" className="h-auto p-0 text-primary text-[11px]">
                        Ver Estadísticas
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
