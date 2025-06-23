import {Avatar, Box, Stack} from "@mui/material";
import {
    DarkModeOutlined,
    GitHub,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LightModeOutlined,
    Login,
    Logout,
    SettingsOutlined
} from '@mui/icons-material';
import {t} from "i18next";
import {darkTheme, lightTheme} from "../theme/theme.ts";
import RoundedIconButton from "./RoundedIconButton.tsx";
import {useUserStore} from "../store/UserStore.ts";
import {useNavigate} from "react-router-dom";
import {useNavigationStack} from "../hooks/NavigationHook.ts";

export function Header({theme, setTheme}: any) {
    const userProfile = useUserStore(state => state.userProfile);
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    const {goBack, goForward, canGoBack, canGoForward} = useNavigationStack();
    return <Box display={"flex"} p={4} height={"5rem"} position={"sticky"} top={0} zIndex={1000} alignItems={"center"}
                sx={{backgroundColor: 'background.default'}}>
        <Box display="flex" gap={2}>
            <RoundedIconButton
                icon={<KeyboardArrowLeft/>}
                onClick={goBack}
                showBorder={canGoBack}
            />
            <RoundedIconButton
                icon={<KeyboardArrowRight/>}
                onClick={goForward}
                showBorder={canGoForward}
            />
        </Box>
        {/*<Stack spacing={2} direction={"row"}>*/}
        {/*    <Button variant={"outlined"} color="inherit" size={"small"}>Home</Button>*/}
        {/*    <Button variant={"outlined"} color="inherit" size={"small"}>About</Button>*/}
        {/*    <Button variant={"outlined"} color="inherit" size={"small"}>Contact</Button>*/}
        {/*</Stack>*/}

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
            <RoundedIconButton icon={<SettingsOutlined/>} onClick={() => navigate('/settings')}/>
            <RoundedIconButton icon={<GitHub/>}/>
        </Stack>
    </Box>
}