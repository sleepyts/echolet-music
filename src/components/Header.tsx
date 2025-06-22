import {Avatar, Box, Stack} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined, Login, Logout, SettingsOutlined} from '@mui/icons-material';
import {t} from "i18next";
import {darkTheme, lightTheme} from "../theme/theme.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";
import {useUserStore} from "../store/UserStore.ts";
import {useNavigate} from "react-router-dom";

export function Header({theme, setTheme}: any) {
    const userProfile = useUserStore(state => state.userProfile);
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    return <Box display={"flex"} p={2} height={"5rem"} position={"sticky"} top={0} zIndex={1000}
                sx={{backgroundColor: 'background.default'}}>
        <Stack spacing={2} direction={"row"} position={"absolute"} left={'50%'} sx={{transform: 'translateX(-50%)'}}>
        </Stack>

        <Stack spacing={1} direction={"row"} ml={"auto"} alignItems={"center"}>
            {
                userProfile !== undefined ?
                    <>
                        <Avatar src={userProfile?.avatarUrl} sx={{width: 30, height: 30}}/>
                    </>
                    :
                    <>
                        <RoundedIconButton icon={<Login/>} title={t('login')} onClick={() => navigate('/login')}/>
                    </>
            }
            {
                userProfile !== undefined && <>
                    <RoundedIconButton icon={<Logout/>}
                                       onClick={() => logout()}
                                       title={t('logout')}
                    />

                </>
            }
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