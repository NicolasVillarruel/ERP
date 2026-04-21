import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                display: ["var(--font-manrope)", "sans-serif"],
            },
            colors: {
                primary: {
                    50: "#F0F9F6",
                    500: "#0F766E",
                    600: "#0D615A",
                    700: "#0A4C46",
                },
                accent: {
                    500: "#F59E0B",
                },
                success: "#10B981",
                danger: "#EF4444",
            },
        },
    },
    plugins: [],
};

export default config;