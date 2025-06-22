import {createBrowserRouter} from "react-router-dom";
import {MainLayout} from "../layout/MainLayout.tsx";
import {PlaylistView} from "../views/PlaylistView.tsx";
import {ArtistView} from "../views/ArtistView.tsx";
import {AlbumView} from "../views/AlbumView.tsx";
import {LoginView} from "../views/LoginView.tsx";
import {SettingsView} from "../views/SettingsView.tsx";

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
                path: 'playlist/:id',
                element: <PlaylistView/>
            },
            {
                path: 'artist/:id',
                element: <ArtistView/>
            },
            {
                path: 'album/:id',
                element: <AlbumView/>
            },
            {
                path:'login',
                element: <LoginView/>
            },
            {
                path:'settings',
                element: <SettingsView/>
            }
        ]
    }
])