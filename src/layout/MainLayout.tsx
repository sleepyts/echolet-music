// MainLayout.tsx
import React from 'react';
import {Box} from '@mui/material';
import {Header} from "../components/Header.tsx";
import {collapsedWidth, drawerWidth, LeftDrawer} from "../components/LeftDrawer.tsx";
import { Outlet } from 'react-router-dom';

export function MainLayout() {
    const [openDrawer, setOpenDrawer] = React.useState(true);

    return (
        <>
            <LeftDrawer open={openDrawer} setOpen={setOpenDrawer}/>
            <Box sx={{
                ml: openDrawer ? `${drawerWidth}px` : `${collapsedWidth}px`,
                transition: (theme) =>
                    theme.transitions.create('margin-left', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.standard,
                    }),
            }}>
                <Header/>
                <Outlet/>
            </Box>

        </>
    );
}
