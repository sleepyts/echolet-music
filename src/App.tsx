import {RouterProvider} from "react-router-dom";
import {AppRouter} from "./router/AppRouter.tsx";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {useThemeStore} from "./store/ThemeStore.ts";

function App() {
    const theme=useThemeStore((state) => state.theme);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <RouterProvider router={AppRouter}/>
        </ThemeProvider>
    )
}

export default App
