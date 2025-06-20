import {Box, Stack} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined, SettingsOutlined} from '@mui/icons-material';
import {t} from "i18next";
import {darkTheme, lightTheme} from "../theme/theme.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";

export function Header({theme, setTheme}: any) {


    return <Box display={"flex"} p={2} height={"5rem"}>
        <Stack spacing={2} direction={"row"} position={"absolute"} left={'50%'} sx={{transform: 'translateX(-50%)'}}>
        </Stack>

        <Stack spacing={1} direction={"row"} ml={"auto"} alignItems={"center"}>
            <RoundedIconButton
                title={theme == lightTheme ? t('dark-mode') : t('light-mode')}
                icon={theme == lightTheme ? <DarkModeOutlined/> : <LightModeOutlined/>}
                onClick={() => {
                    setTheme(theme == lightTheme ? darkTheme : lightTheme)
                }}/>
            <RoundedIconButton icon={<SettingsOutlined/>}/>
        </Stack>
    </Box>
}