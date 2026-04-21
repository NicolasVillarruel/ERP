"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitar error de hidratación
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-2 h-9 w-9" />;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500 animate-in zoom-in duration-300" />
            ) : (
                <Moon className="h-5 w-5 text-slate-700 animate-in zoom-in duration-300" />
            )}
        </Button>
    );
}