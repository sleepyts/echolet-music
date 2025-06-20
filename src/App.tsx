import {RouterProvider} from "react-router-dom";
import {AppRouter} from "./router/AppRouter.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {useThemeStore} from "./store/ThemeStore.ts";
import {useMusicStore} from "./store/MusicStore.ts";
import {useEffect} from "react";

function App() {
    const theme = useThemeStore((state) => state.theme);
    const whenRefreshed = useMusicStore((state) => state.whenRefreshed);
    useEffect(() => {
        whenRefreshed();
    })

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <RouterProvider router={AppRouter}/>
        </ThemeProvider>
    )
}

export default App
