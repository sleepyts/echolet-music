import {Avatar, Box, ButtonBase, Drawer, List, ListItem, ToggleButton, Typography} from "@mui/material";
import {PanelLeftOpen, PanelRightOpen} from "lucide-react";
import {useEffect, useState} from "react";
import {getUserPlaylistInfo} from "../api/playlist/playListApis.ts";
import type {Playlist} from "../api/playlist/PlaylistInfoResponse.ts";
import {useMusicStore} from "../store/MusicStore.ts";
import {useNavigate} from "react-router-dom";
import {t} from "i18next";


export const drawerWidth = 240;
export const collapsedWidth = 72;

interface LeftDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}


export function LeftDrawer({open, setOpen}: LeftDrawerProps) {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const currentPlaylistId = useMusicStore((state) => state.currentPlaylistId)
    const setCurrentPlaylistId = useMusicStore((state) => state.setCurrentPlaylistId)
    useEffect(() => {
        getUserPlaylistInfo(430820620).then(res => {
            setPlaylists(res.playlist)
        })
    }, []);
    return (
        <Drawer open={open} variant={"permanent"} PaperProps={{
            sx: {
                width: open ? drawerWidth : collapsedWidth,
                overflowX: 'hidden',
                p: 1
            }
        }}>


            <Box height={'5rem'} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                {
                    open &&
                    <Typography variant={"h6"}>
                        Azure Music
                    </Typography>
                }
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', p: 0.5,ml: 1.2}}>
                <ButtonBase
                    onClick={() => setOpen(!open)}
                    sx={{
                        flexShrink: 0,
                        m: 0,
                        transition: 'margin 0.3s ease',
                    }}
                >
                    {!open ? <PanelLeftOpen/> : <PanelRightOpen/>}
                </ButtonBase>

                <Typography
                    variant="body1"
                    sx={{
                        ml: 3,
                        opacity: open ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        width: open ? 'auto' : 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {t('playlists')}
                </Typography>
            </Box>
            <List sx={{
                mt: 2,
                overflow: 'hidden',
                transition: 'opacity 0.3s ease',
            }}>
                {
                    playlists.map(playlist => (
                        <ListItem key={playlist.id}
                                  sx={{p: 0}}
                                  title={playlist.name}
                        >
                            <ToggleButton
                                sx={{
                                    p: 0.5,
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    border: 'none',
                                    '&.Mui-selected': {},
                                }}
                                value={playlist.id}
                                selected={currentPlaylistId === playlist.id}
                                onClick={() => {
                                    setCurrentPlaylistId(playlist.id)
                                    navigate('/playlist/' + playlist.id)
                                }}
                            >
                                <Avatar src={playlist.coverImgUrl} variant={"rounded"}/>
                                {open && <Typography variant={"body2"} textTransform={"none"}
                                                     ml={2} noWrap={true}>{playlist.name}</Typography>}
                            </ToggleButton>
                        </ListItem>
                    ))
                }
            </List>
        </Drawer>
    )
}