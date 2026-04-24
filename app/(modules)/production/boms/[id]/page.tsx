import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Network } from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getBom(id: string) {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('boms')
    .select(`
      *,
      product:products(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function BomDetailPage({ params }: { params: { id: string } }) {
  const bom = await getBom(params.id);

  if (!bom) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/production/boms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{bom.name}</h1>
          <p className="text-muted-foreground">Detalles de la lista de materiales y componentes.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Componentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              <Network className="h-12 w-12 mb-4 opacity-20" />
              <p>No hay componentes configurados para esta BOM.</p>
              <Button variant="outline" className="mt-4">Añadir Componente</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Producto</p>
              <p className="text-lg font-semibold">{bom.product?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Versión</p>
              <p className="text-lg font-semibold">v{bom.version}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <p className="text-lg font-semibold">{bom.active ? "Activa" : "Inactiva"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
