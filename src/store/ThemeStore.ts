import {create} from "zustand/react";
import {darkTheme, lightTheme} from "../theme/theme.ts";

interface ThemeState {
    mode: string;
    theme: object
}

interface ThemeActions {
    changeTheme: () => void;
}


export const useThemeStore = create<ThemeState & ThemeActions>(
    (set, get) => ({
        mode: "light",
        theme: lightTheme,
        changeTheme: () => {
            if (get().mode === "light") {
                set({mode: "dark", theme: darkTheme});
            } else {
                set({mode: "light", theme: lightTheme});
            }
        }
    })
);