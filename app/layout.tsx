import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    weight: ["500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "ERP - Producción",
    description: "Módulo de Manufactura",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    storageKey="erp-theme"
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}