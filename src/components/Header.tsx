import {Box, IconButton, Stack} from "@mui/material";
import {useThemeStore} from "../store/ThemeStore.ts";
import {
    DarkModeOutlined,
    LightModeOutlined,
    SettingsOutlined
} from '@mui/icons-material';
import {t} from "i18next";

export function Header() {

    const mode = useThemeStore((state) => state.mode);
    const changeTheme = useThemeStore((state) => state.changeTheme);

    return <Box display={"flex"} p={2}>
        <Stack spacing={2} direction={"row"} position={"absolute"} left={'50%'} sx={{transform: 'translateX(-50%)'}}>
        </Stack>

        <Stack spacing={1} direction={"row"} ml={"auto"}>
            <IconButton
                title={mode === 'light' ? t('dark-mode') : t('light-mode')}
                onClick={() => {
                    changeTheme()
                }}>{mode === "light" ? <DarkModeOutlined/> : <LightModeOutlined/>}</IconButton>
            <IconButton>
                <SettingsOutlined/>
            </IconButton>
        </Stack>
    </Box>
}