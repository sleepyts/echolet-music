// MainLayout.tsx
import React from 'react';
import {Box, CssBaseline, ThemeProvider} from '@mui/material';
import {Header} from "../components/Header.tsx";
import {collapsedWidth, drawerWidth, LeftDrawer} from "../components/LeftDrawer.tsx";
import {Outlet, useLocation} from 'react-router-dom';
import GlobalPlayer from "../components/BottomPlayer.tsx";
import {useMusicStore} from "../store/MusicStore.ts";
import {lightTheme} from "../theme/theme.ts";

export function MainLayout() {
    const [openDrawer, setOpenDrawer] = React.useState(true);
    const currentSong = useMusicStore(state => state.currentMusicData);
    const [theme, setTheme] = React.useState(lightTheme);

    const location = useLocation();

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {location.pathname !== "/login" && <LeftDrawer open={openDrawer} setOpen={setOpenDrawer}/>}
                <Box sx={{
                    ml: openDrawer ? `${drawerWidth}px` : `${collapsedWidth}px`,
                    transition: (theme) =>
                        theme.transitions.create('margin-left', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.standard,
                        }),
                }}>
                    <Header theme={theme} setTheme={setTheme}/>
                    <Box sx={{
                        mb: currentSong === null ? 0 : '6rem',
                        p: 2
                    }}>
                        <Outlet/>

                    </Box>
                </Box>
                <GlobalPlayer/>
            </ThemeProvider>

        </>
    );
}
