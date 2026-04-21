import { Factory } from "lucide-react";
export default function ProductionHome() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
                <Factory className="h-16 w-16 mx-auto text-primary mb-6" />
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Módulo de Producción
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Bienvenido al módulo de Manufactura de tu ERP
                </p>
                <p className="text-sm text-muted-foreground">
                    Selecciona una opción del menú lateral para comenzar
                </p>
            </div>
        </div>
    );
}