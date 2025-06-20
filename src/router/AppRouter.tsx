import {createBrowserRouter} from "react-router-dom";
import {MainLayout} from "../layout/MainLayout.tsx";
import {PlaylistView} from "../views/PlaylistView.tsx";

export const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                path: '',
                element: <></>
            },
            {
                path:'playlist/:id',
                element: <PlaylistView/>
            }
        ]
    }
])