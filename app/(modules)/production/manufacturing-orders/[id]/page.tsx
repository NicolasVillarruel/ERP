import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CalendarClock, Package } from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

async function getMo(id: string) {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('manufacturing_orders')
    .select(`
      *,
      product:products(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function MoDetailPage({ params }: { params: { id: string } }) {
  const mo = await getMo(params.id);

  if (!mo) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/production/manufacturing-orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orden {mo.id.split('-')[0]}</h1>
          <p className="text-muted-foreground">Ejecución y seguimiento de la orden de producción.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estado de Ejecución</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              <Package className="h-12 w-12 mb-4 opacity-20" />
              <p>No se han registrado avances para esta orden.</p>
              <Button className="mt-4 gap-2">
                <CalendarClock className="h-4 w-4" />
                Registrar Producción
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Orden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Producto</p>
              <p className="text-lg font-semibold">{mo.product?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cantidad Planificada</p>
              <p className="text-lg font-semibold">{mo.quantity_planned}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant="outline">{mo.status}</Badge>
            </div>
             <div>
              <p className="text-sm font-medium text-muted-foreground">Prioridad</p>
              <Badge variant="outline">{mo.priority === 1 ? "Alta" : mo.priority === 2 ? "Media" : "Baja"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
