import {createBrowserRouter} from "react-router-dom";
import {MainLayout} from "../layout/MainLayout.tsx";

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>
    }
])