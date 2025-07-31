import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout.tsx";
import { PlaylistView } from "../views/PlaylistView.tsx";
import { ArtistView } from "../views/ArtistView.tsx";
import { AlbumView } from "../views/AlbumView.tsx";
import { LoginView } from "../views/LoginView.tsx";
import { SettingsView } from "../views/SettingsView.tsx";
import { ArtistSongsView } from "../views/ArtistSongsView.tsx";
import { HomeView } from "../views/HomeVIew.tsx";
import { SearchView } from "../views/SearchView.tsx";
import { SearchSongsView } from "../views/SearchSongsView.tsx";
import { SearchArtistsView } from "../views/SearchArtistsView.tsx";
import { SearchPlaylistsView } from "../views/SearchPlaylistsView.tsx";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomeView />,
      },
      {
        path: "playlist/:id",
        element: <PlaylistView />,
      },
      {
        path: "artist/:id",
        element: <ArtistView />,
      },
      {
        path: "artist/songs/:id",
        element: <ArtistSongsView />,
      },
      {
        path: "album/:id",
        element: <AlbumView />,
      },
      {
        path: "login",
        element: <LoginView />,
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
      {
        path: "search/:text",
        element: <SearchView />,
      },
      {
        path: "search/songs/:text",
        element: <SearchSongsView />,
      },
      {
        path: "search/artists/:text",
        element: <SearchArtistsView />,
      },
      {
        path: "search/playlists/:text",
        element: <SearchPlaylistsView />,
      },
    ],
  },
]);
