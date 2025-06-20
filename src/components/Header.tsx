import {Box, IconButton, Stack} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined, SettingsOutlined} from '@mui/icons-material';
import {t} from "i18next";
import {darkTheme, lightTheme} from "../theme/theme.ts";

export function Header({theme, setTheme}: any) {


    return <Box display={"flex"} p={2}>
        <Stack spacing={2} direction={"row"} position={"absolute"} left={'50%'} sx={{transform: 'translateX(-50%)'}}>
        </Stack>

        <Stack spacing={1} direction={"row"} ml={"auto"}>
            <IconButton
                title={theme == lightTheme ? t('dark-mode') : t('light-mode')}
                onClick={() => {
                    setTheme(theme == lightTheme ? darkTheme : lightTheme)
                }}>{theme == lightTheme ? <DarkModeOutlined/> : <LightModeOutlined/>}</IconButton>
            <IconButton>
                <SettingsOutlined/>
            </IconButton>
        </Stack>
    </Box>
}