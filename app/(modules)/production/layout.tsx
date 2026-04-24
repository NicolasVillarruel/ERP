"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Factory, Package, List, Settings, BarChart3,
    Truck, Users, Menu
} from "lucide-react";
import { ThemeToggle } from "../../../components/theme-toggle";

const navItems = [
    { name: "Dashboard", href: "/production/dashboard", icon: BarChart3 },
    { name: "Productos", href: "/production/products", icon: Package },
    { name: "BOM", href: "/production/boms", icon: List },
    { name: "Work Centers", href: "/production/work-centers", icon: Factory },
    { name: "Órdenes de Fabricación", href: "/production/manufacturing-orders", icon: Truck },
    { name: "Ejecución", href: "/production/execution", icon: Settings },
    { name: "Trazabilidad", href: "/production/traceability", icon: Users },
];

export default function ProductionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Mobile Overlay */}
            {open && (
                <div 
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r bg-card shadow-sm transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
                ${open ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Factory className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Producción</h1>
                            <p className="text-sm text-muted-foreground">Manufactura</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

            </div>

            {/* Área principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setOpen(!open)}
                            className="md:hidden p-2 rounded-xl hover:bg-accent"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-semibold tracking-tight">Módulo de Producción</h2>
                    </div>

                    <ThemeToggle />
                </header>

                {/* Contenido */}
                <main className="flex-1 overflow-auto p-4 md:p-8 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}