"use client";

import { useEffect, useState } from "react";
import { Theme } from "@/lib/types";

export function useTheme() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<Theme>("system");

    useEffect(() => {
        setMounted(true);
        const savedTheme = window.localStorage.getItem(
            "orbit-theme",
        ) as Theme | null;
        if (
            savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system"
        )
            setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = isDark ? "dark" : "light";
        window.localStorage.setItem("orbit-theme", theme);
    }, [theme, mounted]);

    return { theme, setTheme, mounted };
}
