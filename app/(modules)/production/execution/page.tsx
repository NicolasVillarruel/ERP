"use client";

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
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  History, 
  Pause, 
  Play, 
  Settings2, 
  ShieldCheck, 
  User, 
  Zap 
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ExecutionPage() {
  const [seconds, setSeconds] = useState(1452); // Simula 24m 12s
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ejecución en Tiempo Real</h1>
          <p className="text-muted-foreground">Terminal de operario y seguimiento de operaciones activas.</p>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-2xl border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-semibold leading-none">Carlos Mendoza</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Operador Senior</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Active Task Card */}
        <Card className="lg:col-span-2 border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="border-b bg-primary/[0.02]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                <CardTitle>Operación en Curso</CardTitle>
              </div>
              <Badge className="bg-primary text-primary-foreground">MO-0104-OP20</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Producto</p>
                  <h3 className="text-2xl font-bold">Motor Ensamblado V8</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ensamblaje de bloque motor y culatas</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-xl border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Cant. Total</p>
                    <p className="text-xl font-bold">50 <span className="text-xs font-normal text-muted-foreground">und</span></p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase mb-1">Completados</p>
                    <p className="text-xl font-bold text-primary">32 <span className="text-xs font-normal text-muted-foreground">und</span></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progreso del Lote</span>
                    <span>64%</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6 border-l md:pl-12">
                <div className="text-center">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Tiempo Transcurrido</p>
                   <div className="text-5xl font-mono font-bold tracking-tighter text-primary">
                    {formatTime(seconds)}
                   </div>
                </div>

                <div className="flex gap-4 w-full max-w-[240px]">
                  {isActive ? (
                    <Button 
                      onClick={() => setIsActive(false)} 
                      className="flex-1 h-14 rounded-2xl gap-2 text-lg shadow-md hover:shadow-lg transition-all"
                      variant="outline"
                    >
                      <Pause className="h-5 w-5 fill-current" />
                      Pausar
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsActive(true)} 
                      className="flex-1 h-14 rounded-2xl gap-2 text-lg shadow-md bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      Continuar
                    </Button>
                  )}
                  <Button size="icon" className="h-14 w-14 rounded-2xl" variant="destructive">
                    <AlertTriangle className="h-6 w-6" />
                  </Button>
                </div>
                
                <Button className="w-full max-w-[240px] h-12 rounded-xl gap-2" variant="secondary">
                  <CheckCircle2 className="h-5 w-5" />
                  Finalizar Unidad
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Control de Calidad</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30 text-center">
                 <p className="text-xs text-muted-foreground italic">No se han registrado rechazos en este turno.</p>
               </div>
               <Button variant="outline" className="w-full text-xs h-9 gap-2">
                 <AlertTriangle className="h-4 w-4" />
                 Reportar No Conformidad
               </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Registro Reciente</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">Ver todo</Button>
               </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "10:45 AM", action: "Unidad #32 completada", type: "success" },
                  { time: "10:30 AM", action: "Pausa técnica (Materiales)", type: "pause" },
                  { time: "09:12 AM", action: "Inicio de operación", type: "start" },
                ].map((log, i) => (
                  <div key={i} className="flex gap-3 items-start relative pb-4 last:pb-0">
                    {i !== 2 && <div className="absolute left-[7px] top-4 w-[1px] h-full bg-border" />}
                    <div className={`w-3.5 h-3.5 rounded-full mt-1 border-2 border-background z-10 ${
                      log.type === 'success' ? 'bg-green-500' : 
                      log.type === 'pause' ? 'bg-amber-500' : 'bg-primary'
                    }`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold leading-none">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/20">
            <CardContent className="pt-6">
              <Button variant="ghost" className="w-full justify-start gap-3 h-10 px-2">
                <Settings2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Instrucciones de Trabajo</span>
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
